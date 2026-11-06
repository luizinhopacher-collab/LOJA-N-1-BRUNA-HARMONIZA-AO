'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

export function HeroMedia() {
  const player = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 768px)');
    const large = matchMedia('(min-width: 1920px)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => {
      setSource(!reduced.matches && desktop.matches && !connection?.saveData
        ? `/videos/bruna-hero-${large.matches ? '4k' : 'hd'}.mp4` : null);
    };
    update();
    [reduced, desktop, large].forEach(query => query.addEventListener('change', update));
    return () => [reduced, desktop, large].forEach(query => query.removeEventListener('change', update));
  }, []);

  async function togglePlayback() {
    const video = player.current;
    if (!video) return;
    if (!video.paused) video.pause();
    else {
      try { await video.play(); } catch { setFailed(true); }
    }
  }

  return <>
    <Image className="hero-background" src="/images/hero-poster.webp" alt="" fill priority sizes="100vw"/>
    {source && !failed && <>
      <video key={source} ref={player} className="hero-video" src={source}
        autoPlay muted loop playsInline preload="metadata" poster="/images/hero-poster.webp"
        aria-hidden="true" onError={() => setFailed(true)}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
      <button className="video-toggle glass" type="button" onClick={togglePlayback}
        aria-label={playing ? 'Pausar vídeo de fundo' : 'Reproduzir vídeo de fundo'}>
        {playing ? <Pause size={14}/> : <Play size={14}/>}<span>{playing ? 'PAUSAR VÍDEO' : 'REPRODUZIR VÍDEO'}</span>
      </button>
    </>}
  </>;
}
