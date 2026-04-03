import { useState, useEffect, useRef, useCallback } from "react";

const EUROPE_IDS = new Set([
  8,20,40,56,70,100,112,191,196,203,208,233,246,250,276,300,
  348,352,372,380,428,438,440,442,470,492,498,499,504,528,578,
  616,620,642,643,674,688,703,705,724,752,756,792,804,807,826,
  8,292,336,674
]);

const NAME_ES = {
  "Albania":"Albania","Andorra":"Andorra","Austria":"Austria",
  "Belarus":"Bielorrusia","Belgium":"Bélgica",
  "Bosnia and Herz.":"Bosnia y Herz.","Bulgaria":"Bulgaria",
  "Croatia":"Croacia","Cyprus":"Chipre","Czechia":"Chequia",
  "Czech Rep.":"Chequia","Denmark":"Dinamarca","Estonia":"Estonia",
  "Finland":"Finlandia","France":"Francia","Germany":"Alemania",
  "Greece":"Grecia","Hungary":"Hungría","Iceland":"Islandia",
  "Ireland":"Irlanda","Italy":"Italia","Kosovo":"Kosovo",
  "Latvia":"Letonia","Liechtenstein":"Liechtenstein",
  "Lithuania":"Lituania","Luxembourg":"Luxemburgo",
  "N. Macedonia":"Macedonia del N.","Malta":"Malta",
  "Moldova":"Moldavia","Monaco":"Mónaco","Montenegro":"Montenegro",
  "Netherlands":"Países Bajos","Norway":"Noruega","Poland":"Polonia",
  "Portugal":"Portugal","Romania":"Rumanía","Russia":"Rusia",
  "San Marino":"San Marino","Serbia":"Serbia","Slovakia":"Eslovaquia",
  "Slovenia":"Eslovenia","Spain":"España","Sweden":"Suecia",
  "Switzerland":"Suiza","Turkey":"Turquía","Ukraine":"Ucrania",
  "United Kingdom":"Reino Unido","Vatican":"Vaticano",
  "Kosovo":"Kosovo","Gibraltar":"Gibraltar",
  "North Macedonia":"Macedonia del N.",
};

const CAPITALS = {
  "Albania":"Tirana","Andorra":"Andorra la Vella","Austria":"Viena",
  "Belarus":"Minsk","Belgium":"Bruselas","Bosnia and Herz.":"Sarajevo",
  "Bulgaria":"Sofía","Croatia":"Zagreb","Cyprus":"Nicosia",
  "Czechia":"Praga","Czech Rep.":"Praga","Denmark":"Copenhague",
  "Estonia":"Talín","Finland":"Helsinki","France":"París",
  "Germany":"Berlín","Greece":"Atenas","Hungary":"Budapest",
  "Iceland":"Reikiavik","Ireland":"Dublín","Italy":"Roma",
  "Kosovo":"Pristina","Latvia":"Riga","Liechtenstein":"Vaduz",
  "Lithuania":"Vilna","Luxembourg":"Luxemburgo",
  "N. Macedonia":"Skopie","Malta":"La Valeta","Moldova":"Chisináu",
  "Monaco":"Mónaco","Montenegro":"Podgorica",
  "Netherlands":"Ámsterdam","Norway":"Oslo","Poland":"Varsovia",
  "Portugal":"Lisboa","Romania":"Bucarest","Russia":"Moscú",
  "San Marino":"San Marino","Serbia":"Belgrado",
  "Slovakia":"Bratislava","Slovenia":"Liubliana","Spain":"Madrid",
  "Sweden":"Estocolmo","Switzerland":"Berna","Turkey":"Ankara",
  "Ukraine":"Kiev","United Kingdom":"Londres","Vatican":"Ciudad del Vaticano",
  "North Macedonia":"Skopie",
};

export default function EuropaMap() {
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const [mode, setMode] = useState("explore");
  const [info, setInfo] = useState(null);
  const [seen, setSeen] = useState({});
  const [countries, setCountries] = useState([]);
  const [quiz, setQuiz] = useState({ queue:[], idx:0, correct:0, wrong:0 });
  const [answered, setAnswered] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const [libs, setLibs] = useState(null);
  const fbTimer = useRef(null);
  const transformRef = useRef({k:1,x:0,y:0});

  useEffect(() => {
    let d3mod, topo;
    Promise.all([
      import("https://cdn.jsdelivr.net/npm/d3@7/+esm"),
      import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm"),
    ]).then(([d3, topojsonMod]) => {
      d3mod = d3; topo = topojsonMod;
      setLibs({ d3: d3mod, topo });
      return fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json");
    }).then(r => r.json()).then(world => {
      const features = topo.feature(world, world.objects.countries).features;
      const europe = features.filter(f => EUROPE_IDS.has(Number(f.id)));
      setCountries(europe);
    });
  }, []);

  const getColor = useCallback((name) => {
    if (mode === "explore") return seen[name] ? "#5DCAA5" : "#B5D4F4";
    if (answered[name] === "correct") return "#5DCAA5";
    if (answered[name] === "wrong") return "#F09595";
    return "#B5D4F4";
  }, [mode, seen, answered]);

  useEffect(() => {
    if (!libs || !svgRef.current || countries.length === 0) return;
    const { d3, topo } = libs;
    const svg = d3.select(svgRef.current);
    const container = svgRef.current.parentElement;
    const W = container.clientWidth || 500;
    const H = Math.round(W * 0.82);
    svg.attr("width", W).attr("height", H).attr("viewBox", `0 0 ${W} ${H}`);

    const projection = d3.geoMercator()
      .center([13, 52])
      .scale(W * 1.15)
      .translate([W / 2, H / 2]);
    const path = d3.geoPath().projection(projection);

    svg.selectAll("*").remove();
    svg.append("rect").attr("width", W).attr("height", H).attr("fill", "#c8dbe8");

    const g = svg.append("g");
    gRef.current = g;

    g.selectAll("path")
      .data(countries)
      .join("path")
      .attr("class", d => "country-path cp-" + (d.properties?.name||"").replace(/\s/g,"_"))
      .attr("d", path)
      .attr("fill", d => getColor(d.properties?.name || ""))
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .on("mouseenter", function(event, d) {
        const name = d.properties?.name || "";
        if (!seen[name] && mode === "explore") {
          d3.select(this).attr("fill", "#378ADD");
        }
        const esName = NAME_ES[name] || name;
        d3.select(this).attr("stroke-width", 1.5);
        svg.select("#tooltip")
          .attr("display", null)
          .attr("transform", `translate(${event.offsetX + 10},${event.offsetY - 10})`)
          .select("text").text(esName);
      })
      .on("mousemove", function(event) {
        svg.select("#tooltip")
          .attr("transform", `translate(${event.offsetX + 10},${event.offsetY - 10})`);
      })
      .on("mouseleave", function(event, d) {
        const name = d.properties?.name || "";
        d3.select(this).attr("fill", getColor(name)).attr("stroke-width", 0.5);
        svg.select("#tooltip").attr("display", "none");
      })
      .on("click", function(event, d) {
        event.stopPropagation();
        const name = d.properties?.name || "";
        handleClick(name);
      });

    const tooltip = svg.append("g").attr("id","tooltip").attr("display","none");
    tooltip.append("rect").attr("rx",4).attr("ry",4).attr("fill","rgba(0,0,0,0.75)").attr("width",120).attr("height",22).attr("y",-18);
    tooltip.append("text").attr("fill","#fff").attr("font-size",11).attr("y",-4).attr("x",6);

    const zoom = d3.zoom()
      .scaleExtent([0.8, 12])
      .on("zoom", (event) => {
        transformRef.current = event.transform;
        g.attr("transform", event.transform);
        tooltip.attr("display","none");
      });
    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.translate(transformRef.current.x, transformRef.current.y).scale(transformRef.current.k));

    svg.append("g").attr("id","zoom-btns").attr("transform",`translate(${W-44},${H-90})`)
      .selectAll("g").data([{label:"+",dy:0,delta:1.5},{label:"−",dy:42,delta:1/1.5}]).join("g")
      .attr("transform", d=>`translate(0,${d.dy})`)
      .call(g2 => {
        g2.append("rect").attr("width",32).attr("height",32).attr("rx",6).attr("fill","white").attr("stroke","rgba(0,0,0,0.15)").attr("stroke-width",0.5).style("cursor","pointer");
        g2.append("text").text(d=>d.label).attr("x",16).attr("y",21).attr("text-anchor","middle").attr("font-size",18).attr("fill","#333").style("pointer-events","none");
        g2.on("click", (event, d) => {
          svg.transition().duration(250).call(zoom.scaleBy, d.delta);
        });
      });

  }, [libs, countries, mode, seen, answered]);

  const handleClick = useCallback((name) => {
    if (mode === "explore") {
      setSeen(s => ({ ...s, [name]: true }));
      setInfo({ name: NAME_ES[name] || name, cap: CAPITALS[name] || "—" });
    } else {
      if (done || quiz.idx >= quiz.queue.length) return;
      const target = quiz.queue[quiz.idx];
      if (name === target) {
        setAnswered(a => ({ ...a, [name]: "correct" }));
        setFeedback({ type:"correct", text:"Correcto!" });
        setQuiz(q => {
          const ni = q.idx + 1;
          if (ni >= q.queue.length) setTimeout(() => setDone(true), 700);
          return { ...q, correct: q.correct+1, idx: ni };
        });
        clearTimeout(fbTimer.current);
        fbTimer.current = setTimeout(() => setFeedback(null), 700);
      } else {
        setAnswered(a => ({ ...a, [name]: "wrong" }));
        setFeedback({ type:"wrong", text:"Ese es " + (NAME_ES[name]||name) });
        setQuiz(q => ({ ...q, wrong: q.wrong+1 }));
        clearTimeout(fbTimer.current);
        fbTimer.current = setTimeout(() => setFeedback(null), 1500);
      }
    }
  }, [mode, done, quiz]);

  const startQuiz = () => {
    const names = countries.map(c => c.properties?.name).filter(n => NAME_ES[n]);
    const q = [...names].sort(() => Math.random()-0.5);
    setQuiz({ queue:q, idx:0, correct:0, wrong:0 });
    setAnswered({});
    setFeedback(null);
    setDone(false);
    transformRef.current = {k:1,x:0,y:0};
  };

  useEffect(() => {
    if (mode === "quiz" && countries.length > 0) startQuiz();
    if (mode === "explore") { setSeen({}); setInfo(null); transformRef.current={k:1,x:0,y:0}; }
  }, [mode, countries]);

  const pct = quiz.queue.length ? Math.round(quiz.idx/quiz.queue.length*100) : 0;
  const target = quiz.queue[quiz.idx];

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0 8px", flexWrap:"wrap", gap:8 }}>
        <div style={{ display:"flex", gap:6 }}>
          {["explore","quiz"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ padding:"6px 16px", borderRadius:8, border:"0.5px solid rgba(0,0,0,0.15)", background:mode===m?"#0a0a0f":"transparent", color:mode===m?"#fff":"#555", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
              {m==="explore"?"Explorar":"Quiz"}
            </button>
          ))}
        </div>
        {mode==="quiz" && !done && (
          <div style={{ fontSize:12, color:"#777", display:"flex", gap:12 }}>
            <span>✓ <b style={{color:"#1D9E75"}}>{quiz.correct}</b></span>
            <span>✗ <b style={{color:"#E24B4A"}}>{quiz.wrong}</b></span>
            <span>Quedan <b>{quiz.queue.length - quiz.idx}</b></span>
          </div>
        )}
      </div>

      <div style={{ border:"0.5px solid rgba(0,0,0,0.1)", borderRadius:12, overflow:"hidden" }}>
        {mode==="quiz" && <div style={{ height:3, background:"#eee" }}><div style={{ height:"100%", width:pct+"%", background:"#1D9E75", transition:"width 0.4s" }} /></div>}
        <div style={{ position:"relative", lineHeight:0 }}>
          <svg ref={svgRef} style={{ display:"block", width:"100%", touchAction:"none" }} />
        </div>

        {mode==="explore" && (
          <div style={{ padding:"10px 14px", borderTop:"0.5px solid rgba(0,0,0,0.08)", minHeight:48, display:"flex", alignItems:"center", background:"#fff" }}>
            {info
              ? <div><div style={{ fontWeight:600, fontSize:15 }}>{info.name}</div><div style={{ fontSize:12, color:"#888", marginTop:2 }}>Capital: {info.cap}</div></div>
              : <div style={{ fontSize:13, color:"#bbb" }}>Toca un país · Pinch o botones +/− para zoom · Arrastra para mover</div>
            }
          </div>
        )}

        {mode==="quiz" && !done && target && (
          <div style={{ padding:"10px 14px", borderTop:"0.5px solid rgba(0,0,0,0.08)", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, minHeight:48, background:"#fff" }}>
            <div style={{ fontSize:14, color:"#555" }}>Encuentra: <span style={{ fontWeight:600, color:"#0a0a0f", fontSize:16 }}>{NAME_ES[target]||target}</span></div>
            {feedback && <div style={{ fontSize:13, padding:"3px 10px", borderRadius:6, background:feedback.type==="correct"?"#E1F5EE":"#FCEBEB", color:feedback.type==="correct"?"#0F6E56":"#A32D2D" }}>{feedback.text}</div>}
          </div>
        )}

        {mode==="quiz" && done && (
          <div style={{ padding:20, textAlign:"center", borderTop:"0.5px solid rgba(0,0,0,0.08)", background:"#fff" }}>
            <div style={{ fontSize:14, color:"#666", marginBottom:12 }}>
              {quiz.correct} correctas · {quiz.wrong} errores · {Math.round(quiz.correct/(quiz.correct+quiz.wrong)*100)}% acierto
            </div>
            <button onClick={startQuiz} style={{ padding:"8px 20px", borderRadius:8, border:"0.5px solid rgba(0,0,0,0.15)", background:"transparent", fontSize:13, cursor:"pointer" }}>Repetir</button>
          </div>
        )}
      </div>
    </div>
  );
}