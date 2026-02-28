import { useState, useEffect } from "react";
import COLORS from "../constants/colors";

export function Button({ children, primary, outline, large, href = "#" }) {
  const [hov, setHov] = useState(false);
  const base = {
    display: "inline-block", textDecoration: "none",
    padding: large ? "14px 30px" : "10px 22px",
    borderRadius: 50, fontSize: large ? 16 : 14, fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.25s ease", cursor: "pointer",
    border: "2px solid transparent",
  };
  const styles = primary ? {
    ...base,
    background: hov ? "#6a20a8" : COLORS.primary, color: "#fff",
    boxShadow: hov ? "0 8px 24px rgba(123,44,191,0.45)" : "0 4px 14px rgba(123,44,191,0.3)",
    transform: hov ? "translateY(-2px)" : "none",
  } : {
    ...base,
    background: "transparent",
    color: hov ? COLORS.primary : COLORS.text,
    border: `2px solid ${hov ? COLORS.primary : "#D1D5DB"}`,
    transform: hov ? "translateY(-2px)" : "none",
  };

  return (
    <a href={href} style={styles} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </a>
  );
}