import COLORS from "../constants/colors";
import { Fade } from "../utils/Fade";
import { useState } from "react";

export function HowItWorks() {
  const steps = [
    { num: "01", icon: "📋", title: "Enter Details", desc: "Provide basic health information like cycle regularity, symptoms, and lifestyle factors through our simple form." },
    { num: "02", icon: "⚡", title: "AI-Based Analysis", desc: "Our trained prediction model analyzes your inputs against clinical patterns to assess risk indicators." },
    { num: "03", icon: "📊", title: "Get Risk Prediction", desc: "Receive a personalized risk report with actionable insights and recommendations to discuss with your doctor." },
  ];

  return (
    <section id="how-it-works" style={{ padding: "100px 24px", background: `linear-gradient(135deg, #faf7ff 0%, #f8f9fa 100%)` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Fade>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h1>Process</h1>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>
              How It Works
            </h2>
            <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 520, margin: "0 auto" }}>
              Three simple steps to understand your PCOD risk profile.
            </p>
          </div>
        </Fade>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28, position: "relative" }}>
          {/* connector line (desktop) */}
          <div style={{ position: "absolute", top: 56, left: "16.5%", right: "16.5%", height: 2, background: `linear-gradient(90deg, ${COLORS.secondary}, ${COLORS.accent})`, opacity: 0.4, zIndex: 0 }} className="step-connector" />

          {steps.map((s, i) => (
            <Fade key={s.num} delay={i * 0.2}>
              <StepCard {...s} />
            </Fade>
          ))}
        </div>
        <style>{`@media (max-width: 768px) { .step-connector { display: none; } }`}</style>
      </div>
    </section>
  );
}

function StepCard({ num, icon, title, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff", borderRadius: 24, padding: "36px 28px",
        boxShadow: hov ? "0 20px 56px rgba(123,44,191,0.14)" : "0 4px 20px rgba(0,0,0,0.06)",
        border: `1px solid ${hov ? "rgba(123,44,191,0.2)" : "transparent"}`,
        transform: hov ? "translateY(-8px)" : "none",
        transition: "all 0.35s ease", position: "relative", zIndex: 1,
      }}
    >
      <div style={{
        width: 60, height: 60, borderRadius: "50%",
        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, marginBottom: 20,
        boxShadow: "0 6px 20px rgba(123,44,191,0.3)",
      }}>{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.secondary, letterSpacing: "0.1em", marginBottom: 8 }}>STEP {num}</div>
      <h3 style={{ fontSize: 21, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>{title}</h3>
      <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}