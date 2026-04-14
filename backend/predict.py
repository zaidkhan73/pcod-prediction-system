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

   # ── Gemini prompt ───────────────────────────────────────────
def _build_prompt(data: dict, prob: float, risk_level: str) -> str:
    age    = int(float(data["age"]))
    weight = float(data["weight"])
    height = float(data["height"])
    bmi    = weight / ((height / 100) ** 2)
    cycle  = int(data["cycleLen"])
    sym    = data["symptoms"]

    # CHANGE: BMI label now uses plain Indian-relatable terms.
    # "Obese" is clinically correct but can feel harsh or confusing.
    # "Weight is on the higher side" is how a doctor would phrase it
    # in a friendly conversation. Same idea, zero jargon.
    bmi_label = (
        "weight is lower than normal" if bmi < 18.5 else
        "weight is normal"            if bmi < 25   else
        "weight is slightly high"     if bmi < 30   else
        "weight is on the higher side"
    )

    # CHANGE: Cycle description now uses everyday language.
    # "Amenorrhoea" means nothing to most users. "Periods have stopped
    # or are very rare" is immediately understood.
    cycle_cat = (
        "periods have stopped or are very rare"   if cycle <= 15 else
        "periods come too frequently or are short" if cycle < 21  else
        "periods are regular"                      if cycle <= 35 else
        "periods are delayed or irregular"
    )

    # CHANGE: Symptom labels now use Indian-familiar language.
    # "Hirsutism" and "acanthosis nigricans" are medical terms no layperson
    # knows. Replaced with descriptions a woman would use herself
    # ("facial hair" → already familiar; "dark patches on neck or underarms"
    # is exactly how Indian women describe acanthosis nigricans to each other).
    sym_labels = {
        "weightGain": "sudden or unexplained weight gain",
        "facialHair": "unwanted hair on face, chin, or body",
        "skinDark":   "dark patches on neck, underarms, or skin folds",
        "hairLoss":   "hair fall or thinning of hair",
        "acne":       "pimples or acne that keep coming back",
    }
    sym_text = ", ".join(sym_labels[k] for k, v in sym.items()
                         if v and k in sym_labels) or "no major symptoms"

    # CHANGE: The entire prompt is now split into two clear layers:
    #
    # LAYER 1 — "INTERNAL CONTEXT" block (marked with [INTERNAL])
    #   This is Gemini's briefing. It uses clinical language because
    #   Gemini needs to fully understand the medical situation to give
    #   accurate advice. The user never sees this section.
    #
    # LAYER 2 — "OUTPUT INSTRUCTIONS" block
    #   This tells Gemini exactly how to write the response:
    #   simple Hindi-English mixed style, Indian food examples,
    #   no jargon, warm tone like an elder sister or family doctor.
    #   The user only sees the output that follows these instructions.
    #
    # This two-layer design means Gemini gets the full clinical picture
    # internally but translates it into everyday Indian language for output.

    return f"""[INTERNAL CONTEXT — for your understanding only, do not include this in your response]
You are analysing a PCOS self-assessment from an Indian woman.
Clinical details:
- Age: {age} years
- BMI: {bmi:.1f} kg/m² ({bmi_label})
- Menstrual cycle length: {cycle} days ({cycle_cat})
- Reported symptoms: {sym_text}
- Fast food consumption 3+ times/week: {"Yes" if data.get("fastFood") else "No"}
- Regular exercise 3+ times/week: {"Yes" if data.get("exercise") else "No"}
- ML model PCOS probability score: {prob * 100:.0f}% — classified as {risk_level} risk
Understanding: PCOS (Polycystic Ovary Syndrome) involves hormonal imbalance, insulin resistance,
irregular cycles, and symptoms like hirsutism, acne, and weight gain. Risk factors include
sedentary lifestyle, high glycaemic diet, obesity, and genetic predisposition.
Use this clinical understanding to give accurate, tailored advice — but translate everything
into simple, friendly language in your actual response below.
[END INTERNAL CONTEXT]

OUTPUT INSTRUCTIONS — write your response exactly as described below:

You are like a caring elder sister or a friendly lady doctor talking to an Indian woman
who may not know medical terms. She may be from a small town or a big city — keep it
simple enough for both.

Tone rules:
- Write like you are talking to her directly and warmly, not writing a report
- Use simple everyday words — the kind used in normal Indian conversations
- Do NOT use: PCOS jargon, Latin terms, complex medical words
- It is okay to say "PCOD" — Indian women are more familiar with that term than "PCOS"
- Use Indian food examples when suggesting diet changes (roti, dal, sabzi, ghee, maida,
  packaged namkeen, cold drinks, etc.) — not Western examples like "whole wheat bread"
- Use Indian lifestyle references where helpful (walking in the morning, yoga, home-cooked food)
- If her risk is Low: be reassuring and encouraging, not dismissive
- If her risk is Moderate: be honest but calm, not scary
- If her risk is High: be clear and firm about seeing a doctor, but not alarming

Format — use EXACTLY these three headings, nothing else:

Your Summary
(2 to 3 sentences. Acknowledge how she might be feeling. Mention her specific situation
in simple words — like her period pattern or the symptoms she reported. Tell her what
the result means in plain terms, not percentage numbers.)

What You Can Do
(3 to 4 practical tips. Make them specific to her profile — mention her actual symptoms
or lifestyle choices. Use Indian food and lifestyle references. Each tip should be one
thing she can actually start doing from tomorrow, not vague advice.)

When to See a Doctor
(1 to 2 sentences. Tell her clearly whether she should go to a doctor now, soon, or just
keep an eye on things. Mention "gynaecologist" or "ladies doctor" — both are understood.
Never say "do not worry" if her risk is High.)

Keep the total response under 280 words. No bullet symbols, no asterisks, no markdown."""


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
