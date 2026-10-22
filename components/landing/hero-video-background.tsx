"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * HeroVideoBackground
 *
 * Implementa mecânica de background com fallback otimizado:
 * - Imagem estática (.webp) exibida instantaneamente para evitar CLS.
 * - Vídeo (.mp4) com autoplay em loop inline e mudo.
 * - Assim que o vídeo começa a rodar, a imagem estática é ocultada imediatamente,
 *   sem cross-fade ou sobreposição de transparências.
 * - Fallback resiliente em caso de erro e suporte a prefers-reduced-motion.
 */
export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Detecta se usuário prefere redução de movimento
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    if (!video.paused) {
      setIsPlaying(true);
    }

    const handlePlaying = () => setIsPlaying(true);
    const handleError = () => {
      setHasError(true);
      setIsPlaying(false);
    };

    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }

    return () => {
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <div
      className="absolute inset-x-0 top-0 h-[950px] sm:h-[1100px] lg:h-[1200px] overflow-hidden pointer-events-none -z-10"
      aria-hidden="true"
    >
      {/* 1. Imagem de Fallback: visível inicialmente; some imediatamente quando o vídeo toca */}
      <div
        className={`absolute inset-0 ${
          isPlaying ? "opacity-0 motion-reduce:opacity-100" : "opacity-100"
        }`}
      >
        <Image
          src="/images/background.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-55"
        />
      </div>

      {/* 2. Vídeo de Background: toca sozinho e substitui a imagem sem sobreposição */}
      {!hasError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/background.webp"
          onPlaying={() => setIsPlaying(true)}
          onError={() => {
            setHasError(true);
            setIsPlaying(false);
          }}
          className={`absolute inset-0 w-full h-full object-cover object-top motion-reduce:hidden ${
            isPlaying ? "opacity-55" : "opacity-0"
          }`}
        >
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>
      )}

      {/* 3. Camada de Integração: Vignette e Fade vertical suave para o canvas escuro (#09090b) */}
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/40 via-transparent to-canvas" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,rgba(9,9,11,0.85)_100%)]" />
    </div>
  );
}
