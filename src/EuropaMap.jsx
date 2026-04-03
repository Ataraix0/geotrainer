import { useState, useEffect, useRef } from "react";

const COUNTRIES = [
  {id:"PT",name:"Portugal",cap:"Lisboa",d:"M 148 340 L 155 335 L 158 345 L 162 360 L 158 375 L 152 380 L 145 370 L 143 355 Z"},
  {id:"ES",name:"España",cap:"Madrid",d:"M 155 310 L 200 295 L 250 292 L 265 300 L 268 315 L 255 330 L 240 340 L 220 345 L 195 350 L 170 348 L 158 345 L 155 335 L 148 340 L 143 330 L 148 318 Z"},
  {id:"FR",name:"Francia",cap:"París",d:"M 195 265 L 230 255 L 265 248 L 285 255 L 295 270 L 288 285 L 275 295 L 265 300 L 250 292 L 220 292 L 200 295 L 185 285 L 180 272 Z"},
  {id:"BE",name:"Bélgica",cap:"Bruselas",d:"M 265 235 L 288 230 L 300 240 L 295 255 L 285 255 L 265 248 L 260 240 Z"},
  {id:"NL",name:"Países Bajos",cap:"Ámsterdam",d:"M 278 210 L 298 208 L 308 220 L 305 232 L 300 240 L 288 230 L 278 225 Z"},
  {id:"LU",name:"Luxemburgo",cap:"Luxemburgo",d:"M 285 255 L 295 252 L 298 260 L 292 266 L 285 262 Z"},
  {id:"DE",name:"Alemania",cap:"Berlín",d:"M 300 195 L 340 188 L 368 195 L 375 215 L 370 235 L 355 248 L 335 255 L 310 258 L 298 260 L 295 252 L 300 240 L 308 220 L 305 208 Z"},
  {id:"CH",name:"Suiza",cap:"Berna",d:"M 295 270 L 318 265 L 330 270 L 328 282 L 312 285 L 298 280 Z"},
  {id:"AT",name:"Austria",cap:"Viena",d:"M 330 258 L 365 252 L 385 258 L 392 268 L 380 278 L 355 280 L 335 278 L 328 268 Z"},
  {id:"IT",name:"Italia",cap:"Roma",d:"M 295 290 L 318 285 L 335 278 L 350 285 L 355 305 L 348 330 L 338 355 L 325 375 L 315 390 L 308 380 L 318 360 L 322 340 L 315 318 L 302 305 L 292 295 Z"},
  {id:"DK",name:"Dinamarca",cap:"Copenhague",d:"M 318 165 L 332 160 L 342 170 L 345 182 L 335 188 L 322 185 L 315 175 Z"},
  {id:"NO",name:"Noruega",cap:"Oslo",d:"M 310 80 L 355 65 L 400 60 L 430 70 L 445 90 L 435 115 L 415 130 L 390 140 L 365 145 L 340 148 L 322 155 L 312 148 L 308 130 L 305 108 Z"},
  {id:"SE",name:"Suecia",cap:"Estocolmo",d:"M 340 80 L 380 68 L 405 75 L 418 95 L 415 118 L 402 138 L 375 148 L 348 152 L 335 148 L 340 128 L 345 105 Z"},
  {id:"FI",name:"Finlandia",cap:"Helsinki",d:"M 400 65 L 440 55 L 468 60 L 480 80 L 478 108 L 462 128 L 442 140 L 418 142 L 405 128 L 408 105 L 415 85 Z"},
  {id:"EE",name:"Estonia",cap:"Tallin",d:"M 442 148 L 468 142 L 478 152 L 472 162 L 450 165 L 440 158 Z"},
  {id:"LV",name:"Letonia",cap:"Riga",d:"M 440 162 L 472 158 L 480 168 L 478 180 L 455 185 L 438 178 Z"},
  {id:"LT",name:"Lituania",cap:"Vilna",d:"M 438 178 L 462 178 L 475 188 L 472 200 L 452 205 L 435 198 Z"},
  {id:"PL",name:"Polonia",cap:"Varsovia",d:"M 370 195 L 415 188 L 448 192 L 462 205 L 455 222 L 432 232 L 402 238 L 375 235 L 358 225 L 355 210 Z"},
  {id:"CZ",name:"Chequia",cap:"Praga",d:"M 358 235 L 395 230 L 418 235 L 420 248 L 402 255 L 372 258 L 358 252 Z"},
  {id:"SK",name:"Eslovaquia",cap:"Bratislava",d:"M 392 255 L 428 250 L 445 255 L 442 268 L 420 272 L 395 268 Z"},
  {id:"HU",name:"Hungría",cap:"Budapest",d:"M 390 268 L 428 265 L 452 268 L 455 282 L 438 292 L 408 295 L 388 288 L 382 278 Z"},
  {id:"RO",name:"Rumanía",cap:"Bucarest",d:"M 445 258 L 492 252 L 520 260 L 525 278 L 518 298 L 498 308 L 470 310 L 448 300 L 440 285 L 442 268 Z"},
  {id:"BG",name:"Bulgaria",cap:"Sofía",d:"M 448 308 L 490 305 L 518 308 L 520 325 L 505 335 L 475 338 L 452 328 Z"},
  {id:"SI",name:"Eslovenia",cap:"Liubliana",d:"M 355 278 L 378 275 L 382 285 L 368 290 L 355 285 Z"},
  {id:"HR",name:"Croacia",cap:"Zagreb",d:"M 368 285 L 400 282 L 418 290 L 422 305 L 408 315 L 385 318 L 368 308 L 362 295 Z"},
  {id:"BA",name:"Bosnia y Herz.",cap:"Sarajevo",d:"M 390 310 L 415 308 L 428 318 L 425 332 L 408 338 L 390 330 Z"},
  {id:"RS",name:"Serbia",cap:"Belgrado",d:"M 418 295 L 445 292 L 458 302 L 455 320 L 438 330 L 418 328 L 408 315 L 415 305 Z"},
  {id:"ME",name:"Montenegro",cap:"Podgorica",d:"M 408 332 L 425 328 L 432 338 L 425 346 L 410 344 Z"},
  {id:"AL",name:"Albania",cap:"Tirana",d:"M 408 342 L 425 340 L 430 355 L 422 365 L 408 360 Z"},
  {id:"MK",name:"Macedonia del N.",cap:"Skopie",d:"M 435 328 L 455 325 L 462 338 L 450 348 L 432 345 Z"},
  {id:"GR",name:"Grecia",cap:"Atenas",d:"M 435 345 L 468 338 L 488 348 L 485 368 L 468 378 L 448 375 L 435 362 Z"},
  {id:"XK",name:"Kosovo",cap:"Pristina",d:"M 432 320 L 448 318 L 452 330 L 438 334 Z"},
  {id:"TR",name:"Turquía (Eur.)",cap:"Estambul",d:"M 518 328 L 555 322 L 568 332 L 562 345 L 538 350 L 518 345 Z"},
  {id:"UA",name:"Ucrania",cap:"Kiev",d:"M 462 200 L 520 192 L 558 198 L 572 215 L 565 238 L 540 252 L 510 258 L 478 255 L 455 242 L 452 222 Z"},
  {id:"MD",name:"Moldavia",cap:"Chisináu",d:"M 520 255 L 538 250 L 545 262 L 535 272 L 520 268 Z"},
  {id:"BY",name:"Bielorrusia",cap:"Minsk",d:"M 462 192 L 510 185 L 535 192 L 538 210 L 522 225 L 495 230 L 465 225 Z"},
  {id:"RU",name:"Rusia (Eur.)",cap:"Moscú",d:"M 510 100 L 580 85 L 640 92 L 660 115 L 648 148 L 620 165 L 585 175 L 550 178 L 520 172 L 498 158 L 490 135 L 498 112 Z"},
  {id:"GB",name:"Reino Unido",cap:"Londres",d:"M 215 185 L 242 175 L 260 182 L 258 200 L 245 212 L 228 218 L 212 210 L 208 196 Z"},
  {id:"IE",name:"Irlanda",cap:"Dublín",d:"M 188 185 L 208 178 L 215 190 L 210 205 L 195 210 L 182 200 Z"},
  {id:"IS",name:"Islandia",cap:"Reikiavik",d:"M 95 75 L 135 68 L 150 78 L 148 92 L 128 100 L 100 98 L 88 86 Z"},
  {id:"MT",name:"Malta",cap:"La Valeta",d:"M 332 415 L 340 412 L 342 420 L 335 422 Z"},
  {id:"CY",name:"Chipre",cap:"Nicosia",d:"M 575 388 L 598 382 L 608 390 L 600 400 L 578 398 Z"},
  {id:"AD",name:"Andorra",cap:"Andorra la Vella",d:"M 232 295 L 240 292 L 242 300 L 235 302 Z"},
  {id:"MC",name:"Mónaco",cap:"Mónaco",d:"M 284 290 L 290 288 L 291 294 L 285 294 Z"},
  {id:"LI",name:"Liechtenstein",cap:"Vaduz",d:"M 318 268 L 324 265 L 325 272 L 319 274 Z"},
];

const COLOR = { default:"#B5D4F4", hover:"#378ADD", correct:"#5DCAA5", wrong:"#F09595", seen:"#9FE1CB", target:"#EF9F27" };

export default function EuropaMap() {
  const [mode, setMode] = useState("explore");
  const [info, setInfo] = useState(null);
  const [seen, setSeen] = useState({});
  const [quiz, setQuiz] = useState({ queue:[], idx:0, correct:0, wrong:0 });
  const [answered, setAnswered] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const fbTimer = useRef(null);

  const startQuiz = () => {
    const q = [...COUNTRIES].sort(() => Math.random()-0.5);
    setQuiz({ queue:q, idx:0, correct:0, wrong:0 });
    setAnswered({});
    setFeedback(null);
    setDone(false);
  };

  useEffect(() => { if (mode === "quiz") startQuiz(); }, [mode]);

  const handleClick = (c) => {
    if (mode === "explore") {
      setSeen(s => ({ ...s, [c.id]: true }));
      setInfo(c);
    } else {
      if (done || quiz.idx >= quiz.queue.length) return;
      const target = quiz.queue[quiz.idx];
      if (c.id === target.id) {
        setAnswered(a => ({ ...a, [c.id]: "correct" }));
        setFeedback({ type:"correct", text:"Correcto!" });
        const newQ = { ...quiz, correct: quiz.correct+1, idx: quiz.idx+1 };
        setQuiz(newQ);
        if (newQ.idx >= newQ.queue.length) { setTimeout(() => setDone(true), 600); }
        fbTimer.current = setTimeout(() => setFeedback(null), 700);
      } else {
        setAnswered(a => ({ ...a, [c.id]: "wrong" }));
        setFeedback({ type:"wrong", text:"Ese es " + c.name });
        setQuiz(q => ({ ...q, wrong: q.wrong+1 }));
        fbTimer.current = setTimeout(() => setFeedback(null), 1200);
      }
    }
  };

  const getColor = (c) => {
    if (mode === "explore") return seen[c.id] ? COLOR.seen : COLOR.default;
    if (answered[c.id] === "correct") return COLOR.correct;
    if (answered[c.id] === "wrong") return COLOR.wrong;
    if (!done && quiz.queue[quiz.idx]?.id === c.id) return COLOR.default;
    return COLOR.default;
  };

  const pct = quiz.queue.length ? Math.round(quiz.idx / quiz.queue.length * 100) : 0;
  const target = quiz.queue[quiz.idx];

  return (
    <div style={{ fontFamily:"Georgia,serif", paddingBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0 10px", flexWrap:"wrap", gap:8 }}>
        <div style={{ display:"flex", gap:6 }}>
          {["explore","quiz"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ padding:"6px 16px", borderRadius:8, border:"0.5px solid rgba(0,0,0,0.15)", background: mode===m ? "#0a0a0f" : "transparent", color: mode===m ? "#fff" : "#666", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
              {m === "explore" ? "Explorar" : "Quiz"}
            </button>
          ))}
        </div>
        {mode === "quiz" && !done && (
          <div style={{ fontSize:12, color:"#888", display:"flex", gap:14 }}>
            <span>Correctas: <b style={{color:"#1D9E75"}}>{quiz.correct}</b></span>
            <span>Errores: <b style={{color:"#E24B4A"}}>{quiz.wrong}</b></span>
            <span>Restantes: <b>{quiz.queue.length - quiz.idx}</b></span>
          </div>
        )}
      </div>

      <div style={{ border:"0.5px solid rgba(0,0,0,0.12)", borderRadius:12, overflow:"hidden", background:"#f0f4f8" }}>
        {mode === "quiz" && (
          <div style={{ height:3, background:"rgba(0,0,0,0.08)" }}>
            <div style={{ height:"100%", width:pct+"%", background:"#1D9E75", transition:"width 0.4s" }} />
          </div>
        )}
        <svg viewBox="0 0 860 620" style={{ display:"block", width:"100%", height:"auto" }}>
          {COUNTRIES.map(c => (
            <path key={c.id} d={c.d} fill={getColor(c)} stroke="#fff" strokeWidth="0.8"
              style={{ cursor:"pointer", transition:"fill 0.15s" }}
              onClick={() => handleClick(c)}
              onMouseEnter={e => { if(mode==="explore") e.target.style.fill=COLOR.hover; }}
              onMouseLeave={e => { if(mode==="explore") e.target.style.fill=getColor(c); }}
            />
          ))}
        </svg>

        {mode === "explore" && (
          <div style={{ padding:"10px 14px", borderTop:"0.5px solid rgba(0,0,0,0.08)", minHeight:50, display:"flex", alignItems:"center" }}>
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

        {mode === "quiz" && !done && target && (
          <div style={{ padding:"10px 14px", borderTop:"0.5px solid rgba(0,0,0,0.08)", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, minHeight:50 }}>
            <div style={{ fontSize:14, color:"#666" }}>Encuentra: <span style={{ fontWeight:600, color:"#0a0a0f", fontSize:16 }}>{target.name}</span></div>
            {feedback && (
              <div style={{ fontSize:13, padding:"3px 10px", borderRadius:6, background: feedback.type==="correct" ? "#E1F5EE" : "#FCEBEB", color: feedback.type==="correct" ? "#0F6E56" : "#A32D2D" }}>
                {feedback.text}
              </div>
            )}
          </div>
        )}

        {mode === "quiz" && done && (
          <div style={{ padding:20, borderTop:"0.5px solid rgba(0,0,0,0.08)", textAlign:"center" }}>
            <div style={{ fontSize:14, color:"#666", marginBottom:12 }}>
              Completado — {quiz.correct} correctas · {quiz.wrong} errores · {Math.round(quiz.correct/(quiz.correct+quiz.wrong)*100)}% acierto
            </div>
            <button onClick={startQuiz} style={{ padding:"8px 20px", borderRadius:8, border:"0.5px solid rgba(0,0,0,0.15)", background:"transparent", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
              Repetir quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}