// ─────────────────────────────────────────────────────────────
// utils/pcos.js
// Shared logic: cycle classification, risk scoring, AI advice
// ─────────────────────────────────────────────────────────────

/**
 * Classify menstrual cycle regularity from length alone.
 * Normal range: 21–35 days.
 * Returns one of: "regular" | "short" | "long" | "absent"
 */
export function classifyCycle(days) {
  if (days <= 10)  return "absent";
  if (days < 21)   return "short";
  if (days <= 35)  return "regular";
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
 * Compute BMI and return category label + Tailwind color classes.
 */
export function computeBMI(weight, height) {
  if (!weight || !height || height === 0) return null;
  const bmi = weight / ((height / 100) ** 2);
  let label, classes;
  if (bmi < 18.5)      { label = "Underweight"; classes = "text-blue-700 bg-blue-50 border-blue-200"; }
  else if (bmi < 25)   { label = "Normal";       classes = "text-emerald-700 bg-emerald-50 border-emerald-200"; }
  else if (bmi < 30)   { label = "Overweight";   classes = "text-amber-700 bg-amber-50 border-amber-200"; }
  else                  { label = "Obese";        classes = "text-red-700 bg-red-50 border-red-200"; }
  return { value: bmi, label, classes };
}

/**
 * Score the form responses → 0–14 raw score → percentage.
 * Returns { score, percent, level: "low" | "moderate" | "high", flags[] }
 */
export function calcRisk(formData) {
  const { bmi, cycleLen, symptoms, fastFood, exercise } = formData;
  let score = 0;
  const flags = [];

  // BMI
  if (bmi >= 30)      { score += 2; flags.push("Obese BMI"); }
  else if (bmi >= 25) { score += 1; flags.push("Elevated BMI"); }

  // Cycle
  const cycClass = classifyCycle(cycleLen);
  if (cycClass === "absent") { score += 4; flags.push("Absent / no period"); }
  else if (cycClass !== "regular") { score += 3; flags.push("Irregular cycle length"); }

  // Symptoms
  const symLabels = {
    weightGain: "Unexplained weight gain",
    facialHair: "Excess facial/body hair",
    skinDark:   "Skin darkening",
    hairLoss:   "Hair thinning / loss",
    acne:       "Persistent acne",
  };

  Object.entries(symptoms).forEach(([k, v]) => {
    if (v) { score += 1.5; flags.push(symLabels[k]); }
  });

  // Lifestyle
  if (fastFood)  { score += 1; flags.push("High fast food intake"); }
  if (!exercise) { score += 1; flags.push("Low physical activity"); }

  // ✅ FIX: If everything is clean
  if (score === 0) {
    return { score: 0, percent: 0, level: "low", flags: [] };
  }

  const percent = Math.round((Math.min(score, 14) / 14) * 100);
  const level = percent < 35 ? "low" : percent < 65 ? "moderate" : "high";

  return { score, percent, level, flags };
}

/**
 * Build a structured prompt for the AI advice call.
 */
export function buildAdvicePrompt(formData, risk) {
  const { age, bmi, bmiLabel, cycleLen, symptoms, fastFood, exercise } = formData;
  const { percent, level, flags } = risk;

  const symList = Object.entries(symptoms)
    .filter(([, v]) => v)
    .map(([k]) => ({
      weightGain: "unexplained weight gain",
      facialHair: "excess facial/body hair (hirsutism)",
      skinDark:   "skin darkening (acanthosis nigricans)",
      hairLoss:   "hair thinning or loss",
      acne:       "persistent acne",
    }[k]))
    .join(", ") || "none reported";

  return `You are a compassionate and knowledgeable women's health assistant specialising in PCOS/PCOD awareness. 
A user has completed a self-assessment tool with the following responses:

- Age: ${age} years
- BMI: ${bmi?.toFixed(1)} (${bmiLabel})
- Average menstrual cycle length: ${cycleLen} days (${cycleLabel(cycleLen)})
- Observable symptoms: ${symList}
- Fast food consumption (3+ times/week): ${fastFood ? "Yes" : "No"}
- Regular exercise (3+ times/week): ${exercise ? "Yes" : "No"}

Risk assessment result: ${percent}% likelihood indicator (${level} risk).
Key flags identified: ${flags.length > 0 ? flags.join(", ") : "none"}.

Please provide:
1. A brief, empathetic personalised summary (2–3 sentences) acknowledging their specific situation.
2. 3–4 specific, actionable lifestyle and dietary recommendations tailored to their responses.
3. A clear, kind statement about when and why they should seek professional medical consultation.

Important guidelines:
- Be warm, encouraging, and non-alarmist.
- Do NOT make a clinical diagnosis.
- Use simple, accessible language — not medical jargon.
- Keep the total response under 300 words.
- Format your response with clear sections using these exact headings: "Your Summary", "What You Can Do", "When to See a Doctor".`;
}

/**
 * Call Anthropic API from backend proxy and stream the response.
 * Replace VITE_API_URL with your actual backend endpoint.
 *
 * Expected backend route: POST /api/advice
 * Body: { prompt: string }
 * Response: streaming text/plain  OR  { advice: string }
 */
export async function fetchAIAdvice(formData, risk, onChunk, onDone, onError) {
  const prompt = buildAdvicePrompt(formData, risk);

  try {
    const res = await fetch(
      (import.meta.env?.VITE_API_URL ?? "http://localhost:5000") + "/api/advice",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    // Handle streaming response (recommended)
    const reader = res.body?.getReader();
    if (reader) {
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        onChunk?.(full);
      }
      onDone?.(full);
    } else {
      // Fallback: non-streaming JSON response
      const data = await res.json();
      onDone?.(data.advice ?? "");
    }
  } catch (err) {
    onError?.(err.message ?? "Failed to get AI advice.");
  }
}