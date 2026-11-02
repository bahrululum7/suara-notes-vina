import React from 'react';
import { X, Smartphone, CheckCircle, Share2, MoreVertical, PlusSquare } from 'lucide-react';

interface PwaInstallGuideProps {
  isOpen: boolean;
  onClose: () => void;
  canPromptInstall?: boolean;
  onInstallClick?: () => void;
}

export const PwaInstallGuide: React.FC<PwaInstallGuideProps> = ({
  isOpen,
  onClose,
  canPromptInstall,
  onInstallClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#201024] rounded-3xl p-5 max-w-sm w-full space-y-4 border border-pink-200/80 dark:border-[#44204c] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-pink-100 dark:border-[#38183f]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center shadow-xs">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-pink-50 text-sm">Tambahkan ke Layar HP 📲</h3>
              <p className="text-[11px] text-pink-500 dark:text-pink-300/80 font-medium">Jadikan aplikasi native tanpa URL bar</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-pink-400 hover:text-pink-600 dark:hover:text-pink-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {canPromptInstall && onInstallClick && (
          <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl text-white flex items-center justify-between shadow-md shadow-pink-500/20">
            <div>
              <p className="font-bold text-xs">Instal Langsung</p>
              <p className="text-[11px] text-pink-100">Dukungan otomatis browser aktif</p>
            </div>
            <button 
              onClick={onInstallClick}
              className="px-3 py-1.5 bg-white text-pink-600 font-bold text-xs rounded-xl hover:bg-pink-50 active:scale-95 transition shadow"
            >
              Pasang Sekarang
            </button>
          </div>
        )}

        <div className="space-y-3 text-xs text-slate-600 dark:text-pink-200/80">
          {/* Chrome Android */}
          <div className="bg-pink-50/70 dark:bg-[#2b1630] p-3.5 rounded-2xl border border-pink-200/60 dark:border-[#44204c] space-y-2">
            <div className="flex items-center space-x-2 text-pink-700 dark:text-pink-300 font-bold">
              <span>🤖</span>
              <span>Google Chrome di Android:</span>
            </div>
            <ol className="space-y-1.5 text-slate-700 dark:text-pink-200/90 pl-1">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-200 dark:bg-pink-900/70 text-pink-800 dark:text-pink-200 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <span>Ketuk ikon menu titik tiga <MoreVertical className="w-3.5 h-3.5 inline text-pink-500" /> di kanan atas.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-200 dark:bg-pink-900/70 text-pink-800 dark:text-pink-200 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <span>Pilih <b>"Tambahkan ke Layar Utama"</b> atau <i>"Instal Aplikasi"</i>.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-200 dark:bg-pink-900/70 text-pink-800 dark:text-pink-200 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <span>Ketuk tombol <b>"Tambah"</b> untuk selesai.</span>
              </li>
            </ol>
          </div>

          {/* Safari iOS */}
          <div className="bg-purple-50/50 dark:bg-[#28142c] p-3.5 rounded-2xl border border-purple-200/60 dark:border-[#421f48] space-y-2">
            <div className="flex items-center space-x-2 text-purple-800 dark:text-purple-300 font-bold">
              <span>🍎</span>
              <span>Safari di iPhone / iPad:</span>
            </div>
            <ol className="space-y-1.5 text-slate-700 dark:text-pink-200/90 pl-1">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-200 dark:bg-purple-900/70 text-purple-800 dark:text-purple-200 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <span>Ketuk tombol <b>Share</b> <Share2 className="w-3.5 h-3.5 inline text-purple-500" /> di bilah bawah.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-200 dark:bg-purple-900/70 text-purple-800 dark:text-purple-200 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <span>Pilih <b>"Add to Home Screen"</b> <PlusSquare className="w-3.5 h-3.5 inline text-purple-500" />.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-200 dark:bg-purple-900/70 text-purple-800 dark:text-purple-200 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <span>Ketuk <b>"Add"</b> di sudut kanan atas.</span>
              </li>
            </ol>
          </div>

          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Aplikasi akan terbuka layar penuh tanpa address bar, cepat dan hemat kuota!</span>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs active:scale-95 transition shadow-md shadow-pink-500/25 cursor-pointer"
        >
          Tutup Panduan
        </button>
      </div>
    </div>
  );
};
