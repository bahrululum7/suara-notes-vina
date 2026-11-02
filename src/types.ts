export interface VoiceNote {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string
  updatedAt: string;
  durationSeconds: number;
  wordCount: number;
  language: string;
  tag?: string;
  audioDataUrl?: string; // Optional recorded audio preview (base64)
}

export type SupportedLanguage = {
  code: string;
  label: string;
  flag: string;
};

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'id-ID', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'en-US', label: 'English (US)', flag: '🇺🇸' },
  { code: 'jv-ID', label: 'Basa Jawa', flag: '🇮🇩' },
  { code: 'su-ID', label: 'Basa Sunda', flag: '🇮🇩' },
  { code: 'ms-MY', label: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'ar-SA', label: 'العربية (Arabic)', flag: '🇸🇦' },
];

export const NOTE_TAGS = ['Semua', 'Ide 💡', 'Curhat 💖', 'Kuliah 🎒', 'Tugas 📝', 'Belanja 🛍️', 'Draft 🌸'];
