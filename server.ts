import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const SYSTEM_INSTRUCTION = `Bertindaklah sebagai AI Proofreader & Editor Bahasa Indonesia profesional.
Tugas Anda:
1. Merevisi teks input agar sesuai dengan Pedoman Umum Ejaan Bahasa Indonesia (PUEBI/EYD Edisi V).
2. Perbaiki tata bahasa, pilihan kata (diksi), dan konjugasi kata agar kalimat efektif, rapi, dan mengalir natural.
3. Hilangkan kata-kata pengisi (filler words seperti 'anu', 'ehm', 'kayak', 'apa ya', 'gitu', dll) yang biasa muncul saat berbicara.
4. Pertahankan makna dan konteks asli dari pesan pembicara.
5. PENTING: HANYA berikan hasil teks revisi akhir saja. JANGAN menyertakan pembuka seperti "Berikut hasilnya:", catatan penjelas, atau tanda kutip di awal/akhir teks.`;

// API Endpoint: /api/proofread
app.post('/api/proofread', async (req: Request, res: Response) => {
  try {
    const { text, customApiKey, provider } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Teks tidak boleh kosong' });
    }

    // 1. Jika pengguna memilih Groq API
    if (provider === 'groq' && customApiKey) {
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customApiKey.trim()}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_INSTRUCTION },
            { role: 'user', content: text }
          ],
          temperature: 0.3,
        })
      });

      if (!groqResponse.ok) {
        const errText = await groqResponse.text();
        console.error('Groq API error:', errText);
        return res.status(groqResponse.status).json({
          error: 'Gagal menghubungi Groq API. Periksa API Key Anda.'
        });
      }

      const groqData = await groqResponse.json();
      const revisedText = groqData.choices?.[0]?.message?.content?.trim();
      return res.json({ revisedText });
    }

    // 2. Gunakan Google Gemini API (menggunakan custom key jika ada, atau GEMINI_API_KEY dari env)
    const geminiKey = customApiKey?.trim() || process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      return res.status(400).json({
        error: 'API Key tidak ditemukan. Masukkan API Key gratis di menu Pengaturan AI atau Secrets.'
      });
    }

    const ai = new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nTeks yang harus direvisi:\n"""\n${text}\n"""` }] }
      ],
      config: {
        temperature: 0.2,
      }
    });

    const revisedText = response.text?.trim() || text;
    return res.json({ revisedText });

  } catch (error: any) {
    console.error('Server proofread error:', error);
    return res.status(500).json({
      error: error.message || 'Terjadi kesalahan saat memproses revisi AI'
    });
  }
});

// Server frontend integration
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
