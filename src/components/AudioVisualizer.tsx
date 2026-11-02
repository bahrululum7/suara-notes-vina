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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!isRecording) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array | null = null;
    let bufferLength = 24;

    if (stream) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;

        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
      } catch (err) {
        console.warn('AudioContext stream connection warning:', err);
      }
    }

    let phase = 0;

    const render = () => {
      animationRef.current = requestAnimationFrame(render);
      phase += 0.08;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
      }

      const numBars = bufferLength || 24;
      const barWidth = (canvas.width / numBars) * 1.5;
      let x = 0;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 6;
        if (analyser && dataArray && dataArray[i] > 0) {
          barHeight = Math.max(6, (dataArray[i] / 255) * canvas.height * 0.9);
        } else {
          // Dynamic simulated wave for mobile when stream is separate
          const wave = Math.sin(phase + i * 0.35) * Math.cos(phase * 0.7 + i * 0.2);
          const normalized = (wave + 1) / 2; // 0 to 1
          barHeight = 6 + normalized * (canvas.height * 0.7);
        }

        const gradient = ctx.createLinearGradient(0, (canvas.height - barHeight) / 2, 0, (canvas.height + barHeight) / 2);
        if (isDark) {
          gradient.addColorStop(0, '#f472b6');
          gradient.addColorStop(0.5, '#f43f5e');
          gradient.addColorStop(1, '#c084fc');
        } else {
          gradient.addColorStop(0, '#fb7185');
          gradient.addColorStop(0.5, '#f472b6');
          gradient.addColorStop(1, '#a855f7');
        }

        ctx.fillStyle = gradient;
        const y = (canvas.height - barHeight) / 2;

        ctx.beginPath();
        ctx.roundRect(x, y, Math.max(2, barWidth - 3), barHeight, 3);
        ctx.fill();

        x += barWidth;
      }
    };

    render();

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
