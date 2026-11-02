export const STANDALONE_HTML_CODE = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>VOICE-TEXT PUNYA VINA - Voice Notes & Auto-Transcriber</title>
  
  <!-- PWA & Mobile Meta Tags -->
  <meta name="theme-color" content="#f472b6">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="VOICE-TEXT PUNYA VINA">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#fff1f2',
              100: '#ffe4e6',
              500: '#f43f5e',
              600: '#e11d48',
              700: '#be123c',
            }
          }
        }
      }
    }
  </script>
  
  <!-- Google Fonts Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      -webkit-tap-highlight-color: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(244, 114, 182, 0.4);
      border-radius: 4px;
    }
  </style>
</head>
<body class="bg-gradient-to-br from-pink-50/80 via-rose-50/50 to-purple-50/40 dark:from-[#150a17] dark:via-[#1a0c1e] dark:to-[#130716] text-slate-800 dark:text-pink-100 min-h-screen transition-colors duration-200">
  
  <!-- Container Khusus HP (Max 448px di desktop, 100% di HP) -->
  <div class="max-w-md mx-auto min-h-screen flex flex-col bg-white dark:bg-[#1f1224] shadow-2xl relative border-x border-pink-200/80 dark:border-[#3d2044]">
    
    <!-- Top PWA Install Banner -->
    <div id="pwaBanner" class="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white px-4 py-2.5 text-xs flex items-center justify-between shadow-sm">
      <div class="flex items-center space-x-2">
        <span class="text-base">🎀</span>
        <div>
          <p class="font-extrabold text-xs">Pasang di Layar Utama HP</p>
          <p class="text-pink-100 text-[10px]">Akses cepat tanpa address bar (PWA) ✨</p>
        </div>
      </div>
      <div class="flex items-center space-x-1.5">
        <button onclick="openPwaModal()" class="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-full text-[11px] font-bold transition active:scale-95">
          Panduan
        </button>
        <button onclick="dismissPwaBanner()" class="p-1 hover:bg-white/20 rounded-full text-white/80" title="Tutup">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>

    <!-- Header -->
    <header class="sticky top-0 z-30 bg-white/95 dark:bg-[#1f1224]/95 backdrop-blur border-b border-pink-100 dark:border-[#38183f] px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-2.5">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-400 text-white flex items-center justify-center shadow-md shadow-pink-500/25">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
        </div>
        <div>
          <div class="flex items-center gap-1">
            <h1 class="text-base font-black tracking-tight text-slate-900 dark:text-pink-50 leading-tight">VOICE-TEXT PUNYA VINA</h1>
            <span class="text-xs">🌸</span>
          </div>
          <p class="text-[10px] text-pink-500 dark:text-pink-300/80 font-semibold">Voice Notes & Cute Transcriber 🎀</p>
        </div>
      </div>
      <div class="flex items-center space-x-1.5">
        <!-- Language Selector -->
        <select id="langSelect" onchange="changeLanguage(this.value)" class="text-xs bg-pink-50/70 dark:bg-[#2b1630] border border-pink-200 dark:border-[#44204c] rounded-2xl px-2 py-1.5 font-bold text-pink-700 dark:text-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-400">
          <option value="id-ID" selected>🇮🇩 ID</option>
          <option value="en-US">🇺🇸 EN</option>
          <option value="jv-ID">🇮🇩 Jawa</option>
          <option value="su-ID">🇮🇩 Sunda</option>
        </select>
        <!-- Dark Mode Toggle -->
        <button onclick="toggleDarkMode()" class="p-2 rounded-2xl bg-pink-50/70 dark:bg-[#2b1630] text-pink-600 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-[#381c3e] border border-pink-200/60 dark:border-[#44204c] transition active:scale-95" title="Ganti Mode">
          <span id="themeIcon">🌙</span>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 pb-28">
      
      <!-- Speech API Warning if unsupported -->
      <div id="unsupportedAlert" class="hidden bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-3.5 text-xs text-amber-800 dark:text-amber-300">
        <div class="flex items-start space-x-2.5">
          <span class="text-base">⚠️</span>
          <div>
            <p class="font-bold">Browser Belum Mendukung Speech Recognition</p>
            <p class="mt-0.5 text-amber-700 dark:text-amber-400">Gunakan Google Chrome di Android untuk transkripsi otomatis suara real-time.</p>
          </div>
        </div>
      </div>

      <!-- Recording Wave & Visualizer Card -->
      <div class="bg-gradient-to-br from-pink-50/90 via-rose-50/60 to-purple-50/50 dark:from-[#241328] dark:to-[#2b1630] border border-pink-200/80 dark:border-[#44204c] rounded-3xl p-4 shadow-sm shadow-pink-100/40 relative overflow-hidden space-y-3">
        
        <!-- Status & Timer Bar -->
        <div class="flex items-center justify-between">
          <span id="recordingBadge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-100/80 dark:bg-[#381c3e] text-pink-700 dark:text-pink-200 border border-pink-200/60 dark:border-[#4d2554]">
            <span id="badgeDot" class="w-2 h-2 rounded-full bg-pink-400"></span>
            <span id="statusText">Siap Merekam ✨</span>
          </span>
          <div id="timerDisplay" class="font-mono text-sm font-black text-pink-700 dark:text-pink-200 tracking-wider">
            00:00
          </div>
        </div>

        <!-- Smart Pause Punctuation Pill (Configurable Jeda) -->
        <div class="flex items-center justify-between text-[11px] px-0.5">
          <button onclick="openSmartPauseModal()" class="flex items-center gap-1.5 text-pink-800 dark:text-pink-200 hover:text-pink-600 dark:hover:text-pink-300 bg-white/90 dark:bg-[#201024]/90 px-2.5 py-1 rounded-2xl border border-pink-200/80 dark:border-[#42204a] transition active:scale-95 cursor-pointer shadow-xs">
            <span class="text-pink-500">⏱️</span>
            <span id="smartPauseLabel" class="font-bold text-[10px]">Jeda: 1.2s (,) / 2.6s (.)</span>
            <svg class="w-3 h-3 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
          </button>
          <span id="smartPauseBadge" class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200/60 dark:border-pink-800/40">
            ⚡ Smart Pause
          </span>
        </div>

        <!-- Canvas Audio Waveform -->
        <div class="h-14 w-full rounded-2xl bg-white/80 dark:bg-[#251428]/80 border border-pink-200/70 dark:border-[#4d2554] flex items-center justify-center overflow-hidden relative shadow-inner">
          <canvas id="waveformCanvas" width="380" height="56" class="w-full h-full"></canvas>
          <div id="canvasPlaceholder" class="absolute inset-0 flex items-center justify-center text-xs text-pink-400 dark:text-pink-300/70 font-medium">
            Ketuk "Mulai Bicara" untuk mendeteksi suaramu 🎵
          </div>
        </div>

        <!-- Big Thumb-Friendly Control Buttons -->
        <div class="grid grid-cols-3 gap-2.5 pt-1">
          <!-- Main Record / Stop Button -->
          <button id="recordBtn" onclick="toggleRecording()" class="col-span-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-lg shadow-pink-500/25 active:scale-[0.98] transition cursor-pointer">
            <svg id="micIcon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
            <span id="recordBtnText">Mulai Bicara 🎙️</span>
          </button>

          <!-- Upload Audio File Button -->
          <label class="col-span-1 py-3.5 px-2 rounded-2xl bg-pink-100/70 dark:bg-[#2e1735] hover:bg-pink-200/80 dark:hover:bg-[#3a1d42] text-pink-800 dark:text-pink-200 font-bold text-xs flex flex-col items-center justify-center cursor-pointer active:scale-[0.98] transition text-center shadow-xs border border-pink-200/60 dark:border-[#4a2453]">
            <svg class="w-4 h-4 mb-0.5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
            <span class="leading-tight">Upload File</span>
            <input type="file" id="audioFileInput" accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg" class="hidden" onchange="handleAudioUpload(event)">
          </label>
        </div>

        <!-- Uploaded Audio Player Preview -->
        <div id="audioPlayerContainer" class="hidden p-2.5 bg-white/95 dark:bg-[#201024] rounded-2xl border border-pink-200 dark:border-[#42204a] space-y-1.5 shadow-xs">
          <div class="flex items-center justify-between text-xs">
            <span id="audioFileName" class="font-bold text-pink-900 dark:text-pink-100 truncate max-w-[200px]">audio.mp3</span>
            <button onclick="removeUploadedAudio()" class="text-rose-500 hover:underline text-[11px] font-semibold">Hapus</button>
          </div>
          <audio id="audioElement" controls class="w-full h-8 rounded-xl"></audio>
        </div>
      </div>

      <!-- Live Transcribed Textarea & Editor -->
      <div class="bg-white/95 dark:bg-[#201024] border border-pink-200/80 dark:border-[#44204c] rounded-3xl p-4 shadow-sm shadow-pink-100/40 space-y-3">
        <div class="flex items-center justify-between border-b border-pink-100 dark:border-[#38183f] pb-2">
          <input type="text" id="noteTitleInput" placeholder="Judul Catatan Cantik ✨ (Opsional)" class="w-full font-black text-slate-800 dark:text-pink-50 placeholder-pink-300 dark:placeholder-pink-400/40 bg-transparent focus:outline-none text-sm">
          <span id="wordCountDisplay" class="text-xs text-pink-500 dark:text-pink-400 shrink-0 font-bold">0 kata</span>
        </div>

        <!-- Transcribed Text Area -->
        <div class="relative">
          <textarea id="transcriptArea" rows="6" placeholder="Hasil suara otomatis muncul di sini... Kamu juga bisa ketik curhatan, ide, atau edit teksnya secara bebas lho! 🌸" class="w-full text-xs sm:text-sm text-slate-800 dark:text-pink-100 bg-pink-50/40 dark:bg-[#1a0c1e] rounded-2xl p-3.5 border border-pink-200/70 dark:border-[#3d1d44] focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none leading-relaxed placeholder-pink-300/70 dark:placeholder-pink-400/40"></textarea>
          <div id="interimHint" class="hidden text-xs text-pink-600 dark:text-pink-300 italic px-2 pt-1 flex items-center space-x-1.5 font-bold">
            <span class="inline-block w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
            <span id="interimText">Mendengarkan...</span>
          </div>
        </div>

        <!-- Category Tag Selection -->
        <div class="flex items-center space-x-1.5 overflow-x-auto py-1 text-xs">
          <span class="text-pink-400 text-[11px] font-bold mr-1 shrink-0">Label:</span>
          <button type="button" onclick="selectTag('Ide 💡')" class="tag-btn px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-xs">Ide 💡</button>
          <button type="button" onclick="selectTag('Curhat 💖')" class="tag-btn px-3 py-1 rounded-full bg-pink-50/80 dark:bg-[#2b1630] text-pink-700 dark:text-pink-300 font-bold border border-pink-100 dark:border-[#3d2044]">Curhat 💖</button>
          <button type="button" onclick="selectTag('Kuliah 🎒')" class="tag-btn px-3 py-1 rounded-full bg-pink-50/80 dark:bg-[#2b1630] text-pink-700 dark:text-pink-300 font-bold border border-pink-100 dark:border-[#3d2044]">Kuliah 🎒</button>
          <button type="button" onclick="selectTag('Tugas 📝')" class="tag-btn px-3 py-1 rounded-full bg-pink-50/80 dark:bg-[#2b1630] text-pink-700 dark:text-pink-300 font-bold border border-pink-100 dark:border-[#3d2044]">Tugas 📝</button>
          <button type="button" onclick="selectTag('Belanja 🛍️')" class="tag-btn px-3 py-1 rounded-full bg-pink-50/80 dark:bg-[#2b1630] text-pink-700 dark:text-pink-300 font-bold border border-pink-100 dark:border-[#3d2044]">Belanja 🛍️</button>
          <button type="button" onclick="selectTag('Draft 🌸')" class="tag-btn px-3 py-1 rounded-full bg-pink-50/80 dark:bg-[#2b1630] text-pink-700 dark:text-pink-300 font-bold border border-pink-100 dark:border-[#3d2044]">Draft 🌸</button>
        </div>

        <!-- Tombol Perbaiki EYD & Tata Bahasa (AI) -->
        <div class="pt-1 flex items-center gap-2">
          <button id="aiProofreadBtn" onclick="runAiProofread()" class="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-rose-400 hover:from-pink-600 hover:to-purple-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-pink-500/25 active:scale-[0.98] transition cursor-pointer">
            <span id="aiBtnSpinner" class="hidden">
              <svg class="w-4 h-4 text-amber-200 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span id="aiBtnIcon">
              <svg class="w-4 h-4 text-amber-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6.4-4.8-6.4 4.8 2.4-7.2-6-4.8h7.6z"/></svg>
            </span>
            <span id="aiBtnText">✨ Perbaiki EYD & Tata Bahasa (AI)</span>
          </button>
          <button type="button" onclick="openAiSettingsModal()" class="p-3 rounded-2xl bg-pink-50/80 dark:bg-[#2b1630] hover:bg-pink-100 dark:hover:bg-[#381c3e] text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-[#44204c] transition active:scale-95 shrink-0 flex items-center justify-center cursor-pointer shadow-xs" title="Pengaturan AI & Input API Key">
            <svg class="w-4 h-4 text-pink-500 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
          </button>
        </div>

        <!-- Undo Banner setelah Pembersihan -->
        <div id="undoBanner" class="hidden items-center justify-between p-2.5 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl text-xs text-amber-800 dark:text-amber-300 animate-in fade-in duration-150">
          <span class="flex items-center gap-1.5 font-medium">
            <span>↩️</span>
            <span>Editor baru saja dibersihkan.</span>
          </span>
          <button onclick="undoClear()" class="font-bold underline hover:text-amber-900 dark:hover:text-amber-100">
            Urungkan
          </button>
        </div>

        <!-- Action Buttons: Save, Copy, Clear -->
        <div class="grid grid-cols-3 gap-2">
          <button onclick="saveNote()" class="py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition shadow-sm shadow-emerald-400/20 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
            <span>Simpan</span>
          </button>
          <button onclick="copyCurrentTranscript()" class="py-3 px-3 rounded-2xl bg-pink-100/80 dark:bg-[#2b1630] hover:bg-pink-200/80 dark:hover:bg-[#381c3e] text-pink-800 dark:text-pink-200 border border-pink-200/60 dark:border-[#42204a] font-bold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            <span>Salin</span>
          </button>
          <button onclick="clearCurrentTranscript()" class="py-3 px-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-500 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40 font-bold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            <span>Bersihkan</span>
          </button>
        </div>
      </div>

      <!-- History List Section -->
      <div class="space-y-3 pt-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <h2 class="text-base font-black text-slate-800 dark:text-pink-50 flex items-center gap-1.5">
              <span>Riwayat Catatan</span>
              <span className="text-xs">📚</span>
            </h2>
            <span id="historyCountBadge" class="text-xs bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full font-extrabold border border-pink-200/60 dark:border-pink-800/40">0</span>
          </div>
          <button onclick="exportAllNotes()" class="text-xs text-pink-600 dark:text-pink-400 font-bold hover:underline">
            Unduh TXT
          </button>
        </div>

        <!-- Search Input -->
        <div class="relative">
          <svg class="w-4 h-4 absolute left-3.5 top-3 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" id="searchInput" oninput="renderNotes()" placeholder="Cari catatan tersimpan..." class="w-full text-xs pl-9 pr-4 py-2.5 bg-white dark:bg-[#201024] border border-pink-200/80 dark:border-[#42204a] rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-slate-800 dark:text-pink-100 placeholder-pink-300 dark:placeholder-pink-400/40">
        </div>

        <!-- Notes List Container -->
        <div id="notesList" class="space-y-2.5"></div>

        <!-- Empty State -->
        <div id="emptyNotesState" class="text-center py-8 px-4 bg-pink-50/40 dark:bg-[#201024]/40 rounded-3xl border border-dashed border-pink-200/80 dark:border-[#44204c] space-y-2">
          <div class="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-500 dark:text-pink-400 flex items-center justify-center mx-auto shadow-xs">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
          </div>
          <p class="text-xs font-black text-slate-800 dark:text-pink-100">Belum Ada Catatan Tersimpan 🎀</p>
          <p class="text-[11px] text-pink-400/90 dark:text-pink-400/70 mt-0.5">Mulai merekam suara manismu atau ketik teks untuk menyimpannya ke memori HP.</p>
        </div>
      </div>
    </main>

    <!-- Bottom Toast Notification -->
    <div id="toast" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 opacity-0 pointer-events-none translate-y-3 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white text-xs font-bold py-2.5 px-4 rounded-full shadow-2xl shadow-pink-500/30 flex items-center space-x-2">
      <span id="toastIcon">✅</span>
      <span id="toastMsg">Berhasil!</span>
    </div>

    <!-- Smart Pause Tuning Modal -->
    <div id="smartPauseModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-end sm:items-center justify-center p-3 animate-in fade-in duration-200">
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center space-x-2.5">
            <span class="text-lg">⏱️</span>
            <div>
              <h3 class="font-bold text-slate-900 dark:text-white text-sm">Smart Pause Punctuation</h3>
              <p class="text-[10px] text-slate-500 dark:text-slate-400">Atur Durasi Jeda Koma & Titik</p>
            </div>
          </div>
          <button onclick="closeSmartPauseModal()" class="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Toggle Switch -->
        <div class="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <div>
            <p class="font-bold text-xs text-slate-800 dark:text-slate-200">Aktifkan Smart Pause</p>
            <p class="text-[10px] text-slate-500 dark:text-slate-400">Koma saat jeda pendek, titik saat jeda panjang</p>
          </div>
          <button id="smartPauseToggleBtn" onclick="toggleSmartPauseActive()" class="w-11 h-6 flex items-center rounded-full p-1 bg-blue-600 cursor-pointer">
            <div id="smartPauseToggleDot" class="bg-white w-4 h-4 rounded-full shadow-md transform translate-x-5 transition-transform duration-200"></div>
          </button>
        </div>

        <!-- Presets -->
        <div class="space-y-1.5">
          <label class="text-[11px] font-bold text-slate-600 dark:text-slate-300">Pilihan Kepekaan:</label>
          <div class="grid grid-cols-3 gap-1.5">
            <button onclick="setSmartPausePreset(1000, 2000)" class="py-2 px-1 rounded-xl text-center text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500">
              <p>Cepat</p>
              <p class="text-[9px] opacity-75">1.0s / 2.0s</p>
            </button>
            <button onclick="setSmartPausePreset(1200, 2600)" class="py-2 px-1 rounded-xl text-center text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 border border-blue-500 text-blue-600 dark:text-blue-300">
              <p>Standar</p>
              <p class="text-[9px] opacity-75">1.2s / 2.6s</p>
            </button>
            <button onclick="setSmartPausePreset(1500, 3200)" class="py-2 px-1 rounded-xl text-center text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500">
              <p>Santai</p>
              <p class="text-[9px] opacity-75">1.5s / 3.2s</p>
            </button>
          </div>
        </div>

        <!-- Sliders -->
        <div class="space-y-3 pt-1 text-xs">
          <div>
            <div class="flex justify-between font-semibold mb-1">
              <span>, Jeda Koma:</span>
              <span id="shortPauseVal" class="text-blue-600 font-mono">1.2 detik</span>
            </div>
            <input type="range" id="shortPauseSlider" min="800" max="2000" step="100" value="1200" oninput="updateSmartPauseSliders()" class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg accent-blue-600 cursor-pointer">
          </div>
          <div>
            <div class="flex justify-between font-semibold mb-1">
              <span>. Jeda Titik:</span>
              <span id="longPauseVal" class="text-indigo-600 font-mono">2.6 detik</span>
            </div>
            <input type="range" id="longPauseSlider" min="1800" max="4500" step="100" value="2600" oninput="updateSmartPauseSliders()" class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg accent-indigo-600 cursor-pointer">
          </div>
        </div>

        <button onclick="closeSmartPauseModal()" class="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs active:scale-95 transition">
          Simpan & Tutup
        </button>
      </div>
    </div>

    <!-- AI Proofreader Settings Modal -->
    <div id="aiSettingsModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-end sm:items-center justify-center p-3 animate-in fade-in duration-200">
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center space-x-2.5">
            <span class="text-lg">🤖</span>
            <div>
              <h3 class="font-bold text-slate-900 dark:text-white text-sm">Pengaturan AI Proofreader</h3>
              <p class="text-[10px] text-slate-500 dark:text-slate-400">Penyedia AI & Input API Key Gratis</p>
            </div>
          </div>
          <button onclick="closeAiSettingsModal()" class="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-200 mb-1">Pilih Model AI:</label>
            <div class="grid grid-cols-2 gap-2">
              <button type="button" id="providerGeminiBtn" onclick="selectAiProvider('gemini')" class="p-2.5 rounded-xl border text-center font-semibold transition border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                <p class="font-bold">Google Gemini</p>
                <p class="text-[10px] opacity-75">Gemini 2.5 Flash</p>
              </button>
              <button type="button" id="providerGroqBtn" onclick="selectAiProvider('groq')" class="p-2.5 rounded-xl border text-center font-semibold transition border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <p class="font-bold">Groq Cloud</p>
                <p class="text-[10px] opacity-75">Llama 3.3 70B</p>
              </button>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="font-bold text-slate-700 dark:text-slate-200">API Key Gratis (Opsional):</label>
              <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Gratis di web resmi</span>
            </div>
            <input type="password" id="customApiKeyInput" placeholder="Masukkan API Key (AIza... atau gsk_...)" class="w-full text-xs px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono">
            <p class="text-[10px] text-slate-400 mt-1">
              *Tersimpan aman di localStorage HP Anda. Jika dikosongkan pada versi server, sistem akan menggunakan koneksi default.
            </p>
          </div>
        </div>

        <button onclick="saveAiSettings()" class="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs active:scale-95 transition">
          Simpan Pengaturan
        </button>
      </div>
    </div>

    <!-- PWA Installation Guide Modal -->
    <div id="pwaModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden items-end sm:items-center justify-center p-3">
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center space-x-2">
            <span class="text-xl">📱</span>
            <div>
              <h3 class="font-bold text-slate-900 dark:text-white text-sm">Tambahkan ke Layar HP</h3>
              <p class="text-[10px] text-slate-400">Jadikan aplikasi native tanpa URL bar</p>
            </div>
          </div>
          <button onclick="closePwaModal()" class="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div class="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-2xl border border-blue-100 dark:border-blue-900/60">
            <p class="font-bold text-blue-900 dark:text-blue-300 mb-1">🤖 Google Chrome di Android:</p>
            <ol class="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200">
              <li>Ketuk ikon <b>menu titik tiga (⋮)</b> di kanan atas Chrome.</li>
              <li>Pilih <b>"Tambahkan ke Layar Utama"</b> (atau <i>"Instal Aplikasi"</i>).</li>
              <li>Ketuk <b>"Tambah"</b> untuk selesai.</li>
            </ol>
          </div>

          <div class="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
            <p class="font-bold text-slate-900 dark:text-slate-200 mb-1">🍎 Safari di iPhone / iPad:</p>
            <ol class="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300">
              <li>Ketuk tombol <b>Bagikan (Share)</b> di bagian bawah.</li>
              <li>Pilih opsi <b>"Add to Home Screen"</b> (+).</li>
              <li>Ketuk <b>"Add"</b> di kanan atas.</li>
            </ol>
          </div>
          
          <p class="text-[11px] text-slate-400 text-center">
            Aplikasi akan tampil fullscreen persis aplikasi Android asli!
          </p>
        </div>

        <button onclick="closePwaModal()" class="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs active:scale-95 transition">
          Saya Mengerti 🌸
        </button>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus (In-App tanpa window.confirm) -->
    <div id="deleteConfirmModal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div class="bg-white dark:bg-[#201024] border border-pink-200 dark:border-[#4a2452] w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4">
        <div class="flex items-center space-x-3">
          <div class="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 flex items-center justify-center shrink-0">
            🗑️
          </div>
          <div>
            <h3 class="font-black text-sm text-slate-800 dark:text-pink-50">Hapus Catatan Ini? 🌸</h3>
            <p class="text-xs text-pink-400 dark:text-pink-300/70">Catatan akan dihapus dari penyimpanan HP</p>
          </div>
        </div>

        <div class="p-3 bg-pink-50/60 dark:bg-[#2b1630] rounded-2xl border border-pink-100 dark:border-[#3d2044]">
          <p id="deleteNoteTitle" class="font-extrabold text-xs text-slate-800 dark:text-pink-100 truncate"></p>
        </div>

        <div class="flex items-center gap-2 pt-1">
          <button onclick="closeDeleteConfirmModal()" class="flex-1 py-2.5 px-3 rounded-2xl bg-pink-50 dark:bg-[#2b1630] text-pink-700 dark:text-pink-300 font-bold text-xs hover:bg-pink-100 dark:hover:bg-[#341b3a] transition">
            Batal
          </button>
          <button onclick="confirmDeleteNote()" class="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-xs shadow-md shadow-rose-500/25 transition active:scale-95 flex items-center justify-center gap-1.5">
            <span>Ya, Hapus</span>
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- JavaScript Logic -->
  <script>
    // App State
    let isRecording = false;
    let recognition = null;
    let finalTranscript = '';
    let selectedTag = 'Ide';
    let timerInterval = null;
    let secondsElapsed = 0;
    let audioContext = null;
    let analyser = null;
    let microphoneStream = null;
    let animationFrameId = null;
    let mediaRecorder = null;
    let recordedAudioChunks = [];
    let currentAudioDataUrl = null;
    let undoMemory = null;

    // === SMART PAUSE PUNCTUATION CONFIGURATION (Configurable) ===
    let smartPauseEnabled = true;
    let shortPauseMs = 1200; // 1.2 detik -> sisipkan koma (', ')
    let longPauseMs = 2600;  // 2.6 detik -> sisipkan titik ('. ') & kapital berikutnya
    let shortPauseTimer = null;
    let longPauseTimer = null;
    let shouldCapitalizeNext = true;

    const STORAGE_KEY = 'suaranote_records_v1';
    const THEME_KEY = 'suaranote_theme';
    const PWA_BANNER_KEY = 'suaranote_pwa_dismissed';

    // Konjungsi Bahasa Indonesia untuk aturan penambahan koma
    const CONJUNCTIONS = ['dan', 'tetapi', 'karena', 'lalu', 'kemudian', 'namun', 'sedangkan', 'sehingga', 'melainkan', 'padahal', 'serta'];

    // DOM Elements
    const recordBtn = document.getElementById('recordBtn');
    const recordBtnText = document.getElementById('recordBtnText');
    const statusText = document.getElementById('statusText');
    const badgeDot = document.getElementById('badgeDot');
    const timerDisplay = document.getElementById('timerDisplay');
    const transcriptArea = document.getElementById('transcriptArea');
    const noteTitleInput = document.getElementById('noteTitleInput');
    const interimHint = document.getElementById('interimHint');
    const interimText = document.getElementById('interimText');
    const wordCountDisplay = document.getElementById('wordCountDisplay');
    const canvas = document.getElementById('waveformCanvas');
    const canvasPlaceholder = document.getElementById('canvasPlaceholder');
    const canvasCtx = canvas ? canvas.getContext('2d') : null;
    const notesList = document.getElementById('notesList');
    const emptyNotesState = document.getElementById('emptyNotesState');
    const historyCountBadge = document.getElementById('historyCountBadge');
    const searchInput = document.getElementById('searchInput');
    const undoBanner = document.getElementById('undoBanner');

    // === SMART PAUSE HELPER FUNCTIONS ===
    function applyShortPauseComma(text) {
      if (!text) return '';
      const trimmed = text.trim();
      if (trimmed.length > 0 && !/[.,!?;:\\s]$/.test(trimmed)) {
        return trimmed + ', ';
      }
      return text;
    }

    function applyLongPausePeriod(text) {
      if (!text) return '';
      let trimmed = text.trim();
      if (/,+$/.test(trimmed)) {
        trimmed = trimmed.replace(/,+$/, '') + '. ';
      } else if (!/[.!?]$/.test(trimmed)) {
        trimmed = trimmed + '. ';
      } else {
        trimmed = trimmed + ' ';
      }
      return trimmed;
    }

    // Modal Smart Pause Controls
    function openSmartPauseModal() {
      document.getElementById('smartPauseModal').classList.remove('hidden');
      document.getElementById('smartPauseModal').classList.add('flex');
    }

    function closeSmartPauseModal() {
      document.getElementById('smartPauseModal').classList.add('hidden');
      document.getElementById('smartPauseModal').classList.remove('flex');
    }

    function toggleSmartPauseActive() {
      smartPauseEnabled = !smartPauseEnabled;
      const toggleDot = document.getElementById('smartPauseToggleDot');
      const toggleBtn = document.getElementById('smartPauseToggleBtn');
      const badge = document.getElementById('smartPauseBadge');

      if (smartPauseEnabled) {
        toggleBtn.classList.remove('bg-slate-400');
        toggleBtn.classList.add('bg-blue-600');
        toggleDot.classList.add('translate-x-5');
        badge.textContent = '⚡ Smart Pause';
        badge.className = 'text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300';
      } else {
        toggleBtn.classList.remove('bg-blue-600');
        toggleBtn.classList.add('bg-slate-400');
        toggleDot.classList.remove('translate-x-5');
        badge.textContent = 'Nonaktif';
        badge.className = 'text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400';
      }
    }

    function setSmartPausePreset(short, long) {
      shortPauseMs = short;
      longPauseMs = long;
      document.getElementById('shortPauseSlider').value = short;
      document.getElementById('longPauseSlider').value = long;
      updateSmartPauseSliders();
    }

    function updateSmartPauseSliders() {
      shortPauseMs = Number(document.getElementById('shortPauseSlider').value);
      longPauseMs = Number(document.getElementById('longPauseSlider').value);
      document.getElementById('shortPauseVal').textContent = (shortPauseMs / 1000).toFixed(1) + ' detik';
      document.getElementById('longPauseVal').textContent = (longPauseMs / 1000).toFixed(1) + ' detik';
      document.getElementById('smartPauseLabel').textContent = 'Jeda: ' + (shortPauseMs / 1000).toFixed(1) + 's (,) / ' + (longPauseMs / 1000).toFixed(1) + 's (.)';
    }

    // === POST-PROCESSING FUNCTION ===
    function formatTranscript(rawText, ensureTrailingPeriod = true) {
      if (!rawText || !rawText.trim()) return '';
      let text = rawText.trim();

      // 1. Normalisasi spasi berlebih
      text = text.replace(/[ \\t]+/g, ' ');

      // 2. Hilangkan spasi sebelum tanda baca (. , ! ? ; :)
      text = text.replace(/\\s+([.,!?;:])/g, '$1');

      // 3. Pastikan spasi setelah tanda baca jika diikuti huruf/angka
      text = text.replace(/([.,!?;:])([a-zA-Z0-9\\u00C0-\\u017F])/g, '$1 $2');

      // 4. Cegah koma atau titik berulang
      text = text.replace(/,{2,}/g, ',');
      text = text.replace(/\\.{2,}/g, '.');

      // 5. Tambahkan koma (,) sebelum kata sambung umum bila didahului kata biasa
      const conjPattern = CONJUNCTIONS.join('|');
      const conjRegex = new RegExp('([a-zA-Z0-9\\\\u00C0-\\\\u017F]+)\\\\s+\\\\b(' + conjPattern + ')\\\\b', 'gi');
      text = text.replace(conjRegex, '$1, $2');
      text = text.replace(/,\\s*,/g, ',');

      // 6. Huruf kapital di awal teks
      text = text.replace(/^([a-z\\u00C0-\\u017F])/i, m => m.toUpperCase());

      // 7. Huruf kapital setelah tanda baca akhir (. ! ?) dan spasi
      text = text.replace(/([.!?]\\s+)([a-z\\u00C0-\\u017F])/g, (_, p1, p2) => p1 + p2.toUpperCase());

      // 8. Huruf kapital setelah baris baru
      text = text.replace(/(\\n\\s*)([a-z\\u00C0-\\u017F])/g, (_, p1, p2) => p1 + p2.toUpperCase());

      // 9. Tambahkan titik di akhir jika belum ada tanda penutup
      if (ensureTrailingPeriod && text.length > 0 && !/[.!?]$/.test(text)) {
        text += '.';
      }

      return text;
    }

    // === AI PROOFREADER CONFIGURATION & LOGIC ===
    let aiProvider = localStorage.getItem('suaranote_ai_provider') || 'gemini';
    let customApiKey = localStorage.getItem('suaranote_custom_api_key') || '';
    let isAiProofreading = false;

    function openAiSettingsModal() {
      document.getElementById('customApiKeyInput').value = customApiKey;
      selectAiProvider(aiProvider);
      document.getElementById('aiSettingsModal').classList.remove('hidden');
      document.getElementById('aiSettingsModal').classList.add('flex');
    }

    function closeAiSettingsModal() {
      document.getElementById('aiSettingsModal').classList.add('hidden');
      document.getElementById('aiSettingsModal').classList.remove('flex');
    }

    function selectAiProvider(provider) {
      aiProvider = provider;
      const geminiBtn = document.getElementById('providerGeminiBtn');
      const groqBtn = document.getElementById('providerGroqBtn');
      if (provider === 'gemini') {
        geminiBtn.className = 'p-2.5 rounded-xl border text-center font-semibold transition border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300';
        groqBtn.className = 'p-2.5 rounded-xl border text-center font-semibold transition border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
      } else {
        groqBtn.className = 'p-2.5 rounded-xl border text-center font-semibold transition border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300';
        geminiBtn.className = 'p-2.5 rounded-xl border text-center font-semibold transition border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
      }
    }

    function saveAiSettings() {
      customApiKey = document.getElementById('customApiKeyInput').value.trim();
      localStorage.setItem('suaranote_ai_provider', aiProvider);
      localStorage.setItem('suaranote_custom_api_key', customApiKey);
      closeAiSettingsModal();
      showToast('Pengaturan AI & API Key disimpan! ⚙️', '🤖');
    }

    const AI_SYSTEM_PROMPT = 'Anda adalah editor bahasa dan proofreader profesional untuk transkripsi suara bahasa Indonesia. Tugas Anda adalah merevisi teks transkripsi suara agar sesuai dengan EYD Edisi V / PUEBI, memperbaiki struktur kalimat yang berbelit-belit menjadi lebih efektif dan enak dibaca, menghilangkan kata-kata pengisi (filler words seperti: anu, ehm, kayak, apa ya, emm, dsb), namun tetap mempertahankan makna, nada, dan ide utama dari pembicara secara utuh. Outputkan HANYA teks hasil revisi akhir yang sudah bersih, rapi, dan siap dibaca tanpa salam pembuka, tanpa pengantar, tanpa kutipan markdown atau penjelasan apa pun.';

    async function runAiProofread() {
      const raw = transcriptArea.value.trim();
      if (!raw) {
        showToast('Teks masih kosong untuk diperbaiki!', '⚠️');
        return;
      }
      if (isAiProofreading) return;

      isAiProofreading = true;
      const btn = document.getElementById('aiProofreadBtn');
      const spinner = document.getElementById('aiBtnSpinner');
      const icon = document.getElementById('aiBtnIcon');
      const btnText = document.getElementById('aiBtnText');

      btn.disabled = true;
      spinner.classList.remove('hidden');
      icon.classList.add('hidden');
      btnText.textContent = 'Sedang Memperbaiki Teks (AI)...';
      showToast('Sedang merevisi EYD & tata bahasa dengan AI...', '🤖');

      try {
        let revisedResult = '';

        // 1. Coba panggil server backend jika tersedia
        try {
          const resp = await fetch('/api/proofread', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: raw,
              customApiKey: customApiKey || undefined,
              provider: aiProvider
            })
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data.revisedText) {
              revisedResult = data.revisedText;
            }
          }
        } catch (serverErr) {
          // Abaikan, lanjut ke direct client-side call bila file HTML dibuka lokal
        }

        // 2. Direct client-side API call jika backend tidak ada & API key tersedia
        if (!revisedResult && customApiKey) {
          if (aiProvider === 'groq') {
            const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + customApiKey,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                  { role: 'system', content: AI_SYSTEM_PROMPT },
                  { role: 'user', content: 'Perbaiki teks transkripsi berikut:\\n\\n' + raw }
                ],
                temperature: 0.3
              })
            });
            if (groqResp.ok) {
              const gData = await groqResp.json();
              revisedResult = gData.choices?.[0]?.message?.content?.trim();
            }
          } else {
            // Google Gemini Direct Call
            const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(customApiKey);
            const geminiResp = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  role: 'user',
                  parts: [{ text: AI_SYSTEM_PROMPT + '\\n\\nTeks transkripsi:\\n' + raw }]
                }]
              })
            });
            if (geminiResp.ok) {
              const geminiData = await geminiResp.json();
              revisedResult = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            }
          }
        }

        // 3. Jika AI berhasil, simpan ke undo & perbarui textarea
        if (revisedResult) {
          undoMemory = { transcript: raw, title: noteTitleInput.value };
          if (undoBanner) {
            undoBanner.classList.remove('hidden');
            undoBanner.classList.add('flex');
          }
          transcriptArea.value = revisedResult;
          updateWordCount();
          showToast('EYD & Tata Bahasa berhasil direvisi AI! ✨', '🪄');
        } else {
          // Fallback lokal jika offline/tanpa API key
          undoMemory = { transcript: raw, title: noteTitleInput.value };
          if (undoBanner) {
            undoBanner.classList.remove('hidden');
            undoBanner.classList.add('flex');
          }
          transcriptArea.value = formatTranscript(raw, true);
          updateWordCount();
          showToast(customApiKey ? 'API bermasalah, dirapikan lokal.' : 'Teks dirapikan! Masukkan API Key di ⚙️ untuk AI penuh.', 'ℹ️');
        }
      } catch (err) {
        console.error('Proofread error:', err);
        transcriptArea.value = formatTranscript(raw, true);
        updateWordCount();
        showToast('Teks dirapikan dengan formatter lokal.', '🪄');
      } finally {
        isAiProofreading = false;
        btn.disabled = false;
        spinner.classList.add('hidden');
        icon.classList.remove('hidden');
        btnText.textContent = '✨ Perbaiki EYD & Tata Bahasa (AI)';
      }
    }

    // Tombol Rapikan Teks Instan
    function autoFormatTranscript() {
      const val = transcriptArea.value.trim();
      if (!val) {
        showToast('Tidak ada teks untuk dirapikan!', '⚠️');
        return;
      }
      transcriptArea.value = formatTranscript(val, true);
      updateWordCount();
      showToast('Teks berhasil dirapikan! ✨', '🪄');
    }

    // Initialize Theme
    function initTheme() {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        document.getElementById('themeIcon').textContent = '☀️';
      } else {
        document.documentElement.classList.remove('dark');
        document.getElementById('themeIcon').textContent = '🌙';
      }
    }

    function toggleDarkMode() {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
      document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙';
    }

    // PWA Modal and Banner
    function openPwaModal() {
      document.getElementById('pwaModal').classList.remove('hidden');
      document.getElementById('pwaModal').classList.add('flex');
    }

    function closePwaModal() {
      document.getElementById('pwaModal').classList.add('hidden');
      document.getElementById('pwaModal').classList.remove('flex');
    }

    function dismissPwaBanner() {
      document.getElementById('pwaBanner').classList.add('hidden');
      localStorage.setItem(PWA_BANNER_KEY, 'true');
    }

    // Speech Recognition Setup
    function initSpeechRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        document.getElementById('unsupportedAlert').classList.remove('hidden');
        return null;
      }

      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = document.getElementById('langSelect').value || 'id-ID';

      shouldCapitalizeNext = !transcriptArea.value.trim() || /[.!?]\\s*$/.test(transcriptArea.value.trim());

      recognizer.onstart = () => {
        isRecording = true;
        updateUIState(true);
      };

      recognizer.onresult = (event) => {
        // 1. Batalkan timer jeda yang sedang berjalan karena kata baru sedang diproses
        if (shortPauseTimer) {
          clearTimeout(shortPauseTimer);
          shortPauseTimer = null;
        }
        if (longPauseTimer) {
          clearTimeout(longPauseTimer);
          longPauseTimer = null;
        }

        let interim = '';
        let chunkFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            chunkFinal += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (chunkFinal) {
          const currentText = transcriptArea.value.trim();
          let formattedChunk = formatTranscript(chunkFinal, false);

          if (shouldCapitalizeNext) {
            formattedChunk = formattedChunk.charAt(0).toUpperCase() + formattedChunk.slice(1);
            shouldCapitalizeNext = false;
          }

          if (!currentText) {
            formattedChunk = formattedChunk.charAt(0).toUpperCase() + formattedChunk.slice(1);
            transcriptArea.value = formattedChunk;
          } else {
            const lastChar = currentText.charAt(currentText.length - 1);
            if (/[.!?]/.test(lastChar)) {
              formattedChunk = formattedChunk.charAt(0).toUpperCase() + formattedChunk.slice(1);
              transcriptArea.value = currentText + ' ' + formattedChunk;
            } else if (lastChar === ',') {
              transcriptArea.value = currentText + ' ' + formattedChunk;
            } else {
              const firstWord = formattedChunk.split(/\\s+/)[0]?.toLowerCase();
              if (CONJUNCTIONS.includes(firstWord)) {
                transcriptArea.value = currentText + ', ' + formattedChunk;
              } else {
                transcriptArea.value = currentText + ' ' + formattedChunk;
              }
            }
          }

          // 2. Pasang Smart Pause Timer jika diaktifkan
          if (smartPauseEnabled) {
            // Jeda pendek -> koma (', ')
            shortPauseTimer = setTimeout(() => {
              transcriptArea.value = applyShortPauseComma(transcriptArea.value);
              updateWordCount();
            }, shortPauseMs);

            // Jeda panjang -> titik ('. ') & kata berikutnya huruf kapital
            longPauseTimer = setTimeout(() => {
              transcriptArea.value = applyLongPausePeriod(transcriptArea.value);
              shouldCapitalizeNext = true;
              updateWordCount();
            }, longPauseMs);
          }
        }

        updateWordCount();

        if (interim) {
          interimHint.classList.remove('hidden');
          interimText.textContent = interim;
        } else {
          interimHint.classList.add('hidden');
        }
      };

      recognizer.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          showToast('Izin mikrofon ditolak! Izinkan di browser.', '⚠️');
          stopRecording();
        }
      };

      recognizer.onend = () => {
        if (isRecording) {
          try {
            recognizer.start();
          } catch (e) {
            stopRecording();
          }
        } else {
          updateUIState(false);
        }
      };

      return recognizer;
    }

    function changeLanguage(langCode) {
      if (recognition) {
        recognition.lang = langCode;
        if (isRecording) showToast('Bahasa dialihkan ke ' + langCode, '🌐');
      }
    }

    // Toggle Recording
    async function toggleRecording() {
      if (isRecording) {
        stopRecording();
      } else {
        await startRecording();
      }
    }

    async function startRecording() {
      if (!recognition) {
        recognition = initSpeechRecognition();
      }
      if (!recognition) {
        showToast('Browser tidak mendukung Speech Recognition.', '❌');
        return;
      }

      try {
        microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        startAudioVisualizer(microphoneStream);
        startMediaRecorder(microphoneStream);

        finalTranscript = transcriptArea.value ? transcriptArea.value + ' ' : '';
        recognition.lang = document.getElementById('langSelect').value || 'id-ID';
        shouldCapitalizeNext = !transcriptArea.value.trim() || /[.!?]\\s*$/.test(transcriptArea.value.trim());
        recognition.start();

        secondsElapsed = 0;
        timerInterval = setInterval(() => {
          secondsElapsed++;
          const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
          const secs = String(secondsElapsed % 60).padStart(2, '0');
          timerDisplay.textContent = \`\${mins}:\${secs}\`;
        }, 1000);

        showToast('Merekam suara... Silakan berbicara!', '🎙️');
      } catch (err) {
        console.error('Mic access error:', err);
        showToast('Gagal mengakses mikrofon. Periksa izin browser.', '⚠️');
        stopRecording();
      }
    }

    function stopRecording() {
      isRecording = false;
      if (shortPauseTimer) {
        clearTimeout(shortPauseTimer);
        shortPauseTimer = null;
      }
      if (longPauseTimer) {
        clearTimeout(longPauseTimer);
        longPauseTimer = null;
      }
      if (recognition) {
        try { recognition.stop(); } catch(e){}
      }
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      if (microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
        microphoneStream = null;
      }
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      stopAudioVisualizer();
      updateUIState(false);
      interimHint.classList.add('hidden');

      // Auto-format hasil transkripsi saat selesai
      const curText = transcriptArea.value.trim();
      if (curText) {
        transcriptArea.value = formatTranscript(curText, true);
        updateWordCount();
      }
    }

    function updateUIState(recording) {
      if (recording) {
        recordBtn.className = 'col-span-2 py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-rose-500/25 active:scale-[0.98] transition animate-pulse';
        recordBtnText.textContent = 'Berhenti Rekam';
        statusText.textContent = 'Mendengarkan...';
        statusText.className = 'text-rose-600 dark:text-rose-400 font-bold';
        badgeDot.className = 'w-2 h-2 rounded-full bg-rose-500 animate-ping';
        canvasPlaceholder.classList.add('hidden');
      } else {
        recordBtn.className = 'col-span-2 py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25 active:scale-[0.98] transition';
        recordBtnText.textContent = 'Mulai Rekam';
        statusText.textContent = 'Siap Merekam';
        statusText.className = '';
        badgeDot.className = 'w-2 h-2 rounded-full bg-slate-400';
        canvasPlaceholder.classList.remove('hidden');
      }
    }

    // MediaRecorder for Audio Playback
    function startMediaRecorder(stream) {
      try {
        recordedAudioChunks = [];
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedAudioChunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedAudioChunks, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            currentAudioDataUrl = reader.result;
          };
          reader.readAsDataURL(blob);
        };
        mediaRecorder.start();
      } catch (e) {}
    }

    // Audio Visualizer with HTML5 Canvas
    function startAudioVisualizer(stream) {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function drawWave() {
          if (!isRecording) return;
          animationFrameId = requestAnimationFrame(drawWave);
          analyser.getByteFrequencyData(dataArray);

          if (!canvasCtx) return;
          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

          const barWidth = (canvas.width / bufferLength) * 1.5;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height * 0.9 + 4;
            const isDark = document.documentElement.classList.contains('dark');
            canvasCtx.fillStyle = isDark ? '#f472b6' : '#fb7185';
            canvasCtx.beginPath();
            canvasCtx.roundRect(x, (canvas.height - barHeight) / 2, barWidth - 2, barHeight, 4);
            canvasCtx.fill();
            x += barWidth;
          }
        }
        drawWave();
      } catch (e) {}
    }

    function stopAudioVisualizer() {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
        audioContext = null;
      }
      if (canvasCtx && canvas) {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Audio Upload Handler
    function handleAudioUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      document.getElementById('audioFileName').textContent = file.name;
      document.getElementById('audioElement').src = URL.createObjectURL(file);
      document.getElementById('audioPlayerContainer').classList.remove('hidden');

      const reader = new FileReader();
      reader.onloadend = () => {
        currentAudioDataUrl = reader.result;
      };
      reader.readAsDataURL(file);

      if (!noteTitleInput.value.trim()) {
        noteTitleInput.value = file.name.replace(/\\.[^/.]+$/, "");
      }
      showToast('Audio dimuat! Putar dan Anda dapat mendiktekan isinya.', '🎵');
    }

    function removeUploadedAudio() {
      document.getElementById('audioPlayerContainer').classList.add('hidden');
      document.getElementById('audioElement').src = '';
      document.getElementById('audioFileInput').value = '';
      currentAudioDataUrl = null;
    }

    // Category Tag Selection
    function selectTag(tagName) {
      selectedTag = tagName;
      document.querySelectorAll('.tag-btn').forEach(btn => {
        if (btn.textContent.includes(tagName)) {
          btn.className = 'tag-btn px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-xs';
        } else {
          btn.className = 'tag-btn px-3 py-1 rounded-full bg-pink-50/80 dark:bg-[#2b1630] text-pink-700 dark:text-pink-300 font-bold border border-pink-100 dark:border-[#3d2044] hover:bg-pink-100 transition';
        }
      });
    }

    function updateWordCount() {
      const text = transcriptArea.value.trim();
      const words = text ? text.split(/\\s+/).filter(Boolean).length : 0;
      wordCountDisplay.textContent = \`\${words} kata\`;
    }

    transcriptArea.addEventListener('input', updateWordCount);

    // Save Note to LocalStorage
    function saveNote() {
      const content = transcriptArea.value.trim();
      if (!content) {
        showToast('Catatan masih kosong! Bicara atau ketik terlebih dahulu.', '⚠️');
        return;
      }

      const title = noteTitleInput.value.trim() || content.slice(0, 32) + (content.length > 32 ? '...' : '');
      const notes = getStoredNotes();

      const newNote = {
        id: 'note_' + Date.now(),
        title: title,
        content: content,
        tag: selectedTag,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        durationSeconds: secondsElapsed || 0,
        wordCount: content.split(/\\s+/).filter(Boolean).length,
        language: document.getElementById('langSelect').value || 'id-ID',
        audioDataUrl: currentAudioDataUrl || null
      };

      notes.unshift(newNote);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      showToast('Catatan suara tersimpan ke HP!', '💾');
      renderNotes();
    }

    function getStoredNotes() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch (e) {
        return [];
      }
    }

    function renderNotes() {
      const notes = getStoredNotes();
      const query = (searchInput.value || '').toLowerCase();
      const filtered = notes.filter(n => 
        n.title.toLowerCase().includes(query) || 
        n.content.toLowerCase().includes(query) ||
        (n.tag && n.tag.toLowerCase().includes(query))
      );

      historyCountBadge.textContent = notes.length;

      if (filtered.length === 0) {
        notesList.innerHTML = '';
        emptyNotesState.classList.remove('hidden');
        return;
      }

      emptyNotesState.classList.add('hidden');
      notesList.innerHTML = filtered.map(note => {
        const dateStr = new Date(note.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });

        const hasAudio = !!note.audioDataUrl;

        return \`
          <div class="bg-white dark:bg-[#251528] border border-pink-100 dark:border-[#422448] rounded-3xl p-4 shadow-sm space-y-2 hover:border-pink-300 dark:hover:border-pink-500/50 transition">
            <div class="flex items-start justify-between">
              <div>
                <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/40 mb-1">
                  \${note.tag || '🌸 Catatan'}
                </span>
                <h3 class="font-bold text-sm text-slate-800 dark:text-pink-100 leading-snug">\${escapeHtml(note.title)}</h3>
              </div>
              <div class="flex items-center space-x-1">
                <button onclick="copyNoteText('\${note.id}')" class="p-1.5 rounded-xl text-slate-500 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-[#341b3a] transition" title="Salin Teks">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                </button>
                <button onclick="loadNoteToEditor('\${note.id}')" class="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-[#341b3a] transition" title="Edit di Atas">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button onclick="deleteNote('\${note.id}')" class="p-1.5 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-[#341b3a] transition" title="Hapus">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>

            <p class="text-xs text-slate-600 dark:text-pink-200/80 line-clamp-3 leading-relaxed whitespace-pre-line">\${escapeHtml(note.content)}</p>

            \${hasAudio ? \`
              <div class="pt-1">
                <audio controls src="\${note.audioDataUrl}" class="w-full h-8 accent-pink-500"></audio>
              </div>
            \` : ''}

            <div class="flex items-center justify-between text-[11px] text-pink-400 dark:text-pink-300/60 pt-2 border-t border-pink-100 dark:border-[#381d3f]">
              <span>\${dateStr}</span>
              <span>\${note.wordCount || 0} kata</span>
            </div>
          </div>
        \`;
      }).join('');
    }

    function copyNoteText(id) {
      const notes = getStoredNotes();
      const note = notes.find(n => n.id === id);
      if (note) {
        navigator.clipboard.writeText(note.content);
        showToast('Teks catatan disalin ke clipboard!', '📋');
      }
    }

    function loadNoteToEditor(id) {
      const notes = getStoredNotes();
      const note = notes.find(n => n.id === id);
      if (note) {
        noteTitleInput.value = note.title;
        transcriptArea.value = note.content;
        selectTag(note.tag || 'Ide');
        updateWordCount();
        if (note.audioDataUrl) {
          currentAudioDataUrl = note.audioDataUrl;
          document.getElementById('audioElement').src = note.audioDataUrl;
          document.getElementById('audioPlayerContainer').classList.remove('hidden');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast('Catatan dimuat ke editor!', '✍️');
      }
    }

    let pendingDeleteId = null;

    function deleteNote(id) {
      const notes = getStoredNotes();
      const note = notes.find(n => n.id === id);
      if (!note) return;
      pendingDeleteId = id;
      document.getElementById('deleteNoteTitle').textContent = note.title || 'Catatan Tanpa Judul';
      const modal = document.getElementById('deleteConfirmModal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    function closeDeleteConfirmModal() {
      pendingDeleteId = null;
      const modal = document.getElementById('deleteConfirmModal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    function confirmDeleteNote() {
      if (!pendingDeleteId) return;
      let notes = getStoredNotes();
      notes = notes.filter(n => n.id !== pendingDeleteId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      closeDeleteConfirmModal();
      renderNotes();
      showToast('Catatan telah dihapus.', '🗑️');
    }

    function copyCurrentTranscript() {
      const text = transcriptArea.value.trim();
      if (!text) {
        showToast('Tidak ada teks untuk disalin!', '⚠️');
        return;
      }
      navigator.clipboard.writeText(text);
      showToast('Teks berhasil disalin!', '📋');
    }

    // Tombol Bersihkan tanpa confirm yang diblokir + Undo
    function clearCurrentTranscript() {
      const currentText = transcriptArea.value.trim();
      const currentTitle = noteTitleInput.value.trim();
      if (!currentText && !currentTitle && !currentAudioDataUrl) {
        showToast('Editor sudah kosong.', 'ℹ️');
        return;
      }

      undoMemory = { text: transcriptArea.value, title: noteTitleInput.value };
      transcriptArea.value = '';
      finalTranscript = '';
      noteTitleInput.value = '';
      removeUploadedAudio();
      updateWordCount();
      timerDisplay.textContent = '00:00';

      undoBanner.classList.remove('hidden');
      undoBanner.classList.add('flex');
      showToast('Editor dibersihkan! Ketuk Urungkan untuk batal.', '🧹');
    }

    function undoClear() {
      if (!undoMemory) return;
      transcriptArea.value = undoMemory.text;
      noteTitleInput.value = undoMemory.title;
      undoMemory = null;
      undoBanner.classList.add('hidden');
      undoBanner.classList.remove('flex');
      updateWordCount();
      showToast('Teks berhasil dikembalikan!', '↩️');
    }

    function exportAllNotes() {
      const notes = getStoredNotes();
      if (notes.length === 0) {
        showToast('Belum ada catatan untuk diunduh.', '⚠️');
        return;
      }
      let content = '=== VOICE-TEXT PUNYA VINA - CATATAN SUARA ===\\n\\n';
      notes.forEach((n, idx) => {
        content += \`[\${idx + 1}] \${n.title} (\${new Date(n.createdAt).toLocaleString('id-ID')})\\n\`;
        content += \`Kategori: \${n.tag || '-'} | Kata: \${n.wordCount}\\n\`;
        content += \`----------------------------------------\\n\`;
        content += \`\${n.content}\\n\\n========================================\\n\\n\`;
      });

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`catatan_suara_\${new Date().toISOString().slice(0, 10)}.txt\`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('File TXT berhasil diunduh!', '📥');
    }

    function showToast(message, icon = '✅') {
      const toast = document.getElementById('toast');
      document.getElementById('toastMsg').textContent = message;
      document.getElementById('toastIcon').textContent = icon;
      toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-3');
      toast.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-3');
      }, 2500);
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Initialize App
    window.addEventListener('DOMContentLoaded', () => {
      initTheme();
      if (localStorage.getItem(PWA_BANNER_KEY) === 'true') {
        document.getElementById('pwaBanner').classList.add('hidden');
      }
      renderNotes();
      selectTag('Ide');
    });
  </script>
</body>
</html>`;
