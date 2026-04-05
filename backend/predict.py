"""
ml/predict.py
─────────────
Handles:
  1. Input validation
  2. Feature engineering & min-max normalisation  (matches training pipeline exactly)
  3. ML model inference  (RandomForestClassifier)
  4. Risk-level classification
  5. Gemini AI personalised advice generation

Normalisation ranges were reverse-engineered from the training dataset
to ensure inference-time scaling is identical to training-time scaling:
    age              20 – 48  years
    weight_kg        35 – 110 kg
    height_cm        140 – 180 cm
    bmi              13.75 – 39.01
    cycle_length_days 18 – 42 days
"""

import os
import pickle

import pandas as pd

from dotenv import load_dotenv
load_dotenv()

# ── Gemini SDK ──────────────────────────────────────────────
try:
    from google import genai as _genai
    _GEMINI_AVAILABLE = True
except ImportError:
    _GEMINI_AVAILABLE = False

# ── Paths ───────────────────────────────────────────────────
_BASE         = os.path.dirname(os.path.abspath(__file__))
_MODEL_PATH   = os.path.join(_BASE, "..", "model", "pcos_model.pkl")
_COLUMNS_PATH = os.path.join(_BASE, "..", "model", "columns.pkl")

# ── Load artefacts once ─────────────────────────────────────
with open(_MODEL_PATH, "rb") as _f:
    _model = pickle.load(_f)

with open(_COLUMNS_PATH, "rb") as _f:
    _columns = pickle.load(_f)

# ── Gemini client ───────────────────────────────────────────
# Set GEMINI_API_KEY in your environment before starting Flask:
#   export GEMINI_API_KEY="your-key-here"
_GEMINI_KEY = os.getenv("GEMINI_API_KEY")
print("Gemini Key Loaded:", "YES" if _GEMINI_KEY else "NO")

_gemini_client = None
if _GEMINI_AVAILABLE and _GEMINI_KEY:
    try:
        _gemini_client = _genai.Client(api_key=_GEMINI_KEY)
        print("Gemini Client Initialized ✅")
    except Exception as e:
        print("Gemini init error:", e)
        _gemini_client = None
else:
    print("Gemini not available ❌")

# ── Normalisation ranges ────────────────────────────────────
_R = {
    "age":               (20,    48),
    "weight_kg":         (35,   110),
    "height_cm":         (140,  180),
    "bmi":               (13.75, 39.01),
    "cycle_length_days": (18,    42),
}


def _norm(value: float, lo: float, hi: float) -> float:
    """Clip to [lo, hi] then min-max scale to [0, 1]."""
    return (max(lo, min(hi, float(value))) - lo) / (hi - lo)


def _cycle_regularity(days: int) -> float:
    """0 for regular (21-35 days), rises toward 1 as cycle becomes irregular."""
    if 21 <= days <= 35:
        return 0.0
    if days < 21:
        return min(1.0, (21 - days) / (21 - 18))
    return min(1.0, (days - 35) / (42 - 35))


def _age_outside_typical(age: float) -> float:
    """Score for age outside the typical PCOS onset window (15-45)."""
    if 15 <= age <= 45:
        return 0.0
    if age < 15:
        return _norm(age, 10, 15)
    return _norm(age, 45, 60)


# ── Validation ──────────────────────────────────────────────
# Only checks that required fields are present and parseable.
# Range enforcement is left entirely to the frontend form.
# Out-of-range values are clipped to [0, 1] during normalisation,
# so the model always receives valid input regardless.
def _validate(data: dict) -> None:
    for key in ["age", "weight", "height", "cycleLen", "symptoms", "fastFood", "exercise"]:
        if key not in data:
            raise ValueError(f"Missing required field: '{key}'")

    # Ensure numeric fields can actually be parsed
    try:
        float(data["age"])
        float(data["weight"])
        float(data["height"])
        int(data["cycleLen"])
    except (TypeError, ValueError):
        raise ValueError("age, weight, height, and cycleLen must be numbers.")

    # Ensure all symptom keys are present
    for key in ["weightGain", "facialHair", "skinDark", "hairLoss", "acne"]:
        if key not in data.get("symptoms", {}):
            raise ValueError(f"Missing symptom key: '{key}'")


# ── Feature engineering ─────────────────────────────────────
def _build_features(data: dict) -> pd.DataFrame:
    age    = float(data["age"])
    weight = float(data["weight"])
    height = float(data["height"])
    cycle  = int(data["cycleLen"])
    sym    = data["symptoms"]
    bmi    = weight / ((height / 100) ** 2)

    b = lambda val: 1.0 if val else 0.0

    feature_map = {
        "age":                      _norm(age,    *_R["age"]),
        "weight_kg":                _norm(weight, *_R["weight_kg"]),
        "height_cm":                _norm(height, *_R["height_cm"]),
        "bmi":                      _norm(bmi,    *_R["bmi"]),
        "cycle_regularity":         _cycle_regularity(cycle),
        "cycle_length_days":        _norm(cycle,  *_R["cycle_length_days"]),
        "weight_gain":              b(sym.get("weightGain")),
        "facial_hair_growth":       b(sym.get("facialHair")),
        "skin_darkening":           b(sym.get("skinDark")),
        "hair_loss":                b(sym.get("hairLoss")),
        "pimples":                  b(sym.get("acne")),
        "fast_food":                b(data.get("fastFood")),
        "regular_exercise":         b(data.get("exercise")),
        "age_outside_typical_range": _age_outside_typical(age),
    }

    return pd.DataFrame([{col: feature_map[col] for col in _columns}])


# ── Risk classification ─────────────────────────────────────
def _classify_risk(prob: float) -> tuple:
    if prob < 0.35:
        return "Low", (
            "Your responses suggest a low likelihood of PCOS at this time. "
            "Maintain a balanced diet, stay physically active, and keep track "
            "of any new symptoms."
        )
    elif prob < 0.65:
        return "Moderate", (
            "Some factors associated with PCOS are present. Start regular "
            "exercise, reduce processed food, maintain a consistent sleep "
            "schedule, and consider a gynaecologist check-up."
        )
    else:
        return "High", (
            "Multiple strong indicators associated with PCOS were detected. "
            "Please consult a qualified gynaecologist or endocrinologist for a "
            "thorough clinical evaluation. Do not self-medicate."
        )


# ── Gemini prompt ───────────────────────────────────────────
def _build_prompt(data: dict, prob: float, risk_level: str) -> str:
    age    = int(float(data["age"]))
    weight = float(data["weight"])
    height = float(data["height"])
    bmi    = weight / ((height / 100) ** 2)
    cycle  = int(data["cycleLen"])
    sym    = data["symptoms"]

    bmi_label  = ("Underweight" if bmi < 18.5 else "Normal" if bmi < 25
                  else "Overweight" if bmi < 30 else "Obese")
    cycle_cat  = ("absent / amenorrhoea"        if cycle <= 15 else
                  "short — less than 21 days"   if cycle < 21  else
                  "regular (21–35 days)"         if cycle <= 35 else
                  "long / irregular (>35 days)")

    sym_labels = {
        "weightGain": "unexplained weight gain",
        "facialHair": "excess facial/body hair (hirsutism)",
        "skinDark":   "skin darkening (acanthosis nigricans)",
        "hairLoss":   "hair thinning or loss",
        "acne":       "persistent acne",
    }
    sym_text = ", ".join(sym_labels[k] for k, v in sym.items()
                         if v and k in sym_labels) or "none reported"

    return f"""You are a compassionate women's health assistant specialising in PCOS/PCOD awareness.

A user completed a PCOS self-assessment:

- Age: {age} years
- BMI: {bmi:.1f} ({bmi_label})
- Menstrual cycle length: {cycle} days ({cycle_cat})
- Active symptoms: {sym_text}
- Fast food (3+ times/week): {"Yes" if data.get("fastFood") else "No"}
- Regular exercise (3+ times/week): {"Yes" if data.get("exercise") else "No"}

ML model result: {prob * 100:.0f}% PCOS likelihood — {risk_level} risk.

Respond using EXACTLY these three headings (no extra formatting):

Your Summary
(2–3 warm, empathetic sentences acknowledging their specific situation and result)

What You Can Do
(3–4 specific, actionable lifestyle/dietary recommendations tailored to their profile)

When to See a Doctor
(A clear, kind statement about when and why to seek professional consultation)

Rules: warm and non-alarmist · no clinical diagnosis · plain language · under 300 words · exact headings only."""


# ── Gemini call ─────────────────────────────────────────────
def _get_gemini_advice(prompt: str) -> str:
    if not _gemini_client:
        return (
            "AI advice is currently unavailable — GEMINI_API_KEY is not configured. "
            "Please consult a healthcare professional for personalised guidance."
        )
    try:
        response = _gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return response.text.strip()
    except Exception as exc:
        return f"Unable to generate AI advice at this time: {exc}"


# ── Public interface ────────────────────────────────────────
def predict_pcos(raw_data: dict) -> dict:
    """
    Accept raw (un-normalised) form data from the frontend,
    run the ML model and Gemini advice, return the full result.

    Parameters
    ----------
    raw_data : dict
        Keys: age, weight, height, cycleLen, symptoms, fastFood, exercise

    Returns
    -------
    dict
        probability  float  0–1
        risk_level   str    "Low" | "Moderate" | "High"
        advice       str    rule-based fallback
        ai_advice    str    Gemini personalised advice
    """
    _validate(raw_data)
    features  = _build_features(raw_data)
    pcos_prob = float(_model.predict_proba(features)[0][1])
    risk_level, advice = _classify_risk(pcos_prob)
    ai_advice = _get_gemini_advice(_build_prompt(raw_data, pcos_prob, risk_level))

    return {
        "probability": round(pcos_prob, 4),
        "risk_level":  risk_level,
        "advice":      advice,
        "ai_advice":   ai_advice,
    }


# ── Smoke test ──────────────────────────────────────────────
if __name__ == "__main__":
    _cases = [
        ("LOW — healthy, regular cycle", dict(
            age=22, weight=55, height=165, cycleLen=28,
            symptoms=dict(weightGain=False, facialHair=False, skinDark=False,
                          hairLoss=False, acne=False),
            fastFood=False, exercise=True)),
        ("MODERATE — some flags", dict(
            age=28, weight=72, height=162, cycleLen=38,
            symptoms=dict(weightGain=True, facialHair=False, skinDark=False,
                          hairLoss=False, acne=True),
            fastFood=True, exercise=False)),
        ("HIGH — many symptoms, irregular", dict(
            age=30, weight=90, height=155, cycleLen=50,
            symptoms=dict(weightGain=True, facialHair=True, skinDark=True,
                          hairLoss=False, acne=True),
            fastFood=True, exercise=False)),
    ]
    for label, d in _cases:
        r = predict_pcos(d)
        print(f"\n{'─'*55}")
        print(f"  {label}")
        print(f"  Probability : {r['probability']:.2f}  →  {r['risk_level']} risk")
