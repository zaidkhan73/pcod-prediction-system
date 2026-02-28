import { useState, useEffect } from "react";
import COLORS from "../constants/colors";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Home", "About", "How It Works", "Contact"];

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(123,44,191,0.10)" : "none",
        transition: "all 0.4s ease",
        borderBottom: scrolled ? "1px solid rgba(205,180,219,0.3)" : "none",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        {/* Logo */}
        <a href="#" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: COLORS.primary, letterSpacing: "-0.5px" }}>
            Rutu<span style={{ color: COLORS.accent }}>chakra</span>
          </span>
        </a>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="desktop-nav">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              style={{ textDecoration: "none", color: COLORS.text, fontSize: 15, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = COLORS.primary}
              onMouseLeave={e => e.target.style.color = COLORS.text}
            >{l}</a>
          ))}
          <a href="#home" style={{
            textDecoration: "none", background: COLORS.primary, color: "#fff",
            padding: "10px 22px", borderRadius: 50, fontSize: 14, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif", transition: "all 0.25s",
            boxShadow: "0 4px 14px rgba(123,44,191,0.3)",
          }}
            onMouseEnter={e => { e.target.style.background = "#6a20a8"; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 6px 20px rgba(123,44,191,0.4)"; }}
            onMouseLeave={e => { e.target.style.background = COLORS.primary; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 14px rgba(123,44,191,0.3)"; }}
          >Check Your Risk</a>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 4 }}
          className="hamburger"
          aria-label="Menu"
        >
          <div style={{ width: 24, height: 2, background: COLORS.primary, marginBottom: 5, transition: "all 0.3s", transform: open ? "rotate(45deg) translateY(7px)" : "none" }} />
          <div style={{ width: 24, height: 2, background: COLORS.primary, marginBottom: 5, transition: "all 0.3s", opacity: open ? 0 : 1 }} />
          <div style={{ width: 24, height: 2, background: COLORS.primary, transition: "all 0.3s", transform: open ? "rotate(-45deg) translateY(-7px)" : "none" }} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div style={{
        overflow: "hidden", maxHeight: open ? 320 : 0,
        transition: "max-height 0.4s ease",
        background: "rgba(255,255,255,0.97)",
        borderTop: open ? "1px solid rgba(205,180,219,0.3)" : "none",
      }} className="mobile-menu">
        <div style={{ padding: "12px 24px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} onClick={() => setOpen(false)}
              style={{ textDecoration: "none", color: COLORS.text, fontSize: 16, fontWeight: 500, padding: "10px 0", fontFamily: "'DM Sans', sans-serif", borderBottom: "1px solid rgba(205,180,219,0.2)" }}
            >{l}</a>
          ))}
          <a href="#home" onClick={() => setOpen(false)} style={{
            textDecoration: "none", background: COLORS.primary, color: "#fff",
            padding: "12px 22px", borderRadius: 50, fontSize: 15, fontWeight: 600,
            textAlign: "center", marginTop: 10, fontFamily: "'DM Sans', sans-serif",
          }}>Check Your Risk</a>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${COLORS.bg}; color: ${COLORS.text}; font-family: 'DM Sans', sans-serif; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}