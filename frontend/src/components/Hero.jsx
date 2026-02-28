import { useState, useEffect } from "react";
import COLORS from "../constants/colors";
import { Button } from "./Button";

export function Hero() {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

    return (
        <section id="home" style={{
            minHeight: "100vh", display: "flex", alignItems: "center",
            background: `linear-gradient(135deg, #faf7ff 0%, #f0e6ff 40%, #e8f8f7 100%)`,
            paddingTop: 88, position: "relative", overflow: "hidden",
        }}>
            {/* Background orbs */}
            <div style={{ position: "absolute", top: -80, right: -80, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(123,44,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -60, left: -60, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(46,196,182,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px", display: "flex", alignItems: "center", gap: 60, width: "100%", flexWrap: "wrap" }}>
                {/* Text */}
                <div style={{ flex: "1 1 400px", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(40px)", transition: "all 0.9s ease 0.1s" }}>
                    <div style={{ display: "inline-block", background: "rgba(123,44,191,0.08)", border: "1px solid rgba(123,44,191,0.2)", borderRadius: 50, padding: "6px 16px", marginBottom: 20 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.primary, letterSpacing: "0.06em", textTransform: "uppercase" }}>PCOD Prediction System</span>
                    </div>
                    <h1 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "clamp(36px, 5vw, 58px)", lineHeight: 1.15, color: COLORS.text,
                        fontWeight: 700, marginBottom: 24,
                    }}>
                        Understand Your<br />
                        <span style={{ color: COLORS.primary }}>Cycle.</span> Predict Early.<br />
                        <span style={{ color: COLORS.accent }}>Stay Healthy.</span>
                    </h1>
                    <p style={{ fontSize: 18, color: "#4B5563", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
                        Rutuchakra helps women assess their risk of PCOD using smart prediction technology — early awareness, better choices, healthier lives.
                    </p>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <Button primary large href="#home">Check Your Risk</Button>
                        <Button outline large href="#about">Learn More</Button>
                    </div>

                    {/* Trust badges */}
                    <div style={{ display: "flex", gap: 24, marginTop: 40, flexWrap: "wrap" }}>
                        {["🔒 Private & Secure", "⚡ Instant Results", "🧬 AI-Powered"].map(badge => (
                            <span key={badge} style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>{badge}</span>
                        ))}
                    </div>
                </div>

                {/* Illustration */}
                <div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(40px)", transition: "all 0.9s ease 0.35s" }}>
                    <HeroIllustration />
                </div>
            </div>
        </section>
    );
}

function HeroIllustration() {
    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                maxWidth: 360,
                aspectRatio: "1 / 1",
            }}
        >
            {/* Inner card */}
            <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 260, height: 260, borderRadius: 32,
                background: "white",
                boxShadow: "0 20px 60px rgba(123,44,191,0.15)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24,
            }}>
                {/* Cycle icon SVG */}
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="36" stroke="#CDB4DB" strokeWidth="3" strokeDasharray="6 4" />
                    <circle cx="40" cy="40" r="24" fill="rgba(123,44,191,0.08)" />
                    <circle cx="40" cy="40" r="14" fill="#7B2CBF" opacity="0.9" />
                    <path d="M40 10 A30 30 0 0 1 70 40" stroke="#2EC4B6" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="40" cy="10" r="4" fill="#2EC4B6" />
                    <circle cx="70" cy="40" r="4" fill="#2EC4B6" />
                    {/* Heart pulse */}
                    <path d="M28 42 L33 42 L36 36 L40 50 L44 38 L47 42 L52 42" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.primary, marginBottom: 4 }}>Risk Assessment</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>Powered by AI Analysis</div>
                </div>
                {/* Mini stats */}
                <div style={{ display: "flex", gap: 16 }}>
                    {[["98%", "Accuracy"], ["<1min", "Results"]].map(([v, l]) => (
                        <div key={l} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.accent }}>{v}</div>
                            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{l}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating badges */}
            {[
                { label: "PCOD Aware", icon: "💜", top: "8%", left: "-8%", delay: "0s" },
                { label: "Smart AI", icon: "🧬", bottom: "8%", right: "-8%", delay: "1s" },
            ].map(({ label, icon, top, left, bottom, right, delay }) => (
                <div key={label} style={{
                    position: "absolute", top, left, bottom, right,
                    background: "white", borderRadius: 50, padding: "8px 14px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                    display: "flex", alignItems: "center", gap: 6,
                    fontSize: 13, fontWeight: 600, color: COLORS.text,
                    animation: `float 3s ease-in-out ${delay} infinite`,
                }}>
                    <span>{icon}</span>{label}
                </div>
            ))}

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
        </div>
    );
}