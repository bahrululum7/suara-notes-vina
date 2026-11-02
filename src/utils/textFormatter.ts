/**
 * Utility post-processing untuk hasil transkripsi Web Speech API.
 * 
 * Aturan:
 * 1. Huruf kapital di awal teks dan setelah tanda baca akhir (. ? ! \n).
 * 2. Tanda titik (.) di akhir kalimat atau ketika jeda bicara selesai.
 * 3. Tanda koma (,) sebelum kata sambung umum seperti "dan", "tetapi", "karena", "lalu", "kemudian", "namun", "sedangkan", "sehingga".
 * 4. Normalisasi spasi dan tanda baca ganda.
 * 5. Smart Pause Punctuation: Timer jeda pendek (koma) dan jeda panjang (titik).
 */

export interface SmartPauseConfig {
  enabled: boolean;
  shortPauseMs: number; // default: 800ms (rentang 0.6s - 1.2s) -> sisipkan koma
  longPauseMs: number;  // default: 2500ms (~2.5s) -> sisipkan titik & kapital berikutnya
}

export const DEFAULT_SMART_PAUSE_CONFIG: SmartPauseConfig = {
  enabled: true,
  shortPauseMs: 800,
  longPauseMs: 2500,
};

export const SMART_PAUSE_PRESETS = [
  { name: 'Cepat', short: 600, long: 2000, label: 'Cepat (0.6s / 2.0s)' },
  { name: 'Ideal', short: 800, long: 2500, label: 'Ideal (0.8s / 2.5s)' },
  { name: 'Santai', short: 1200, long: 3000, label: 'Santai (1.2s / 3.0s)' },
];

export const CONJUNCTIONS = [
  'dan',
  'tetapi',
  'karena',
  'lalu',
  'kemudian',
  'namun',
  'sedangkan',
  'sehingga',
  'melainkan',
  'padahal',
  'serta'
];

/**
 * Sisipkan koma (', ') di akhir teks jika jeda pendek terjadi
 */
export function applyShortPauseComma(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  // Sisipkan koma hanya jika berakhiran huruf/angka (bukan sudah bertanda baca)
  if (trimmed.length > 0 && !/[.,!?;:\s]$/.test(trimmed)) {
    return trimmed + ', ';
  }
  return text;
}

/**
 * Sisipkan titik ('. ') di akhir teks jika jeda panjang terjadi
 */
export function applyLongPausePeriod(text: string): string {
  if (!text) return '';
  let trimmed = text.trim();
  // Jika sebelumnya diberi koma oleh short pause, ubah koma menjadi titik
  if (/,+$/.test(trimmed)) {
    trimmed = trimmed.replace(/,+$/, '') + '. ';
  } else if (!/[.!?]$/.test(trimmed)) {
    trimmed = trimmed + '. ';
  } else {
    trimmed = trimmed + ' ';
  }
  return trimmed;
}

/**
 * Merapikan teks transkripsi suara secara menyeluruh
 */
export function formatTranscript(rawText: string, ensureTrailingPeriod = true): string {
  if (!rawText || !rawText.trim()) return '';

  let text = rawText.trim();

  // 1. Normalisasi spasi berlebih
  text = text.replace(/[ \t]+/g, ' ');

  // 2. Hilangkan spasi sebelum tanda baca (contoh: "kata , kata ." -> "kata, kata.")
  text = text.replace(/\s+([.,!?;:])/g, '$1');

  // 3. Pastikan ada spasi setelah tanda baca jika diikuti huruf/angka
  text = text.replace(/([.,!?;:])([a-zA-Z0-9\u00C0-\u017F])/g, '$1 $2');

  // 4. Cegah koma atau titik berulang (contoh: ",," -> ",", ".." -> ".")
  text = text.replace(/,{2,}/g, ',');
  text = text.replace(/\.{2,}/g, '.');

  // 5. Tambahkan koma (,) sebelum kata sambung umum bila didahului kata biasa (bukan tanda baca)
  const conjPattern = CONJUNCTIONS.join('|');
  const conjRegex = new RegExp(`([a-zA-Z0-9\\u00C0-\\u017F]+)\\s+\\b(${conjPattern})\\b`, 'gi');
  text = text.replace(conjRegex, '$1, $2');

  // Bersihkan jika terjadi double koma setelah penggantian
  text = text.replace(/,\s*,/g, ',');

  // 6. Huruf kapital di awal teks
  text = text.replace(/^([a-z\u00C0-\u017F])/i, (match) => match.toUpperCase());

  // 7. Huruf kapital setelah tanda baca akhir (. ! ?) dan spasi
  text = text.replace(/([.!?]\s+)([a-z\u00C0-\u017F])/g, (_, p1, p2) => p1 + p2.toUpperCase());

  // 8. Huruf kapital setelah baris baru (newline)
  text = text.replace(/(\n\s*)([a-z\u00C0-\u017F])/g, (_, p1, p2) => p1 + p2.toUpperCase());

  // 9. Pastikan ada tanda titik di akhir jika belum ada tanda baca penutup (. ! ?)
  if (ensureTrailingPeriod && text.length > 0 && !/[.!?]$/.test(text)) {
    text += '.';
  }

  return text;
}

/**
 * Format chunk kecil yang baru masuk saat berbicara secara real-time
 */
export function formatSpeechChunk(
  existingText: string,
  newChunk: string,
  shouldCapitalizeFirst = false
): string {
  const trimmedChunk = newChunk.trim();
  if (!trimmedChunk) return existingText;

  // Format chunk baru
  let formattedChunk = formatTranscript(trimmedChunk, false);

  if (shouldCapitalizeFirst) {
    formattedChunk = formattedChunk.charAt(0).toUpperCase() + formattedChunk.slice(1);
  }

  if (!existingText || !existingText.trim()) {
    // Awal kalimat: buat huruf pertama kapital
    return formattedChunk.charAt(0).toUpperCase() + formattedChunk.slice(1);
  }

  const trimmedExisting = existingText.trim();
  const lastChar = trimmedExisting.charAt(trimmedExisting.length - 1);

  // Jika teks sebelumnya diakhiri tanda baca penutup (. ! ?)
  if (/[.!?]/.test(lastChar)) {
    formattedChunk = formattedChunk.charAt(0).toUpperCase() + formattedChunk.slice(1);
    return `${trimmedExisting} ${formattedChunk}`;
  }

  // Jika teks sebelumnya diakhiri tanda koma
  if (lastChar === ',') {
    return `${trimmedExisting} ${formattedChunk}`;
  }

  // Jika teks sebelumnya belum ada titik dan kata pertama adalah konjungsi
  const firstWord = trimmedChunk.split(/\s+/)[0]?.toLowerCase();
  if (CONJUNCTIONS.includes(firstWord)) {
    return `${trimmedExisting}, ${formattedChunk}`;
  }

  return `${trimmedExisting} ${formattedChunk}`;
}
