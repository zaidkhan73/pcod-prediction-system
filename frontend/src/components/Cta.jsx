import { Fade } from "../utils/Fade";
import COLORS from "../constants/colors";
import { useState } from "react";

export function CTA() {
  return (
    <section style={{ padding: "80px 24px" }}>
      <Fade>
        <div style={{
          maxWidth: 900, margin: "0 auto", borderRadius: 32,
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, #5a189a 60%, #3c096c 100%)`,
          padding: "64px 40px", textAlign: "center",
          boxShadow: "0 24px 64px rgba(123,44,191,0.35)",
          position: "relative", overflow: "hidden",
        }}>
          {/* decorative circles */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(46,196,182,0.15)" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💜</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.3 }}>
              Take Charge of Your Health Today.
            </h2>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.7 }}>
              Join thousands of women who use Rutuchakra to understand their health and take early, informed action.
            </p>
            <CTAButton>Start PCOD Risk Assessment →</CTAButton>
          </div>
        </div>
      </Fade>
    </section>
  );
}

function CTAButton({ children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#fff" : "rgba(255,255,255,0.15)",
        color: hov ? COLORS.primary : "#fff",
        border: "2px solid rgba(255,255,255,0.6)",
        padding: "16px 36px", borderRadius: 50,
        fontSize: 17, fontWeight: 700, cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        transition: "all 0.3s ease",
        boxShadow: hov ? "0 8px 30px rgba(255,255,255,0.3)" : "none",
        transform: hov ? "translateY(-3px)" : "none",
      }}
    >{children}</button>
  );
}