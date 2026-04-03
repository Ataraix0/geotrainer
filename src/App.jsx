import { useState } from "react";
import EuropaMap from "./EuropaMap.jsx";
import Fichas from "./Fichas.jsx";

const regions = [
  { name: "Europa del Este", emoji: "🇷🇴", color: "#e63946", premium: false, clues: [
    { icon: "🛣️", title: "Carreteras", tip: "Polonia: líneas blancas discontinuas. Rumanía: marcas amarillas." },
    { icon: "📡", title: "Postes eléctricos", tip: "Postes de madera en T invertida = Rusia/Ucrania." },
    { icon: "🔤", title: "Idioma", tip: "Cirílico = Rusia, Ucrania, Bulgaria, Serbia." }
  ]},
  { name: "América del Sur", emoji: "🇧🇷", color: "#2a9d8f", premium: false, clues: [
    { icon: "🌿", title: "Vegetación", tip: "Brasil: verde brillante, palmeras altas." },
    { icon: "🏘️", title: "Casas", tip: "Fachadas coloridas pastel. Rejas en ventanas." },
    { icon: "🔤", title: "Idioma", tip: "Português con ç = Brasil. Castellano con ñ = resto." }
  ]},
  { name: "Países Nórdicos", emoji: "🇸🇪", color: "#6d6875", premium: false, clues: [
    { icon: "🏡", title: "Casas", tip: "Madera pintada en rojo (Falun rödfärg) = Suecia/Noruega." },
    { icon: "🔤", title: "Idioma", tip: "å,ä,ö = Suecia. ø,æ,å = Noruega/Dinamarca." },
    { icon: "☁️", title: "Luz", tip: "Luz difusa y gris. En verano muy larga y dorada." }
  ]},
  { name: "Sudeste Asiático", emoji: "🇹🇭", color: "#f4a261", premium: true, clues: [
    { icon: "🛕", title: "Arquitectura", tip: "Tejados curvados dorados = Tailandia/Myanmar." },
    { icon: "📶", title: "Escritura", tip: "Thai = caracteres redondos. Vietnamita = latino con acentos." },
    { icon: "🛵", title: "Tráfico", tip: "Motos por todas partes." }
  ]},
  { name: "Japón / Corea", emoji: "🇯🇵", color: "#457b9d", premium: true, clues: [
    { icon: "🔤", title: "Escritura", tip: "Hiragana/Kanji = Japón. Hangul = Corea." },
    { icon: "🚗", title: "Conducción", tip: "Japón conduce por la IZQUIERDA." },
    { icon: "⛩️", title: "Arquitectura", tip: "Japón: tejas negras, madera, vending machines." }
  ]},
  { name: "África", emoji: "🌍", color: "#e9c46a", premium: true, clues: [
    { icon: "🏜️", title: "Terreno", tip: "Sahel: tierra rojiza con arbustos bajos." },
    { icon: "🌳", title: "Árboles", tip: "Baobab (tronco grueso, copa pequeña) = África Subsahariana." },
    { icon: "🔤", title: "Idioma", tip: "Francés = Oeste. Inglés = Este y Sur. Árabe = Norte." }
  ]},
];

const QUIZ = [
  { img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Strada_nationala_1_Buftea.jpg/640px-Strada_nationala_1_Buftea.jpg", q: "¿En qué país está esta carretera?", opts: ["Polonia","Rumanía","Ucrania","Hungría"], correct: 1, tip: "Las líneas amarillas en el centro son características de Rumanía." },
  { img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Wooden_houses_in_Bergen%2C_Norway.jpg/640px-Wooden_houses_in_Bergen%2C_Norway.jpg", q: "¿En qué país están estas casas?", opts: ["Suecia","Dinamarca","Noruega","Finlandia"], correct: 2, tip: "El estilo de Bergen, Noruega, es inconfundible." },
  { img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_Papua_New_Guinea_-_panoramio_%283%29.jpg/640px-PNG_Papua_New_Guinea_-_panoramio_%283%29.jpg", q: "¿En qué región del mundo estás?", opts: ["SE Asiático","África tropical","Oceanía","América Central"], correct: 2, tip: "Vegetación típica de Papúa Nueva Guinea." },
];

export default function App() {
  const [isPro, setIsPro] = useState(false);
  const [tab, setTab] = useState("lessons");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [expandedClue, setExpandedClue] = useState(null);
  const [quizIdx, setQuizIdx] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [xp, setXp] = useState(620);

  const gainXP = (n) => setXp(x => Math.min(1000, x + n));

  const handleAnswer = (i) => {
    if (answered !== null) return;
    const q = QUIZ[quizIdx % QUIZ.length];
    setAnswered(i);
    setScore(s => ({ correct: s.correct + (i === q.correct ? 1 : 0), total: s.total + 1 }));
    if (i === q.correct) gainXP(50);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e8e0d0", fontFamily: "Georgia, serif", paddingBottom: 60 }}>
      <div style={{ background: "linear-gradient(180deg,#0f0c29,#0a0a0f)", padding: "24px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 400, letterSpacing: "0.1em", background: "linear-gradient(90deg,#e9c46a,#f4a261)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🌍 GeoTrainer</div>
            <div style={{ fontSize: 11, color: "#7a6a5a", letterSpacing: "0.15em" }}>ENTRENAMIENTO GEOVISUAL</div>
          </div>
          <button onClick={() => !isPro && setShowPaywall(true)} style={{ padding: "6px 14px", borderRadius: 20, border: isPro ? "1px solid #e9c46a" : "1px solid rgba(255,255,255,0.15)", background: isPro ? "rgba(233,196,106,0.15)" : "rgba(255,255,255,0.05)", color: isPro ? "#e9c46a" : "#a89080", cursor: "pointer", fontFamily: "inherit", fontSize: "0.75rem" }}>
            {isPro ? "⭐ Pro activo" : "🔒 Gratis"}
          </button>
        </div>
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "#a89080" }}>Nivel 3</span>
          <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: xp/10+"%", background: "#e9c46a", borderRadius: 3, transition: "width 0.5s" }} />
          </div>
          <span style={{ fontSize: 12, color: "#e9c46a", fontWeight: 600 }}>{xp} XP</span>
        </div>
      </div>

      {showPaywall && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#1a1a2e", border: "1px solid rgba(233,196,106,0.3)", borderRadius: 20, padding: "32px 24px", maxWidth: 360, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🔓</div>
            <h2 style={{ color: "#e9c46a", fontWeight: 400, marginBottom: 8 }}>GeoTrainer Pro</h2>
            <p style={{ color: "#a89080", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: 20 }}>Desbloquea todas las regiones, quiz con imágenes y estadísticas detalladas.</p>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", padding: "12px 8px", textAlign: "center" }}>
                <div style={{ color: "#7a6a5a", fontSize: "0.72rem", marginBottom: 4 }}>MENSUAL</div>
                <div style={{ color: "#e8e0d0", fontWeight: 700, fontSize: "1.3rem" }}>1,99€</div>
              </div>
              <div style={{ flex: 1, borderRadius: 10, border: "2px solid #e9c46a", padding: "12px 8px", textAlign: "center", background: "rgba(233,196,106,0.08)" }}>
                <div style={{ color: "#7a6a5a", fontSize: "0.72rem", marginBottom: 4 }}>⭐ ANUAL</div>
                <div style={{ color: "#e9c46a", fontWeight: 700, fontSize: "1.3rem" }}>14,99€</div>
                <div style={{ color: "#7a6a5a", fontSize: "0.68rem" }}>1,25€/mes</div>
              </div>
            </div>
            <button onClick={() => { setIsPro(true); setShowPaywall(false); gainXP(100); }} style={{ width: "100%", padding: 14, borderRadius: 30, border: "none", background: "linear-gradient(90deg,#e9c46a,#f4a261)", color: "#0a0a0f", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>Activar Pro →</button>
            <button onClick={() => setShowPaywall(false)} style={{ background: "none", border: "none", color: "#7a6a5a", cursor: "pointer", fontFamily: "inherit", fontSize: "0.82rem" }}>Ahora no</button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {[["lessons","Lecciones"],["mapa","Mapa"],["fichas","Fichas"],["quiz","Quiz"],["stats","Stats"]].map(([id,label]) => (
            <button key={id} onClick={() => { setTab(id); setSelectedRegion(null); }} style={{ flex: 1, padding: "11px 2px", fontSize: 12, color: tab===id ? "#e8e0d0" : "#7a6a5a", borderBottom: tab===id ? "2px solid #e9c46a" : "2px solid transparent", background: "none", border: "none", borderBottom: tab===id ? "2px solid #e9c46a" : "2px solid transparent", cursor: "pointer", fontFamily: "inherit", fontWeight: tab===id ? 600 : 400 }}>{label}</button>
          ))}
        </div>

        <div style={{ padding: 16 }}>

          {tab === "lessons" && !selectedRegion && (
            <div>
              <p style={{ fontSize: 11, color: "#7a6a5a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Ruta de aprendizaje</p>
              {regions.map(r => {
                const locked = r.premium && !isPro;
                return (
                  <div key={r.name} onClick={() => locked ? setShowPaywall(true) : setSelectedRegion(r)} style={{ borderRadius: 12, border: "1px solid "+(locked?"rgba(255,255,255,0.06)":r.color+"40"), background: locked?"rgba(255,255,255,0.02)":r.color+"15", padding: 14, marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, opacity: locked?0.5:1 }}>
                    <span style={{ fontSize: 24 }}>{locked?"🔒":r.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{r.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "#7a6a5a" }}>{r.clues.length} pistas{r.premium?" · Pro":""}</div>
                    </div>
                    <span style={{ color: "#7a6a5a", fontSize: 18 }}>›</span>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "lessons" && selectedRegion && (
            <div>
              <button onClick={() => { setSelectedRegion(null); setExpandedClue(null); }} style={{ background: "none", border: "none", color: "#e9c46a", cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem", padding: "0 0 14px" }}>← Volver</button>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span style={{ fontSize: 28 }}>{selectedRegion.emoji}</span>
                <h2 style={{ margin: 0, fontWeight: 400, color: selectedRegion.color, fontSize: "1.1rem" }}>{selectedRegion.name}</h2>
              </div>
              {selectedRegion.clues.map((c, i) => (
                <div key={i} onClick={() => setExpandedClue(expandedClue===i?null:i)} style={{ borderRadius: 10, border: "1px solid "+(expandedClue===i?selectedRegion.color:"rgba(255,255,255,0.08)"), background: expandedClue===i?selectedRegion.color+"15":"rgba(255,255,255,0.02)", padding: "12px 14px", marginBottom: 8, cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{c.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{c.title}</span>
                    <span style={{ marginLeft: "auto", color: "#7a6a5a" }}>{expandedClue===i?"−":"+"}</span>
                  </div>
                  {expandedClue===i && <p style={{ margin: "10px 0 0 28px", color: "#c8b89a", fontSize: "0.82rem", lineHeight: 1.7 }}>{c.tip}</p>}
                </div>
              ))}
            </div>
          )}

          {tab === "fichas" && (
            <div>
              <Fichas />
            </div>
          )}

          {tab === "mapa" && (
            <div style={{ background: "#fff", borderRadius: 12, padding: 12 }}>
              <EuropaMap />
            </div>
          )}

          {tab === "quiz" && (() => {
            if (!isPro && quizIdx >= 1) return (
              <div style={{ borderRadius: 14, border: "1px solid rgba(233,196,106,0.3)", background: "rgba(233,196,106,0.06)", padding: "28px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>⭐</div>
                <h3 style={{ color: "#e9c46a", fontWeight: 400, marginBottom: 8 }}>Quiz Pro</h3>
                <p style={{ color: "#a89080", fontSize: "0.85rem", marginBottom: 20 }}>Accede a todas las imágenes con Pro.</p>
                <button onClick={() => setShowPaywall(true)} style={{ padding: "12px 28px", borderRadius: 30, border: "none", background: "linear-gradient(90deg,#e9c46a,#f4a261)", color: "#0a0a0f", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Activar Pro →</button>
              </div>
            );
            const q = QUIZ[quizIdx % QUIZ.length];
            return (
              <div>
                <div style={{ fontSize: 12, color: "#7a6a5a", marginBottom: 10 }}>Pregunta {(quizIdx%QUIZ.length)+1}/{QUIZ.length} · {score.correct}/{score.total} correctas</div>
                <img src={q.img} alt="quiz" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 10, marginBottom: 14 }} />
                <p style={{ fontWeight: 600, marginBottom: 14, lineHeight: 1.5 }}>{q.q}</p>
                {q.opts.map((o,i) => {
                  let bg="rgba(255,255,255,0.04)",border="rgba(255,255,255,0.1)",color="#e8e0d0";
                  if(answered!==null){ if(i===q.correct){bg="rgba(42,157,143,0.2)";border="#2a9d8f";color="#2a9d8f";}else if(i===answered){bg="rgba(230,57,70,0.2)";border="#e63946";color="#e63946";} }
                  return <button key={i} onClick={()=>handleAnswer(i)} disabled={answered!==null} style={{ width:"100%",padding:"11px 14px",borderRadius:8,border:"1px solid "+border,background:bg,color,cursor:answered===null?"pointer":"default",textAlign:"left",fontFamily:"inherit",fontSize:"0.85rem",marginBottom:8,display:"block" }}>{o}</button>;
                })}
                {answered!==null && (
                  <div>
                    <p style={{ fontSize:"0.82rem",color:"#a89080",lineHeight:1.6,marginBottom:12,padding:"10px 12px",background:"rgba(255,255,255,0.04)",borderRadius:8 }}>{answered===q.correct?"✓ Correcto — ":"✗ Incorrecto — "}{q.tip}</p>
                    <button onClick={()=>{setQuizIdx(i=>i+1);setAnswered(null);}} style={{ width:"100%",padding:12,borderRadius:8,border:"none",background:"#e8e0d0",color:"#0a0a0f",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Siguiente →</button>
                  </div>
                )}
              </div>
            );
          })()}

          {tab === "stats" && (
            <div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
                {[["Acierto","72%","#2a9d8f"],["Racha","5 días 🔥","#e9c46a"],["Quiz","47","#e8e0d0"],["XP",xp,"#e9c46a"]].map(([l,v,c])=>(
                  <div key={l} style={{ background:"rgba(255,255,255,0.04)",borderRadius:10,padding:14 }}>
                    <div style={{ fontSize:11,color:"#7a6a5a",marginBottom:4 }}>{l}</div>
                    <div style={{ fontSize:22,fontWeight:700,color:c }}>{v}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:11,color:"#7a6a5a",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10 }}>Por región</p>
              {[["Nórdicos",88,"#2a9d8f"],["Europa Occ.",81,"#2a9d8f"],["Europa Este",61,"#e9c46a"],["Américas",54,"#e9c46a"],["Asia",38,"#e63946"],["África",29,"#e63946"]].map(([n,p,c])=>(
                <div key={n} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4 }}>
                    <span>{n}</span><span style={{ color:c,fontWeight:600 }}>{p}%</span>
                  </div>
                  <div style={{ height:5,background:"rgba(255,255,255,0.08)",borderRadius:3,overflow:"hidden" }}>
                    <div style={{ height:"100%",width:p+"%",background:c,borderRadius:3 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}