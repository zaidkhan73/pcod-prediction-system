import { useState } from "react";

export function PCODTips() {
  const tips = [
    {
      icon: "🥗",
      color: "#2EC4B6",
      colorLight: "rgba(46,196,182,0.10)",
      title: "Eat a Balanced Diet",
      points: [
        "Choose whole grains over refined carbs (oats, brown rice, quinoa)",
        "Include anti-inflammatory foods: leafy greens, berries, fatty fish",
        "Limit sugar, processed foods, and high-GI snacks",
        "Add fibre-rich foods to regulate blood sugar levels",
      ],
    },
    {
      icon: "🏃‍♀️",
      color: "#7B2CBF",
      colorLight: "rgba(123,44,191,0.10)",
      title: "Stay Physically Active",
      points: [
        "Aim for at least 30 minutes of moderate exercise daily",
        "Yoga and stretching help reduce cortisol and hormonal stress",
        "Strength training improves insulin sensitivity significantly",
        "Even brisk walking 5 days a week can improve cycle regularity",
      ],
    },
    {
      icon: "😴",
      color: "#F59E0B",
      colorLight: "rgba(245,158,11,0.10)",
      title: "Prioritise Sleep & Rest",
      points: [
        "Maintain a consistent sleep schedule of 7–9 hours nightly",
        "Poor sleep worsens insulin resistance and hormonal imbalance",
        "Avoid screens at least 30 minutes before bedtime",
        "Practice relaxation techniques: deep breathing, meditation",
      ],
    },
    {
      icon: "🧘‍♀️",
      color: "#EC4899",
      colorLight: "rgba(236,72,153,0.10)",
      title: "Manage Stress Levels",
      points: [
        "Chronic stress raises cortisol which disrupts ovulation",
        "Practice mindfulness, journaling, or breathing exercises daily",
        "Spend time in nature — even 20 minutes reduces stress hormones",
        "Seek support from friends, family, or a mental health professional",
      ],
    },
    {
      icon: "💧",
      color: "#06B6D4",
      colorLight: "rgba(6,182,212,0.10)",
      title: "Stay Hydrated",
      points: [
        "Drink at least 8–10 glasses of water throughout the day",
        "Herbal teas like spearmint may help reduce androgen levels",
        "Avoid sugary drinks, energy drinks, and excessive caffeine",
        "Hydration supports metabolism, skin health, and hormone balance",
      ],
    },
    {
      icon: "🩺",
      color: "#10B981",
      colorLight: "rgba(16,185,129,0.10)",
      title: "Consult a Healthcare Professional",
      points: [
        "Get regular hormonal and blood sugar panels done annually",
        "Discuss cycle irregularities with your gynaecologist early",
        "A nutritionist can build a PCOD-friendly personalised meal plan",
        "Never self-medicate — hormonal therapy must be doctor-prescribed",
      ],
    },
  ];
 
  const [active, setActive] = useState(null);
 
  return (
    <section id="tips" style={{ padding: "100px 24px", background: "linear-gradient(180deg, #faf7ff 0%, #f8f9fa 100%)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
 
        {/* Header */}
        <Fade>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Tag>Wellness Guide</Tag>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: COLORS.text, marginBottom: 16, lineHeight: 1.2 }}>
              General Suggestions to<br />
              <span style={{ color: COLORS.primary }}>Tackle & Prevent PCOD</span>
            </h2>
            <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 580, margin: "0 auto", lineHeight: 1.8 }}>
              While PCOD cannot always be fully prevented, these evidence-backed lifestyle habits can significantly reduce risk, ease symptoms, and support hormonal balance.
            </p>
            <div style={{ marginTop: 16, padding: "12px 20px", background: "rgba(46,196,182,0.08)", border: "1px solid rgba(46,196,182,0.25)", borderRadius: 12, display: "inline-block" }}>
              <p style={{ fontSize: 13, color: "#0D7A73", fontWeight: 600 }}>
                💡 These are general wellness suggestions and do not replace professional medical advice.
              </p>
            </div>
          </div>
        </Fade>
 
        {/* Tips Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {tips.map((tip, i) => (
            <Fade key={tip.title} delay={i * 0.1}>
              <TipCard
                tip={tip}
                isOpen={active === i}
                onToggle={() => setActive(active === i ? null : i)}
              />
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}
 
function TipCard({ tip, isOpen, onToggle }) {
  const [hov, setHov] = useState(false);
  const isActive = isOpen || hov;
 
  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 20,
        background: "#fff",
        border: `1px solid ${isActive ? tip.color + "55" : "rgba(0,0,0,0.06)"}`,
        boxShadow: isActive ? `0 16px 48px ${tip.color}22` : "0 2px 12px rgba(0,0,0,0.04)",
        transition: "all 0.35s ease",
        transform: isActive ? "translateY(-4px)" : "none",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {/* Card Header */}
      <div style={{ padding: "28px 28px 20px", display: "flex", alignItems: "flex-start", gap: 16 }}>
        {/* Icon circle */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
          background: tip.colorLight,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26,
          transition: "transform 0.3s ease",
          transform: isActive ? "scale(1.1)" : "scale(1)",
        }}>
          {tip.icon}
        </div>
 
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: 18, fontWeight: 700, color: COLORS.text,
            marginBottom: 4, fontFamily: "'DM Sans', sans-serif",
          }}>
            {tip.title}
          </h3>
          <p style={{ fontSize: 13, color: tip.color, fontWeight: 600 }}>
            {isOpen ? "Click to collapse ▲" : "Click to expand ▼"}
          </p>
        </div>
 
        {/* Accent bar */}
        <div style={{
          width: 4, height: 40, borderRadius: 4,
          background: tip.color,
          opacity: isActive ? 1 : 0.3,
          transition: "opacity 0.3s ease",
          flexShrink: 0,
        }} />
      </div>
 
      {/* Expandable bullet points */}
      <div style={{
        maxHeight: isOpen ? 240 : 0,
        overflow: "hidden",
        transition: "max-height 0.4s ease",
      }}>
        <div style={{ padding: "0 28px 24px" }}>
          <div style={{ width: "100%", height: 1, background: `${tip.color}33`, marginBottom: 16 }} />
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {tip.points.map((pt, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  background: tip.colorLight,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: tip.color, fontWeight: 700, marginTop: 1,
                }}>✓</span>
                <span style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.6 }}>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}