// src/pages/LandingPage.jsx
// ─────────────────────────────────────────────────────────────
// RutuChakra — Redesigned Landing Page
// Aesthetic : Luxury editorial · soft feminine · deeply modern
// Fonts     : Cormorant Garamond (display) + Outfit (body)
// Colors    : Rose × Plum (same as original, same hex values)
// Key changes:
//   · Full UI modernisation — editorial layout, micro-details
//   · Advice section → smooth accordion / dropdown panels
//   · Highly responsive at every breakpoint (320px → 1440px+)
//   · Scroll-reveal animations, hover polish, nav blur
//   · Footer added
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef, useState, useMemo } from "react";
import { Link, useNavigate } from 'react-router-dom';



// ── Intersection observer hook ───────────────────────────────
function useInView(threshold = 0.12) {
  const ref   = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Scroll-reveal wrapper ────────────────────────────────────
function Reveal({ children, delay = 0, className = "", from = "bottom" }) {
  const [ref, inView] = useInView();
  const T = {
    bottom: inView ? "translateY(0)"   : "translateY(40px)",
    left:   inView ? "translateX(0)"   : "translateX(-40px)",
    right:  inView ? "translateX(0)"   : "translateX(40px)",
  };
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity:         inView ? 1 : 0,
        transform:       T[from] ?? T.bottom,
        transitionDelay: `${delay}ms`,
      }}>
      {children}
    </div>
  );
}

// ── Floating petals ──────────────────────────────────────────
function FloatingPetals() {
  const cols = ["#f9c6d4", "#ead5f5", "#fdf0f4", "#c9a8d4", "#f5eef8"];
  const petals = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id:    i,
      left:  `${(i * 8.7) % 100}%`,
      size:  6 + (i % 5) * 2,
      dur:   `${11 + (i % 7) * 2}s`,
      delay: `${(i * 1.9) % 15}s`,
      color: cols[i % cols.length],
      rot:   (i * 37) % 360,
    })), []
  );
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {petals.map((p) => (
        <div key={p.id} className="absolute opacity-0 rounded-[50%_50%_50%_0]"
          style={{
            left: p.left, top: "-20px",
            width: p.size, height: p.size * 1.35,
            background: p.color,
            transform:  `rotate(${p.rot}deg)`,
            animation:  `petalFall ${p.dur} linear ${p.delay} infinite`,
          }}/>
      ))}
    </div>
  );
}

// ── Animated mesh blobs ──────────────────────────────────────
function MeshBg() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute w-[700px] h-[700px] rounded-full opacity-[0.11] blur-[120px]
        -top-60 -left-44"
        style={{ background:"#7c3d8f", animation:"drift1 22s ease-in-out infinite" }}/>
      <div className="absolute w-[550px] h-[550px] rounded-full opacity-[0.10] blur-[110px]
        -bottom-48 -right-36"
        style={{ background:"#e8527a", animation:"drift2 28s ease-in-out infinite" }}/>
      <div className="absolute w-[380px] h-[380px] rounded-full opacity-[0.08] blur-[90px]
        top-[42%] left-[52%]"
        style={{ background:"#c9a8d4", animation:"drift3 18s ease-in-out infinite" }}/>
    </div>
  );
}

// ── Navbar ───────────────────────────────────────────────────
function Navbar({ onCTA }) {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label:"What is PCOD?", href:"#pcod"   },
    { label:"Advice",        href:"#advice"  },
    { label:"About Us",      href:"#about"   },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400
      ${scrolled
        ? "bg-white/75 backdrop-blur-xl shadow-[0_1px_24px_rgba(124,61,143,0.09)]"
        : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10
        flex items-center justify-between h-16 sm:h-[68px]">

        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
            style={{ background:"linear-gradient(135deg,#e8527a,#7c3d8f)" }}>🌸</div>
          <span className="font-semibold tracking-[0.01em] transition-colors duration-200
            group-hover:opacity-80"
            style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", color:"#4e2268" }}>
            RutuChakra
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href}
              className="relative group text-[0.82rem] font-medium tracking-[0.02em]
                transition-colors duration-200"
              style={{ fontFamily:"'Outfit',sans-serif", color:"#8a6e95" }}
              onMouseEnter={(e) => e.currentTarget.style.color="#e8527a"}
              onMouseLeave={(e) => e.currentTarget.style.color="#8a6e95"}>
              {l.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] rounded-full
                group-hover:w-full transition-all duration-300"
                style={{ background:"linear-gradient(90deg,#e8527a,#7c3d8f)" }}/>
            </a>
          ))}
          <button onClick={() => navigate("/form")}
            className="px-6 py-2.5 rounded-full text-white text-[0.8rem] font-semibold
              tracking-wide transition-all duration-200 hover:-translate-y-0.5"
            style={{
              fontFamily:    "'Outfit',sans-serif",
              background:    "linear-gradient(135deg,#e8527a,#7c3d8f)",
              boxShadow:     "0 4px 20px rgba(124,61,143,0.28)",
              letterSpacing: "0.03em",
            }}>
            Check your risk
          </button>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden p-2 rounded-xl transition-colors"
          style={{ color:"#7c3d8f" }}
          onClick={() => setOpen((o) => !o)}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2}>
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300
        ${open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-white/96 backdrop-blur-xl border-t px-5 py-5 flex flex-col gap-4"
          style={{ borderColor:"#e4d0ea" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href}
              className="text-[0.9rem] font-medium py-0.5"
              style={{ color:"#7c3d8f", fontFamily:"'Outfit',sans-serif" }}
              onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <button onClick={() => { setOpen(false); onCTA(); }}
            className="mt-1 w-full py-3.5 rounded-full text-white text-[0.9rem]
              font-semibold tracking-wide"
            style={{
              background:    "linear-gradient(135deg,#e8527a,#7c3d8f)",
              fontFamily:    "'Outfit',sans-serif",
              letterSpacing: "0.02em",
            }}>
            Check your risk →
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────
function HeroSection({ onCTA }) {
  const navigate = useNavigate()
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center
      text-center px-5 sm:px-8 pt-20 pb-16 overflow-hidden">

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[520px] h-[520px] sm:w-[780px] sm:h-[780px] rounded-full pointer-events-none"
        style={{ background:"radial-gradient(circle,rgba(234,213,245,0.30) 0%,transparent 68%)" }}/>
      {/* Subtle concentric rings */}
      {[480, 360].map((s, i) => (
        <div key={s}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            rounded-full border pointer-events-none hidden sm:block"
          style={{
            width:       `${s}px`,  height: `${s}px`,
            borderColor: i === 0 ? "#e8527a" : "#7c3d8f",
            opacity:     i === 0 ? 0.06 : 0.04,
          }}/>
      ))}

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8 sm:mb-10"
          style={{
            background: "linear-gradient(135deg,#f9c6d4,#ead5f5)",
            animation:  "fadeDown 0.7s cubic-bezier(0.16,1,0.3,1) both",
          }}>
          <span className="w-[5px] h-[5px] rounded-full"
            style={{ background:"#e8527a", animation:"pulseDot 2.2s ease-in-out infinite" }}/>
          <span className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase"
            style={{ color:"#7c3d8f", fontFamily:"'Outfit',sans-serif" }}>
            PCOD / PCOS Awareness &amp; Prediction
          </span>
        </div>

        {/* Headline */}
        <h1 className="mb-6 sm:mb-7 tracking-tight"
          style={{
            fontFamily:  "'Cormorant Garamond',serif",
            fontSize:    "clamp(3rem,9vw,6.4rem)",
            lineHeight:  1.04,
            color:       "#4e2268",
            fontWeight:  600,
            animation:   "fadeDown 0.8s 0.08s cubic-bezier(0.16,1,0.3,1) both",
          }}>
          Your cycle,{" "}
          <em style={{ fontStyle:"italic", color:"#e8527a" }}>understood.</em>
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl mx-auto leading-[1.78] mb-10 sm:mb-12"
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize:   "clamp(0.95rem,2.2vw,1.14rem)",
            color:      "#8a6e95",
            animation:  "fadeDown 0.8s 0.16s cubic-bezier(0.16,1,0.3,1) both",
          }}>
          RutuChakra is a free, symptom-based awareness tool that helps you understand
          PCOD/PCOS risk — privately, compassionately, and without any lab tests.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4"
          style={{ animation:"fadeDown 0.8s 0.24s cubic-bezier(0.16,1,0.3,1) both" }}>
          <button onClick={() => navigate("/form")}
            className="group w-full sm:w-auto flex items-center justify-center gap-3
              px-9 py-4 rounded-full text-white font-semibold
              transition-all duration-250 hover:-translate-y-1 active:translate-y-0"
            style={{
              fontFamily:    "'Outfit',sans-serif",
              fontSize:      "0.92rem",
              letterSpacing: "0.02em",
              background:    "linear-gradient(135deg,#e8527a,#7c3d8f)",
              boxShadow:     "0 8px 28px rgba(124,61,143,0.30)",
            }}>
            Start your risk check
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
          <a href="#pcod"
            className="w-full sm:w-auto flex items-center justify-center
              px-9 py-4 rounded-full font-medium transition-all duration-200 border-[1.5px]
              hover:-translate-y-0.5 text-center"
            style={{
              fontFamily:  "'Outfit',sans-serif",
              fontSize:    "0.92rem",
              color:       "#7c3d8f",
              borderColor: "#c9a8d4",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor="#e8527a"; e.currentTarget.style.color="#e8527a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor="#c9a8d4"; e.currentTarget.style.color="#7c3d8f"; }}>
            Learn about PCOD
          </a>
        </div>

        {/* Trust indicators */}
        <div className="mt-14 sm:mt-16 flex flex-wrap items-center justify-center
          gap-x-7 gap-y-3"
          style={{ animation:"fadeDown 0.8s 0.32s cubic-bezier(0.16,1,0.3,1) both" }}>
          {[
            { icon:"🔒", text:"100% private"          },
            { icon:"🩺", text:"Doctor-guided design"   },
            { icon:"⚡", text:"Results in 2 minutes"   },
            { icon:"🆓", text:"Completely free"         },
          ].map((t) => (
            <div key={t.text} className="flex items-center gap-2 text-[0.77rem]"
              style={{ color:"#8a6e95", fontFamily:"'Outfit',sans-serif" }}>
              <span className="text-sm">{t.icon}</span>{t.text}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 pointer-events-none"
        style={{ transform:"translateX(-50%)", animation:"bounceCue 2s ease-in-out infinite" }}>
        <svg className="w-5 h-5 opacity-25" fill="none" viewBox="0 0 24 24"
          stroke="#7c3d8f" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </section>
  );
}

// ── PCOD Info ─────────────────────────────────────────────────
function PcodSection() {
  const facts = [
    { icon:"🧬", heading:"Hormonal condition",
      body:"PCOD is caused by a hormonal imbalance where the ovaries produce excess androgens, disrupting egg maturation and release — often silently for years." },
    { icon:"💊", heading:"Highly manageable",
      body:"With the right lifestyle, diet, and medical guidance, most PCOD cases are manageable. Early detection is the single most powerful tool available to you." },
  ];


  return (
    <section id="pcod" className="relative z-10 py-4 sm:py-6 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16 sm:mb-20">
          <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase mb-3"
            style={{ color:"#e8527a", fontFamily:"'Outfit',sans-serif" }}>
            Understanding PCOD
          </p>
          <h2 className="mb-4 leading-[1.1]"
            style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:  "clamp(2.2rem,5.5vw,3.8rem)",
              color:     "#4e2268", fontWeight:600,
            }}>
            What is PCOD / PCOS?
          </h2>
          <p className="max-w-lg mx-auto leading-[1.78]"
            style={{ fontFamily:"'Outfit',sans-serif",
              fontSize:"clamp(0.88rem,2vw,1rem)", color:"#8a6e95" }}>
            Polycystic Ovarian Disease affects millions — yet most women don't recognise the signs
            until much later. Here's what you need to know.
          </p>
        </Reveal>

        {/* Fact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 mb-16 sm:mb-20 flex justify-items-center">
          {facts.map((f, i) => (
            <Reveal key={f.heading} delay={i * 75}>
              <div className="group relative bg-white/72 backdrop-blur-sm rounded-2xl border
                p-6 sm:p-7 h-full flex flex-col gap-4 overflow-hidden
                hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(124,61,143,0.12)]
                transition-all duration-300"
                style={{ borderColor:"#e4d0ea" }}>
                {/* Top hover accent */}
                <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background:"linear-gradient(90deg,#e8527a,#7c3d8f)" }}/>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background:"linear-gradient(135deg,#fdf0f4,#ead5f5)" }}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="mb-2 font-semibold"
                    style={{ fontFamily:"'Cormorant Garamond',serif",
                      fontSize:"1.15rem", color:"#4e2268" }}>
                    {f.heading}
                  </h3>
                  <p className="leading-[1.72]"
                    style={{ fontFamily:"'Outfit',sans-serif",
                      fontSize:"0.84rem", color:"#8a6e95" }}>
                    {f.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

       
      </div>
    </section>
  );
}

// ── Accordion item ────────────────────────────────────────────
function AccordionItem({ item, isOpen, onToggle }) {
  const bodyRef = useRef(null);
  const [bodyH, setBodyH] = useState(0);
  useEffect(() => {
    if (bodyRef.current) setBodyH(bodyRef.current.scrollHeight);
  }, []);

  const tagMap = {
    Nutrition:         { bg:"#dcfce7", text:"#166534", dot:"#22c55e" },
    Movement:          { bg:"#dbeafe", text:"#1e40af", dot:"#3b82f6" },
    "Mental wellness": { bg:"#f3e8ff", text:"#6b21a8", dot:"#a855f7" },
    "Medical care":    { bg:"#fce7f3", text:"#9d174d", dot:"#ec4899" },
  };
  const tc = tagMap[item.tag] ?? tagMap["Medical care"];

  return (
    <div className="rounded-2xl border overflow-hidden transition-all duration-300"
      style={{
        borderColor: isOpen ? "#c9a8d4" : "#e4d0ea",
        boxShadow:   isOpen ? "0 8px 32px rgba(124,61,143,0.09)" : "none",
        background:  "#ffffff",
      }}>

      {/* Trigger */}
      <button type="button" onClick={onToggle}
        className="w-full flex items-center justify-between gap-4
          px-6 sm:px-7 py-5 sm:py-6 text-left group transition-all duration-200"
        style={{
          background: isOpen
            ? "linear-gradient(135deg,#fdf0f4,#f5eef8)"
            : "#ffffff",
        }}>
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0
            transition-transform duration-300 group-hover:scale-110"
            style={{ background:"linear-gradient(135deg,#fdf0f4,#ead5f5)" }}>
            {item.icon}
          </div>
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full mb-1"
              style={{ background:tc.bg }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background:tc.dot }}/>
              <span className="text-[0.6rem] font-semibold tracking-[0.13em] uppercase"
                style={{ color:tc.text, fontFamily:"'Outfit',sans-serif" }}>
                {item.tag}
              </span>
            </div>
            <h3 className="font-semibold leading-snug"
              style={{ fontFamily:"'Cormorant Garamond',serif",
                fontSize:"1.1rem", color:"#4e2268" }}>
              {item.title}
            </h3>
          </div>
        </div>
        {/* Chevron */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0
          transition-all duration-300"
          style={{
            background: isOpen ? "linear-gradient(135deg,#e8527a,#7c3d8f)" : "#f5eef8",
            transform:  isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2.5}
            style={{ color: isOpen ? "#ffffff" : "#8a6e95" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </button>

      {/* Body */}
      <div className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: isOpen ? `${bodyH + 48}px` : "0px" }}>
        <div ref={bodyRef} className="px-6 sm:px-7 pb-6 pt-1 border-t"
          style={{ borderColor:"#f5eef8" }}>
          <div className="flex flex-col gap-3 pt-4">
            {item.points.map((pt, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-[3px] w-5 h-5 rounded-full shrink-0
                  flex items-center justify-center"
                  style={{ background:"linear-gradient(135deg,#f9c6d4,#c9a8d4)" }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background:"#e8527a" }}/>
                </div>
                <p className="leading-[1.7]"
                  style={{ fontFamily:"'Outfit',sans-serif",
                    fontSize:"0.855rem", color:"#6b4e7e" }}>
                  {pt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Advice Section ────────────────────────────────────────────
function AdviceSection() {
  const [openIdx, setOpenIdx] = useState(0);

const advice = [
  {
    icon:"🥗", tag:"Nutrition", title:"Eat healthy",
    points:[
      "Eat home food like roti, dal, vegetables",
      "Avoid junk food and too much sugar",
    ],
  },
  {
    icon:"🏃‍♀️", tag:"Movement", title:"Stay active",
    points:[
      "Walk or exercise daily",
      "Even 20 minutes is enough",
    ],
  },
  {
    icon:"🧘‍♀️", tag:"Mental wellness", title:"Reduce stress",
    points:[
      "Take time to relax daily",
      "Get proper sleep",
    ],
  },
  {
    icon:"🩺", tag:"Medical care", title:"Health check",
    points:[
      "Visit a doctor if needed",
      "Track your periods",
    ],
  },
];
  return (
    <section id="advice" className="relative z-10 py-8 sm:py-10 px-5 sm:px-8">
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background:"linear-gradient(90deg,transparent,#c9a8d4,transparent)" }}/>

      <div className="max-w-4xl mx-auto">
        <Reveal className="text-center mb-14 sm:mb-18">
          <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase mb-3"
            style={{ color:"#e8527a", fontFamily:"'Outfit',sans-serif" }}>
            Living well with PCOD
          </p>
          <h2 className="mb-4 leading-[1.1]"
            style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:  "clamp(2.2rem,5.5vw,3.8rem)",
              color:     "#4e2268", fontWeight:600,
            }}>
            General advice to tackle PCOD
          </h2>
          <p className="max-w-lg mx-auto leading-[1.78]"
            style={{ fontFamily:"'Outfit',sans-serif",
              fontSize:"clamp(0.88rem,2vw,1rem)", color:"#8a6e95" }}>
            Small, consistent changes have the biggest impact. Tap each pillar to expand
            the recommendations.
          </p>
        </Reveal>

        {/* Accordion list */}
        <div className="flex flex-col gap-3.5">
          {advice.map((item, i) => (
            <Reveal key={item.title} delay={i * 60}>
              <AccordionItem
                item={item}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx((p) => (p === i ? null : i))}
              />
            </Reveal>
          ))}
        </div>

        {/* Disclaimer */}
        <Reveal delay={220}>
          <div className="mt-8 rounded-2xl border px-6 py-5 flex items-start gap-4"
            style={{ borderColor:"#e4d0ea", background:"rgba(245,238,248,0.55)" }}>
            <span className="text-2xl shrink-0 mt-0.5">💬</span>
            <p className="leading-[1.7]"
              style={{ fontFamily:"'Outfit',sans-serif", fontSize:"0.845rem", color:"#6b4e7e" }}>
              <strong style={{ color:"#4e2268", fontWeight:600 }}>Remember: </strong>
              These are general awareness guidelines — not a substitute for personalised medical advice.
              Every person's body is different. Always consult a qualified doctor for diagnosis and treatment.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── About Section ─────────────────────────────────────────────
function AboutSection() {
  const pillars = [
    { icon:"🎯", title:"Our mission",
      desc:"To make PCOS/PCOD awareness accessible to every woman in India — regardless of location, income, or access to specialists." },
    { icon:"🛡️", title:"Privacy first",
      desc:"We collect no personal identifiers. Your responses are used only to generate your result. Nothing is stored or shared with third parties." },
  ];

  return (
    <section id="about" className="relative z-10 py14 sm:py-16 px-5 sm:px-8">
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background:"linear-gradient(90deg,transparent,#c9a8d4,transparent)" }}/>

      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16 sm:mb-20">
          <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase mb-3"
            style={{ color:"#e8527a", fontFamily:"'Outfit',sans-serif" }}>
            Who we are
          </p>
          <h2 className="mb-4 leading-[1.1]"
            style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:  "clamp(2.2rem,5.5vw,3.8rem)",
              color:     "#4e2268", fontWeight:600,
            }}>
            About RutuChakra
          </h2>
          <p className="max-w-xl mx-auto leading-[1.78]"
            style={{ fontFamily:"'Outfit',sans-serif",
              fontSize:"clamp(0.88rem,2vw,1rem)", color:"#8a6e95" }}>
            RutuChakra (रुतुचक्र) — meaning "menstrual cycle" in Sanskrit — is a student-built
            awareness platform bridging the gap between PCOS and early detection in India.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <div className="group relative flex gap-4 bg-white/72 backdrop-blur-sm
                rounded-2xl border p-6 sm:p-7 h-full overflow-hidden
                hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(124,61,143,0.10)]
                transition-all duration-300"
                style={{ borderColor:"#e4d0ea" }}>
                <div className="absolute inset-x-0 top-0 h-[3px] opacity-0
                  group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background:"linear-gradient(90deg,#e8527a,#7c3d8f)" }}/>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center
                  text-lg shrink-0"
                  style={{ background:"linear-gradient(135deg,#fdf0f4,#ead5f5)" }}>
                  {p.icon}
                </div>
                <div>
                  <h3 className="mb-2 font-semibold"
                    style={{ fontFamily:"'Outfit',sans-serif",
                      fontSize:"0.95rem", color:"#4e2268" }}>
                    {p.title}
                  </h3>
                  <p className="leading-[1.72]"
                    style={{ fontFamily:"'Outfit',sans-serif",
                      fontSize:"0.845rem", color:"#8a6e95" }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Section ───────────────────────────────────────────────
function CTASection({ onCTA }) {
  const navigate = useNavigate()
  return (
    <section className="relative z-10 py-4 sm:py-8 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="relative rounded-[32px] overflow-hidden text-center
            px-8 py-16 sm:px-16 sm:py-20">
            <div className="absolute inset-0"
              style={{ background:"linear-gradient(135deg,#fdf0f4 0%,#f5eef8 55%,#ead5f5 100%)" }}/>
            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-[4px]"
              style={{ background:"linear-gradient(90deg,#e8527a,#7c3d8f,#f9c6d4)" }}/>
            {/* Blobs */}
            <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-35"
              style={{ background:"#e8527a" }}/>
            <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl opacity-25"
              style={{ background:"#7c3d8f" }}/>

            <div className="relative z-10">
              <div className="inline-flex w-16 h-16 rounded-full items-center justify-center
                text-3xl mb-6 mx-auto"
                style={{ background:"linear-gradient(135deg,#fdf0f4,#ead5f5)" }}>
                🌸
              </div>
              <h2 className="mb-4 leading-[1.1]"
                style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:  "clamp(2rem,5vw,3.2rem)",
                  color:     "#4e2268", fontWeight:600,
                }}>
                Take the first step toward awareness
              </h2>
              <p className="max-w-lg mx-auto leading-[1.78] mb-10"
                style={{ fontFamily:"'Outfit',sans-serif",
                  fontSize:"clamp(0.9rem,2vw,1.05rem)", color:"#8a6e95" }}>
                Our 4-step check takes under 5 minutes. No personal data collected.
                No account needed. Just honest, caring insights — and an AI-powered
                advice summary tailored to your answers.
              </p>
              <button onClick={() => navigate("/form")}
                className="group inline-flex items-center gap-3 px-10 py-4 rounded-full
                  text-white font-semibold transition-all duration-250
                  hover:-translate-y-1 active:translate-y-0"
                style={{
                  fontFamily:    "'Outfit',sans-serif",
                  fontSize:      "0.95rem",
                  letterSpacing: "0.02em",
                  background:    "linear-gradient(135deg,#e8527a,#7c3d8f)",
                  boxShadow:     "0 8px 32px rgba(124,61,143,0.30)",
                }}>
                Begin your assessment
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </button>
              <p className="mt-4 text-[0.71rem]"
                style={{ color:"#b89ec8", fontFamily:"'Outfit',sans-serif" }}>
                Not a clinical diagnosis · Results are for awareness only
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative z-10 border-t py-8 px-5 sm:px-8"
      style={{ borderColor:"#e4d0ea" }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center
        justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
            style={{ background:"linear-gradient(135deg,#e8527a,#7c3d8f)" }}>🌸</div>
          <span className="font-semibold"
            style={{ fontFamily:"'Cormorant Garamond',serif",
              fontSize:"1rem", color:"#4e2268" }}>
            RutuChakra
          </span>
        </div>
        <p className="text-[0.74rem] text-center sm:text-right"
          style={{ color:"#b89ec8", fontFamily:"'Outfit',sans-serif" }}>
          A student-built awareness project · Not a substitute for medical advice
        </p>
      </div>
    </footer>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function LandingPage({ onStartAssessment }) {
  useEffect(() => {
    if (document.getElementById("rc-styles")) return;
    const style = document.createElement("style");
    style.id = "rc-styles";
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');

      @keyframes drift1    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,30px)} }
      @keyframes drift2    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,-40px)} }
      @keyframes drift3    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,25px)} }
      @keyframes petalFall {
        0%   { opacity:0;    transform:translateY(-20px) rotate(0deg) translateX(0); }
        10%  { opacity:0.45; }
        90%  { opacity:0.25; }
        100% { opacity:0;    transform:translateY(105vh) rotate(360deg) translateX(60px); }
      }
      @keyframes fadeDown {
        from { opacity:0; transform:translateY(-24px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes fadeUp {
        from { opacity:0; transform:translateY(24px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes pulseDot {
        0%,100% { transform:scale(1);    opacity:1;    }
        50%     { transform:scale(1.55); opacity:0.55; }
      }
      @keyframes bounceCue {
        0%,100% { transform:translateX(-50%) translateY(0);  }
        50%     { transform:translateX(-50%) translateY(8px); }
      }

      html { scroll-behavior: smooth; }

      @media (max-width: 480px) {
        section { padding-left: 20px !important; padding-right: 20px !important; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden"
      style={{ background:"#fff8fb", color:"#2d1a35" }}>
      <MeshBg />
      <FloatingPetals />
      <Navbar       onCTA={onStartAssessment} />
      <main>
        <HeroSection  onCTA={onStartAssessment} />
        <PcodSection />
        <AdviceSection />
        <AboutSection />
        <CTASection   onCTA={onStartAssessment} />
      </main>
      <Footer />
    </div>
  );
}