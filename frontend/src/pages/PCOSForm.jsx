// ─────────────────────────────────────────────────────────────
// components/PCOSForm.jsx
// 4-step form shell.  Risk calculation is done by the backend;
// this component just collects and submits the raw form values.
// ─────────────────────────────────────────────────────────────
import { useState } from "react";
import { BackgroundMesh, FloatingPetals, StepProgress, FormCard } from "../components/Formprimitives";
import { Section1, Section2, Section3, Section4 } from "../components/FormSections";
import ResultScreen from "../components/ResultScreen";
import { fetchPrediction } from "../utils/pcos";

/* ── Initial form state ── */
const INITIAL = {
  // Section 1
  age:      "",
  weight:   "",
  height:   "",
  bmi:      null,
  bmiLabel: "",
  // Section 2
  cycleLen: 28,
  // Section 3
  symptoms: {
    weightGain: false,
    facialHair: false,
    skinDark:   false,
    hairLoss:   false,
    acne:       false,
    none:       false,
  },
  // Section 4
  fastFood: null,
  exercise: null,
};

export default function PCOSForm() {
  const [step,       setStep]       = useState(1);
  const [animDir,    setAnimDir]    = useState("r");
  const [formData,   setFormData]   = useState(INITIAL);
  const [result,     setResult]     = useState(null);   // backend response
  const [submitting, setSubmitting] = useState(false);
  const [submitError,setSubmitError]= useState("");

  function update(patch) {
    setFormData((prev) => ({ ...prev, ...patch }));
  }

  function goTo(n, dir) {
    setAnimDir(dir);
    setTimeout(() => setStep(n), 10);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNext(n) { goTo(n + 1, "r"); }
  function handleBack(n) { goTo(n - 1, "l"); }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError("");
    try {
      const prediction = await fetchPrediction(formData);
      setResult(prediction);
      goTo(5, "r");
    } catch (err) {
      setSubmitError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function restart() {
    setFormData(INITIAL);
    setResult(null);
    setSubmitError("");
    goTo(1, "l");
  }

  const showProgress = step <= 4;

  return (
    <div className="relative min-h-screen bg-[#fff8fb] text-[#2d1a35] overflow-x-hidden font-body">
      <BackgroundMesh />
      <FloatingPetals />

      <div className="relative z-10 flex flex-col items-center px-4 pt-12 pb-24 min-h-screen">

        {/* ── Page Header ── */}
        {showProgress && (
          <header className="text-center mb-10 animate-fade-down w-full max-w-[580px]">
            <div className="inline-flex items-center gap-2 px-5 py-[7px] rounded-full mb-5
              text-[0.68rem] font-medium tracking-[0.15em] uppercase text-[#7c3d8f]"
              style={{ background: "linear-gradient(135deg,#f9c6d4,#ead5f5)" }}>
              <span className="w-[6px] h-[6px] rounded-full bg-[#e8527a] animate-[pulseDot_2.2s_ease-in-out_infinite]" />
              PCOD / PCOS Awareness Tool
            </div>
            <h1 className="font-display text-[clamp(2rem,5.5vw,3.2rem)] text-[#4e2268] leading-[1.13] mb-3">
              Know Your{" "}
              <em className="italic text-[#e8527a]">Risk.</em>
            </h1>
            <p className="text-sm text-[#8a6e95] max-w-[440px] mx-auto leading-[1.72]">
              A gentle 4-step symptom check to raise awareness about PCOS & PCOD.
              No lab tests — just your lived experience.
            </p>
          </header>
        )}

        {/* ── Step progress ── */}
        {showProgress && <StepProgress current={step} />}

        {/* ── Card ── */}
        <FormCard animDir={animDir}>
          {step === 1 && (
            <Section1
              data={formData}
              onChange={update}
              onNext={() => handleNext(1)}
            />
          )}
          {step === 2 && (
            <Section2
              data={formData}
              onChange={update}
              onNext={() => handleNext(2)}
              onBack={() => handleBack(2)}
            />
          )}
          {step === 3 && (
            <Section3
              data={formData}
              onChange={update}
              onNext={() => handleNext(3)}
              onBack={() => handleBack(3)}
            />
          )}
          {step === 4 && (
            <Section4
              data={formData}
              onChange={update}
              onNext={handleSubmit}
              onBack={() => handleBack(4)}
              submitting={submitting}
              error={submitError}
            />
          )}
          {step === 5 && result && (
            <ResultScreen
              result={result}
              onRestart={restart}
            />
          )}
        </FormCard>

      </div>
    </div>
  );
}