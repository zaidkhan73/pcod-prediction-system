import COLORS from "../constants/colors";

export function Footer() {
  return (
    <footer style={{ background: "#0F0A1A", color: "#9CA3AF", padding: "60px 24px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, marginBottom: 12 }}>
              <span style={{ color: COLORS.secondary }}>Rutu</span><span style={{ color: COLORS.accent }}>chakra</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 220 }}>
              Empowering women with early PCOD risk awareness through smart technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Quick Links</h4>
            {["Home", "About", "How It Works", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                style={{ display: "block", color: "#9CA3AF", textDecoration: "none", fontSize: 14, marginBottom: 10, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = COLORS.secondary}
                onMouseLeave={e => e.target.style.color = "#9CA3AF"}
              >{l}</a>
            ))}
          </div>

          {/* Social */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Connect</h4>
            {[["Twitter/X", "🐦"], ["Instagram", "📸"], ["LinkedIn", "💼"], ["Email", "✉️"]].map(([name, icon]) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, cursor: "pointer" }}>
                <span>{icon}</span>
                <span style={{ fontSize: 14 }}>{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 12, maxWidth: 600, lineHeight: 1.7, color: "#6B7280" }}>
            <span style={{ color: COLORS.accent, fontWeight: 700 }}>⚠️ Disclaimer: </span>
            This system provides prediction support only and is <strong>not a medical diagnosis</strong>. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.
          </p>
          <p style={{ fontSize: 12 }}>© 2025 Rutuchakra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Tag helper ── */
function Tag({ children }) {
  return (
    <div style={{ display: "inline-block", background: "rgba(123,44,191,0.08)", border: "1px solid rgba(123,44,191,0.18)", borderRadius: 50, padding: "5px 14px", marginBottom: 14 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.primary, letterSpacing: "0.08em", textTransform: "uppercase" }}>{children}</span>
    </div>
  );
}