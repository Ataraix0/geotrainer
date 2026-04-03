import { useState, useEffect, useRef, useCallback } from "react";

const EUROPE_IDS = new Set([
  8,20,40,56,70,100,112,191,196,203,208,233,246,250,276,300,
  348,352,372,380,428,438,440,442,470,492,498,499,528,578,
  616,620,642,643,674,688,703,705,724,752,756,792,804,807,826
]);

const DATA = {
  "Albania":         { es:"Albania",         flag:"🇦🇱", prefix:"+355", domain:".al", drive:"D", script:"Latino"     },
  "Andorra":         { es:"Andorra",          flag:"🇦🇩", prefix:"+376", domain:".ad", drive:"D", script:"Latino"     },
  "Austria":         { es:"Austria",          flag:"🇦🇹", prefix:"+43",  domain:".at", drive:"D", script:"Latino"     },
  "Belarus":         { es:"Bielorrusia",      flag:"🇧🇾", prefix:"+375", domain:".by", drive:"D", script:"Cirílico"   },
  "Belgium":         { es:"Bélgica",          flag:"🇧🇪", prefix:"+32",  domain:".be", drive:"D", script:"Latino"     },
  "Bosnia and Herz.":{ es:"Bosnia y Herz.",   flag:"🇧🇦", prefix:"+387", domain:".ba", drive:"D", script:"Latino"     },
  "Bulgaria":        { es:"Bulgaria",         flag:"🇧🇬", prefix:"+359", domain:".bg", drive:"D", script:"Cirílico"   },
  "Croatia":         { es:"Croacia",          flag:"🇭🇷", prefix:"+385", domain:".hr", drive:"D", script:"Latino"     },
  "Cyprus":          { es:"Chipre",           flag:"🇨🇾", prefix:"+357", domain:".cy", drive:"I", script:"Griego"     },
  "Czechia":         { es:"Chequia",          flag:"🇨🇿", prefix:"+420", domain:".cz", drive:"D", script:"Latino"     },
  "Czech Rep.":      { es:"Chequia",          flag:"🇨🇿", prefix:"+420", domain:".cz", drive:"D", script:"Latino"     },
  "Denmark":         { es:"Dinamarca",        flag:"🇩🇰", prefix:"+45",  domain:".dk", drive:"D", script:"Latino"     },
  "Estonia":         { es:"Estonia",          flag:"🇪🇪", prefix:"+372", domain:".ee", drive:"D", script:"Latino"     },
  "Finland":         { es:"Finlandia",        flag:"🇫🇮", prefix:"+358", domain:".fi", drive:"D", script:"Latino"     },
  "France":          { es:"Francia",          flag:"🇫🇷", prefix:"+33",  domain:".fr", drive:"D", script:"Latino"     },
  "Germany":         { es:"Alemania",         flag:"🇩🇪", prefix:"+49",  domain:".de", drive:"D", script:"Latino"     },
  "Greece":          { es:"Grecia",           flag:"🇬🇷", prefix:"+30",  domain:".gr", drive:"D", script:"Griego"     },
  "Hungary":         { es:"Hungría",          flag:"🇭🇺", prefix:"+36",  domain:".hu", drive:"D", script:"Latino"     },
  "Iceland":         { es:"Islandia",         flag:"🇮🇸", prefix:"+354", domain:".is", drive:"D", script:"Latino"     },
  "Ireland":         { es:"Irlanda",          flag:"🇮🇪", prefix:"+353", domain:".ie", drive:"I", script:"Latino"     },
  "Italy":           { es:"Italia",           flag:"🇮🇹", prefix:"+39",  domain:".it", drive:"D", script:"Latino"     },
  "Kosovo":          { es:"Kosovo",           flag:"🇽🇰", prefix:"+383", domain:".xk", drive:"D", script:"Latino"     },
  "Latvia":          { es:"Letonia",          flag:"🇱🇻", prefix:"+371", domain:".lv", drive:"D", script:"Latino"     },
  "Liechtenstein":   { es:"Liechtenstein",    flag:"🇱🇮", prefix:"+423", domain:".li", drive:"D", script:"Latino"     },
  "Lithuania":       { es:"Lituania",         flag:"🇱🇹", prefix:"+370", domain:".lt", drive:"D", script:"Latino"     },
  "Luxembourg":      { es:"Luxemburgo",       flag:"🇱🇺", prefix:"+352", domain:".lu", drive:"D", script:"Latino"     },
  "N. Macedonia":    { es:"Macedonia del N.", flag:"🇲🇰", prefix:"+389", domain:".mk", drive:"D", script:"Cirílico"   },
  "North Macedonia": { es:"Macedonia del N.", flag:"🇲🇰", prefix:"+389", domain:".mk", drive:"D", script:"Cirílico"   },
  "Malta":           { es:"Malta",            flag:"🇲🇹", prefix:"+356", domain:".mt", drive:"I", script:"Latino"     },
  "Moldova":         { es:"Moldavia",         flag:"🇲🇩", prefix:"+373", domain:".md", drive:"D", script:"Latino"     },
  "Monaco":          { es:"Mónaco",           flag:"🇲🇨", prefix:"+377", domain:".mc", drive:"D", script:"Latino"     },
  "Montenegro":      { es:"Montenegro",       flag:"🇲🇪", prefix:"+382", domain:".me", drive:"D", script:"Latino"     },
  "Netherlands":     { es:"Países Bajos",     flag:"🇳🇱", prefix:"+31",  domain:".nl", drive:"D", script:"Latino"     },
  "Norway":          { es:"Noruega",          flag:"🇳🇴", prefix:"+47",  domain:".no", drive:"D", script:"Latino"     },
  "Poland":          { es:"Polonia",          flag:"🇵🇱", prefix:"+48",  domain:".pl", drive:"D", script:"Latino"     },
  "Portugal":        { es:"Portugal",         flag:"🇵🇹", prefix:"+351", domain:".pt", drive:"D", script:"Latino"     },
  "Romania":         { es:"Rumanía",          flag:"🇷🇴", prefix:"+40",  domain:".ro", drive:"D", script:"Latino"     },
  "Russia":          { es:"Rusia",            flag:"🇷🇺", prefix:"+7",   domain:".ru", drive:"D", script:"Cirílico"   },
  "San Marino":      { es:"San Marino",       flag:"🇸🇲", prefix:"+378", domain:".sm", drive:"D", script:"Latino"     },
  "Serbia":          { es:"Serbia",           flag:"🇷🇸", prefix:"+381", domain:".rs", drive:"D", script:"Cirílico"   },
  "Slovakia":        { es:"Eslovaquia",       flag:"🇸🇰", prefix:"+421", domain:".sk", drive:"D", script:"Latino"     },
  "Slovenia":        { es:"Eslovenia",        flag:"🇸🇮", prefix:"+386", domain:".si", drive:"D", script:"Latino"     },
  "Spain":           { es:"España",           flag:"🇪🇸", prefix:"+34",  domain:".es", drive:"D", script:"Latino"     },
  "Sweden":          { es:"Suecia",           flag:"🇸🇪", prefix:"+46",  domain:".se", drive:"D", script:"Latino"     },
  "Switzerland":     { es:"Suiza",            flag:"🇨🇭", prefix:"+41",  domain:".ch", drive:"D", script:"Latino"     },
  "Turkey":          { es:"Turquía",          flag:"🇹🇷", prefix:"+90",  domain:".tr", drive:"D", script:"Latino"     },
  "Ukraine":         { es:"Ucrania",          flag:"🇺🇦", prefix:"+380", domain:".ua", drive:"D", script:"Cirílico"   },
  "United Kingdom":  { es:"Reino Unido",      flag:"🇬🇧", prefix:"+44",  domain:".uk", drive:"I", script:"Latino"     },
  "Vatican":         { es:"Vaticano",         flag:"🇻🇦", prefix:"+379", domain:".va", drive:"D", script:"Latino"     },
};

const CATS = [
  { id:"prefix",  label:"📞 Prefijos",   field:"prefix" },
  { id:"domain",  label:"🌐 Dominios",   field:"domain" },
  { id:"drive",   label:"🚗 Conducción", field:"drive"  },
  { id:"script",  label:"🔤 Escritura",  field:"script" },
];

const EUROPE_IDS_SET = new Set([
  8,20,40,56,70,100,112,191,196,203,208,233,246,250,276,300,
  348,352,372,380,428,438,440,442,470,492,498,499,528,578,
  616,620,642,643,674,688,703,705,724,752,756,792,804,807,826
]);

// Color logic per category
function getColor(name, cat, flash, quizCorrect, quizMissed) {
  if (flash === name) return flash === quizCorrect ? "#e9c46a" : "#e63946";
  if (quizCorrect && quizCorrect === name && quizMissed?.includes(name)) return "#5a2030";
  if (quizCorrect === name) return "#1D9E75";
  const d = DATA[name];
  if (!d) return "#1e2d42";
  if (cat === "drive") {
    return d.drive === "I" ? "#8b1a1a" : "#1a4a3a";
  }
  if (cat === "script") {
    const sc = { "Latino":"#1a3a5c", "Cirílico":"#4a1a2a", "Griego":"#1a2a4a" };
    return sc[d.script] || "#1e2d42";
  }
  return "#2a3d5e";
}

function getLabel(name, cat) {
  const d = DATA[name];
  if (!d) return "";
  if (cat === "prefix") return d.prefix;
  if (cat === "domain") return d.domain;
  if (cat === "drive")  return d.drive === "I" ? "← I" : "D →";
  if (cat === "script") return d.script.slice(0,3);
  return "";
}

const C = {
  ocean:"#0f1a2e", gold:"#e9c46a", border:"rgba(255,255,255,0.1)",
  text:"#e8e0d0", muted:"#a89080", correct:"#1D9E75", wrong:"#e63946",
};

export default function MapaFichas() {
  const svgRef   = useRef(null);
  const gRef     = useRef(null);
  const labelsRef= useRef(null);
  const [libs, setLibs]         = useState(null);
  const [countries, setCountries] = useState([]);
  const [cat, setCat]           = useState("prefix");
  const [mode, setMode]         = useState("explore"); // explore | quiz
  const [hovered, setHovered]   = useState(null);
  const [flash, setFlash]       = useState(null);
  const flashRef = useRef(null);

  // Quiz state
  const [quizQ, setQuizQ]       = useState(null); // { name, value, options }
  const [answered, setAnswered] = useState(null);
  const [quizCorrect, setQuizCorrect] = useState([]);
  const [quizMissed, setQuizMissed]   = useState([]);
  const [score, setScore]       = useState({ c:0, w:0 });
  const [quizDone, setQuizDone] = useState(false);
  const [remaining, setRemaining] = useState([]);

  useEffect(() => {
    Promise.all([
      import("https://cdn.jsdelivr.net/npm/d3@7/+esm"),
      import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm"),
    ]).then(([d3, topo]) => {
      fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
        .then(r => r.json()).then(world => {
          const feats = topo.feature(world, world.objects.countries).features;
          setCountries(feats.filter(f => EUROPE_IDS_SET.has(Number(f.id))));
          setLibs({ d3, topo });
        });
    });
  }, []);

  const buildMap = useCallback(() => {
    if (!libs || !svgRef.current || !countries.length) return;
    const { d3 } = libs;
    const el = svgRef.current;
    const W = el.parentElement.clientWidth || 500;
    const H = Math.round(W * 0.78);
    const svg = d3.select(el).attr("width",W).attr("height",H).attr("viewBox",`0 0 ${W} ${H}`);
    svg.selectAll("*").remove();
    svg.append("rect").attr("width",W).attr("height",H).attr("fill",C.ocean);
    const proj = d3.geoMercator().center([13,52]).scale(W*1.15).translate([W/2,H/2]);
    const path = d3.geoPath().projection(proj);
    const g = svg.append("g");
    gRef.current = g;
    g.selectAll("path").data(countries).join("path")
      .attr("d", path)
      .attr("data-name", d => d.properties?.name||"")
      .attr("fill", d => getColor(d.properties?.name||"", cat, null, null, []))
      .attr("stroke","rgba(255,255,255,0.2)").attr("stroke-width",0.5)
      .style("cursor","pointer");

    // Label group on top
    const lg = svg.append("g").attr("pointer-events","none");
    labelsRef.current = lg;

    // Zoom
    const zoom = d3.zoom().scaleExtent([0.7,14]).on("zoom", e => {
      g.attr("transform", e.transform);
      lg.attr("transform", e.transform);
    });
    svg.call(zoom);

    // Zoom buttons
    const zG = svg.append("g").attr("transform",`translate(${W-42},${H-82})`);
    [{l:"+",dy:0,f:1.5},{l:"−",dy:40,f:1/1.5}].forEach(({l,dy,f}) => {
      const b = zG.append("g").attr("transform",`translate(0,${dy})`).style("cursor","pointer");
      b.append("rect").attr("width",30).attr("height",30).attr("rx",6)
        .attr("fill","rgba(10,10,15,0.8)").attr("stroke",C.border).attr("stroke-width",0.5);
      b.append("text").text(l).attr("x",15).attr("y",21).attr("text-anchor","middle")
        .attr("font-size",18).attr("fill",C.gold).style("pointer-events","none");
      b.on("click", () => svg.transition().duration(220).call(zoom.scaleBy, f));
    });

    renderLabels(g, lg, proj, path);
  }, [libs, countries, cat]);

  const renderLabels = (g, lg, proj, path) => {
    if (!libs) return;
    lg.selectAll("*").remove();
    if (cat === "drive" || cat === "script") return; // color-coded, no text needed
    countries.forEach(feature => {
      const name = feature.properties?.name || "";
      const d = DATA[name];
      if (!d) return;
      const label = getLabel(name, cat);
      if (!label) return;
      const centroid = libs.d3.geoPath().projection(proj).centroid(feature);
      if (!centroid || isNaN(centroid[0])) return;
      const bounds = libs.d3.geoPath().projection(proj).bounds(feature);
      const bW = bounds[1][0] - bounds[0][0];
      if (bW < 8) return; // too small to label
      lg.append("text")
        .attr("x", centroid[0]).attr("y", centroid[1])
        .attr("text-anchor","middle").attr("dominant-baseline","middle")
        .attr("font-size", Math.min(Math.max(bW * 0.18, 7), 11))
        .attr("font-weight","600")
        .attr("fill","rgba(255,255,255,0.9)")
        .attr("stroke","rgba(0,0,0,0.5)").attr("stroke-width","2px").attr("paint-order","stroke")
        .text(label);
    });
  };

  useEffect(() => { buildMap(); }, [buildMap]);

  // Recolor on cat/mode/quiz state change
  const recolor = useCallback(() => {
    if (!gRef.current) return;
    gRef.current.selectAll("path[data-name]").each(function() {
      const name = this.getAttribute("data-name");
      let fill = getColor(name, cat, flash, null, []);
      if (mode === "quiz") {
        if (quizCorrect.includes(name)) fill = C.correct;
        else if (quizMissed.includes(name)) fill = "#5a2030";
      }
      if (flash === name) fill = C.gold;
      this.style.fill = fill;
    });
  }, [cat, flash, mode, quizCorrect, quizMissed]);

  useEffect(() => { recolor(); }, [recolor]);

  // Attach handlers
  const attachHandlers = useCallback(() => {
    if (!gRef.current || !libs) return;
    const { d3 } = libs;
    gRef.current.selectAll("path[data-name]")
      .on("mouseenter", function(event, dd) {
        const name = dd?.properties?.name || this.getAttribute("data-name")||"";
        d3.select(this).style("opacity", 0.75);
        const d = DATA[name];
        if (d) setHovered({ name:d.es, flag:d.flag, value: getLabel(name, cat) || (cat==="drive"?(d.drive==="I"?"Izquierda":"Derecha"):d.script) });
      })
      .on("mouseleave", function() {
        libs.d3.select(this).style("opacity",1);
        setHovered(null);
      })
      .on("click", function(event, dd) {
        const name = dd?.properties?.name || this.getAttribute("data-name")||"";
        if (mode === "quiz") handleQuizClick(name);
      });
  }, [libs, mode, cat, quizQ]);

  useEffect(() => { attachHandlers(); }, [attachHandlers]);

  // Quiz logic
  const startQuiz = () => {
    const pool = Object.keys(DATA).filter((n,i,a) => a.findIndex(x=>DATA[x].es===DATA[n].es)===i);
    const shuffled = pool.sort(() => Math.random()-0.5);
    setRemaining(shuffled);
    setQuizCorrect([]);
    setQuizMissed([]);
    setScore({c:0,w:0});
    setAnswered(null);
    setQuizDone(false);
    nextQuestion(shuffled, [], []);
  };

  const nextQuestion = (rem, correct, missed) => {
    const pending = rem.filter(n => !correct.includes(n));
    if (!pending.length) { setQuizDone(true); return; }
    const name = pending[0];
    const d = DATA[name];
    const field = CATS.find(c=>c.id===cat)?.field || "prefix";
    const value = d[field];
    // Build 3 wrong options from same field
    const others = Object.keys(DATA)
      .filter(n => DATA[n][field] !== value)
      .sort(() => Math.random()-0.5).slice(0,3);
    const options = [name, ...others].sort(() => Math.random()-0.5);
    setQuizQ({ name, value, options, field });
    setAnswered(null);
    setRemaining(pending);
  };

  const handleQuizClick = useCallback((clickedName) => {
    if (!quizQ || answered) return;
    setAnswered(clickedName);
    const ok = clickedName === quizQ.name;
    setScore(s => ({ c: s.c+(ok?1:0), w: s.w+(ok?0:1) }));
    setFlash(clickedName);
    clearTimeout(flashRef.current);
    flashRef.current = setTimeout(() => {
      setFlash(null);
      if (ok) {
        setQuizCorrect(c => {
          const nc = [...c, quizQ.name];
          nextQuestion(remaining, nc, quizMissed);
          return nc;
        });
      } else {
        setQuizMissed(m => [...m, clickedName]);
        setTimeout(() => nextQuestion(remaining, quizCorrect, [...quizMissed, clickedName]), 400);
      }
    }, 700);
  }, [quizQ, answered, remaining, quizCorrect, quizMissed]);

  const catLabel = CATS.find(c=>c.id===cat)?.label || "";

  return (
    <div style={{fontFamily:"Georgia,serif", color:C.text}}>

      {/* Mode + Cat selectors */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",padding:"10px 0 8px",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => { setCat(c.id); setMode("explore"); setQuizQ(null); }}
              style={{padding:"5px 12px",borderRadius:20,fontSize:12,fontFamily:"inherit",cursor:"pointer",
                border:cat===c.id?`1px solid ${C.gold}`:`1px solid ${C.border}`,
                background:cat===c.id?"rgba(233,196,106,0.15)":"transparent",
                color:cat===c.id?C.gold:C.muted}}>
              {c.label}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:6}}>
          {["explore","quiz"].map(m => (
            <button key={m} onClick={() => { setMode(m); if(m==="quiz") startQuiz(); }}
              style={{padding:"5px 14px",borderRadius:20,fontSize:12,fontFamily:"inherit",cursor:"pointer",
                border:mode===m?`1px solid ${C.gold}`:`1px solid ${C.border}`,
                background:mode===m?"rgba(233,196,106,0.12)":"transparent",
                color:mode===m?C.gold:C.muted}}>
              {m==="explore"?"🔍 Ver":"🎯 Quiz"}
            </button>
          ))}
        </div>
      </div>

      <div style={{border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",background:C.ocean}}>

        {/* Info / Quiz banner */}
        <div style={{background:"linear-gradient(135deg,#0f0c29,#16213e)",borderBottom:`1px solid ${C.border}`,
          padding:"11px 16px",minHeight:52,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
          {mode==="explore" && (
            hovered
              ? <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:22}}>{hovered.flag}</span>
                  <div>
                    <div style={{fontSize:15,fontWeight:600,color:"#fff"}}>{hovered.name}</div>
                    <div style={{fontSize:12,color:C.gold,marginTop:2}}>{hovered.value}</div>
                  </div>
                </div>
              : <div style={{fontSize:13,color:C.muted}}>Pasa el ratón sobre un país para ver su {catLabel}</div>
          )}
          {mode==="quiz" && !quizDone && quizQ && (
            <>
              <div>
                <div style={{fontSize:11,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase"}}>
                  ¿A qué país pertenece?
                </div>
                <div style={{fontSize:22,fontWeight:700,color:C.gold,letterSpacing:"0.04em"}}>{quizQ.value}</div>
              </div>
              <div style={{display:"flex",gap:14,fontSize:13}}>
                <span style={{color:C.correct}}>✓ {score.c}</span>
                <span style={{color:C.wrong}}>✗ {score.w}</span>
                <span style={{color:C.muted}}>{remaining.length} restantes</span>
              </div>
            </>
          )}
          {mode==="quiz" && quizDone && (
            <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
              <span style={{fontSize:14,color:"#fff"}}>🎉 Completado · <span style={{color:C.correct}}>{score.c}</span> correctas · <span style={{color:C.wrong}}>{score.w}</span> errores</span>
              <button onClick={startQuiz} style={{padding:"6px 18px",borderRadius:20,border:"none",background:`linear-gradient(90deg,${C.gold},#f4a261)`,color:"#0a0a0f",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                Repetir →
              </button>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {mode==="quiz" && !quizDone && (
          <div style={{height:3,background:"rgba(255,255,255,0.06)"}}>
            <div style={{height:"100%",
              width: remaining.length ? ((Object.keys(DATA).filter((n,i,a)=>a.findIndex(x=>DATA[x].es===DATA[n].es)===i).length - remaining.length) / Object.keys(DATA).filter((n,i,a)=>a.findIndex(x=>DATA[x].es===DATA[n].es)===i).length * 100) + "%" : "0%",
              background:`linear-gradient(90deg,${C.gold},#f4a261)`,transition:"width 0.4s"}} />
          </div>
        )}

        {/* MAP */}
        <svg ref={svgRef} style={{display:"block",width:"100%",touchAction:"none"}} />

        {/* Legend */}
        {mode==="explore" && (cat==="drive"||cat==="script") && (
          <div style={{padding:"8px 14px",borderTop:`1px solid ${C.border}`,background:"rgba(255,255,255,0.02)",display:"flex",flexWrap:"wrap",gap:10}}>
            {cat==="drive" && <>
              <span style={{fontSize:12,display:"flex",alignItems:"center",gap:6}}><span style={{width:14,height:14,borderRadius:3,background:"#1a4a3a",display:"inline-block"}}></span><span style={{color:C.muted}}>Derecha</span></span>
              <span style={{fontSize:12,display:"flex",alignItems:"center",gap:6}}><span style={{width:14,height:14,borderRadius:3,background:"#8b1a1a",display:"inline-block"}}></span><span style={{color:C.muted}}>Izquierda (UK, IE, MT, CY)</span></span>
            </>}
            {cat==="script" && <>
              <span style={{fontSize:12,display:"flex",alignItems:"center",gap:6}}><span style={{width:14,height:14,borderRadius:3,background:"#1a3a5c",display:"inline-block"}}></span><span style={{color:C.muted}}>Latino</span></span>
              <span style={{fontSize:12,display:"flex",alignItems:"center",gap:6}}><span style={{width:14,height:14,borderRadius:3,background:"#4a1a2a",display:"inline-block"}}></span><span style={{color:C.muted}}>Cirílico</span></span>
              <span style={{fontSize:12,display:"flex",alignItems:"center",gap:6}}><span style={{width:14,height:14,borderRadius:3,background:"#1a2a4a",display:"inline-block"}}></span><span style={{color:C.muted}}>Griego</span></span>
            </>}
          </div>
        )}
      </div>
    </div>
  );
}