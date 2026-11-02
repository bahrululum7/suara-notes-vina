import React, { useState } from 'react';
import { X, Copy, Download, Check, FileCode, CheckCircle2 } from 'lucide-react';
import { STANDALONE_HTML_CODE } from '../utils/singleFileHtml';

interface SingleFileExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SingleFileExportModal: React.FC<SingleFileExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(STANDALONE_HTML_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([STANDALONE_HTML_CODE], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'suaranote-single-file.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#201024] rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col border border-pink-200/80 dark:border-[#44204c] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-pink-100 dark:border-[#38183f] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center shadow-xs">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-pink-50 text-sm">Single File HTML Mandiri 📄</h3>
              <p className="text-[11px] text-pink-500 dark:text-pink-300/80 font-medium">100% Mandiri (HTML + Tailwind CDN + JS)</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full text-pink-400 hover:text-pink-600 dark:hover:text-pink-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-600 dark:text-pink-200/80">
          <div className="bg-pink-50/80 dark:bg-pink-950/40 p-3.5 rounded-2xl border border-pink-200/80 dark:border-pink-900/60 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
            <p className="text-pink-900 dark:text-pink-200 leading-relaxed text-[11px]">
              File ini menggabungkan semua kode (HTML, CSS Tailwind CDN, SVG Icons, tema pastel pink lucu, dan Web Speech JS) dalam <b>1 file tunggal</b>. Anda bisa langsung menyalin atau mengunduhnya dan membukanya di browser HP mana pun tanpa instalasi (Zero Install).
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-pink-500 dark:text-pink-400">
              <span>Preview Kode (suaranote-single-file.html)</span>
              <span>~{Math.round(STANDALONE_HTML_CODE.length / 1024)} KB</span>
            </div>
            <pre className="p-3 bg-[#150a17] text-pink-100 rounded-2xl text-[10px] font-mono overflow-x-auto max-h-56 leading-relaxed border border-[#3d1d44] selection:bg-pink-500">
              <code>{STANDALONE_HTML_CODE.slice(0, 1500)}...</code>
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-pink-100 dark:border-[#38183f] bg-pink-50/40 dark:bg-[#1a0c1e] grid grid-cols-2 gap-2.5">
          <button
            onClick={handleCopyCode}
            className="py-3 px-3 rounded-2xl bg-white dark:bg-[#2b1630] border border-pink-200 dark:border-[#42204a] hover:bg-pink-50 text-pink-700 dark:text-pink-200 font-bold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="py-3 px-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition shadow-md shadow-pink-500/25 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .html</span>
          </button>
        </div>
      </div>
    </div>
  );
};
