// ─────────────────────────────────────────────────────────────
// components/ResultScreen.jsx
// Shows risk result, flagged indicators, and streamed AI advice
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { fetchAIAdvice } from "../utils/pcos";

/* ── Parse AI response into sections ── */
function parseAdvice(text) {
  const sections = {};
  const headings = ["Your Summary", "What You Can Do", "When to See a Doctor"];
  headings.forEach((h, i) => {
    const next = headings[i + 1];
    const start = text.indexOf(h);
    if (start === -1) return;
    const end = next ? text.indexOf(next) : text.length;
    sections[h] = text.slice(start + h.length, end).replace(/^[:\s]+/, "").trim();
  });
  return sections;
}

/* ── Section icons ── */
const SECTION_ICONS = {
  "Your Summary":         "🌸",
  "What You Can Do":      "💡",
  "When to See a Doctor": "🩺",
};

/* ── Risk level config ── */
function levelConfig(level) {
  return {
    low: {
      icon: "🌿",
      auraClass: "from-emerald-100 to-teal-100",
      ringColor:  "rgba(16,185,129,0.14)",
      title:      "Low likelihood of PCOS",
      subtitle:   "Your responses suggest a low likelihood of PCOS at this time. Keep up a balanced lifestyle and stay aware of any changes.",
    },
    moderate: {
      icon: "🌸",
      auraClass: "from-amber-100 to-yellow-100",
      ringColor:  "rgba(245,158,11,0.14)",
      title:      "Some PCOS indicators present",
      subtitle:   "A few factors commonly associated with PCOS were identified. A consultation with a gynaecologist will help clarify your picture.",
    },
    high: {
      icon: "💜",
      auraClass: "from-rose-100 to-plum-100",
      ringColor:  "rgba(232,82,122,0.14)",
      title:      "Multiple PCOS indicators noted",
      subtitle:   "Several factors strongly linked to PCOS were identified. We encourage you to consult a qualified doctor for a thorough evaluation.",
    },
  }[level];
}

export default function ResultScreen({ formData, risk, onRestart }) {
  const { percent, level, flags } = risk;
  const cfg = levelConfig(level);

  const [adviceText, setAdviceText]   = useState("");
  const [adviceState, setAdviceState] = useState("idle"); // idle | loading | streaming | done | error
  const [errorMsg, setErrorMsg]       = useState("");
  const adviceRef = useRef(null);

  /* auto-fetch advice on mount */
  useEffect(() => {
    setAdviceState("loading");
    fetchAIAdvice(
      formData,
      risk,
      (chunk) => { setAdviceText(chunk); setAdviceState("streaming"); },
      (full)  => { setAdviceText(full);  setAdviceState("done"); },
      (err)   => { setErrorMsg(err);     setAdviceState("error"); }
    );
  }, []);

  /* auto-scroll advice panel while streaming */
  useEffect(() => {
    if (adviceState === "streaming" && adviceRef.current) {
      adviceRef.current.scrollTop = adviceRef.current.scrollHeight;
    }
  }, [adviceText]);

  const parsed = adviceState === "done" ? parseAdvice(adviceText) : null;

  return (
    <div className="flex flex-col items-center text-center gap-6 animate-slide-r">

      {/* ── Aura ring ── */}
      <div className="relative mt-2">
        <div
          className={`w-[130px] h-[130px] rounded-full bg-gradient-to-br ${cfg.auraClass}
            flex items-center justify-center text-5xl animate-pop-in`}
        >
          {cfg.icon}
        </div>
        {/* pulsing ring */}
        <div
          className="absolute inset-[-12px] rounded-full animate-aura-ring pointer-events-none"
          style={{ background: cfg.ringColor }}
        />
      </div>

      {/* ── Title ── */}
      <div>
        <h2 className="font-display text-[clamp(1.4rem,4vw,2rem)] text-plum-800 mb-2">
          {cfg.title}
        </h2>
        <p className="text-sm text-plum-400 leading-[1.72] max-w-[380px] mx-auto">
          {cfg.subtitle}
        </p>
      </div>

      {/* ── Score bar ── */}
      <div className="w-full max-w-[340px]">
        <div className="flex justify-between text-[0.77rem] text-plum-300 mb-2">
          <span>Risk indicator</span>
          <span className="font-medium text-plum-600">{percent}%</span>
        </div>
        <div className="h-[10px] bg-plum-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-[1400ms] ease-out"
            style={{
              width: `${percent}%`,
              background: "linear-gradient(90deg,#e8527a,#7c3d8f)",
              transitionDelay: "300ms",
            }}
          />
        </div>
      </div>

      {/* ── Flags ── */}
      {flags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center max-w-[440px]">
          {flags.map((f, i) => (
            <span
              key={f}
              className="bg-rose-50 text-rose-400 border border-rose-100
                rounded-full px-3.5 py-1 text-[0.75rem] font-medium animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {f}
            </span>
          ))}
        </div>
      )}

      {/* ── AI Advice Panel ── */}
      <div className="w-full max-w-[500px] text-left">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse-dot" />
          <span className="text-[0.78rem] font-medium tracking-wider uppercase text-plum-600">
            AI-Powered Advice
          </span>
        </div>

        <div className="bg-gradient-to-br from-plum-50 to-rose-50 rounded-2xl border border-plum-100 overflow-hidden">

          {/* loading skeleton */}
          {adviceState === "loading" && (
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-plum-400 text-sm">
                <svg className="animate-spin w-4 h-4 text-rose-400 shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Generating your personalised advice…
              </div>
              {[80, 65, 90, 50].map((w, i) => (
                <div key={i} className="h-3 bg-plum-100 rounded-full animate-pulse"
                  style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }} />
              ))}
            </div>
          )}

          {/* streaming — show raw text */}
          {adviceState === "streaming" && (
            <div
              ref={adviceRef}
              className="p-5 max-h-[280px] overflow-y-auto text-[0.82rem] text-plum-700
                leading-[1.72] whitespace-pre-wrap font-body"
            >
              {adviceText}
              <span className="inline-block w-[2px] h-[14px] bg-rose-400 ml-0.5 animate-bounce-sm align-middle" />
            </div>
          )}

          {/* done — sectioned view */}
          {adviceState === "done" && parsed && (
            <div className="divide-y divide-plum-100">
              {Object.entries(parsed).map(([heading, content], i) => (
                <div
                  key={heading}
                  className="p-5 animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{SECTION_ICONS[heading]}</span>
                    <h3 className="text-[0.78rem] font-medium tracking-wider uppercase text-plum-500">
                      {heading}
                    </h3>
                  </div>
                  <p className="text-[0.84rem] text-plum-700 leading-[1.72]">{content}</p>
                </div>
              ))}
            </div>
          )}

          {/* done but no parsed sections — raw fallback */}
          {adviceState === "done" && !parsed && adviceText && (
            <div className="p-5 text-[0.84rem] text-plum-700 leading-[1.72] whitespace-pre-wrap">
              {adviceText}
            </div>
          )}

          {/* error */}
          {adviceState === "error" && (
            <div className="p-5">
              <p className="text-sm text-red-500 mb-3">{errorMsg}</p>
              <button
                onClick={() => {
                  setAdviceState("loading");
                  setAdviceText("");
                  fetchAIAdvice(
                    formData, risk,
                    (c) => { setAdviceText(c); setAdviceState("streaming"); },
                    (f) => { setAdviceText(f); setAdviceState("done"); },
                    (e) => { setErrorMsg(e);   setAdviceState("error"); }
                  );
                }}
                className="text-[0.8rem] text-rose-400 underline hover:text-rose-600"
              >
                Try again
              </button>
            </div>
          )}
        </div>

        {/* critical alert for high risk */}
        {level === "high" && (
          <div className="mt-3 flex items-start gap-3 bg-red-50 border border-red-200
            rounded-xl p-4 animate-fade-up">
            <span className="text-xl shrink-0">⚠️</span>
            <p className="text-[0.8rem] text-red-700 leading-[1.6]">
              <strong>Urgent:</strong> Multiple strong indicators of PCOS were detected. Please consult a
              gynaecologist or endocrinologist as soon as possible for clinical evaluation.
            </p>
          </div>
        )}
      </div>

      {/* ── Disclaimer ── */}
      <p className="text-[0.73rem] text-plum-300 border border-plum-100 rounded-[10px]
        p-3.5 leading-[1.68] bg-cream max-w-[440px]">
        This is a <strong className="text-plum-500">symptom-based awareness tool</strong> — not a clinical
        diagnosis. Results are indicative only. Please consult a qualified gynaecologist or endocrinologist
        for a proper medical evaluation.
      </p>

      {/* ── Restart ── */}
      <button
        onClick={onRestart}
        className="border-[1.5px] border-plum-100 text-plum-300 px-7 py-3 rounded-full
          text-[0.875rem] bg-transparent hover:border-rose-300 hover:text-rose-400
          transition-all duration-200 outline-none"
      >
        Retake the assessment
      </button>
    </div>
  );
}