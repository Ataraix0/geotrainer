import { useState } from "react";

const C = {
  bg: "#0a0a0f", surface: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.08)", borderHov: "rgba(233,196,106,0.4)",
  gold: "#e9c46a", goldDim: "#a07830", text: "#e8e0d0",
  muted: "#a89080", hint: "rgba(232,224,208,0.35)",
  correct: "#1D9E75", wrong: "#e63946",
};

const EUROPA = [
  { flag:"🇦🇱", es:"Albania",       prefix:"+355", domain:".al", drive:"D", script:"Latino",    diacritics:"ç, ë" },
  { flag:"🇦🇩", es:"Andorra",       prefix:"+376", domain:".ad", drive:"D", script:"Latino",    diacritics:"à, é, ï" },
  { flag:"🇦🇹", es:"Austria",       prefix:"+43",  domain:".at", drive:"D", script:"Latino",    diacritics:"ä, ö, ü, ß" },
  { flag:"🇧🇾", es:"Bielorrusia",   prefix:"+375", domain:".by", drive:"D", script:"Cirílico",  diacritics:"ь, ъ, э, ю, я" },
  { flag:"🇧🇪", es:"Bélgica",       prefix:"+32",  domain:".be", drive:"D", script:"Latino",    diacritics:"à, â, è, é, ê" },
  { flag:"🇧🇦", es:"Bosnia y Herz.",prefix:"+387", domain:".ba", drive:"D", script:"Latino/Cir",diacritics:"č, ć, š, đ" },
  { flag:"🇧🇬", es:"Bulgaria",      prefix:"+359", domain:".bg", drive:"D", script:"Cirílico",  diacritics:"ъ, щ, ю, я" },
  { flag:"🇭🇷", es:"Croacia",       prefix:"+385", domain:".hr", drive:"D", script:"Latino",    diacritics:"č, ć, š, đ, ž" },
  { flag:"🇨🇾", es:"Chipre",        prefix:"+357", domain:".cy", drive:"I", script:"Griego",    diacritics:"α, β, γ, δ, ε" },
  { flag:"🇨🇿", es:"Chequia",       prefix:"+420", domain:".cz", drive:"D", script:"Latino",    diacritics:"á, č, ě, š, ž" },
  { flag:"🇩🇰", es:"Dinamarca",     prefix:"+45",  domain:".dk", drive:"D", script:"Latino",    diacritics:"æ, ø, å" },
  { flag:"🇪🇪", es:"Estonia",       prefix:"+372", domain:".ee", drive:"D", script:"Latino",    diacritics:"ä, ö, ü, õ" },
  { flag:"🇫🇮", es:"Finlandia",     prefix:"+358", domain:".fi", drive:"D", script:"Latino",    diacritics:"ä, ö, å" },
  { flag:"🇫🇷", es:"Francia",       prefix:"+33",  domain:".fr", drive:"D", script:"Latino",    diacritics:"à, â, é, è, ê, ç" },
  { flag:"🇩🇪", es:"Alemania",      prefix:"+49",  domain:".de", drive:"D", script:"Latino",    diacritics:"ä, ö, ü, ß" },
  { flag:"🇬🇷", es:"Grecia",        prefix:"+30",  domain:".gr", drive:"D", script:"Griego",    diacritics:"α, β, γ, δ, ε, ζ" },
  { flag:"🇭🇺", es:"Hungría",       prefix:"+36",  domain:".hu", drive:"D", script:"Latino",    diacritics:"á, é, í, ó, ö, ő, ú, ü, ű" },
  { flag:"🇮🇸", es:"Islandia",      prefix:"+354", domain:".is", drive:"D", script:"Latino",    diacritics:"á, ð, é, í, þ, ó, ú, ý, æ, ö" },
  { flag:"🇮🇪", es:"Irlanda",       prefix:"+353", domain:".ie", drive:"I", script:"Latino",    diacritics:"á, é, í, ó, ú" },
  { flag:"🇮🇹", es:"Italia",        prefix:"+39",  domain:".it", drive:"D", script:"Latino",    diacritics:"à, è, é, ì, ò, ù" },
  { flag:"🇽🇰", es:"Kosovo",        prefix:"+383", domain:".xk", drive:"D", script:"Latino/Cir",diacritics:"ë, q, x" },
  { flag:"🇱🇻", es:"Letonia",       prefix:"+371", domain:".lv", drive:"D", script:"Latino",    diacritics:"ā, č, ē, ģ, ī, ķ, ļ, ņ, š, ū, ž" },
  { flag:"🇱🇮", es:"Liechtenstein", prefix:"+423", domain:".li", drive:"D", script:"Latino",    diacritics:"ä, ö, ü" },
  { flag:"🇱🇹", es:"Lituania",      prefix:"+370", domain:".lt", drive:"D", script:"Latino",    diacritics:"ą, č, ę, ė, į, š, ų, ū, ž" },
  { flag:"🇱🇺", es:"Luxemburgo",    prefix:"+352", domain:".lu", drive:"D", script:"Latino",    diacritics:"à, â, é, è, ê, ë" },
  { flag:"🇲🇰", es:"Macedonia N.",  prefix:"+389", domain:".mk", drive:"D", script:"Cirílico",  diacritics:"ѓ, ѕ, ј, љ, њ, ќ, џ" },
  { flag:"🇲🇹", es:"Malta",         prefix:"+356", domain:".mt", drive:"I", script:"Latino",    diacritics:"ċ, ġ, għ, ħ, ie, ż" },
  { flag:"🇲🇩", es:"Moldavia",      prefix:"+373", domain:".md", drive:"D", script:"Latino",    diacritics:"ă, â, î, ș, ț" },
  { flag:"🇲🇨", es:"Mónaco",        prefix:"+377", domain:".mc", drive:"D", script:"Latino",    diacritics:"à, â, é, è, ê, ç" },
  { flag:"🇲🇪", es:"Montenegro",    prefix:"+382", domain:".me", drive:"D", script:"Latino/Cir",diacritics:"č, ć, š, đ, ž" },
  { flag:"🇳🇱", es:"Países Bajos",  prefix:"+31",  domain:".nl", drive:"D", script:"Latino",    diacritics:"é, ë, ï, ó, ö, ü" },
  { flag:"🇳🇴", es:"Noruega",       prefix:"+47",  domain:".no", drive:"D", script:"Latino",    diacritics:"æ, ø, å" },
  { flag:"🇵🇱", es:"Polonia",       prefix:"+48",  domain:".pl", drive:"D", script:"Latino",    diacritics:"ą, ć, ę, ł, ń, ó, ś, ź, ż" },
  { flag:"🇵🇹", es:"Portugal",      prefix:"+351", domain:".pt", drive:"D", script:"Latino",    diacritics:"ã, â, á, à, ç, é, ê, í, ó, ô, õ, ú" },
  { flag:"🇷🇴", es:"Rumanía",       prefix:"+40",  domain:".ro", drive:"D", script:"Latino",    diacritics:"ă, â, î, ș, ț" },
  { flag:"🇷🇺", es:"Rusia",         prefix:"+7",   domain:".ru", drive:"D", script:"Cirílico",  diacritics:"ь, ъ, э, ю, я, ё" },
  { flag:"🇸🇲", es:"San Marino",    prefix:"+378", domain:".sm", drive:"D", script:"Latino",    diacritics:"à, è, é, ì, ò, ù" },
  { flag:"🇷🇸", es:"Serbia",        prefix:"+381", domain:".rs", drive:"D", script:"Cirílico",  diacritics:"ђ, ј, љ, њ, ћ, џ" },
  { flag:"🇸🇰", es:"Eslovaquia",    prefix:"+421", domain:".sk", drive:"D", script:"Latino",    diacritics:"á, ä, č, ď, é, í, ĺ, ľ, ň, ó, ô, ŕ, š, ť, ú, ý, ž" },
  { flag:"🇸🇮", es:"Eslovenia",     prefix:"+386", domain:".si", drive:"D", script:"Latino",    diacritics:"č, š, ž" },
  { flag:"🇪🇸", es:"España",        prefix:"+34",  domain:".es", drive:"D", script:"Latino",    diacritics:"á, é, í, ó, ú, ñ, ü" },
  { flag:"🇸🇪", es:"Suecia",        prefix:"+46",  domain:".se", drive:"D", script:"Latino",    diacritics:"å, ä, ö" },
  { flag:"🇨🇭", es:"Suiza",         prefix:"+41",  domain:".ch", drive:"D", script:"Latino",    diacritics:"ä, ö, ü (DE) · é, à, è (FR)" },
  { flag:"🇹🇷", es:"Turquía",       prefix:"+90",  domain:".tr", drive:"D", script:"Latino",    diacritics:"ç, ğ, ı, İ, ö, ş, ü" },
  { flag:"🇺🇦", es:"Ucrania",       prefix:"+380", domain:".ua", drive:"D", script:"Cirílico",  diacritics:"і, ї, є, ґ" },
  { flag:"🇬🇧", es:"Reino Unido",   prefix:"+44",  domain:".uk", drive:"I", script:"Latino",    diacritics:"—" },
  { flag:"🇻🇦", es:"Vaticano",      prefix:"+379", domain:".va", drive:"D", script:"Latino",    diacritics:"—" },
];

const CATEGORIES = [
  { id:"all",      label:"Todo",       icon:"🌍" },
  { id:"prefix",   label:"Prefijos",   icon:"📞" },
  { id:"domain",   label:"Dominios",   icon:"🌐" },
  { id:"drive",    label:"Conducción", icon:"🚗" },
  { id:"script",   label:"Escritura",  icon:"🔤" },
  { id:"diacritics",label:"Diacríticos",icon:"Ää" },
];

const SCRIPT_COLORS = {
  "Latino":     { bg:"rgba(29,158,117,0.15)", border:"rgba(29,158,117,0.4)", text:"#1D9E75" },
  "Cirílico":   { bg:"rgba(230,57,70,0.15)",  border:"rgba(230,57,70,0.4)",  text:"#e63946" },
  "Griego":     { bg:"rgba(69,123,157,0.15)", border:"rgba(69,123,157,0.4)", text:"#85b7eb" },
  "Latino/Cir": { bg:"rgba(244,162,97,0.15)", border:"rgba(244,162,97,0.4)", text:"#f4a261" },
};

export default function Fichas() {
  const [cat, setCat]   = useState("all");
  const [search, setSearch] = useState("");
  const [quiz, setQuiz] = useState(null); // null | { cat, q, options, correct, answered }
  const [quizScore, setQuizScore] = useState({ c:0, w:0 });

  const filtered = EUROPA.filter(c => {
    if (search) return c.es.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const startQuiz = (catId) => {
    const pool = [...EUROPA].sort(() => Math.random()-0.5);
    const q = pool[0];
    const wrongPool = pool.filter(c => c.es !== q.es).slice(0,3);
    let field, label;
    if (catId === "prefix")  { field="prefix";  label="¿Cuál es el prefijo de"; }
    if (catId === "domain")  { field="domain";  label="¿Cuál es el dominio de"; }
    if (catId === "drive")   { field="drive";   label="¿Conduce por la derecha (D) o izquierda (I)?"; }
    if (catId === "script")  { field="script";  label="¿Qué escritura usa"; }
    const correct = q[field];
    const opts = [correct, ...wrongPool.map(c=>c[field])].sort(()=>Math.random()-0.5);
    setQuiz({ catId, field, label, q, options:[...new Set(opts)], correct, answered:null });
    setQuizScore({ c:0, w:0 });
  };

  const handleQuizAnswer = (opt) => {
    if (quiz.answered) return;
    const ok = opt === quiz.correct;
    setQuizScore(s => ({ c: s.c+(ok?1:0), w: s.w+(ok?0:1) }));
    setQuiz(q => ({ ...q, answered: opt }));
  };

  const nextQuiz = () => {
    startQuiz(quiz.catId);
  };

  const renderCard = (c) => {
    const sc = SCRIPT_COLORS[c.script] || SCRIPT_COLORS["Latino"];
    return (
      <div key={c.es} style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px", transition:"border-color 0.15s" }}
        onMouseEnter={e => e.currentTarget.style.borderColor=C.borderHov}
        onMouseLeave={e => e.currentTarget.style.borderColor=C.border}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <span style={{ fontSize:24 }}>{c.flag}</span>
          <span style={{ fontWeight:600, fontSize:14, color:C.text }}>{c.es}</span>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {(cat==="all"||cat==="prefix") && (
            <span style={{ fontSize:12, padding:"3px 10px", borderRadius:20, background:"rgba(233,196,106,0.12)", border:`1px solid rgba(233,196,106,0.25)`, color:C.gold }}>
              📞 {c.prefix}
            </span>
          )}
          {(cat==="all"||cat==="domain") && (
            <span style={{ fontSize:12, padding:"3px 10px", borderRadius:20, background:"rgba(69,123,157,0.12)", border:"1px solid rgba(69,123,157,0.3)", color:"#85b7eb" }}>
              🌐 {c.domain}
            </span>
          )}
          {(cat==="all"||cat==="drive") && (
            <span style={{ fontSize:12, padding:"3px 10px", borderRadius:20,
              background: c.drive==="I" ? "rgba(230,57,70,0.12)" : "rgba(29,158,117,0.12)",
              border: c.drive==="I" ? "1px solid rgba(230,57,70,0.3)" : "1px solid rgba(29,158,117,0.3)",
              color: c.drive==="I" ? "#e63946" : "#1D9E75" }}>
              🚗 {c.drive==="I" ? "Izquierda" : "Derecha"}
            </span>
          )}
          {(cat==="all"||cat==="script") && (
            <span style={{ fontSize:12, padding:"3px 10px", borderRadius:20, background:sc.bg, border:`1px solid ${sc.border}`, color:sc.text }}>
              🔤 {c.script}
            </span>
          )}
          {(cat==="all"||cat==="diacritics") && c.diacritics !== "—" && (
            <span style={{ fontSize:12, padding:"3px 10px", borderRadius:20, background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`, color:C.muted, fontFamily:"monospace" }}>
              {c.diacritics}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ color:C.text, fontFamily:"Georgia, serif" }}>

      {/* Header */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, color:C.goldDim, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:4 }}>Referencia visual</div>
        <div style={{ fontSize:18, fontWeight:500, color:C.text }}>Fichas de Europa</div>
        <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>Prefijos · Dominios · Escrituras · Conducción · Diacríticos</div>
      </div>

      {/* Search */}
      <input
        placeholder="Buscar país..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width:"100%", marginBottom:12, padding:"9px 14px", borderRadius:10, border:`1px solid ${C.border}`, background:"rgba(255,255,255,0.04)", color:C.text, fontFamily:"inherit", fontSize:14, outline:"none" }}
      />

      {/* Category pills */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => { setCat(c.id); setQuiz(null); }}
            style={{ padding:"5px 14px", borderRadius:20, fontSize:12, fontFamily:"inherit", cursor:"pointer",
              border: cat===c.id ? `1px solid ${C.gold}` : `1px solid ${C.border}`,
              background: cat===c.id ? "rgba(233,196,106,0.15)" : "transparent",
              color: cat===c.id ? C.gold : C.muted }}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Quiz launcher — solo para cats con datos concretos */}
      {["prefix","domain","drive","script"].includes(cat) && !quiz && (
        <div style={{ marginBottom:16, padding:"12px 16px", borderRadius:12, border:`1px solid rgba(233,196,106,0.2)`, background:"rgba(233,196,106,0.05)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
          <div style={{ fontSize:13, color:C.muted }}>¿Quieres ponerte a prueba con esta categoría?</div>
          <button onClick={() => startQuiz(cat)}
            style={{ padding:"7px 18px", borderRadius:20, border:"none", background:`linear-gradient(90deg,${C.gold},#f4a261)`, color:"#0a0a0f", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
            Quiz rápido →
          </button>
        </div>
      )}

      {/* Quiz card */}
      {quiz && (
        <div style={{ marginBottom:16, padding:"16px", borderRadius:12, border:`1px solid rgba(233,196,106,0.3)`, background:"rgba(233,196,106,0.06)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontSize:11, color:C.goldDim, letterSpacing:"0.1em" }}>QUIZ RÁPIDO</div>
            <div style={{ fontSize:12, color:C.muted }}>
              <span style={{ color:C.correct }}>✓ {quizScore.c}</span>
              {quizScore.w>0 && <span style={{ color:C.wrong }}> · ✗ {quizScore.w}</span>}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ fontSize:28 }}>{quiz.q.flag}</span>
            <div style={{ fontSize:15, color:C.text, fontWeight:500, lineHeight:1.4 }}>
              {quiz.label} <span style={{ color:C.gold }}>{quiz.q.es}</span>?
            </div>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {quiz.options.map(opt => {
              let bg = "rgba(255,255,255,0.04)", border = C.border, color = C.text;
              if (quiz.answered) {
                if (opt === quiz.correct)  { bg="rgba(29,158,117,0.2)"; border="#1D9E75"; color="#1D9E75"; }
                else if (opt === quiz.answered) { bg="rgba(230,57,70,0.2)"; border="#e63946"; color="#e63946"; }
              }
              return (
                <button key={opt} onClick={() => handleQuizAnswer(opt)}
                  disabled={!!quiz.answered}
                  style={{ padding:"9px 16px", borderRadius:10, border:`1px solid ${border}`, background:bg, color, fontFamily:"inherit", fontSize:14, cursor:quiz.answered?"default":"pointer", transition:"all 0.15s", fontWeight:500 }}>
                  {opt}
                </button>
              );
            })}
          </div>
          {quiz.answered && (
            <div style={{ marginTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:13, color: quiz.answered===quiz.correct ? C.correct : C.wrong }}>
                {quiz.answered===quiz.correct ? "✓ Correcto" : `✗ Era: ${quiz.correct}`}
              </div>
              <button onClick={nextQuiz}
                style={{ padding:"6px 18px", borderRadius:20, border:`1px solid ${C.gold}`, background:"rgba(233,196,106,0.1)", color:C.gold, fontFamily:"inherit", fontSize:12, cursor:"pointer" }}>
                Siguiente →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cards grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:10 }}>
        {filtered.map(renderCard)}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:"center", padding:"40px 20px", color:C.muted, fontSize:14 }}>
          No se encontró ningún país con "{search}"
        </div>
      )}
    </div>
  );
}