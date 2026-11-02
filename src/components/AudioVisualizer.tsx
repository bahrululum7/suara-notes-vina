import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isRecording: boolean;
  stream: MediaStream | null;
  isDark: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isRecording, stream, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!isRecording || !stream) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const render = () => {
        animationRef.current = requestAnimationFrame(render);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.6;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const val = dataArray[i];
          const barHeight = Math.max(4, (val / 255) * canvas.height * 0.88);
          
          // Gradient bar: pastel pink, rose & lavender
          const gradient = ctx.createLinearGradient(0, (canvas.height - barHeight) / 2, 0, (canvas.height + barHeight) / 2);
          if (isDark) {
            gradient.addColorStop(0, '#f472b6'); // pastel pink
            gradient.addColorStop(0.5, '#f43f5e'); // rose
            gradient.addColorStop(1, '#c084fc'); // lavender
          } else {
            gradient.addColorStop(0, '#fb7185'); // pastel rose
            gradient.addColorStop(0.5, '#f472b6'); // pastel pink
            gradient.addColorStop(1, '#a855f7'); // soft violet
          }

          ctx.fillStyle = gradient;
          const y = (canvas.height - barHeight) / 2;
          
          // Draw rounded bars
          ctx.beginPath();
          ctx.roundRect(x, y, Math.max(2, barWidth - 3), barHeight, 3);
          ctx.fill();

          x += barWidth;
        }
      };

      render();
    } catch (err) {
      console.warn('AudioVisualizer initialization error:', err);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isRecording, stream, isDark]);

  return (
    <div className="relative w-full h-14 rounded-2xl bg-white/80 dark:bg-[#251428]/80 border border-pink-200/70 dark:border-[#4d2554] flex items-center justify-center overflow-hidden transition-colors shadow-inner">
      <canvas
        ref={canvasRef}
        width={380}
        height={56}
        className="w-full h-full object-contain"
      />
      {!isRecording && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-pink-400 dark:text-pink-300/70 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-300 dark:bg-pink-500/60 animate-pulse"></span>
            Siap mendeteksi gelombang suaramu 🎵
          </span>
        </div>
      )}
    </div>
  );
};
