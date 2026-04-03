import { useState, useEffect, useRef } from "react";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as topojson from "https://cdn.jsdelivr.net/npm/topojson-client@3/+esm";

const COUNTRY_INFO = {
  "Albania": "Tirana", "Andorra": "Andorra la Vella", "Austria": "Viena",
  "Belarus": "Minsk", "Belgium": "Bruselas", "Bosnia and Herz.": "Sarajevo",
  "Bulgaria": "Sofía", "Croatia": "Zagreb", "Cyprus": "Nicosia",
  "Czech Rep.": "Praga", "Denmark": "Copenhague", "Estonia": "Talín",
  "Finland": "Helsinki", "France": "París", "Germany": "Berlín",
  "Greece": "Atenas", "Hungary": "Budapest", "Iceland": "Reikiavik",
  "Ireland": "Dublín", "Italy": "Roma", "Kosovo": "Pristina",
  "Latvia": "Riga", "Liechtenstein": "Vaduz", "Lithuania": "Vilna",
  "Luxembourg": "Luxemburgo", "Macedonia": "Skopie", "Malta": "La Valeta",
  "Moldova": "Chisináu", "Monaco": "Mónaco", "Montenegro": "Podgorica",
  "Netherlands": "Ámsterdam", "Norway": "Oslo", "Poland": "Varsovia",
  "Portugal": "Lisboa", "Romania": "Bucarest", "Russia": "Moscú",
  "San Marino": "San Marino", "Serbia": "Belgrado", "Slovakia": "Bratislava",
  "Slovenia": "Liubliana", "Spain": "Madrid", "Sweden": "Estocolmo",
  "Switzerland": "Berna", "Turkey": "Ankara", "Ukraine": "Kiev",
  "United Kingdom": "Londres", "Vatican": "Ciudad del Vaticano",
  "North Macedonia": "Skopie",
};

const NAME_ES = {
  "Albania":"Albania","Andorra":"Andorra","Austria":"Austria",
  "Belarus":"Bielorrusia","Belgium":"Bélgica","Bosnia and Herz.":"Bosnia y Herz.",
  "Bulgaria":"Bulgaria","Croatia":"Croacia","Cyprus":"Chipre",
  "Czech Rep.":"Chequia","Denmark":"Dinamarca","Estonia":"Estonia",
  "Finland":"Finlandia","France":"Francia","Germany":"Alemania",
  "Greece":"Grecia","Hungary":"Hungría","Iceland":"Islandia",
  "Ireland":"Irlanda","Italy":"Italia","Kosovo":"Kosovo",
  "Latvia":"Letonia","Liechtenstein":"Liechtenstein","Lithuania":"Lituania",
  "Luxembourg":"Luxemburgo","Macedonia":"Macedonia del N.","Malta":"Malta",
  "Moldova":"Moldavia","Monaco":"Mónaco","Montenegro":"Montenegro",
  "Netherlands":"Países Bajos","Norway":"Noruega","Poland":"Polonia",
  "Portugal":"Portugal","Romania":"Rumanía","Russia":"Rusia",
  "San Marino":"San Marino","Serbia":"Serbia","Slovakia":"Eslovaquia",
  "Slovenia":"Eslovenia","Spain":"España","Sweden":"Suecia",
  "Switzerland":"Suiza","Turkey":"Turquía","Ukraine":"Ucrania",
  "United Kingdom":"Reino Unido","Vatican":"Vaticano",
  "North Macedonia":"Macedonia del N.",
};

export default function EuropaMap() {
  const svgRef = useRef(null);
  const [mode, setMode] = useState("explore");
  const [info, setInfo] = useState(null);
  const [seen, setSeen] = useState({});
  const [countries, setCountries] = useState([]);
  const [quiz, setQuiz] = useState({ queue:[], idx:0, correct:0, wrong:0 });
  const [answered, setAnswered] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const fbTimer = useRef(null);

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r => r.json())
      .then(world => {
        const topo = topojson.feature(world, world.objects.countries);
        const europeIds = new Set([
          "8","20","40","112","56","70","100","191","196","203","208",
          "233","246","250","276","300","348","352","372","380","381",
          "428","438","440","442","807","470","498","492","499","528",
          "578","616","620","642","643","674","688","703","705","724",
          "752","756","792","804","826","336"
        ]);
        const euroCountries = topo.features.filter(f => europeIds.has(String(f.id)));
        setCountries(euroCountries);
      });
  }, []);

  useEffect(() => {
    if (!svgRef.current || countries.length === 0) return;
    const svg = d3.select(svgRef.current);
    const w = svgRef.current.parentElement.clientWidth || 500;
    const h = Math.round(w * 0.75);
    svg.attr("viewBox", `0 0 ${w} ${h}`).attr("width","100%").attr("height", h);

    const projection = d3.geoMercator()
      .center([15, 54])
      .scale(w * 1.1)
      .translate([w/2, h/2]);
    const path = d3.geoPath().projection(projection);
    svg.selectAll("*").remove();
    svg.append("rect").attr("width",w).attr("height",h).attr("fill","#dde8f0");

    svg.selectAll("path")
      .data(countries)
      .join("path")
      .attr("d", path)
      .attr("fill", d => {
        const name = d.properties?.name || "";
        if (mode === "explore") return seen[name] ? "#5DCAA5" : "#B5D4F4";
        if (answered[name] === "correct") return "#5DCAA5";
        if (answered[name] === "wrong") return "#F09595";
        return "#B5D4F4";
      })
      .attr("stroke","#fff")
      .attr("stroke-width", 0.6)
      .style("cursor","pointer")
      .on("mouseenter", function(event, d) {
        const name = d.properties?.name || "";
        if (mode === "explore" && !seen[name]) {
          d3.select(this).attr("fill","#378ADD");
        }
      })
      .on("mouseleave", function(event, d) {
        const name = d.properties?.name || "";
        if (mode === "explore") {
          d3.select(this).attr("fill", seen[name] ? "#5DCAA5" : "#B5D4F4");
        }
      })
      .on("click", function(event, d) {
        const name = d.properties?.name || "";
        handleClick(name);
      });
  }, [countries, mode, seen, answered]);

  const handleClick = (name) => {
    if (mode === "explore") {
      setSeen(s => ({ ...s, [name]: true }));
      setInfo({ name: NAME_ES[name] || name, cap: COUNTRY_INFO[name] || "—" });
    } else {
      if (done || quiz.idx >= quiz.queue.length) return;
      const target = quiz.queue[quiz.idx];
      if (name === target) {
        setAnswered(a => ({ ...a, [name]: "correct" }));
        setFeedback({ type:"correct", text:"Correcto!" });
        const newIdx = quiz.idx + 1;
        setQuiz(q => ({ ...q, correct: q.correct+1, idx: newIdx }));
        if (newIdx >= quiz.queue.length) setTimeout(() => setDone(true), 600);
        clearTimeout(fbTimer.current);
        fbTimer.current = setTimeout(() => setFeedback(null), 700);
      } else {
        setAnswered(a => ({ ...a, [name]: "wrong" }));
        setFeedback({ type:"wrong", text:"Ese es " + (NAME_ES[name]||name) });
        setQuiz(q => ({ ...q, wrong: q.wrong+1 }));
        clearTimeout(fbTimer.current);
        fbTimer.current = setTimeout(() => setFeedback(null), 1400);
      }
    }
  };

  const startQuiz = () => {
    const names = countries.map(c => c.properties?.name).filter(Boolean);
    const q = [...names].sort(() => Math.random()-0.5);
    setQuiz({ queue:q, idx:0, correct:0, wrong:0 });
    setAnswered({});
    setFeedback(null);
    setDone(false);
  };

  useEffect(() => { if (mode === "quiz" && countries.length > 0) startQuiz(); }, [mode, countries]);

  const pct = quiz.queue.length ? Math.round(quiz.idx/quiz.queue.length*100) : 0;
  const target = quiz.queue[quiz.idx];

  return (
    <div style={{ fontFamily:"Georgia,serif" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0 10px", flexWrap:"wrap", gap:8 }}>
        <div style={{ display:"flex", gap:6 }}>
          {["explore","quiz"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ padding:"6px 16px", borderRadius:8, border:"0.5px solid rgba(0,0,0,0.15)", background:mode===m?"#0a0a0f":"transparent", color:mode===m?"#fff":"#666", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
              {m==="explore"?"Explorar":"Quiz"}
            </button>
          ))}
        </div>
        {mode==="quiz" && !done && (
          <div style={{ fontSize:12, color:"#888", display:"flex", gap:14 }}>
            <span>Correctas: <b style={{color:"#1D9E75"}}>{quiz.correct}</b></span>
            <span>Errores: <b style={{color:"#E24B4A"}}>{quiz.wrong}</b></span>
            <span>Quedan: <b>{quiz.queue.length - quiz.idx}</b></span>
          </div>
        )}
      </div>

      <div style={{ border:"0.5px solid rgba(0,0,0,0.12)", borderRadius:12, overflow:"hidden", background:"#dde8f0" }}>
        {mode==="quiz" && (
          <div style={{ height:3, background:"rgba(0,0,0,0.08)" }}>
            <div style={{ height:"100%", width:pct+"%", background:"#1D9E75", transition:"width 0.4s" }} />
          </div>
        )}
        <svg ref={svgRef} style={{ display:"block", width:"100%" }} />

        {mode==="explore" && (
          <div style={{ padding:"10px 14px", borderTop:"0.5px solid rgba(0,0,0,0.08)", minHeight:50, display:"flex", alignItems:"center", background:"#fff" }}>
            {info ? (
              <div>
                <div style={{ fontWeight:600, fontSize:15 }}>{info.name}</div>
                <div style={{ fontSize:12, color:"#888", marginTop:2 }}>Capital: {info.cap}</div>
              </div>
            ) : (
              <div style={{ fontSize:13, color:"#aaa" }}>Toca un país para identificarlo</div>
            )}
          </div>
        )}

        {mode==="quiz" && !done && target && (
          <div style={{ padding:"10px 14px", borderTop:"0.5px solid rgba(0,0,0,0.08)", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, minHeight:50, background:"#fff" }}>
            <div style={{ fontSize:14, color:"#666" }}>Encuentra: <span style={{ fontWeight:600, color:"#0a0a0f", fontSize:16 }}>{NAME_ES[target]||target}</span></div>
            {feedback && (
              <div style={{ fontSize:13, padding:"3px 10px", borderRadius:6, background:feedback.type==="correct"?"#E1F5EE":"#FCEBEB", color:feedback.type==="correct"?"#0F6E56":"#A32D2D" }}>
                {feedback.text}
              </div>
            )}
          </div>
        )}

        {mode==="quiz" && done && (
          <div style={{ padding:20, borderTop:"0.5px solid rgba(0,0,0,0.08)", textAlign:"center", background:"#fff" }}>
            <div style={{ fontSize:14, color:"#666", marginBottom:12 }}>
              Completado — {quiz.correct} correctas · {quiz.wrong} errores · {Math.round(quiz.correct/(quiz.correct+quiz.wrong)*100)}% acierto
            </div>
            <button onClick={startQuiz} style={{ padding:"8px 20px", borderRadius:8, border:"0.5px solid rgba(0,0,0,0.15)", background:"transparent", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
              Repetir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}