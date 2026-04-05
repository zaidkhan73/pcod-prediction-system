// ─────────────────────────────────────────────────────────────
// utils/pcos.js
// UI helpers only — risk calculation is handled by the backend ML model.
// ─────────────────────────────────────────────────────────────

/**
 * Classify menstrual cycle regularity from length alone (UI display only).
 * Normal range: 21–35 days.
 * Returns one of: "regular" | "short" | "long" | "absent"
 */
export function classifyCycle(days) {
  if (days <= 15) return "absent";
  if (days < 21)  return "short";
  if (days <= 35) return "regular";
  return "long";
}

export function cycleLabel(days) {
  const c = classifyCycle(days);
  const map = {
    absent:  "Absent / Amenorrhea",
    short:   "Short cycle (< 21 days)",
    regular: "Regular (21–35 days)",
    long:    "Long / Irregular (> 35 days)",
  };
  return map[c];
}

export function cycleColor(days) {
  const c = classifyCycle(days);
  const map = {
    absent:  "text-red-600 bg-red-50 border-red-200",
    short:   "text-amber-700 bg-amber-50 border-amber-200",
    regular: "text-emerald-700 bg-emerald-50 border-emerald-200",
    long:    "text-rose-600 bg-rose-50 border-rose-200",
  };
  return map[c];
}

export function isIrregular(days) {
  return classifyCycle(days) !== "regular";
}

/**
 * Compute BMI for display purposes only.
 * The backend recomputes this from raw weight/height.
 */
export function computeBMI(weight, height) {
  if (!weight || !height || height === 0) return null;
  const bmi = weight / ((height / 100) ** 2);
  let label, classes;
  if (bmi < 18.5)    { label = "Underweight"; classes = "text-blue-700 bg-blue-50 border-blue-200"; }
  else if (bmi < 25) { label = "Normal";       classes = "text-emerald-700 bg-emerald-50 border-emerald-200"; }
  else if (bmi < 30) { label = "Overweight";   classes = "text-amber-700 bg-amber-50 border-amber-200"; }
  else               { label = "Obese";        classes = "text-red-700 bg-red-50 border-red-200"; }
  return { value: bmi, label, classes };
}

/**
 * Send form data to the Flask backend and return the full prediction result.
 *
 * @param {object} formData  — raw form values (age, weight, height, cycleLen, symptoms, fastFood, exercise)
 * @returns {Promise<{probability, risk_level, advice, ai_advice}>}
 */
export async function fetchPrediction(formData) {
  const API_BASE = import.meta.env?.VITE_API_URL ?? "http://localhost:5000";

  const payload = {
    age:      parseFloat(formData.age),
    weight:   parseFloat(formData.weight),
    height:   parseFloat(formData.height),
    cycleLen: parseInt(formData.cycleLen, 10),
    symptoms: {
      weightGain: !!formData.symptoms.weightGain,
      facialHair: !!formData.symptoms.facialHair,
      skinDark:   !!formData.symptoms.skinDark,
      hairLoss:   !!formData.symptoms.hairLoss,
      acne:       !!formData.symptoms.acne,
    },
    fastFood: !!formData.fastFood,
    exercise: !!formData.exercise,
  };

  const response = await fetch(`${API_BASE}/predict`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? `Server error ${response.status}`);
  }

  const json = await response.json();

  if (json.status !== "success") {
    throw new Error(json.message ?? "Prediction failed.");
  }

  return json.data; // { probability, risk_level, advice, ai_advice }
}