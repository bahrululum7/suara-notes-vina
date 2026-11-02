import React, { useState } from 'react';
import { VoiceNote } from '../types';
import { Copy, Trash2, Edit3, Check, Volume2, Share2, Calendar, FileText } from 'lucide-react';

interface NoteCardProps {
  note: VoiceNote;
  onCopy: (text: string) => void;
  onEdit: (note: VoiceNote) => void;
  onDelete: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onCopy, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(note.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: note.content,
        });
      } catch {
        // user cancelled share
      }
    } else {
      handleCopy();
    }
  };

  const formattedDate = new Date(note.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white/95 dark:bg-[#251528] border border-pink-100 dark:border-[#422448] rounded-3xl p-4 shadow-sm hover:border-pink-300 dark:hover:border-pink-500/50 hover:shadow-md hover:shadow-pink-100/50 dark:hover:shadow-pink-950/30 transition-all space-y-2.5 group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5 mb-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200/60 dark:border-pink-800/50">
              {note.tag || 'Ide 💡'}
            </span>
            <span className="text-[10px] text-pink-400 dark:text-pink-400/60 font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3 inline" />
              {formattedDate}
            </span>
          </div>
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-pink-50 truncate leading-snug">
            {note.title || 'Catatan Cantik ✨'}
          </h3>
        </div>

        {/* Action icons with generous touch targets */}
        <div className="flex items-center space-x-0.5 shrink-0">
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl text-slate-400 hover:text-pink-600 dark:hover:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950/50 transition active:scale-90"
            title="Salin Teks"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => onEdit(note)}
            className="p-2 rounded-xl text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition active:scale-90"
            title="Edit di Editor"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition active:scale-90"
            title="Bagikan"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition active:scale-90 cursor-pointer"
            title="Hapus Catatan"
            aria-label="Hapus Catatan"
          >
            <Trash2 className="w-4 h-4 pointer-events-none text-rose-500/80 group-hover:text-rose-500" />
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-pink-200/80 line-clamp-3 leading-relaxed whitespace-pre-line font-normal">
        {note.content}
      </p>

      {note.audioDataUrl && (
        <div className="pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-pink-600 dark:text-pink-300 mb-1">
            <Volume2 className="w-3.5 h-3.5 text-pink-500" />
            <span>Rekaman Suara:</span>
          </div>
          <audio controls src={note.audioDataUrl} className="w-full h-8 rounded-xl" />
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-pink-400/80 dark:text-pink-400/60 pt-1.5 border-t border-pink-100 dark:border-[#3a1d40]">
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          {note.wordCount || 0} kata
        </span>
        {note.durationSeconds > 0 && (
          <span>Durasi: {Math.floor(note.durationSeconds / 60)}m {note.durationSeconds % 60}s</span>
        )}
      </div>
    </div>
  );
};
