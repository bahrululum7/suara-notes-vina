import React from 'react';
import { X, Sliders, Clock, Sparkles, Check, RotateCcw } from 'lucide-react';
import { SMART_PAUSE_PRESETS, SmartPauseConfig, DEFAULT_SMART_PAUSE_CONFIG } from '../utils/textFormatter';

interface SmartPauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SmartPauseConfig;
  onChangeConfig: (newConfig: SmartPauseConfig) => void;
}

export const SmartPauseModal: React.FC<SmartPauseModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
}) => {
  if (!isOpen) return null;

  const handlePresetSelect = (short: number, long: number) => {
    onChangeConfig({
      ...config,
      shortPauseMs: short,
      longPauseMs: long,
    });
  };

  const handleResetDefault = () => {
    onChangeConfig(DEFAULT_SMART_PAUSE_CONFIG);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#201024] rounded-3xl p-5 max-w-sm w-full space-y-4 border border-pink-200/80 dark:border-[#44204c] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-pink-100 dark:border-[#38183f]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-pink-50 text-sm">Smart Pause Punctuation ⏱️</h3>
              <p className="text-[10px] text-pink-500 dark:text-pink-300/80 font-medium">Deteksi Jeda Bicara Otomatis</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-pink-400 hover:text-pink-600 dark:hover:text-pink-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle On/Off */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-pink-50/70 dark:bg-[#2b1630] border border-pink-200/70 dark:border-[#44204c]">
          <div>
            <p className="font-bold text-xs text-slate-800 dark:text-pink-100">Aktifkan Smart Pause</p>
            <p className="text-[10px] text-pink-500 dark:text-pink-300/70">Koma saat jeda pendek, titik saat jeda panjang</p>
          </div>
          <button
            onClick={() => onChangeConfig({ ...config, enabled: !config.enabled })}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
              config.enabled ? 'bg-pink-500' : 'bg-slate-300 dark:bg-[#3d2044]'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                config.enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Presets */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 dark:text-pink-200">Pilihan Kepekaan:</label>
          <div className="grid grid-cols-3 gap-1.5">
            {SMART_PAUSE_PRESETS.map((p) => {
              const isSelected = config.shortPauseMs === p.short && config.longPauseMs === p.long;
              return (
                <button
                  key={p.name}
                  onClick={() => handlePresetSelect(p.short, p.long)}
                  className={`py-2 px-1 rounded-2xl text-center text-xs font-semibold transition active:scale-95 border ${
                    isSelected
                      ? 'bg-pink-500 text-white border-pink-500 shadow-sm shadow-pink-400/30'
                      : 'bg-pink-50/50 dark:bg-[#2b1630] text-slate-700 dark:text-pink-200 border-pink-100 dark:border-[#3d2044] hover:bg-pink-100/60'
                  }`}
                >
                  <p className="leading-tight font-bold">{p.name}</p>
                  <p className="text-[9px] opacity-80 mt-0.5">{(p.short / 1000).toFixed(1)}s / {(p.long / 1000).toFixed(1)}s</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders for Fine-Tuning */}
        <div className="space-y-3 pt-1">
          {/* Slider 1: Short Pause (Koma) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-pink-200 flex items-center gap-1">
                <span className="font-bold text-pink-600 dark:text-pink-400">,</span> Jeda Koma:
              </span>
              <span className="font-mono font-bold text-pink-600 dark:text-pink-400">
                {(config.shortPauseMs / 1000).toFixed(1)} detik
              </span>
            </div>
            <input
              type="range"
              min="600"
              max="1200"
              step="50"
              value={config.shortPauseMs}
              onChange={(e) => onChangeConfig({ ...config, shortPauseMs: Number(e.target.value) })}
              className="w-full h-1.5 bg-pink-100 dark:bg-[#3d2044] rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between text-[9px] text-pink-400">
              <span>0.6s (Cepat)</span>
              <span>0.8s (Default)</span>
              <span>1.2s (Maks)</span>
            </div>
          </div>

          {/* Slider 2: Long Pause (Titik) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-pink-200 flex items-center gap-1">
                <span className="font-bold text-purple-600 dark:text-purple-400">.</span> Jeda Titik:
              </span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                {(config.longPauseMs / 1000).toFixed(1)} detik
              </span>
            </div>
            <input
              type="range"
              min="1800"
              max="4000"
              step="100"
              value={config.longPauseMs}
              onChange={(e) => onChangeConfig({ ...config, longPauseMs: Number(e.target.value) })}
              className="w-full h-1.5 bg-pink-100 dark:bg-[#3d2044] rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[9px] text-pink-400">
              <span>1.8s (Cepat)</span>
              <span>2.5s (Default)</span>
              <span>4.0s (Santai)</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={handleResetDefault}
            className="py-2.5 px-3 rounded-2xl bg-pink-50 dark:bg-[#2b1630] hover:bg-pink-100 dark:hover:bg-[#361c3d] text-pink-700 dark:text-pink-300 font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition"
            title="Kembalikan ke Nilai Awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition shadow-md shadow-pink-500/25 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Simpan & Tutup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
