// ─────────────────────────────────────────────────────────────
// components/ResultScreen.jsx
// Displays the prediction result returned by the Flask backend.
// All risk logic and AI advice come from the server — this
// component is purely presentational.
// ─────────────────────────────────────────────────────────────

/* ── Parse AI advice text into named sections ── */
function parseAdvice(text) {
  const sections = {};
  const headings = ["Your Summary", "What You Can Do", "When to See a Doctor"];
  headings.forEach((h, i) => {
    const next  = headings[i + 1];
    const start = text.indexOf(h);
    if (start === -1) return;
    const end = next ? text.indexOf(next) : text.length;
    sections[h] = text.slice(start + h.length, end).replace(/^[:\s]+/, "").trim();
  });
  return sections;
}

const SECTION_ICONS = {
  "Your Summary":         "🌸",
  "What You Can Do":      "💡",
  "When to See a Doctor": "🩺",
};

/* ── Risk level visual config ── */
function levelConfig(level) {
  const map = {
    Low: {
      icon:      "🌿",
      auraClass: "from-emerald-100 to-teal-100",
      ringColor: "rgba(16,185,129,0.14)",
      title:     "Low likelihood of PCOS",
      subtitle:  "Your responses suggest a low likelihood of PCOS at this time. Keep up a balanced lifestyle and stay aware of any changes.",
    },
    Moderate: {
      icon:      "🌸",
      auraClass: "from-amber-100 to-yellow-100",
      ringColor: "rgba(245,158,11,0.14)",
      title:     "Some PCOS indicators present",
      subtitle:  "A few factors commonly associated with PCOS were identified. A consultation with a gynaecologist will help clarify your picture.",
    },
    High: {
      icon:      "💜",
      auraClass: "from-rose-100 to-plum-100",
      ringColor: "rgba(232,82,122,0.14)",
      title:     "Multiple PCOS indicators noted",
      subtitle:  "Several factors strongly linked to PCOS were identified. We encourage you to consult a qualified doctor for a thorough evaluation.",
    },
  };
  return map[level] ?? map["Moderate"];
}

/**
 * Props
 * -----
 * result     : { probability, risk_level, advice, ai_advice }  — from backend
 * onRestart  : () => void
 */
export default function ResultScreen({ result, onRestart }) {
  const { probability, risk_level, ai_advice } = result;
  const percent = Math.round(probability * 100);
  const cfg     = levelConfig(risk_level);

  const parsed     = parseAdvice(ai_advice ?? "");
  const hasSections = Object.keys(parsed).length > 0;

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
          <span>PCOS likelihood</span>
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

      {/* ── AI Advice Panel ── */}
      <div className="w-full max-w-[500px] text-left">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          <span className="text-[0.78rem] font-medium tracking-wider uppercase text-plum-600">
            AI-Powered Advice
          </span>
        </div>

        <div className="bg-gradient-to-br from-plum-50 to-rose-50 rounded-2xl border border-plum-100 overflow-hidden">
          {ai_advice ? (
            hasSections ? (
              /* ── Parsed sections view ── */
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
            ) : (
              /* ── Raw text fallback ── */
              <div className="p-5 text-[0.84rem] text-plum-700 leading-[1.72] whitespace-pre-wrap">
                {ai_advice}
              </div>
            )
          ) : (
            /* ── No AI advice (key not set) ── */
            <div className="p-5 text-[0.84rem] text-plum-400 leading-[1.72]">
              {result.advice}
            </div>
          )}
        </div>

        {/* ── High-risk urgent alert ── */}
        {risk_level === "High" && (
          <div className="mt-3 flex items-start gap-3 bg-red-50 border border-red-200
            rounded-xl p-4 animate-fade-up">
            <span className="text-xl shrink-0">⚠️</span>
            <p className="text-[0.8rem] text-red-700 leading-[1.6]">
              <strong>Please act soon:</strong> Multiple strong indicators of PCOS were detected.
              Consult a gynaecologist or endocrinologist for clinical evaluation.
            </p>
          </div>
        )}
      </div>

      {/* ── Disclaimer ── */}
      <p className="text-[0.73rem] text-plum-300 border border-plum-100 rounded-[10px]
        p-3.5 leading-[1.68] bg-cream max-w-[440px]">
        This is a <strong className="text-plum-500">symptom-based awareness tool</strong> — not a
        clinical diagnosis. Results are indicative only. Please consult a qualified gynaecologist
        or endocrinologist for a proper medical evaluation.
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