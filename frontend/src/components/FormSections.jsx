// ─────────────────────────────────────────────────────────────
// components/FormSections.jsx
// The 4 step sections: Body, Cycle, Symptoms, Lifestyle
// ─────────────────────────────────────────────────────────────
import { useState } from "react";
import {
  SectionHead, Field, NumberInput, InfoBox,
  NavButtons, SymptomCard, CycleSlider,
} from "./Formprimitives";
import { computeBMI, cycleLabel, cycleColor, isIrregular } from "../utils/pcos";

/* ════════════════════════════════════════
   SECTION 1 — Body Measurements
════════════════════════════════════════ */
export function Section1({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({});

  const bmiResult = computeBMI(
    parseFloat(data.weight),
    parseFloat(data.height)
  );

  function validate() {
    const e = {};
    const age = parseFloat(data.age);
    const w   = parseFloat(data.weight);
    const h   = parseFloat(data.height);
    if (!data.age || age < 10 || age > 60)
      e.age = "Please enter a valid age (10–60)";
    if (!data.weight || w < 25 || w > 200)
      e.weight = "Enter weight between 25–200 kg";
    if (!data.height || h < 100 || h > 220)
      e.height = "Enter height between 100–220 cm";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (!validate()) return;
    onChange({ bmi: bmiResult?.value ?? null, bmiLabel: bmiResult?.label ?? "" });
    onNext();
  }

  return (
    <div>
      <SectionHead
        step={1}
        title="Let's start with the basics"
        desc="Enter your age, weight, and height. BMI is calculated automatically — no math needed."
      />
      <div className="flex flex-col gap-5">

        {/* Age */}
        <Field label="Age" hint="(years)" error={errors.age}>
          <NumberInput
            id="age" placeholder="e.g. 24" min={10} max={60}
            value={data.age} onChange={(v) => onChange({ age: v })}
            hasError={!!errors.age}
          />
        </Field>

        {/* Weight + Height side by side */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Weight" hint="(kg)" error={errors.weight}>
            <NumberInput
              id="weight" placeholder="e.g. 58" min={25} max={200}
              value={data.weight} onChange={(v) => onChange({ weight: v })}
              hasError={!!errors.weight}
            />
          </Field>
          <Field label="Height" hint="(cm)" error={errors.height}>
            <NumberInput
              id="height" placeholder="e.g. 162" min={100} max={220}
              value={data.height} onChange={(v) => onChange({ height: v })}
              hasError={!!errors.height}
            />
          </Field>
        </div>

        {/* BMI display */}
        <Field label="Your BMI" hint="— auto-calculated">
          <div className="flex items-center justify-between px-4 py-3.5 rounded-[10px]
            border-[1.5px] border-dashed border-plum-200 bg-plum-50 min-h-[54px]">
            <span className="font-display text-[1.65rem] text-plum-600 leading-none">
              {bmiResult ? bmiResult.value.toFixed(1) : "—"}
            </span>
            {bmiResult && (
              <span className={`text-[0.72rem] font-medium px-3 py-1 rounded-full border ${bmiResult.classes}`}>
                {bmiResult.label}
              </span>
            )}
          </div>
        </Field>

        <InfoBox>
          BMI = weight (kg) ÷ height² (m). It is one of several indicators — not a
          standalone measure of PCOS risk or overall health.
        </InfoBox>
      </div>
      <NavButtons onNext={handleNext} />
    </div>
  );
}

/* ════════════════════════════════════════
   SECTION 2 — Menstrual Cycle
════════════════════════════════════════ */
export function Section2({ data, onChange, onNext, onBack }) {
  const days       = data.cycleLen ?? 28;
  const label      = cycleLabel(days);
  const colorClass = cycleColor(days);
  const irregular  = isIrregular(days);

  return (
    <div>
      <SectionHead
        step={2}
        title="Your cycle pattern"
        desc="Drag the slider to select your average menstrual cycle length. Regularity is determined automatically from the value you choose."
      />
      <div className="flex flex-col gap-5">

        {/* Slider */}
        <Field label="Average cycle length">
          <CycleSlider
            value={days}
            onChange={(v) => onChange({ cycleLen: v })}
          />
        </Field>

        {/* Auto-detected regularity badge */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-[10px] border ${colorClass} transition-all duration-300`}>
          <span className="text-xl">
            {days <= 15 ? "🚫" : irregular ? "⚠️" : "✅"}
          </span>
          <div>
            <p className="text-[0.78rem] font-semibold">{label}</p>
            <p className="text-[0.73rem] opacity-80 mt-0.5">
              {days <= 15
                ? "This may indicate amenorrhoea. Please consult a doctor."
                : irregular
                ? "Cycles outside 21–35 days are flagged as irregular — a key PCOS indicator."
                : "Your cycle length falls within the typical healthy range of 21–35 days."}
            </p>
          </div>
        </div>

        {/* Visual scale */}
        <div className="relative h-2 rounded-full overflow-hidden flex">
          <div className="bg-red-200 flex-[6]" title="< 21 (short/absent)" />
          <div className="bg-emerald-200 flex-[14]" title="21–35 (regular)" />
          <div className="bg-amber-200 flex-[25]" title="> 35 (long)" />
          <div
            className="absolute top-0 bottom-0 w-[3px] bg-plum-600 rounded-full transition-all duration-200"
            style={{ left: `${((days - 15) / (60 - 15)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[0.65rem] text-plum-300 -mt-3">
          <span>Short</span>
          <span className="text-emerald-600 font-medium">Regular (21–35)</span>
          <span>Long</span>
        </div>

        <InfoBox>
          Your regularity is decided automatically. A typical cycle is 21–35 days.
          Cycles shorter, longer, absent, or very unpredictable may signal a hormonal imbalance.
        </InfoBox>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}

/* ════════════════════════════════════════
   SECTION 3 — Symptoms
════════════════════════════════════════ */
const SYMPTOMS = [
  { key: "weightGain", icon: "⚖️",  label: "Unexplained weight gain" },
  { key: "facialHair", icon: "🪮",  label: "Excess facial or body hair" },
  { key: "skinDark",   icon: "🩺",  label: "Skin darkening on neck or folds" },
  { key: "hairLoss",   icon: "💇",  label: "Hair thinning or hair loss" },
  { key: "acne",       icon: "🔴",  label: "Persistent acne or pimples" },
  { key: "none",       icon: "✅",  label: "None of the above" },
];

export function Section3({ data, onChange, onNext, onBack }) {
  const symptoms = data.symptoms ?? {};

  function tap(key) {
    if (key === "none") {
      const wasNone = symptoms.none;
      const cleared = {};
      SYMPTOMS.forEach((s) => (cleared[s.key] = false));
      onChange({ symptoms: { ...cleared, none: !wasNone } });
    } else {
      onChange({
        symptoms: {
          ...symptoms,
          none: false,
          [key]: !symptoms[key],
        },
      });
    }
  }

  return (
    <div>
      <SectionHead
        step={3}
        title="What have you been experiencing?"
        desc="Select every symptom that applies. These are self-reportable — no tests needed. Tap to select or deselect."
      />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          {SYMPTOMS.map((s) => (
            <SymptomCard
              key={s.key}
              icon={s.icon}
              label={s.label}
              selected={!!symptoms[s.key]}
              onClick={() => tap(s.key)}
            />
          ))}
        </div>
        <InfoBox>
          Even one or two symptoms can be worth discussing with a doctor.
          PCOS presents differently in every person.
        </InfoBox>
      </div>
      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}

/* ════════════════════════════════════════
   SECTION 4 — Lifestyle
   `error` prop shows any backend submission error.
════════════════════════════════════════ */
export function Section4({ data, onChange, onNext, onBack, submitting, error }) {
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (data.fastFood === null || data.fastFood === undefined)
      e.ff = "Please select an option";
    if (data.exercise === null || data.exercise === undefined)
      e.ex = "Please select an option";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (!validate()) return;
    onNext();
  }

  return (
    <div>
      <SectionHead
        step={4}
        title="Your everyday routine"
        desc="Diet and activity directly affect insulin resistance and hormone levels — both key factors in PCOS."
      />
      <div className="flex flex-col gap-6">

        {/* Fast food */}
        <div className="flex flex-col gap-2">
          <p className="text-[0.83rem] font-medium text-plum-800">
            Do you consume fast food frequently?{" "}
            <span className="font-normal text-[0.77rem] text-plum-300">(3+ times / week)</span>
          </p>
          <div className="flex gap-2.5">
            {[
              { label: "Yes", val: true  },
              { label: "No",  val: false },
            ].map(({ label, val }) => {
              const active = data.fastFood === val;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => { onChange({ fastFood: val }); setErrors((e) => ({ ...e, ff: "" })); }}
                  className={`flex-1 py-[13px] px-3 rounded-[10px] text-[0.87rem] font-medium
                    border-[1.5px] transition-all duration-[260ms] outline-none cursor-pointer
                    ${active && val === true
                      ? "border-rose-400 bg-gradient-to-br from-rose-50 to-plum-100 text-rose-400 scale-[1.03] shadow-card-sm"
                      : active
                      ? "border-plum-200 bg-plum-50 text-plum-600 scale-[1.03]"
                      : "border-plum-100 bg-cream text-plum-300 hover:border-plum-200 hover:text-plum-600 hover:bg-plum-50"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {errors.ff && <span className="text-[0.73rem] text-red-500 animate-fade-up">{errors.ff}</span>}
        </div>

        {/* Exercise */}
        <div className="flex flex-col gap-2">
          <p className="text-[0.83rem] font-medium text-plum-800">
            Do you exercise regularly?{" "}
            <span className="font-normal text-[0.77rem] text-plum-300">(3+ times / week)</span>
          </p>
          <div className="flex gap-2.5">
            {[
              { label: "Yes", val: true  },
              { label: "No",  val: false },
            ].map(({ label, val }) => {
              const active = data.exercise === val;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => { onChange({ exercise: val }); setErrors((e) => ({ ...e, ex: "" })); }}
                  className={`flex-1 py-[13px] px-3 rounded-[10px] text-[0.87rem] font-medium
                    border-[1.5px] transition-all duration-[260ms] outline-none cursor-pointer
                    ${active && val === true
                      ? "border-rose-400 bg-gradient-to-br from-rose-50 to-plum-100 text-rose-400 scale-[1.03] shadow-card-sm"
                      : active
                      ? "border-plum-200 bg-plum-50 text-plum-600 scale-[1.03]"
                      : "border-plum-100 bg-cream text-plum-300 hover:border-plum-200 hover:text-plum-600 hover:bg-plum-50"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {errors.ex && <span className="text-[0.73rem] text-red-500 animate-fade-up">{errors.ex}</span>}
        </div>

        <InfoBox>
          A sedentary lifestyle and diet high in processed food can worsen hormonal imbalance
          and elevate PCOS risk over time.
        </InfoBox>

        {/* Backend submission error */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
            <span className="text-red-400 shrink-0">⚠️</span>
            <p className="text-[0.8rem] text-red-600 leading-[1.5]">{error}</p>
          </div>
        )}
      </div>

      <NavButtons
        onBack={onBack}
        onNext={handleNext}
        nextLabel="See my result →"
        loading={submitting}
      />
    </div>
  );
}