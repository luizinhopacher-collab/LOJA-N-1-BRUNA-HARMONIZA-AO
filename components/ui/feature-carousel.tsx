'use client';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { Button } from './button';
const slides = [
 { number:'01',title:'Tempo para ouvir.',text:'Uma conversa sobre você, suas expectativas e o que faz sentido para o seu cuidado.' },
 { number:'02',title:'Um olhar individual.',text:'Cada pessoa tem sua história. A avaliação é o ponto de partida para conversar sobre as possibilidades.' },
 { number:'03',title:'Clareza em cada etapa.',text:'Espaço para perguntas e decisões conscientes, respeitando a sua individualidade.' },
];
export function FeatureCarousel(){
 const [active,setActive]=useState(0); const [paused,setPaused]=useState(false); const [focused,setFocused]=useState(false); const [reduced,setReduced]=useState(true);
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(m.matches);update();m.addEventListener('change',update);return()=>m.removeEventListener('change',update)},[]);
 useEffect(()=>{if(paused||focused||reduced)return;const id=setInterval(()=>setActive(x=>(x+1)%slides.length),4000);return()=>clearInterval(id)},[paused,focused,reduced]);
 return <div className="carousel" role="region" aria-roledescription="carrossel" aria-label="Etapas do cuidado" onMouseEnter={()=>setFocused(true)} onMouseLeave={()=>setFocused(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false)}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();setActive(x=>(x+1)%3)}if(e.key==='ArrowLeft'){e.preventDefault();setActive(x=>(x+2)%3)}}}>
 <div className="slide-stage">{slides.map((s,i)=><article key={s.number} className={`experience-slide ${i===active?'active':''}`} aria-hidden={i!==active}><span className="slide-number">{s.number} / 03</span><div className={`slide-art art-${i}`} aria-hidden="true"><span/><span/><span/></div><div className="slide-copy"><p className="eyebrow">A EXPERIÊNCIA DO CUIDADO</p><h3>{s.title}</h3><p>{s.text}</p></div></article>)}</div>
 <div className="carousel-controls"><span aria-live={paused||focused||reduced?'polite':'off'}>{String(active+1).padStart(2,'0')} <span className="muted">/ 03</span></span><div className="progress-dots">{slides.map((s,i)=><button key={s.number} aria-label={`Ir para etapa ${i+1}`} aria-current={i===active?'true':undefined} onClick={()=>setActive(i)} className={i===active?'selected':''}/>)}</div><div className="control-buttons"><Button aria-label={paused?'Reproduzir carrossel':'Pausar carrossel'} onClick={()=>setPaused(!paused)}>{paused?<Play size={16}/>:<Pause size={16}/>}</Button><Button aria-label="Etapa anterior" onClick={()=>setActive(x=>(x+2)%3)}><ArrowLeft size={18}/></Button><Button aria-label="Próxima etapa" onClick={()=>setActive(x=>(x+1)%3)}><ArrowRight size={18}/></Button></div></div></div>
}
