import { useState, useEffect, useRef, useCallback } from "react";

const EUROPE_IDS = new Set([
  8,20,40,56,70,100,112,191,196,203,208,233,246,250,276,300,
  348,352,372,380,428,438,440,442,470,492,498,499,528,578,
  616,620,642,643,674,688,703,705,724,752,756,792,804,807,826
]);

const COUNTRY_DATA = {
  "Albania":          { es:"Albania",          cap:"Tirana",              flag:"🇦🇱" },
  "Andorra":          { es:"Andorra",           cap:"Andorra la Vella",    flag:"🇦🇩" },
  "Austria":          { es:"Austria",           cap:"Viena",               flag:"🇦🇹" },
  "Belarus":          { es:"Bielorrusia",       cap:"Minsk",               flag:"🇧🇾" },
  "Belgium":          { es:"Bélgica",           cap:"Bruselas",            flag:"🇧🇪" },
  "Bosnia and Herz.": { es:"Bosnia y Herz.",    cap:"Sarajevo",            flag:"🇧🇦" },
  "Bulgaria":         { es:"Bulgaria",          cap:"Sofía",               flag:"🇧🇬" },
  "Croatia":          { es:"Croacia",           cap:"Zagreb",              flag:"🇭🇷" },
  "Cyprus":           { es:"Chipre",            cap:"Nicosia",             flag:"🇨🇾" },
  "Czechia":          { es:"Chequia",           cap:"Praga",               flag:"🇨🇿" },
  "Czech Rep.":       { es:"Chequia",           cap:"Praga",               flag:"🇨🇿" },
  "Denmark":          { es:"Dinamarca",         cap:"Copenhague",          flag:"🇩🇰" },
  "Estonia":          { es:"Estonia",           cap:"Talín",               flag:"🇪🇪" },
  "Finland":          { es:"Finlandia",         cap:"Helsinki",            flag:"🇫🇮" },
  "France":           { es:"Francia",           cap:"París",               flag:"🇫🇷" },
  "Germany":          { es:"Alemania",          cap:"Berlín",              flag:"🇩🇪" },
  "Greece":           { es:"Grecia",            cap:"Atenas",              flag:"🇬🇷" },
  "Hungary":          { es:"Hungría",           cap:"Budapest",            flag:"🇭🇺" },
  "Iceland":          { es:"Islandia",          cap:"Reikiavik",           flag:"🇮🇸" },
  "Ireland":          { es:"Irlanda",           cap:"Dublín",              flag:"🇮🇪" },
  "Italy":            { es:"Italia",            cap:"Roma",                flag:"🇮🇹" },
  "Kosovo":           { es:"Kosovo",            cap:"Pristina",            flag:"🇽🇰" },
  "Latvia":           { es:"Letonia",           cap:"Riga",                flag:"🇱🇻" },
  "Liechtenstein":    { es:"Liechtenstein",     cap:"Vaduz",               flag:"🇱🇮" },
  "Lithuania":        { es:"Lituania",          cap:"Vilna",               flag:"🇱🇹" },
  "Luxembourg":       { es:"Luxemburgo",        cap:"Luxemburgo",          flag:"🇱🇺" },
  "N. Macedonia":     { es:"Macedonia del N.",  cap:"Skopie",              flag:"🇲🇰" },
  "North Macedonia":  { es:"Macedonia del N.",  cap:"Skopie",              flag:"🇲🇰" },
  "Malta":            { es:"Malta",             cap:"La Valeta",           flag:"🇲🇹" },
  "Moldova":          { es:"Moldavia",          cap:"Chisináu",            flag:"🇲🇩" },
  "Monaco":           { es:"Mónaco",            cap:"Mónaco",              flag:"🇲🇨" },
  "Montenegro":       { es:"Montenegro",        cap:"Podgorica",           flag:"🇲🇪" },
  "Netherlands":      { es:"Países Bajos",      cap:"Ámsterdam",           flag:"🇳🇱" },
  "Norway":           { es:"Noruega",           cap:"Oslo",                flag:"🇳🇴" },
  "Poland":           { es:"Polonia",           cap:"Varsovia",            flag:"🇵🇱" },
  "Portugal":         { es:"Portugal",          cap:"Lisboa",              flag:"🇵🇹" },
  "Romania":          { es:"Rumanía",           cap:"Bucarest",            flag:"🇷🇴" },
  "Russia":           { es:"Rusia",             cap:"Moscú",               flag:"🇷🇺" },
  "San Marino":       { es:"San Marino",        cap:"San Marino",          flag:"🇸🇲" },
  "Serbia":           { es:"Serbia",            cap:"Belgrado",            flag:"🇷🇸" },
  "Slovakia":         { es:"Eslovaquia",        cap:"Bratislava",          flag:"🇸🇰" },
  "Slovenia":         { es:"Eslovenia",         cap:"Liubliana",           flag:"🇸🇮" },
  "Spain":            { es:"España",            cap:"Madrid",              flag:"🇪🇸" },
  "Sweden":           { es:"Suecia",            cap:"Estocolmo",           flag:"🇸🇪" },
  "Switzerland":      { es:"Suiza",             cap:"Berna",               flag:"🇨🇭" },
  "Turkey":           { es:"Turquía",           cap:"Ankara",              flag:"🇹🇷" },
  "Ukraine":          { es:"Ucrania",           cap:"Kiev",                flag:"🇺🇦" },
  "United Kingdom":   { es:"Reino Unido",       cap:"Londres",             flag:"🇬🇧" },
  "Vatican":          { es:"Vaticano",          cap:"Ciudad del Vaticano", flag:"🇻🇦" },
};

const C = {
  ocean:"#0f1a2e", land:"#2a3d5e", landHov:"#3d5580",
  correct:"#1D9E75", wrong:"#e63946", wrongBg:"#5a2030",
  flash:"#e9c46a", gold:"#e9c46a", border:"rgba(255,255,255,0.12)",
  text:"#e8e0d0", muted:"#a89080", dark:"#0f0c29",
};

const getES   = n => COUNTRY_DATA[n]?.es   || n;
const getFlag = n => COUNTRY_DATA[n]?.flag || "";
const getCap  = n => COUNTRY_DATA[n]?.cap  || "—";
const fmtTime = s => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

const MODES = [
  { id:"pin",      label:"📍 Países"   },
  { id:"capitals", label:"🏛️ Capitales" },
  { id:"explore",  label:"🔍 Explorar"  },
];

export default function EuropaMap() {
  const svgRef   = useRef(null);
  const gRef     = useRef(null);
  const timerRef = useRef(null);
  const flashRef = useRef(null);

  const [libs,      setLibs]      = useState(null);
  const [countries, setCountries] = useState([]);
  const [mode,      setMode]      = useState("pin");
  const [phase,     setPhase]     = useState("start");

  const [queue,   setQueue]   = useState([]);
  const [idx,     setIdx]     = useState(0);
  const [correct, setCorrect] = useState([]);
  const [missed,  setMissed]  = useState({});
  const [flash,   setFlash]   = useState(null);
  const [timer,   setTimer]   = useState(0);
  const [hovered, setHovered] = useState(null);
  const [seen,    setSeen]    = useState({});

  useEffect(() => {
    Promise.all([
      import("https://cdn.jsdelivr.net/npm/d3@7/+esm"),
      import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm"),
    ]).then(([d3, topo]) => {
      fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
        .then(r => r.json()).then(world => {
          const feats = topo.feature(world, world.objects.countries).features;
          setCountries(feats.filter(f => EUROPE_IDS.has(Number(f.id))));
          setLibs({ d3, topo });
        });
    });
  }, []);

  const buildMap = useCallback(() => {
    if (!libs || !svgRef.current || !countries.length) return;
    const { d3 } = libs;
    const el = svgRef.current;
    const W  = el.parentElement.clientWidth || 500;
    const H  = Math.round(W * 0.78);
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
      .attr("fill", C.land)
      .attr("stroke","rgba(255,255,255,0.18)").attr("stroke-width",0.5)
      .style("cursor","pointer").style("transition","fill 0.12s");
    const zoom = d3.zoom().scaleExtent([0.7,14]).on("zoom", e => g.attr("transform",e.transform));
    svg.call(zoom);
    const zG = svg.append("g").attr("transform",`translate(${W-42},${H-82})`);
    [{l:"+",dy:0,f:1.5},{l:"−",dy:40,f:1/1.5}].forEach(({l,dy,f}) => {
      const b = zG.append("g").attr("transform",`translate(0,${dy})`).style("cursor","pointer");
      b.append("rect").attr("width",30).attr("height",30).attr("rx",6)
        .attr("fill","rgba(10,10,15,0.75)").attr("stroke",C.border).attr("stroke-width",0.5);
      b.append("text").text(l).attr("x",15).attr("y",21).attr("text-anchor","middle")
        .attr("font-size",18).attr("fill",C.gold).style("pointer-events","none");
      b.on("click", () => svg.transition().duration(220).call(zoom.scaleBy, f));
    });
  }, [libs, countries]);

  useEffect(() => { buildMap(); }, [buildMap]);

  const colorMap = useCallback(() => {
    if (!gRef.current) return;
    gRef.current.selectAll("path[data-name]").each(function() {
      const name = this.getAttribute("data-name");
      let fill = C.land;
      if (mode === "explore") {
        fill = seen[name] ? C.correct : C.land;
      } else {
        if (correct.includes(name)) fill = C.correct;
        else if (missed[name])       fill = C.wrongBg;
      }
      if (flash?.name === name) fill = flash.ok ? C.flash : C.wrong;
      this.style.fill = fill;
    });
  }, [mode, seen, correct, missed, flash]);

  useEffect(() => { colorMap(); }, [colorMap]);

  const attachHandlers = useCallback(() => {
    if (!gRef.current || !libs) return;
    const { d3 } = libs;
    gRef.current.selectAll("path[data-name]")
      .on("click", function(event, d) {
        const name = d?.properties?.name || this.getAttribute("data-name")||"";
        if (mode === "explore") {
          setSeen(s => ({...s,[name]:true}));
          setHovered({ name:getES(name), cap:getCap(name), flag:getFlag(name) });
        } else if (phase === "playing") {
          handleClick(name);
        }
      })
      .on("mouseenter", function(event, d) {
        const name = d?.properties?.name || this.getAttribute("data-name")||"";
        if (!correct.includes(name) && !(missed[name] && mode !== "explore")) {
          d3.select(this).style("fill", C.landHov);
        }
        if (mode === "explore") setHovered({ name:getES(name), cap:getCap(name), flag:getFlag(name) });
      })
      .on("mouseleave", function(event, d) {
        const name = d?.properties?.name || this.getAttribute("data-name")||"";
        let fill = C.land;
        if (mode === "explore") fill = seen[name] ? C.correct : C.land;
        else if (correct.includes(name)) fill = C.correct;
        else if (missed[name]) fill = C.wrongBg;
        d3.select(this).style("fill", fill);
        if (mode === "explore") setHovered(null);
      });
  }, [libs, mode, phase, seen, correct, missed]);

  useEffect(() => { attachHandlers(); }, [attachHandlers]);

  const startGame = () => {
    const names = countries.map(c => c.properties?.name).filter(n => COUNTRY_DATA[n]);
    const shuffled = [...names].sort(() => Math.random()-0.5);
    setQueue(shuffled); setIdx(0); setCorrect([]); setMissed({});
    setFlash(null); setTimer(0); setPhase("playing");
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer(t => t+1), 1000);
  };

  const handleClick = useCallback((name) => {
    setQueue(q => {
      setIdx(i => {
        if (i >= q.length) return i;
        const target = q[i];
        if (name === target) {
          setCorrect(c => [...c, name]);
          setFlash({ name, ok: true });
          clearTimeout(flashRef.current);
          flashRef.current = setTimeout(() => setFlash(null), 500);
          const next = i + 1;
          if (next >= q.length) { clearInterval(timerRef.current); setTimeout(() => setPhase("result"), 700); }
          return next;
        } else {
          setMissed(m => ({...m,[name]:(m[name]||0)+1}));
          setFlash({ name, ok: false });
          clearTimeout(flashRef.current);
          flashRef.current = setTimeout(() => setFlash(null), 650);
          return i;
        }
      });
      return q;
    });
  }, []);

  useEffect(() => () => { clearInterval(timerRef.current); clearTimeout(flashRef.current); }, []);

  const target      = queue[idx];
  const remaining   = queue.slice(idx);
  const totalErrors = Object.values(missed).reduce((a,b)=>a+b,0);
  const accuracy    = (correct.length+totalErrors)>0 ? Math.round(correct.length/(correct.length+totalErrors)*100) : 100;

  const panelBase = {
    background:"linear-gradient(135deg,#0f0c29,#16213e)",
    borderBottom:`1px solid ${C.border}`,
    padding:"12px 16px",
    display:"flex", alignItems:"center", justifyContent:"space-between",
    gap:12, flexWrap:"wrap", minHeight:60,
  };

  // What to show in the top banner during play
  const renderTarget = () => {
    if (!target) return null;
    if (mode === "pin") {
      return (
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:32,lineHeight:1}}>{getFlag(target)}</span>
          <div>
            <div style={{fontSize:11,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase"}}>Encuentra el país</div>
            <div style={{fontSize:20,fontWeight:700,color:"#fff"}}>{getES(target)}</div>
          </div>
        </div>
      );
    }
    if (mode === "capitals") {
      return (
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:10,background:"rgba(233,196,106,0.15)",border:`1px solid ${C.gold}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:22}}>🏛️</span>
          </div>
          <div>
            <div style={{fontSize:11,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase"}}>¿De qué país es capital?</div>
            <div style={{fontSize:22,fontWeight:700,color:C.gold}}>{getCap(target)}</div>
          </div>
        </div>
      );
    }
  };

  return (
    <div style={{fontFamily:"Georgia,serif"}}>

      {/* Mode selector */}
      <div style={{display:"flex",gap:6,padding:"10px 0 8px",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {MODES.map(({id,label}) => (
            <button key={id} onClick={() => { setMode(id); setPhase("start"); clearInterval(timerRef.current); setSeen({}); setHovered(null); }}
              style={{padding:"6px 14px",borderRadius:20,
                border:mode===id?`1px solid ${C.gold}`:`1px solid ${C.border}`,
                background:mode===id?"rgba(233,196,106,0.15)":"transparent",
                color:mode===id?C.gold:C.muted,
                fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:mode===id?600:400}}>
              {label}
            </button>
          ))}
        </div>
        {phase==="playing" && (
          <div style={{display:"flex",gap:14,alignItems:"center",fontSize:13}}>
            <span style={{color:C.gold,fontVariantNumeric:"tabular-nums",fontWeight:600}}>{fmtTime(timer)}</span>
            <span style={{color:C.correct}}>✓ {correct.length}</span>
            {totalErrors>0 && <span style={{color:C.wrong}}>✗ {totalErrors}</span>}
            <span style={{color:C.muted}}>{remaining.length} restantes</span>
          </div>
        )}
      </div>

      <div style={{border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",background:C.ocean}}>

        {/* START banner */}
        {phase==="start" && mode!=="explore" && (
          <div style={panelBase}>
            <div>
              <div style={{color:C.gold,fontWeight:600,fontSize:15,letterSpacing:"0.04em"}}>
                Europa · {mode==="pin"?"Países":"Capitales"}
              </div>
              <div style={{color:C.muted,fontSize:12,marginTop:2}}>
                {mode==="pin"
                  ? "Haz clic en el país cuando aparezca su nombre"
                  : "Haz clic en el país al que pertenece cada capital"
                }
              </div>
            </div>
            <button onClick={startGame} style={{padding:"9px 24px",borderRadius:20,border:"none",
              background:`linear-gradient(90deg,${C.gold},#f4a261)`,
              color:"#0a0a0f",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.06em"}}>
              EMPEZAR →
            </button>
          </div>
        )}

        {/* PLAYING banner */}
        {phase==="playing" && target && (
          <div style={panelBase}>
            {renderTarget()}
            <div style={{display:"flex",gap:20,alignItems:"center"}}>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:10,color:C.muted,letterSpacing:"0.08em"}}>TIEMPO</div>
                <div style={{fontSize:16,fontWeight:600,color:C.gold,fontVariantNumeric:"tabular-nums"}}>{fmtTime(timer)}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:10,color:C.muted,letterSpacing:"0.08em"}}>PROGRESO</div>
                <div style={{fontSize:16,fontWeight:600,color:"#fff"}}>{correct.length}<span style={{color:C.muted}}>/{queue.length}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* EXPLORE banner */}
        {mode==="explore" && (
          <div style={panelBase}>
            {hovered
              ? <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:28}}>{hovered.flag}</span>
                  <div>
                    <div style={{fontSize:16,fontWeight:600,color:"#fff"}}>{hovered.name}</div>
                    <div style={{fontSize:12,color:C.muted,marginTop:2}}>Capital: {hovered.cap}</div>
                  </div>
                </div>
              : <div style={{fontSize:13,color:C.muted}}>Toca un país · Rueda o +/− para zoom · Arrastra para mover</div>
            }
          </div>
        )}

        {/* MAP */}
        <div style={{lineHeight:0,position:"relative"}}>
          <svg ref={svgRef} style={{display:"block",width:"100%",touchAction:"none"}} />
        </div>

        {/* Progress bar */}
        {phase==="playing" && (
          <div style={{height:3,background:"rgba(255,255,255,0.06)"}}>
            <div style={{height:"100%",
              width:queue.length?(correct.length/queue.length*100)+"%":"0%",
              background:`linear-gradient(90deg,${C.gold},#f4a261)`,transition:"width 0.4s"}} />
          </div>
        )}

        {/* Pending list */}
        {phase==="playing" && remaining.length>0 && (
          <div style={{background:"rgba(255,255,255,0.03)",padding:"8px 14px",borderTop:`1px solid ${C.border}`}}>
            <div style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",marginBottom:5}}>
              PENDIENTES ({remaining.length})
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"3px 10px"}}>
              {remaining.map(n => (
                <span key={n} style={{fontSize:12,color:"rgba(232,224,208,0.5)"}}>
                  {mode==="capitals" ? getCap(n) : getES(n)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* RESULT */}
        {phase==="result" && (
          <div style={{padding:"24px 20px",textAlign:"center",
            background:"linear-gradient(135deg,#0f0c29,#16213e)",
            borderTop:`1px solid ${C.border}`}}>
            <div style={{fontSize:36,marginBottom:10}}>🌍</div>
            <div style={{fontSize:20,fontWeight:600,color:"#fff",marginBottom:14}}>¡Completado!</div>
            <div style={{display:"flex",justifyContent:"center",gap:24,marginBottom:16,flexWrap:"wrap"}}>
              {[
                ["Tiempo",   fmtTime(timer),  C.gold],
                ["Aciertos", correct.length,  C.correct],
                ["Errores",  totalErrors,     totalErrors?C.wrong:C.correct],
                ["Precisión",accuracy+"%",    accuracy>=90?C.correct:accuracy>=70?C.gold:C.wrong],
              ].map(([l,v,c]) => (
                <div key={l} style={{minWidth:60}}>
                  <div style={{fontSize:10,color:C.muted,letterSpacing:"0.08em",marginBottom:4}}>{l.toUpperCase()}</div>
                  <div style={{fontSize:22,fontWeight:700,color:c}}>{v}</div>
                </div>
              ))}
            </div>
            {Object.keys(missed).length>0 && (
              <div style={{marginBottom:16,background:"rgba(230,57,70,0.1)",borderRadius:10,
                padding:"10px 14px",border:"1px solid rgba(230,57,70,0.2)",textAlign:"left"}}>
                <div style={{fontSize:10,color:C.wrong,letterSpacing:"0.08em",marginBottom:6}}>FALLASTE EN</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"5px 14px"}}>
                  {Object.keys(missed).map(n => (
                    <span key={n} style={{fontSize:13,color:"rgba(232,224,208,0.85)"}}>
                      {getFlag(n)} {getES(n)}
                      {mode==="capitals" && <span style={{color:C.muted,fontSize:11}}> · {getCap(n)}</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button onClick={startGame} style={{padding:"10px 30px",borderRadius:20,border:"none",
              background:`linear-gradient(90deg,${C.gold},#f4a261)`,
              color:"#0a0a0f",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.06em"}}>
              REPETIR →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}