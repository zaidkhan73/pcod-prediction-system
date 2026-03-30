// ─────────────────────────────────────────────────────────────
// components/FormPrimitives.jsx
// Shared UI atoms used across all form sections
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef } from "react";

/* ── Animated background ── */
export function BackgroundMesh() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="blob absolute w-[600px] h-[600px] rounded-full bg-plum-600 opacity-15 blur-[90px] -top-48 -left-36 animate-drift-1" />
      <div className="blob absolute w-[480px] h-[480px] rounded-full bg-rose-400 opacity-15 blur-[90px] -bottom-40 -right-28 animate-drift-2" />
      <div className="blob absolute w-[300px] h-[300px] rounded-full bg-plum-200 opacity-15 blur-[90px] top-[38%] left-[52%] animate-drift-3" />
    </div>
  );
}

/* ── Floating petals ── */
export function FloatingPetals() {
  const petalColors = ["#f9c6d4", "#ead5f5", "#fdf0f4", "#c9a8d4"];
  const petals = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: 7 + Math.random() * 9,
    duration: `${9 + Math.random() * 14}s`,
    delay: `${Math.random() * 14}s`,
    color: petalColors[Math.floor(Math.random() * petalColors.length)],
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute opacity-0 rounded-[50%_50%_50%_0]"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.35,
            background: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animation: `petalFall ${p.duration} linear ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Step progress dots ── */
export function StepProgress({ current, total = 4 }) {
  const labels = ["Body", "Cycle", "Symptoms", "Lifestyle"];
  const pct = ((current - 1) / total) * 100;

  return (
    <div className="w-full max-w-[580px] mb-7 animate-fade-down">
      <div className="flex items-start mb-3">
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          const done = n < current;
          const active = n === current;
          return (
            <div key={n} className="flex-1 flex flex-col items-center gap-2 relative">
              {/* connector line */}
              {n < total && (
                <div
                  className="absolute top-[18px] h-[2px] z-0 transition-all duration-500"
                  style={{
                    left: "calc(50% + 20px)",
                    right: "calc(-50% + 20px)",
                    background: done
                      ? "#e4d0ea"
                      : "#e4d0ea",
                  }}
                />
              )}
              {/* bubble */}
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-content-center
                  text-xs font-medium z-10 relative transition-all duration-[420ms]
                  flex items-center justify-center
                  ${active
                    ? "bg-gradient-to-br from-rose-400 to-plum-600 text-white border-transparent scale-[1.18] shadow-rose-glow"
                    : done
                    ? "bg-gradient-to-br from-rose-600 to-rose-800 text-white border-transparent"
                    : "bg-white border-2 border-plum-100 text-plum-200"
                  }
                `}
              >
                {done ? "✓" : n}
              </div>
              <span
                className={`text-[0.65rem] font-medium tracking-wider text-center
                  ${active ? "text-rose-400" : done ? "text-plum-600" : "text-plum-200"}`}
              >
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>
      {/* fill bar */}
      <div className="h-[5px] bg-plum-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#e8527a,#7c3d8f)",
          }}
        />
      </div>
    </div>
  );
}

/* ── Card wrapper ── */
export function FormCard({ children, animDir = "r" }) {
  return (
    <div
      className={`w-full max-w-[580px] bg-white rounded-[28px] shadow-card overflow-hidden
        ${animDir === "r" ? "animate-slide-r" : "animate-slide-l"}`}
    >
      {/* shimmer stripe */}
      <div
        className="h-[5px] animate-shimmer"
        style={{
          background: "linear-gradient(90deg,#e8527a,#7c3d8f,#f9c6d4,#7c3d8f)",
          backgroundSize: "300%",
        }}
      />
      <div className="p-6 sm:p-10">{children}</div>
    </div>
  );
}

/* ── Section heading ── */
export function SectionHead({ step, total = 4, tag, title, desc }) {
  return (
    <div className="mb-7">
      <p className="text-[0.67rem] font-medium tracking-[0.15em] uppercase text-rose-400 mb-2">
        {tag ?? `Section ${step} of ${total}`}
      </p>
      <h2 className="font-display text-[clamp(1.3rem,3.8vw,1.9rem)] text-plum-800 leading-[1.2] mb-2">
        {title}
      </h2>
      {desc && (
        <p className="text-sm text-plum-400 leading-[1.68]">{desc}</p>
      )}
    </div>
  );
}

/* ── Field wrapper ── */
export function Field({ label, hint, error, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-[7px] ${className}`}>
      {label && (
        <label className="text-[0.83rem] font-medium text-plum-800">
          {label}{" "}
          {hint && <span className="font-normal text-plum-300 text-[0.77rem]">{hint}</span>}
        </label>
      )}
      {children}
      {error && (
        <span className="text-[0.73rem] text-red-500 animate-fade-up">{error}</span>
      )}
    </div>
  );
}

/* ── Number input ── */
export function NumberInput({ id, placeholder, min, max, value, onChange, hasError }) {
  return (
    <input
      id={id}
      type="number"
      inputMode="decimal"
      placeholder={placeholder}
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full px-4 py-[14px] rounded-[10px] font-body text-base text-plum-800
        bg-cream border-[1.5px] outline-none
        transition-all duration-200
        focus:border-rose-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(232,82,122,0.11)] focus:-translate-y-px
        placeholder:text-plum-200
        [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none
        ${hasError ? "border-red-400 shadow-[0_0_0_3px_rgba(214,59,90,0.10)]" : "border-plum-100"}
      `}
    />
  );
}

/* ── Toggle button pair ── */
export function TogglePair({ options, value, onChange }) {
  return (
    <div className="flex gap-2.5">
      {options.map(({ label, val, isYes }) => {
        const active = value === val;
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`
              flex-1 py-[13px] px-3 rounded-[10px] text-[0.87rem] font-medium
              border-[1.5px] transition-all duration-[260ms] cursor-pointer outline-none
              ${active && isYes
                ? "border-rose-400 bg-gradient-to-br from-rose-50 to-plum-100 text-rose-400 scale-[1.03] shadow-card-sm"
                : active && !isYes
                ? "border-plum-200 bg-plum-50 text-plum-600 scale-[1.03]"
                : "border-plum-100 bg-cream text-plum-300 hover:border-plum-200 hover:text-plum-600 hover:bg-plum-50"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Symptom card ── */
export function SymptomCard({ icon, label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative text-left rounded-[10px] p-4 pb-3 border-[1.5px]
        transition-all duration-[280ms] cursor-pointer outline-none overflow-hidden
        ${selected
          ? "border-rose-400 -translate-y-0.5 scale-[1.02] shadow-card-sm"
          : "border-plum-100 bg-cream hover:border-plum-200 hover:-translate-y-0.5"
        }
      `}
    >
      {/* hover/selected overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-rose-50 to-plum-100
          transition-opacity duration-250 ${selected ? "opacity-100" : "opacity-0"}`}
      />
      <span className="text-2xl mb-1.5 block relative z-10">{icon}</span>
      <p className={`text-[0.79rem] font-medium leading-snug relative z-10
        ${selected ? "text-plum-600" : "text-plum-800"}`}>
        {label}
      </p>
      {/* tick */}
      <div
        className={`
          mt-2 w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center
          transition-all duration-200 relative z-10
          ${selected ? "bg-rose-400 border-rose-400" : "bg-white border-plum-100"}
        `}
      >
        {selected && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5.5L4 8L8.5 2.5" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </button>
  );
}

/* ── Info box ── */
export function InfoBox({ children }) {
  return (
    <div className="bg-plum-100 border-l-[3px] border-plum-200 rounded-r-[10px] p-3 pl-4 text-[0.79rem] text-plum-800 leading-[1.62]">
      {children}
    </div>
  );
}

/* ── Navigation buttons ── */
export function NavButtons({ onBack, onNext, nextLabel = "Continue →", loading = false }) {
  return (
    <div className="flex gap-3 mt-9 flex-wrap">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="order-2 sm:order-1 w-full sm:w-auto px-6 py-[14px] rounded-full border-[1.5px]
            border-plum-100 text-plum-300 text-[0.875rem] font-medium bg-transparent
            hover:border-plum-200 hover:text-plum-600 transition-all duration-200 outline-none"
        >
          ← Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={loading}
        className="order-1 sm:order-2 flex-1 py-[15px] px-7 rounded-full border-none text-white
          text-[0.92rem] font-medium tracking-wide shadow-btn
          transition-all duration-[260ms] outline-none
          hover:-translate-y-[3px] hover:shadow-btn-hover active:translate-y-0
          disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0
          relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#e8527a,#7c3d8f)",
        }}
      >
        <span className="relative z-10">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Analysing…
            </span>
          ) : nextLabel}
        </span>
      </button>
    </div>
  );
}

/* ── Custom range slider ── */
export function CycleSlider({ value, onChange }) {
  const trackRef = useRef(null);
  const pct = ((value - 15) / (60 - 15)) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-[2.1rem] text-plum-600 leading-none">{value}</span>
        <span className="text-[0.88rem] text-plum-300">days</span>
      </div>
      <div className="relative py-3">
        <div
          ref={trackRef}
          className="relative h-[6px] rounded-full overflow-hidden"
          style={{ background: "#e4d0ea" }}
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-100"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg,#e8527a,#7c3d8f)",
            }}
          />
        </div>
        <input
          type="range"
          min={15}
          max={60}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ margin: 0 }}
        />
        {/* custom thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full pointer-events-none
            shadow-[0_2px_10px_rgba(124,61,143,0.34)] transition-transform duration-100"
          style={{
            left: `calc(${pct}% - 12px)`,
            background: "linear-gradient(135deg,#e8527a,#7c3d8f)",
          }}
        />
      </div>
      <div className="flex justify-between text-[0.69rem] text-plum-300">
        <span>15 days</span>
        <span>60 days</span>
      </div>
    </div>
  );
}