import { useState, useEffect, useRef, useCallback } from "react";

const EUROPE_IDS = new Set([
  8,20,40,56,70,100,112,191,196,203,208,233,246,250,276,300,
  348,352,372,380,428,438,440,442,470,492,498,499,528,578,
  616,620,642,643,674,688,703,705,724,752,756,792,804,807,826
]);

const COUNTRY_DATA = {
  "Albania":    { es:"Albania",        cap:"Tirana",            flag:"🇦🇱" },
  "Andorra":    { es:"Andorra",        cap:"Andorra la Vella",  flag:"🇦🇩" },
  "Austria":    { es:"Austria",        cap:"Viena",             flag:"🇦🇹" },
  "Belarus":    { es:"Bielorrusia",    cap:"Minsk",             flag:"🇧🇾" },
  "Belgium":    { es:"Bélgica",        cap:"Bruselas",          flag:"🇧🇪" },
  "Bosnia and Herz.": { es:"Bosnia y Herz.", cap:"Sarajevo",   flag:"🇧🇦" },
  "Bulgaria":   { es:"Bulgaria",       cap:"Sofía",             flag:"🇧🇬" },
  "Croatia":    { es:"Croacia",        cap:"Zagreb",            flag:"🇭🇷" },
  "Cyprus":     { es:"Chipre",         cap:"Nicosia",           flag:"🇨🇾" },
  "Czechia":    { es:"Chequia",        cap:"Praga",             flag:"🇨🇿" },
  "Czech Rep.": { es:"Chequia",        cap:"Praga",             flag:"🇨🇿" },
  "Denmark":    { es:"Dinamarca",      cap:"Copenhague",        flag:"🇩🇰" },
  "Estonia":    { es:"Estonia",        cap:"Talín",             flag:"🇪🇪" },
  "Finland":    { es:"Finlandia",      cap:"Helsinki",          flag:"🇫🇮" },
  "France":     { es:"Francia",        cap:"París",             flag:"🇫🇷" },
  "Germany":    { es:"Alemania",       cap:"Berlín",            flag:"🇩🇪" },
  "Greece":     { es:"Grecia",         cap:"Atenas",            flag:"🇬🇷" },
  "Hungary":    { es:"Hungría",        cap:"Budapest",          flag:"🇭🇺" },
  "Iceland":    { es:"Islandia",       cap:"Reikiavik",         flag:"🇮🇸" },
  "Ireland":    { es:"Irlanda",        cap:"Dublín",            flag:"🇮🇪" },
  "Italy":      { es:"Italia",         cap:"Roma",              flag:"🇮🇹" },
  "Kosovo":     { es:"Kosovo",         cap:"Pristina",          flag:"🇽🇰" },
  "Latvia":     { es:"Letonia",        cap:"Riga",              flag:"🇱🇻" },
  "Liechtenstein":{ es:"Liechtenstein",cap:"Vaduz",             flag:"🇱🇮" },
  "Lithuania":  { es:"Lituania",       cap:"Vilna",             flag:"🇱🇹" },
  "Luxembourg": { es:"Luxemburgo",     cap:"Luxemburgo",        flag:"🇱🇺" },
  "N. Macedonia":{ es:"Macedonia del N.",cap:"Skopie",          flag:"🇲🇰" },
  "North Macedonia":{ es:"Macedonia del N.",cap:"Skopie",       flag:"🇲🇰" },
  "Malta":      { es:"Malta",          cap:"La Valeta",         flag:"🇲🇹" },
  "Moldova":    { es:"Moldavia",       cap:"Chisináu",          flag:"🇲🇩" },
  "Monaco":     { es:"Mónaco",         cap:"Mónaco",            flag:"🇲🇨" },
  "Montenegro": { es:"Montenegro",     cap:"Podgorica",         flag:"🇲🇪" },
  "Netherlands":{ es:"Países Bajos",   cap:"Ámsterdam",         flag:"🇳🇱" },
  "Norway":     { es:"Noruega",        cap:"Oslo",              flag:"🇳🇴" },
  "Poland":     { es:"Polonia",        cap:"Varsovia",          flag:"🇵🇱" },
  "Portugal":   { es:"Portugal",       cap:"Lisboa",            flag:"🇵🇹" },
  "Romania":    { es:"Rumanía",        cap:"Bucarest",          flag:"🇷🇴" },
  "Russia":     { es:"Rusia",          cap:"Moscú",             flag:"🇷🇺" },
  "San Marino": { es:"San Marino",     cap:"San Marino",        flag:"🇸🇲" },
  "Serbia":     { es:"Serbia",         cap:"Belgrado",          flag:"🇷🇸" },
  "Slovakia":   { es:"Eslovaquia",     cap:"Bratislava",        flag:"🇸🇰" },
  "Slovenia":   { es:"Eslovenia",      cap:"Liubliana",         flag:"🇸🇮" },
  "Spain":      { es:"España",         cap:"Madrid",            flag:"🇪🇸" },
  "Sweden":     { es:"Suecia",         cap:"Estocolmo",         flag:"🇸🇪" },
  "Switzerland":{ es:"Suiza",          cap:"Berna",             flag:"🇨🇭" },
  "Turkey":     { es:"Turquía",        cap:"Ankara",            flag:"🇹🇷" },
  "Ukraine":    { es:"Ucrania",        cap:"Kiev",              flag:"🇺🇦" },
  "United Kingdom":{ es:"Reino Unido", cap:"Londres",           flag:"🇬🇧" },
  "Vatican":    { es:"Vaticano",       cap:"Ciudad del Vaticano",flag:"🇻🇦" },
};

const getES = n => COUNTRY_DATA[n]?.es || n;
const getFlag = n => COUNTRY_DATA[n]?.flag || "";
const getCap = n => COUNTRY_DATA[n]?.cap || "—";

export default function EuropaMap() {
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const zoomRef = useRef(null);
  const [mode, setMode] = useState("pin");
  const [phase, setPhase] = useState("start"); // start | playing | result
  const [countries, setCountries] = useState([]);
  const [libs, setLibs] = useState(null);

  // PIN state
  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState([]);
  const [missed, setMissed] = useState({});
  const [flash, setFlash] = useState(null); // { name, ok }
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const flashRef = useRef(null);

  // Explore state
  const [hovered, setHovered] = useState(null);
  const [seen, setSeen] = useState({});

  useEffect(() => {
    Promise.all([
      import("https://cdn.jsdelivr.net/npm/d3@7/+esm"),
      import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm"),
    ]).then(([d3, topo]) => {
      setLibs({ d3, topo });
      return fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json");
    }).then(r => r.json()).then(world => {
      const [d3mod, topoMod] = [window.__d3, window.__topo];
      import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm").then(topo => {
        import("https://cdn.jsdelivr.net/npm/d3@7/+esm").then(d3 => {
          fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
            .then(r=>r.json()).then(world => {
              const feats = topo.feature(world, world.objects.countries).features;
              setCountries(feats.filter(f => EUROPE_IDS.has(Number(f.id))));
              setLibs({d3,topo});
            });
        });
      });
    }).catch(()=>{});
  }, []);

  useEffect(() => {
    if (!libs) {
      import("https://cdn.jsdelivr.net/npm/d3@7/+esm").then(d3 => {
        import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm").then(topo => {
          fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
            .then(r=>r.json()).then(world => {
              const feats = topo.feature(world, world.objects.countries).features;
              setCountries(feats.filter(f => EUROPE_IDS.has(Number(f.id))));
              setLibs({d3,topo});
            });
        });
      });
    }
  }, []);

  const buildMap = useCallback(() => {
    if (!libs || !svgRef.current || countries.length === 0) return;
    const { d3 } = libs;
    const el = svgRef.current;
    const W = el.parentElement.clientWidth || 500;
    const H = Math.round(W * 0.78);
    const svg = d3.select(el).attr("width",W).attr("height",H).attr("viewBox",`0 0 ${W} ${H}`);
    svg.selectAll("*").remove();
    svg.append("rect").attr("width",W).attr("height",H).attr("fill","#aac8e0");

    const proj = d3.geoMercator().center([13,52]).scale(W*1.15).translate([W/2,H/2]);
    const path = d3.geoPath().projection(proj);
    const g = svg.append("g");
    gRef.current = g;

    g.selectAll("path").data(countries).join("path")
      .attr("d", path)
      .attr("class", d => "cp")
      .attr("data-name", d => d.properties?.name||"")
      .attr("fill", "#3a7d44")
      .attr("stroke","#fff").attr("stroke-width",0.6)
      .style("cursor","pointer");

    const zoom = d3.zoom().scaleExtent([0.7,14]).on("zoom", e => g.attr("transform",e.transform));
    zoomRef.current = zoom;
    svg.call(zoom);

    const zoomG = svg.append("g").attr("transform",`translate(${W-44},${H-80})`);
    [{l:"+",dy:0,f:1.5},{l:"−",dy:38,f:1/1.5}].forEach(({l,dy,f}) => {
      const bg = zoomG.append("g").attr("transform",`translate(0,${dy})`).style("cursor","pointer");
      bg.append("rect").attr("width",30).attr("height",30).attr("rx",6).attr("fill","white").attr("fill-opacity",0.85).attr("stroke","rgba(0,0,0,0.2)").attr("stroke-width",0.5);
      bg.append("text").text(l).attr("x",15).attr("y",21).attr("text-anchor","middle").attr("font-size",18).attr("fill","#333").style("pointer-events","none");
      bg.on("click", () => svg.transition().duration(220).call(zoom.scaleBy, f));
    });
  }, [libs, countries]);

  useEffect(() => { buildMap(); }, [buildMap]);

  const colorMap = useCallback(() => {
    if (!gRef.current) return;
    gRef.current.selectAll("path[data-name]").each(function() {
      const name = this.getAttribute("data-name");
      let fill = "#3a7d44";
      if (phase === "playing" || phase === "result") {
        if (correct.includes(name)) fill = "#1a5c28";
        else if (missed[name]) fill = "#c0392b";
        else fill = "#3a7d44";
      }
      if (flash?.name === name) fill = flash.ok ? "#f1c40f" : "#e74c3c";
      if (phase === "start" && mode === "explore" && seen[name]) fill = "#5DCAA5";
      this.style.fill = fill;
    });
  }, [phase, correct, missed, flash, mode, seen]);

  useEffect(() => { colorMap(); }, [colorMap]);

  const attachHandlers = useCallback(() => {
    if (!gRef.current || !libs) return;
    const { d3 } = libs;
    gRef.current.selectAll("path[data-name]")
      .on("click", function(event, d) {
        const name = d.properties?.name || this.getAttribute("data-name") || "";
        if (mode === "explore") {
          setSeen(s => ({...s,[name]:true}));
          setHovered({ name: getES(name), cap: getCap(name), flag: getFlag(name) });
        } else if (phase === "playing") {
          handlePinClick(name);
        }
      })
      .on("mouseenter", function(event, d) {
        const name = d.properties?.name || this.getAttribute("data-name") || "";
        if (mode === "explore") {
          d3.select(this).style("opacity", 0.75);
          setHovered({ name: getES(name), cap: getCap(name), flag: getFlag(name) });
        } else {
          d3.select(this).style("opacity", 0.75);
        }
      })
      .on("mouseleave", function() {
        libs.d3.select(this).style("opacity", 1);
        if (mode === "explore") setHovered(null);
      });
  }, [libs, mode, phase]);

  useEffect(() => { attachHandlers(); }, [attachHandlers]);

  const startGame = () => {
    const names = countries.map(c => c.properties?.name).filter(n => COUNTRY_DATA[n]);
    const shuffled = [...names].sort(() => Math.random()-0.5);
    setQueue(shuffled);
    setIdx(0);
    setCorrect([]);
    setMissed({});
    setFlash(null);
    setTimer(0);
    setPhase("playing");
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer(t => t+1), 1000);
  };

  const handlePinClick = useCallback((name) => {
    setQueue(q => {
      setIdx(i => {
        if (i >= q.length) return i;
        const target = q[i];
        if (name === target) {
          setCorrect(c => [...c, name]);
          setFlash({ name, ok: true });
          clearTimeout(flashRef.current);
          flashRef.current = setTimeout(() => setFlash(null), 500);
          const nextIdx = i + 1;
          if (nextIdx >= q.length) {
            clearInterval(timerRef.current);
            setTimeout(() => setPhase("result"), 600);
          }
          return nextIdx;
        } else {
          setMissed(m => ({...m,[name]:(m[name]||0)+1}));
          setFlash({ name, ok: false });
          clearTimeout(flashRef.current);
          flashRef.current = setTimeout(() => setFlash(null), 600);
          return i;
        }
      });
      return q;
    });
  }, []);

  useEffect(() => () => { clearInterval(timerRef.current); clearTimeout(flashRef.current); }, []);

  const fmtTime = s => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;
  const target = queue[idx];
  const remaining = queue.slice(idx);
  const totalErrors = Object.values(missed).reduce((a,b)=>a+b,0);
  const accuracy = queue.length > 0 ? Math.round((correct.length/(correct.length+totalErrors||1))*100) : 100;

  return (
    <div style={{fontFamily:"Georgia,serif"}}>

      {/* MODE SELECTOR */}
      <div style={{display:"flex",gap:6,padding:"10px 0 8px",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:6}}>
          {[["pin","PIN"],["explore","Explorar"]].map(([m,l]) => (
            <button key={m} onClick={() => { setMode(m); setPhase("start"); clearInterval(timerRef.current); }}
              style={{padding:"5px 14px",borderRadius:8,border:"0.5px solid rgba(0,0,0,0.2)",background:mode===m?"#1a5c28":"transparent",color:mode===m?"#fff":"#444",fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:mode===m?600:400}}>
              {l}
            </button>
          ))}
        </div>
        {phase==="playing" && (
          <div style={{display:"flex",gap:12,alignItems:"center",fontSize:13,color:"#444"}}>
            <span style={{fontVariantNumeric:"tabular-nums",fontWeight:600,color:"#1a5c28"}}>{fmtTime(timer)}</span>
            <span>{correct.length} / {queue.length}</span>
            {totalErrors > 0 && <span style={{color:"#c0392b"}}>✗ {totalErrors}</span>}
          </div>
        )}
      </div>

      {/* MAP */}
      <div style={{border:"0.5px solid rgba(0,0,0,0.12)",borderRadius:12,overflow:"hidden",background:"#aac8e0"}}>

        {/* PIN BAR */}
        {mode==="pin" && phase==="playing" && target && (
          <div style={{background:"#1a2a3a",padding:"10px 16px",display:"flex",alignItems:"center",gap:12,justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:28}}>{getFlag(target)}</span>
              <div>
                <div style={{fontSize:11,color:"#aaa",letterSpacing:"0.06em"}}>HAZ CLIC EN</div>
                <div style={{fontSize:17,fontWeight:700,color:"#fff"}}>{getES(target)}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:"#aaa"}}>TIEMPO</div>
                <div style={{fontSize:15,fontWeight:600,color:"#f1c40f",fontVariantNumeric:"tabular-nums"}}>{fmtTime(timer)}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:"#aaa"}}>PROGRESO</div>
                <div style={{fontSize:15,fontWeight:600,color:"#fff"}}>{correct.length}/{queue.length}</div>
              </div>
            </div>
          </div>
        )}

        {/* START SCREEN PIN */}
        {mode==="pin" && phase==="start" && (
          <div style={{background:"#1a2a3a",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{color:"#fff",fontSize:14,fontWeight:500}}>Modo PIN — Europa: Países</div>
            <button onClick={startGame}
              style={{padding:"8px 22px",borderRadius:20,border:"none",background:"#27ae60",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              EMPEZAR
            </button>
          </div>
        )}

        {/* EXPLORE INFO */}
        {mode==="explore" && (
          <div style={{background:"#1a2a3a",padding:"10px 16px",minHeight:48,display:"flex",alignItems:"center",gap:10}}>
            {hovered
              ? <>
                  <span style={{fontSize:24}}>{hovered.flag}</span>
                  <div>
                    <div style={{fontWeight:600,fontSize:15,color:"#fff"}}>{hovered.name}</div>
                    <div style={{fontSize:12,color:"#aaa"}}>Capital: {hovered.cap}</div>
                  </div>
                </>
              : <div style={{fontSize:13,color:"#aaa"}}>Toca un país para ver su nombre y capital</div>
            }
          </div>
        )}

        {/* SVG MAP */}
        <div style={{position:"relative",lineHeight:0}}>
          <svg ref={svgRef} style={{display:"block",width:"100%",touchAction:"none"}} />
        </div>

        {/* PENDING LIST */}
        {mode==="pin" && phase==="playing" && remaining.length > 0 && (
          <div style={{background:"#f8f8f6",padding:"8px 12px",borderTop:"0.5px solid rgba(0,0,0,0.08)"}}>
            <div style={{fontSize:10,color:"#999",letterSpacing:"0.08em",marginBottom:4}}>PENDIENTES ({remaining.length})</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"3px 6px"}}>
              {remaining.map(n => (
                <span key={n} style={{fontSize:12,color:"#555"}}>{getES(n)}</span>
              ))}
            </div>
          </div>
        )}

        {/* RESULT */}
        {phase==="result" && (
          <div style={{padding:"20px 16px",textAlign:"center",background:"#fff",borderTop:"0.5px solid rgba(0,0,0,0.08)"}}>
            <div style={{fontSize:32,marginBottom:8}}>🎉</div>
            <div style={{fontSize:18,fontWeight:600,marginBottom:4}}>¡Completado!</div>
            <div style={{fontSize:14,color:"#666",marginBottom:16}}>
              Tiempo: <b>{fmtTime(timer)}</b> · Errores: <b style={{color:totalErrors>0?"#c0392b":"#27ae60"}}>{totalErrors}</b> · Precisión: <b style={{color:"#27ae60"}}>{accuracy}%</b>
            </div>
            {Object.keys(missed).length > 0 && (
              <div style={{marginBottom:16,textAlign:"left",background:"#fff5f5",borderRadius:8,padding:"10px 14px"}}>
                <div style={{fontSize:11,color:"#c0392b",letterSpacing:"0.06em",marginBottom:6}}>FALLASTE EN</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"4px 10px"}}>
                  {Object.keys(missed).map(n => (
                    <span key={n} style={{fontSize:13,color:"#c0392b"}}>{getFlag(n)} {getES(n)}</span>
                  ))}
                </div>
              </div>
            )}
            <button onClick={startGame}
              style={{padding:"10px 28px",borderRadius:20,border:"none",background:"#27ae60",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              REPETIR
            </button>
          </div>
        )}
      </div>
    </div>
  );
}