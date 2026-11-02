import React, { useState } from 'react';
import { X, Sparkles, Key, ExternalLink, Check, ShieldCheck, Cpu } from 'lucide-react';

export interface AiConfig {
  provider: 'gemini' | 'groq';
  apiKey: string;
}

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AiConfig;
  onSaveConfig: (newConfig: AiConfig) => void;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [provider, setProvider] = useState<'gemini' | 'groq'>(config.provider);
  const [apiKey, setApiKey] = useState<string>(config.apiKey);
  const [showKey, setShowKey] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig({
      provider,
      apiKey: apiKey.trim(),
    });
    onClose();
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
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-pink-50 text-sm">Pengaturan AI Proofreader ✨</h3>
              <p className="text-[10px] text-pink-500 dark:text-pink-300/80 font-medium">Revisi EYD, Diksi & Tata Bahasa</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-pink-400 hover:text-pink-600 dark:hover:text-pink-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3 bg-pink-50/80 dark:bg-pink-950/40 border border-pink-200/80 dark:border-pink-900/60 rounded-2xl text-[11px] text-pink-900 dark:text-pink-200 leading-relaxed flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
          <span>
            <b>API Bawaan Aktif:</b> Aplikasi ini sudah terhubung otomatis ke Google Gemini AI. Memasukkan API Key sendiri bersifat <b>opsional</b> jika ingin memakai kuota akun pribadi atau Groq.
          </span>
        </div>

        {/* Provider Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-pink-200">Pilih Model / Provider AI:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setProvider('gemini')}
              className={`p-2.5 rounded-2xl border text-left transition active:scale-95 cursor-pointer ${
                provider === 'gemini'
                  ? 'border-pink-500 bg-pink-50/90 dark:bg-pink-950/60 text-pink-700 dark:text-pink-200 font-bold ring-1 ring-pink-400 shadow-xs'
                  : 'border-pink-100 dark:border-[#38183f] bg-slate-50 dark:bg-[#2b1630] text-slate-600 dark:text-pink-300/70'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs">
                <span>✨</span>
                <span>Google Gemini</span>
              </div>
              <p className="text-[10px] opacity-75 font-normal mt-0.5">Gemini 3.8 Flash (Cepat & Baku)</p>
            </button>

            <button
              type="button"
              onClick={() => setProvider('groq')}
              className={`p-2.5 rounded-2xl border text-left transition active:scale-95 cursor-pointer ${
                provider === 'groq'
                  ? 'border-purple-500 bg-purple-50/90 dark:bg-purple-950/60 text-purple-700 dark:text-purple-200 font-bold ring-1 ring-purple-400 shadow-xs'
                  : 'border-pink-100 dark:border-[#38183f] bg-slate-50 dark:bg-[#2b1630] text-slate-600 dark:text-pink-300/70'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs">
                <span>⚡</span>
                <span>Groq Cloud</span>
              </div>
              <p className="text-[10px] opacity-75 font-normal mt-0.5">Llama 3.3 70B (Ultra Cepat)</p>
            </button>
          </div>
        </div>

        {/* API Key Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-700 dark:text-pink-200 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-pink-400" />
              <span>API Key Pribadi (Opsional):</span>
            </label>
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold hover:underline"
            >
              {showKey ? 'Sembunyikan' : 'Lihat'}
            </button>
          </div>

          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={
              provider === 'gemini' 
                ? 'Kosongkan jika menggunakan sistem bawaan' 
                : 'gsk_... (Masukkan API Key Groq)'
            }
            className="w-full text-xs px-3.5 py-2.5 bg-pink-50/40 dark:bg-[#2b1630] border border-pink-200 dark:border-[#44204c] rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 font-mono text-slate-800 dark:text-pink-100"
          />

          <div className="flex items-center justify-between text-[10px] text-pink-400 pt-0.5">
            <span>Tersimpan aman di memori lokal HP</span>
            <a
              href={provider === 'gemini' ? 'https://aistudio.google.com/app/apikey' : 'https://console.groq.com/keys'}
              target="_blank"
              rel="noreferrer"
              className="text-pink-600 dark:text-pink-400 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>Dapatkan Key Gratis</span>
              <ExternalLink className="w-2.5 h-2.5 inline" />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center gap-2">
          {apiKey && (
            <button
              type="button"
              onClick={() => setApiKey('')}
              className="py-2.5 px-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 font-semibold text-xs active:scale-95 transition"
            >
              Hapus Key
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition shadow-md shadow-pink-500/25 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
