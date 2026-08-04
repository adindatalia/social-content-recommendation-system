import type { DominantPhrases, PhraseItem, RecommendedStrategy } from "@/lib/types";

/**
 * lib/promptBuilder.ts
 * ---------------------------------------------------------------
 * Rekonstruksi 1:1 dari backend/app/services/prompt_builder.py.
 * Tujuannya menampilkan prompt yang SESUNGGUHNYA dikirim ke LLM (Gemini)
 * di section "Prompt Engineering", memakai data ASLI yang sudah
 * dikembalikan oleh /api/generate (keyword, distribution, dominant_phrases,
 * strategy) -- bukan teks statis/mock.
 *
 * PENTING: logika di sini murni presentasional (tidak memanggil endpoint
 * baru, tidak mengubah business logic backend). Kalau template di backend
 * berubah, file ini perlu disinkronkan secara manual.
 */

type StrategyTone = { arahan: string; larangan: string };

const STRATEGY_TONE: Record<string, StrategyTone> = {
  address_pain_point: {
    arahan:
      "Fokus menjawab keluhan publik secara spesifik. Tunjukkan empati di awal, lalu berikan solusi/tindakan konkret. Bangun kepercayaan.",
    larangan:
      "DILARANG membuat konten promosi/testimoni positif. DILARANG mengabaikan pain point yang tersedia. DILARANG menyalahkan pasien.",
  },
  edukasi_informatif: {
    arahan:
      "Fokus edukasi. Jelaskan prosedur, biaya, atau regulasi dengan bahasa sederhana. Netral, informatif, dan terpercaya.",
    larangan:
      "DILARANG menggunakan gaya clickbait atau bombastis. DILARANG membuat konten yang terkesan menjual/promosi. Gunakan bahasa formal.",
  },
  showcase_positif: {
    arahan:
      "Fokus mengangkat pengalaman positif dan testimoni. Tunjukkan sisi baik layanan. Inspiratif dan meyakinkan, tapi tetap kredibel.",
    larangan:
      "DILARANG membahas keluhan/pain point. DILARANG terkesan berlebihan atau tidak realistis (hindari superlatif kosong).",
  },
};

const FORMATS = ["OPSI 1", "OPSI 2", "OPSI 3"];

const SENTIMENT_TO_PHRASE_KEY: Record<string, keyof DominantPhrases> = {
  Negatif: "negative",
  Netral: "neutral",
  Positif: "positive",
};

interface Distribution {
  Positif: number;
  Netral: number;
  Negatif: number;
}

export function buildPromptPreview(
  keyword: string,
  distribution: Distribution,
  dominantPhrases: DominantPhrases,
  strategy: RecommendedStrategy
): string {
  const distText = Object.entries(distribution)
    .map(([k, v]) => `${k}: ${v}%`)
    .join(", ");

  const phraseKey = SENTIMENT_TO_PHRASE_KEY[strategy.target_sentiment ?? "Negatif"] ?? "negative";
  const phrases: PhraseItem[] = dominantPhrases?.[phraseKey] ?? [];

  let pains: string;
  let painInstruction: string;

  if (phrases.length > 0) {
    pains = phrases.map((p, i) => `${i + 1}. ${p.keyword} (muncul ${p.count}x)`).join("\n");
    painInstruction = `WAJIB: pilih SATU frasa dominan BERBEDA dari daftar di atas untuk setiap ide (total ${phrases.length} frasa tersedia, buat 3 ide dari frasa yang berlainan bila memungkinkan). Sebutkan frasa tersebut secara eksplisit di bagian hook atau body -- jangan hanya menyinggung secara implisit.`;
  } else {
    pains = "(tidak ada frasa dominan spesifik terdeteksi dari data)";
    painInstruction =
      "Karena tidak ada frasa dominan spesifik, fokuskan ide pada tema umum sesuai strategi dan kata kunci.";
  }

  const cfg = STRATEGY_TONE[strategy.key] ?? STRATEGY_TONE.edukasi_informatif;
  const formatsList = FORMATS.join(", ");

  return `Kamu adalah content strategist untuk institusi kesehatan.
Tugasmu membuat 3 ide konten media sosial berdasarkan DATA ANALISIS SENTIMEN PUBLIK berikut. Setiap ide WAJIB berbasis data ini, BUKAN pengetahuan umum tentang topik kesehatan.

=== DATA ANALISIS (WAJIB DIPAKAI) ===
Kata kunci   : "${keyword}"
Distribusi sentimen publik: ${distText}
Frasa dominan yang terdeteksi:
${pains}

=== STRATEGI KONTEN: ${strategy.label} ===
Arahan gaya: ${cfg.arahan}
Larangan   : ${cfg.larangan}

=== ATURAN WAJIB ===
1. ${painInstruction}
2. DILARANG membuat ide generik yang bisa dipakai untuk topik kesehatan apa pun.
   Setiap ide harus terasa SPESIFIK untuk kata kunci "${keyword}" dan data di atas.
3. Bagian "justification" WAJIB menyebutkan angka/data konkret dari analisis
   di atas (persentase sentimen atau frasa dominan spesifik), bukan alasan umum.
4. Buat TEPAT 3 ide, masing-masing format berbeda: ${formatsList}.
5. Konsisten dengan strategi "${strategy.label}" -- ikuti arahan gaya, hindari larangan.

=== FORMAT OUTPUT ===
Balas HANYA dalam JSON valid (tanpa teks pembuka, tanpa markdown, tanpa \`\`\`).

{
  "ideas": [
    {
      "title": "judul menarik, maksimal 70 karakter",
      "format": "OPSI 1",
      "hook": "kalimat pembuka yang menyebutkan frasa dominan/data secara eksplisit",
      "body": "isi/script konten, 2-4 kalimat, actionable, spesifik ke data",
      "cta": "call to action yang jelas",
      "hashtags": ["tanpatandapagar", "maksimal5", "relevan"],
      "justification": "alasan berbasis DATA KONKRET di atas (sebutkan angka/frasa dominan spesifik)"
    }
  ]
}

Pastikan ada TEPAT 3 objek di "ideas", satu untuk tiap format: ${formatsList}.
Gunakan Bahasa Indonesia yang natural.`;
}
