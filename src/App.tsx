/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Upload,
  Copy,
  Check,
  Save,
  Trash2,
  Moon,
  Sun,
  Smartphone,
  Maximize2,
  Minimize2,
  Search,
  Download,
  Share2,
  FileCode,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Info,
  CheckCircle2,
  Sliders,
  Clock,
  Loader2
} from 'lucide-react';
import { VoiceNote, SUPPORTED_LANGUAGES, NOTE_TAGS } from './types';
import {
  formatTranscript,
  formatSpeechChunk,
  applyShortPauseComma,
  applyLongPausePeriod,
  SmartPauseConfig,
  DEFAULT_SMART_PAUSE_CONFIG
} from './utils/textFormatter';
import { AudioVisualizer } from './components/AudioVisualizer';
import { NoteCard } from './components/NoteCard';
import { PwaInstallGuide } from './components/PwaInstallGuide';
import { SingleFileExportModal } from './components/SingleFileExportModal';
import { SmartPauseModal } from './components/SmartPauseModal';
import { AiSettingsModal, AiConfig } from './components/AiSettingsModal';

const STORAGE_KEY = 'suaranote_records_v1';
const THEME_KEY = 'suaranote_theme';
const PWA_BANNER_DISMISSED_KEY = 'suaranote_pwa_banner_dismissed';

// Extended SpeechRecognition interface for TypeScript
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Mobile frame simulator on desktop
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Speech Recognition & Recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [selectedLang, setSelectedLang] = useState<string>('id-ID');
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [interimText, setInterimText] = useState<string>('');
  
  // Audio stream and recorder
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  // Uploaded audio state
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);
  const [uploadedAudioName, setUploadedAudioName] = useState<string>('');
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Note Editor state
  const [title, setTitle] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('Ide');
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('Semua');

  // Modals and UI notifications
  const [showPwaBanner, setShowPwaBanner] = useState<boolean>(true);
  const [showPwaModal, setShowPwaModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showSmartPauseModal, setShowSmartPauseModal] = useState<boolean>(false);
  const [showAiSettingsModal, setShowAiSettingsModal] = useState<boolean>(false);
  const [isProofreading, setIsProofreading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIcon, setToastIcon] = useState<string>('✅');

  // AI Proofreader Configuration
  const [aiConfig, setAiConfig] = useState<AiConfig>(() => {
    try {
      const saved = localStorage.getItem('suaranote_ai_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { provider: 'gemini', apiKey: '' };
  });

  const handleUpdateAiConfig = (newConfig: AiConfig) => {
    setAiConfig(newConfig);
    localStorage.setItem('suaranote_ai_config', JSON.stringify(newConfig));
    triggerToast('Pengaturan AI & API Key disimpan! ⚙️', '🤖');
  };

  // Smart Pause Punctuation Configuration (Default: 800ms / 0.8s koma, 2500ms / 2.5s titik)
  const [smartPauseConfig, setSmartPauseConfig] = useState<SmartPauseConfig>(() => {
    try {
      const saved = localStorage.getItem('suaranote_pause_config_v3');
      if (saved) return JSON.parse(saved);
      const old = localStorage.getItem('suaranote_pause_config');
      if (old) {
        const parsed = JSON.parse(old);
        return {
          enabled: parsed.enabled ?? true,
          shortPauseMs: parsed.shortPauseMs === 1200 ? 800 : Math.min(1200, Math.max(600, parsed.shortPauseMs || 800)),
          longPauseMs: parsed.longPauseMs === 2600 ? 2500 : (parsed.longPauseMs || 2500),
        };
      }
    } catch {}
    return DEFAULT_SMART_PAUSE_CONFIG;
  });

  // Native PWA install prompt event
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Undo state for cleared text
  const [undoData, setUndoData] = useState<{ transcript: string; title: string } | null>(null);

  // Delete Confirmation Modal and Undo Deleted Note State
  const [noteToDelete, setNoteToDelete] = useState<VoiceNote | null>(null);
  const [deletedNoteBackup, setDeletedNoteBackup] = useState<{ note: VoiceNote; index: number } | null>(null);

  // Refs for Speech Recognition Mobile Lifecycle & Smart Pause Timers
  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef<boolean>(false);
  const isManualStopRef = useRef<boolean>(false);
  const restartTimeoutRef = useRef<any>(null);
  const interimTextRef = useRef<string>('');
  const timerIntervalRef = useRef<any>(null);
  const shortPauseTimerRef = useRef<any>(null);
  const longPauseTimerRef = useRef<any>(null);
  const shouldCapitalizeNextRef = useRef<boolean>(true);
  const transcriptRef = useRef<string>('');

  // Simpan konfigurasi Smart Pause
  const handleUpdateSmartPauseConfig = (newConfig: SmartPauseConfig) => {
    setSmartPauseConfig(newConfig);
    localStorage.setItem('suaranote_pause_config', JSON.stringify(newConfig));
    localStorage.setItem('suaranote_pause_config_v3', JSON.stringify(newConfig));
    triggerToast('Pengaturan jeda waktu disimpan! ⏱️', '⚙️');
  };

  // Sync transcriptRef
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Handle theme class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDark]);

  // Load notes and check banner dismissed
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (e) {
      console.warn('Failed to parse saved notes from localStorage', e);
    }

    if (localStorage.getItem(PWA_BANNER_DISMISSED_KEY) === 'true') {
      setShowPwaBanner(false);
    }

    // Check Speech Recognition support
    const win = window as unknown as IWindow;
    if (!win.SpeechRecognition && !win.webkitSpeechRecognition) {
      setSpeechSupported(false);
    }

    // PWA install prompt handler
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPwaBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Save notes to localStorage whenever notes change
  const saveNotesToStorage = (updatedNotes: VoiceNote[]) => {
    setNotes(updatedNotes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  };

  // Toast notification trigger
  const triggerToast = (msg: string, icon = '✅') => {
    setToastMessage(msg);
    setToastIcon(icon);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Start Speech Recognition (Dioptimalkan untuk Android & iPhone / iOS)
  const startRecording = () => {
    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      triggerToast('Browser tidak mendukung Web Speech API.', '⚠️');
      setSpeechSupported(false);
      return;
    }

    // Batalkan timeout restart sebelumnya jika ada
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    isManualStopRef.current = false;
    isRecordingRef.current = true;
    setIsRecording(true);
    setInterimText('');
    interimTextRef.current = '';

    try {
      // 1. Inisialisasi dan jalankan SpeechRecognition SECARA SINKRON langsung pada gesture pengguna
      // (Wajib untuk iOS Safari / PWA Standalone agar token user gesture tidak hilang oleh async await)
      const recognizer = new SpeechRecognitionClass();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = selectedLang;

      shouldCapitalizeNextRef.current = !transcript.trim() || /[.!?]\s*$/.test(transcript.trim());

      recognizer.onstart = () => {
        setIsRecording(true);
        triggerToast('Mendengarkan... Silakan berbicara!', '🎙️');
      };

      recognizer.onresult = (event: any) => {
        // Batalkan timer jeda yang sedang berjalan karena kata baru sedang diproses
        if (shortPauseTimerRef.current) {
          clearTimeout(shortPauseTimerRef.current);
          shortPauseTimerRef.current = null;
        }
        if (longPauseTimerRef.current) {
          clearTimeout(longPauseTimerRef.current);
          longPauseTimerRef.current = null;
        }

        let interim = '';
        let finalStr = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          const chunk = res[0]?.transcript || '';
          if (res.isFinal) {
            finalStr += chunk + ' ';
          } else {
            interim += chunk;
          }
        }

        if (finalStr) {
          // Format chunk kalimat baru (kapital jika kalimat baru, koma sebelum kata sambung)
          setTranscript((prev) => formatSpeechChunk(prev, finalStr, shouldCapitalizeNextRef.current));
          shouldCapitalizeNextRef.current = false;

          // Smart Pause Timer (Jeda koma default ~0.8s, jeda titik ~2.5s)
          if (smartPauseConfig.enabled) {
            shortPauseTimerRef.current = setTimeout(() => {
              setTranscript((prev) => applyShortPauseComma(prev));
            }, smartPauseConfig.shortPauseMs);

            longPauseTimerRef.current = setTimeout(() => {
              setTranscript((prev) => applyLongPausePeriod(prev));
              shouldCapitalizeNextRef.current = true;
            }, smartPauseConfig.longPauseMs);
          }
        }

        setInterimText(interim);
        interimTextRef.current = interim;
      };

      recognizer.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        // Error 'no-speech' normal terjadi saat pengguna diam beberapa detik di HP; jangan hentikan rekaman
        if (event.error === 'no-speech') {
          return;
        }
        if (event.error === 'not-allowed') {
          isManualStopRef.current = true;
          isRecordingRef.current = false;
          setIsRecording(false);
          triggerToast('Izin mikrofon ditolak! Periksa izin di pengaturan browser.', '⚠️');
          return;
        }
        if (event.error === 'audio-capture') {
          triggerToast('Mikrofon sedang dipakai atau tidak terdeteksi.', '⚠️');
          return;
        }
        if (event.error === 'network') {
          triggerToast('Koneksi internet diperlukan untuk Speech-to-Text di browser ini.', '⚠️');
          return;
        }
      };

      recognizer.onend = () => {
        // Auto-restart jika masih dalam sesi rekaman aktif (Mencegah terputus di Android Chrome & iOS Safari)
        if (isRecordingRef.current && !isManualStopRef.current) {
          restartTimeoutRef.current = setTimeout(() => {
            if (isRecordingRef.current && !isManualStopRef.current) {
              try {
                recognizer.start();
              } catch (e) {
                console.log('Speech auto-restart notice:', e);
              }
            }
          }, 80);
        }
      };

      recognizer.start();
      recognitionRef.current = recognizer;

      // Timer
      setTimerSeconds(0);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);

      // 2. Request mic audio stream non-blockingly untuk visualizer gelombang suara
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          if (!isRecordingRef.current) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          setAudioStream(stream);

          // Hindari MediaRecorder di iOS WebKit untuk mencegah lock hardware mic
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

          if (!isIOS) {
            try {
              audioChunksRef.current = [];
              const recorder = new MediaRecorder(stream);
              recorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
              };
              recorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onloadend = () => {
                  if (reader.result) {
                    setRecordedAudioUrl(reader.result as string);
                  }
                };
                reader.readAsDataURL(blob);
              };
              recorder.start();
              mediaRecorderRef.current = recorder;
            } catch (recErr) {
              console.log('MediaRecorder skipped:', recErr);
            }
          }
        }).catch((err) => {
          console.log('Audio visualizer fallback to simulated wave:', err);
        });
      }

    } catch (err) {
      console.error('Speech recognition start error:', err);
      triggerToast('Gagal mengakses mikrofon. Periksa izin perangkat.', '❌');
      stopRecording();
    }
  };

  // Stop Speech Recognition & auto-format
  const stopRecording = () => {
    isManualStopRef.current = true;
    isRecordingRef.current = false;
    setIsRecording(false);

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    if (shortPauseTimerRef.current) {
      clearTimeout(shortPauseTimerRef.current);
      shortPauseTimerRef.current = null;
    }
    if (longPauseTimerRef.current) {
      clearTimeout(longPauseTimerRef.current);
      longPauseTimerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }

    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
    }

    // Komit kata-kata interim terakhir jika ada sebelum berhenti
    if (interimTextRef.current) {
      setTranscript((prev) => formatSpeechChunk(prev, interimTextRef.current, shouldCapitalizeNextRef.current));
      interimTextRef.current = '';
    }
    setInterimText('');

    // Auto format hasil akhir transkripsi (titik penutup, koma konjungsi, kapital)
    setTranscript((prev) => formatTranscript(prev, true));
    triggerToast('Perekaman selesai. Teks dirapikan otomatis!', '✨');
  };

  // Toggle record button
  const handleToggleRecording = () => {
    if (isRecordingRef.current) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Audio Upload handler
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedAudioName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setUploadedAudioUrl(objectUrl);

    // Read to base64 for note saving
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setRecordedAudioUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

    if (!title.trim()) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    triggerToast(`Audio "${file.name}" dimuat. Anda bisa putar & diktekan.`, '🎵');
  };

  const removeUploadedAudio = () => {
    if (uploadedAudioUrl) {
      URL.revokeObjectURL(uploadedAudioUrl);
    }
    setUploadedAudioUrl(null);
    setUploadedAudioName('');
    setRecordedAudioUrl(null);
  };

  // Save Note to LocalStorage
  const handleSaveNote = () => {
    const text = transcript.trim();
    if (!text) {
      triggerToast('Catatan masih kosong! Bicara atau ketik terlebih dahulu.', '⚠️');
      return;
    }

    const noteTitle = title.trim() || text.slice(0, 32) + (text.length > 32 ? '...' : '');
    const newNote: VoiceNote = {
      id: 'note_' + Date.now(),
      title: noteTitle,
      content: text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      durationSeconds: timerSeconds,
      wordCount: text.split(/\s+/).filter(Boolean).length,
      language: selectedLang,
      tag: selectedTag,
      audioDataUrl: recordedAudioUrl || undefined,
    };

    saveNotesToStorage([newNote, ...notes]);
    triggerToast('Catatan berhasil disimpan ke HP!', '💾');
  };

  // Copy current editor text
  const handleCopyCurrent = () => {
    if (!transcript.trim()) {
      triggerToast('Tidak ada teks untuk disalin!', '⚠️');
      return;
    }
    navigator.clipboard.writeText(transcript);
    triggerToast('Teks disalin ke clipboard!', '📋');
  };

  // AI Proofreader: Perbaiki EYD & Tata Bahasa
  const handleAiProofread = async () => {
    const textToRevise = transcript.trim();
    if (!textToRevise) {
      triggerToast('Teks masih kosong untuk diperbaiki!', '⚠️');
      return;
    }

    setIsProofreading(true);
    triggerToast('Sedang merevisi EYD & tata bahasa dengan AI...', '🤖');

    try {
      const response = await fetch('/api/proofread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToRevise,
          customApiKey: aiConfig.apiKey,
          provider: aiConfig.provider,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memproses revisi teks dengan AI');
      }

      if (data.revisedText) {
        // Simpan versi lama ke undo agar pengguna bisa membatalkan bila diinginkan
        setUndoData({ transcript, title });
        setTranscript(data.revisedText);
        triggerToast('EYD & Tata Bahasa berhasil direvisi AI! ✨', '🪄');
      }
    } catch (err: any) {
      console.error('Proofread error:', err);
      triggerToast(err.message || 'Gagal memproses AI. Menggunakan perapian lokal.', '⚠️');
      // Fallback format lokal bila server/API tidak tersedia
      const localFormatted = formatTranscript(textToRevise, true);
      setTranscript(localFormatted);
    } finally {
      setIsProofreading(false);
    }
  };

  // Rapikan teks lokal (Auto-Format)
  const handleAutoFormat = () => {
    if (!transcript.trim()) {
      triggerToast('Tidak ada teks untuk dirapikan!', '⚠️');
      return;
    }
    const formatted = formatTranscript(transcript, true);
    setTranscript(formatted);
    triggerToast('Teks berhasil dirapikan! ✨', '🪄');
  };

  // Bersihkan editor (Tanpa window.confirm yang sering terblokir iframe/browser)
  const handleClearCurrent = () => {
    if (!transcript.trim() && !title.trim() && !uploadedAudioUrl) {
      triggerToast('Editor sudah kosong.', 'ℹ️');
      return;
    }
    // Simpan ke undo agar pengguna bisa mengembalikan teks jika salah tekan
    setUndoData({ transcript, title });
    setTranscript('');
    setTitle('');
    setInterimText('');
    setTimerSeconds(0);
    removeUploadedAudio();
    triggerToast('Editor dibersihkan! (Ketuk "Urungkan" untuk membatalkan)', '🧹');
  };

  // Batalkan / Urungkan pembersihan editor
  const handleUndoClear = () => {
    if (!undoData) return;
    setTranscript(undoData.transcript);
    setTitle(undoData.title);
    setUndoData(null);
    triggerToast('Teks berhasil dikembalikan!', '↩️');
  };

  // Load note to editor for editing
  const handleEditNote = (note: VoiceNote) => {
    setTitle(note.title);
    setTranscript(note.content);
    if (note.tag) setSelectedTag(note.tag);
    if (note.audioDataUrl) {
      setRecordedAudioUrl(note.audioDataUrl);
      setUploadedAudioUrl(note.audioDataUrl);
      setUploadedAudioName(note.title);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerToast('Catatan dimuat ke editor!', '✍️');
  };

  // Request delete note (membuka modal in-app yang aman tanpa window.confirm yang sering diblokir)
  const handleDeleteNote = (id: string) => {
    const target = notes.find((n) => n.id === id);
    if (target) {
      setNoteToDelete(target);
    }
  };

  // Konfirmasi hapus catatan
  const handleConfirmDelete = () => {
    if (!noteToDelete) return;
    const index = notes.findIndex((n) => n.id === noteToDelete.id);
    const updated = notes.filter((n) => n.id !== noteToDelete.id);
    const deleted = noteToDelete;
    setDeletedNoteBackup({ note: deleted, index: index >= 0 ? index : 0 });
    saveNotesToStorage(updated);
    setNoteToDelete(null);
    triggerToast(`Catatan "${deleted.title}" dihapus.`, '🗑️');

    // Auto-clear backup undo setelah 6 detik
    setTimeout(() => {
      setDeletedNoteBackup((prev) => (prev?.note.id === deleted.id ? null : prev));
    }, 6000);
  };

  // Urungkan hapus catatan (restore note)
  const handleUndoDelete = () => {
    if (!deletedNoteBackup) return;
    const restoredNotes = [...notes];
    const insertIndex = Math.min(deletedNoteBackup.index, restoredNotes.length);
    restoredNotes.splice(insertIndex, 0, deletedNoteBackup.note);
    saveNotesToStorage(restoredNotes);
    const restoredTitle = deletedNoteBackup.note.title;
    setDeletedNoteBackup(null);
    triggerToast(`Catatan "${restoredTitle}" dikembalikan! 🌸`, '↩️');
  };

  // Export all notes to TXT
  const handleExportAll = () => {
    if (notes.length === 0) {
      triggerToast('Belum ada catatan untuk diunduh.', '⚠️');
      return;
    }
    let content = '=== SUARANOTE - RIWAYAT CATATAN SUARA ===\n';
    content += `Diunduh pada: ${new Date().toLocaleString('id-ID')}\n`;
    content += `Total Catatan: ${notes.length}\n\n`;

    notes.forEach((n, idx) => {
      content += `[${idx + 1}] ${n.title}\n`;
      content += `Tanggal: ${new Date(n.createdAt).toLocaleString('id-ID')} | Tag: ${n.tag || '-'} | Kata: ${n.wordCount}\n`;
      content += `----------------------------------------\n`;
      content += `${n.content}\n\n`;
      content += `========================================\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `suaranote_backup_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast('Backup catatan TXT terunduh!', '📥');
  };

  // Native PWA install prompt trigger
  const handlePromptInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowPwaBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowPwaModal(true);
    }
  };

  // Format timer
  const formatTimer = (sec: number) => {
    const mins = String(Math.floor(sec / 60)).padStart(2, '0');
    const secs = String(sec % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Filtered notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = filterTag === 'Semua' || n.tag === filterTag;
    return matchesSearch && matchesTag;
  });

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-pink-50/80 via-rose-50/50 to-purple-50/40 dark:from-[#150a17] dark:via-[#1a0c1e] dark:to-[#130716] text-slate-800 dark:text-pink-100 transition-colors flex flex-col items-center justify-start ${isMobileFrame ? 'py-0 sm:py-6' : ''}`}>
      
      {/* Top desktop control bar for previewing simulator vs full width */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-2 px-3 text-xs text-pink-500/80 dark:text-pink-400">
        <span className="font-bold flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-pink-500" />
          Preview Layar HP ✨
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="flex items-center gap-1 hover:text-pink-600 dark:hover:text-pink-300 font-semibold transition cursor-pointer"
            title="Ganti Mode Frame"
          >
            {isMobileFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            <span>{isMobileFrame ? 'Lebarkan' : 'Frame HP'}</span>
          </button>
          <span>•</span>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Single-File HTML</span>
          </button>
        </div>
      </div>

      {/* Main Container: Mobile Frame or Full Width */}
      <div className={`w-full ${isMobileFrame ? 'max-w-md sm:rounded-[36px] sm:shadow-2xl sm:shadow-pink-300/30 dark:sm:shadow-pink-950/40 sm:border sm:border-pink-200/80 dark:sm:border-[#3d2044]' : 'max-w-2xl sm:rounded-3xl sm:shadow-xl'} bg-white dark:bg-[#1f1224] min-h-screen sm:min-h-[840px] flex flex-col overflow-hidden relative transition-all`}>
        
        {/* Top PWA Add to Home Screen Banner */}
        {showPwaBanner && (
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white px-3.5 py-2.5 text-xs flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center space-x-2">
              <span className="text-base">🎀</span>
              <div className="leading-tight">
                <p className="font-extrabold text-[11px] sm:text-xs">Pasang di Layar Utama HP</p>
                <p className="text-pink-100 text-[10px]">Akses cepat tanpa address bar (PWA) ✨</p>
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={handlePromptInstall}
                className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-full text-[11px] font-bold active:scale-95 transition cursor-pointer"
              >
                {deferredPrompt ? 'Pasang' : 'Panduan'}
              </button>
              <button
                onClick={() => {
                  setShowPwaBanner(false);
                  localStorage.setItem(PWA_BANNER_DISMISSED_KEY, 'true');
                }}
                className="p-1 hover:bg-white/20 rounded-full text-white/80 cursor-pointer"
                title="Tutup banner"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* App Header */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#1f1224]/95 backdrop-blur border-b border-pink-100 dark:border-[#38183f] px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-400 text-white flex items-center justify-center shadow-md shadow-pink-500/25">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-pink-50 leading-none">
                  VOICE-TEXT PUNYA VINA
                </h1>
                <span className="text-xs">🌸</span>
              </div>
              <p className="text-[10px] text-pink-500 dark:text-pink-300/80 font-semibold mt-0.5">
                Voice Notes & Cute Transcriber 🎀
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Language Selector */}
            <select
              value={selectedLang}
              onChange={(e) => {
                setSelectedLang(e.target.value);
                triggerToast(`Bahasa diatur ke ${e.target.value}`, '🌐');
              }}
              className="text-xs bg-pink-50/70 dark:bg-[#2b1630] border border-pink-200 dark:border-[#44204c] rounded-2xl px-2 py-1.5 font-bold text-pink-700 dark:text-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-400 cursor-pointer"
              title="Pilih Bahasa Transkripsi"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-2xl bg-pink-50/70 dark:bg-[#2b1630] text-pink-600 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-[#381c3e] transition active:scale-95 cursor-pointer border border-pink-200/60 dark:border-[#44204c]"
              title={isDark ? 'Mode Terang' : 'Mode Malam Velvet'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-pink-500" />}
            </button>

            {/* Single File Export Modal Toggle (for mobile or desktop) */}
            <button
              onClick={() => setShowExportModal(true)}
              className="p-2 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition active:scale-95 cursor-pointer border border-purple-200/60 dark:border-[#421f48]"
              title="Download Single-File HTML"
            >
              <FileCode className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Main Workspace */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
          
          {/* Unsupported Web Speech API Warning */}
          {!speechSupported && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-3.5 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
              <div className="flex items-center space-x-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Web Speech API Belum Aktif di Browser Ini</span>
              </div>
              <p className="text-amber-700 dark:text-amber-400 text-[11px] leading-relaxed">
                Untuk transkripsi otomatis suara real-time secara gratis, buka aplikasi ini di <b>Google Chrome (Android/Desktop)</b>. Anda tetap bisa mengetik manual atau memutar audio di sini.
              </p>
            </div>
          )}

          {/* Real-Time Recording & Audio Visualizer Card */}
          <div className="bg-gradient-to-br from-pink-50/90 via-rose-50/60 to-purple-50/50 dark:from-[#241328] dark:to-[#2b1630] border border-pink-200/80 dark:border-[#44204c] rounded-3xl p-4 shadow-sm shadow-pink-100/40 space-y-3 relative overflow-hidden">
            
            {/* Recording Status & Live Timer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                  isRecording 
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 animate-pulse' 
                    : 'bg-pink-100/80 dark:bg-[#381c3e] text-pink-700 dark:text-pink-200 border border-pink-200/60 dark:border-[#4d2554]'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-pink-400'}`}></span>
                  <span>{isRecording ? 'Mendengarkan... 🎙️' : 'Siap Merekam ✨'}</span>
                </span>
                <span className="text-[11px] text-pink-400 dark:text-pink-400/80 font-bold">
                  {selectedLang === 'id-ID' ? '🇮🇩 ID' : selectedLang}
                </span>
              </div>

              <div className="font-mono text-sm font-black text-pink-700 dark:text-pink-200 tracking-wider">
                {formatTimer(timerSeconds)}
              </div>
            </div>

            {/* Smart Pause Punctuation Pill & Kepekaan Button */}
            <div className="flex items-center justify-between text-[11px] px-0.5">
              <button
                onClick={() => setShowSmartPauseModal(true)}
                className="flex items-center gap-1.5 text-pink-800 dark:text-pink-200 hover:text-pink-600 dark:hover:text-pink-300 bg-white/90 dark:bg-[#201024]/90 px-2.5 py-1 rounded-2xl border border-pink-200/80 dark:border-[#42204a] transition active:scale-95 cursor-pointer shadow-xs"
                title="Sesuaikan Kepekaan Jeda Waktu (Smart Pause)"
              >
                <Clock className="w-3.5 h-3.5 text-pink-500" />
                <span className="font-bold text-[10px] sm:text-[11px]">
                  Jeda: {(smartPauseConfig.shortPauseMs / 1000).toFixed(1)}s (,) / {(smartPauseConfig.longPauseMs / 1000).toFixed(1)}s (.)
                </span>
                <Sliders className="w-3 h-3 text-pink-400 ml-0.5" />
              </button>

              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                smartPauseConfig.enabled 
                  ? 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200/60 dark:border-pink-800/40' 
                  : 'bg-slate-200 dark:bg-[#3d2044] text-slate-400'
              }`}>
                {smartPauseConfig.enabled ? '⚡ Smart Pause' : 'Nonaktif'}
              </span>
            </div>

            {/* Audio Waveform Visualizer */}
            <AudioVisualizer isRecording={isRecording} stream={audioStream} isDark={isDark} />

            {/* Big Thumb-Friendly Control Buttons (Mobile-first UX) */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {/* Record / Stop Button (Spans 2 columns for comfortable thumb tapping) */}
              <button
                onClick={handleToggleRecording}
                className={`col-span-2 py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2.5 transition active:scale-[0.98] shadow-md cursor-pointer ${
                  isRecording
                    ? 'bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white shadow-rose-500/30 animate-pulse'
                    : 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white shadow-pink-500/25'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-5 h-5 fill-white" />
                    <span>Berhenti Rekam</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span>Mulai Bicara 🎙️</span>
                  </>
                )}
              </button>

              {/* Upload Audio File Button */}
              <label className="col-span-1 py-3.5 px-2.5 rounded-2xl bg-pink-100/70 dark:bg-[#2e1735] hover:bg-pink-200/80 dark:hover:bg-[#3a1d42] text-pink-800 dark:text-pink-200 font-bold text-xs flex flex-col items-center justify-center cursor-pointer active:scale-[0.98] transition text-center shadow-xs border border-pink-200/60 dark:border-[#4a2453]">
                <Upload className="w-4 h-4 mb-0.5 text-pink-600 dark:text-pink-400" />
                <span className="leading-tight">Upload File</span>
                <input
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
                  className="hidden"
                  onChange={handleAudioUpload}
                />
              </label>
            </div>

            {/* Uploaded or Recorded Audio Player */}
            {uploadedAudioUrl && (
              <div className="p-3 bg-white/95 dark:bg-[#201024] rounded-2xl border border-pink-200 dark:border-[#42204a] space-y-2 animate-in fade-in duration-200 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-pink-900 dark:text-pink-100 truncate max-w-[200px] flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    {uploadedAudioName || 'Audio Rekaman 🎵'}
                  </span>
                  <div className="flex items-center space-x-2">
                    {/* Playback speed buttons */}
                    <button
                      onClick={() => {
                        const speeds = [1, 1.25, 1.5, 2, 0.75];
                        const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
                        const nextSpeed = speeds[nextIndex];
                        setPlaybackRate(nextSpeed);
                        if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
                      }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-pink-100 dark:bg-[#381c3e] text-pink-700 dark:text-pink-300"
                    >
                      {playbackRate}x
                    </button>
                    <button
                      onClick={removeUploadedAudio}
                      className="text-rose-500 hover:underline text-[11px] font-semibold"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
                <audio
                  ref={audioRef}
                  controls
                  src={uploadedAudioUrl}
                  className="w-full h-8 rounded-xl"
                />
                <p className="text-[10px] text-pink-400 text-center">
                  💡 Tips: Putar file audio lalu klik <b>Mulai Bicara</b> untuk mendikte atau mencatat poinnya.
                </p>
              </div>
            )}
          </div>

          {/* Transcribed Textarea & Editing Card */}
          <div className="bg-white/95 dark:bg-[#201024] border border-pink-200/80 dark:border-[#44204c] rounded-3xl p-4 shadow-sm shadow-pink-100/40 space-y-3">
            
            {/* Note Title Input & Word count */}
            <div className="flex items-center justify-between gap-2 border-b border-pink-100 dark:border-[#38183f] pb-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul Catatan Cantik ✨ (Opsional)"
                className="w-full font-black text-slate-800 dark:text-pink-50 placeholder-pink-300 dark:placeholder-pink-400/40 bg-transparent focus:outline-none text-sm sm:text-base"
              />
              <span className="text-xs font-bold text-pink-500 dark:text-pink-400 shrink-0">
                {wordCount} kata
              </span>
            </div>

            {/* Editable Text Area with Instant Live Text */}
            <div className="relative space-y-1.5">
              <textarea
                value={isRecording && interimText ? (transcript ? `${transcript} ${interimText}` : interimText) : transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={6}
                placeholder="Hasil suara otomatis muncul di sini secara real-time kata per kata... Kamu juga bisa ketik curhatan, ide, atau edit teksnya secara bebas lho! 🌸"
                className="w-full text-xs sm:text-sm text-slate-800 dark:text-pink-100 bg-pink-50/40 dark:bg-[#1a0c1e] rounded-2xl p-3.5 border border-pink-200/70 dark:border-[#3d1d44] focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none leading-relaxed placeholder-pink-300/70 dark:placeholder-pink-400/40"
              />
              
              {/* Real-time speech status and interim live indicator */}
              {isRecording && (
                <div className="flex items-center justify-between text-xs px-1">
                  <div className="flex items-center space-x-1.5 text-pink-600 dark:text-pink-300 font-bold truncate">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0"></span>
                    {interimText ? (
                      <span className="truncate italic">"{interimText}"</span>
                    ) : (
                      <span className="text-[11px] text-pink-400 dark:text-pink-400/80">Sedang mendengarkan... katakan sesuatu 🎙️</span>
                    )}
                  </div>
                  {interimText && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 px-2 py-0.5 rounded-full shrink-0">
                      Live
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Category Tag Selector */}
            <div className="flex items-center space-x-1.5 overflow-x-auto py-1 text-xs">
              <span className="text-[11px] font-bold text-pink-400 mr-1 shrink-0">Label:</span>
              {NOTE_TAGS.filter((t) => t !== 'Semua').map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full font-bold transition active:scale-95 shrink-0 cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm shadow-pink-400/30'
                      : 'bg-pink-50/80 dark:bg-[#2b1630] text-pink-700 dark:text-pink-300 border border-pink-100 dark:border-[#3d2044] hover:bg-pink-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Tombol Perbaiki EYD & Tata Bahasa (AI) */}
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={handleAiProofread}
                disabled={isProofreading}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-rose-400 hover:from-pink-600 hover:to-purple-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-pink-500/25 active:scale-[0.98] transition cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                title="Perbaiki ejaan EYD/PUEBI, struktur kalimat, dan bersihkan kata pengisi dengan AI"
              >
                {isProofreading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
                    <span>Sedang Merapikan Teks Cantik (AI)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>✨ Perbaiki EYD & Tata Bahasa (AI)</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowAiSettingsModal(true)}
                className="p-3 rounded-2xl bg-pink-50/80 dark:bg-[#2b1630] hover:bg-pink-100 dark:hover:bg-[#381c3e] text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-[#44204c] transition active:scale-95 shrink-0 flex items-center justify-center cursor-pointer shadow-xs"
                title="Pengaturan AI & Input API Key"
              >
                <Sliders className="w-4 h-4 text-pink-500 dark:text-pink-400" />
              </button>
            </div>

            {/* Banner Undo jika baru saja dibersihkan */}
            {undoData && (
              <div className="flex items-center justify-between p-2.5 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl text-xs text-amber-800 dark:text-amber-300 animate-in fade-in duration-150">
                <span className="flex items-center gap-1.5 font-medium">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Editor baru saja dibersihkan.
                </span>
                <button
                  onClick={handleUndoClear}
                  className="font-bold underline hover:text-amber-900 dark:hover:text-amber-100 cursor-pointer"
                >
                  Urungkan
                </button>
              </div>
            )}

            {/* Main Action Buttons: Simpan, Salin, Bersihkan */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleSaveNote}
                className="py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition shadow-sm shadow-emerald-400/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan</span>
              </button>

              <button
                onClick={handleCopyCurrent}
                className="py-3 px-3 rounded-2xl bg-pink-100/80 dark:bg-[#2b1630] hover:bg-pink-200/80 dark:hover:bg-[#381c3e] text-pink-800 dark:text-pink-200 border border-pink-200/60 dark:border-[#42204a] font-bold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Salin</span>
              </button>

              <button
                onClick={handleClearCurrent}
                className="py-3 px-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-500 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40 font-bold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Bersihkan</span>
              </button>
            </div>
          </div>

          {/* Notes History & Management Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black text-slate-800 dark:text-pink-50 flex items-center gap-1.5">
                  <span>Riwayat Catatan</span>
                  <span className="text-xs">📚</span>
                </h2>
                <span className="text-xs bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full font-extrabold border border-pink-200/60 dark:border-pink-800/40">
                  {notes.length}
                </span>
              </div>

              {notes.length > 0 && (
                <button
                  onClick={handleExportAll}
                  className="text-xs text-pink-600 dark:text-pink-400 font-bold hover:text-pink-700 dark:hover:text-pink-300 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh TXT</span>
                </button>
              )}
            </div>

            {/* Search and Tag Filter */}
            {notes.length > 0 && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-pink-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari catatan tersimpan..."
                    className="w-full text-xs pl-9 pr-4 py-2.5 bg-white dark:bg-[#201024] border border-pink-200/80 dark:border-[#42204a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-slate-800 dark:text-pink-100 placeholder-pink-300 dark:placeholder-pink-400/40"
                  />
                </div>

                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
                  {NOTE_TAGS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilterTag(t)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition cursor-pointer ${
                        filterTag === t
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                          : 'bg-pink-50/80 dark:bg-[#2b1630] text-pink-700 dark:text-pink-300 border border-pink-100 dark:border-[#3d1d44] hover:bg-pink-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes List */}
            {filteredNotes.length > 0 ? (
              <div className="space-y-2.5">
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onCopy={(text) => triggerToast('Teks catatan disalin!', '📋')}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4 bg-pink-50/40 dark:bg-[#201024]/40 rounded-3xl border border-dashed border-pink-200/80 dark:border-[#44204c] space-y-2">
                <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-500 dark:text-pink-400 flex items-center justify-center mx-auto shadow-xs">
                  <Mic className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-black text-slate-800 dark:text-pink-100">
                  {notes.length === 0 ? 'Belum Ada Catatan Tersimpan 🎀' : 'Tidak Ada Catatan yang Cocok'}
                </h3>
                <p className="text-[11px] text-pink-400/90 dark:text-pink-400/70 max-w-xs mx-auto">
                  {notes.length === 0
                    ? 'Ketuk tombol "Mulai Bicara" untuk merekam suara manismu atau ketik catatan untuk menyimpannya di HP.'
                    : 'Coba ubah kata kunci pencarian atau filter label.'}
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Floating Quick Action or Status Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 py-3 bg-white/95 dark:bg-[#1f1224]/95 backdrop-blur border-t border-pink-100 dark:border-[#38183f] flex items-center justify-between text-xs z-30 shadow-lg">
          <div className="flex items-center space-x-2 text-pink-600/80 dark:text-pink-300/80">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
            <span className="text-[11px] font-bold">100% Gratis & Offline LocalStorage ✨</span>
          </div>
          <button
            onClick={() => setShowPwaModal(true)}
            className="flex items-center space-x-1 text-pink-600 dark:text-pink-300 font-black text-[11px] hover:underline cursor-pointer"
          >
            <span>Panduan PWA HP 📲</span>
          </button>
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white text-xs font-bold py-2.5 px-4 rounded-full shadow-2xl shadow-pink-500/30 flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <span>{toastIcon}</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Floating Undo Delete Notification */}
        {deletedNoteBackup && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#1f1224] dark:bg-pink-950 border border-pink-500/40 text-white text-xs font-bold py-2 px-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <span className="flex items-center gap-1.5 text-pink-200">
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Catatan dihapus</span>
            </span>
            <button
              type="button"
              onClick={handleUndoDelete}
              className="px-2.5 py-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl text-white text-xs font-black transition active:scale-95 cursor-pointer shadow-sm"
            >
              Urungkan ↩️
            </button>
          </div>
        )}

        {/* Modal Konfirmasi Hapus Catatan (In-App tanpa window.confirm yang sering diblokir) */}
        {noteToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#201024] border border-pink-200 dark:border-[#4a2452] w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-xs">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-800 dark:text-pink-50">Hapus Catatan Ini? 🌸</h3>
                  <p className="text-xs text-pink-400 dark:text-pink-300/70">Catatan akan dihapus dari penyimpanan HP</p>
                </div>
              </div>

              <div className="p-3 bg-pink-50/60 dark:bg-[#2b1630] rounded-2xl border border-pink-100 dark:border-[#3d2044] space-y-1">
                <p className="font-extrabold text-xs text-slate-800 dark:text-pink-100 truncate">
                  {noteToDelete.title || 'Catatan Tanpa Judul'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-pink-300/70 line-clamp-2 leading-relaxed">
                  {noteToDelete.content}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setNoteToDelete(null)}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-pink-50 dark:bg-[#2b1630] text-pink-700 dark:text-pink-300 font-bold text-xs hover:bg-pink-100 dark:hover:bg-[#341b3a] transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-xs shadow-md shadow-rose-500/25 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Ya, Hapus</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PWA Installation Modal */}
        <PwaInstallGuide
          isOpen={showPwaModal}
          onClose={() => setShowPwaModal(false)}
          canPromptInstall={!!deferredPrompt}
          onInstallClick={handlePromptInstall}
        />

        {/* Single File HTML Export Modal */}
        <SingleFileExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
        />

        {/* Smart Pause Punctuation Tuning Modal */}
        <SmartPauseModal
          isOpen={showSmartPauseModal}
          onClose={() => setShowSmartPauseModal(false)}
          config={smartPauseConfig}
          onChangeConfig={handleUpdateSmartPauseConfig}
        />

        {/* AI Proofreader Settings Modal */}
        <AiSettingsModal
          isOpen={showAiSettingsModal}
          onClose={() => setShowAiSettingsModal(false)}
          config={aiConfig}
          onSaveConfig={handleUpdateAiConfig}
        />
      </div>
    </div>
  );
}
