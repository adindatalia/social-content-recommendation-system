import type { HistoryItem } from "@/lib/types";

// ─── Riwayat awal (mock) ───
export const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: "hist-1",
    keyword: "Antrian lama di RS",
    angle: "Address Pain Point",
    periode: "7",
    timestamp: "23 Juni 2026, 14:30",
    result: {
      keyword: "Antrian lama di RS",
      angle: "Address Pain Point",
      periode: "7",
      timestamp: "23 Juni 2026, 14:30",
      analysis: {
        keyword: "Antrian lama di RS",
        total_comments: 486,
        distribution: { Negatif: 68, Netral: 20, Positif: 12 },
        dominant_phrases: {
          negative: [
            { keyword: "antrian lama", count: 45 },
            { keyword: "menunggu berjam-jam", count: 30 },
          ],
          neutral: [{ keyword: "jadwal pendaftaran", count: 15 }],
          positive: [{ keyword: "petugas ramah", count: 8 }],
        },
        recommended_strategy: { key: "address_pain_point", label: "Address Pain Point" },
      },
      ideas: [
        {
          id: "idea-1-1",
          title: "Paham gak sih kenapa antri RS jam 5 pagi?",
          format: "TIKTOK - REELS",
          category: "Address Pain Point",
          hook: "Pernah gak sih harus antri jam 5 pagi?",
          body: "Kupas tuntas fakta sistem pendaftaran rumah sakit... Tips booking online biar gak perlu nunggu dari subuh.",
          cta: "CTA - share ke temanmu yang sering ngeluh antrian!",
          hashtags: ["antrianrs", "bpjskes", "pelayananpublik", "tipssehat"],
          justification: "67% netizen kecewa dengan waktu tunggu pendaftaran yang terlalu lama.",
        },
        {
          id: "idea-1-2",
          title: "Cara Antri RS Tanpa Ribet!",
          format: "FEED - CAROUSEL",
          category: "Address Pain Point",
          hook: "Tips jitu hindari antrian mengular...",
          body: "Cari tahu jam-jam sepi pelayanan... Gunakan aplikasi JKN Mobile untuk antrean online.",
          cta: "Simpan info ini untuk kunjungan berikutnya!",
          hashtags: ["mobilejkn", "antriancepat", "infobpjs", "sehatselalu"],
          justification: "Topik antrian online mulai dicari sejak adanya integrasi sistem baru.",
        },
        {
          id: "idea-1-3",
          title: "3 Detik Masuk Antrean Tanpa Capek",
          format: "INFOGRAFIK",
          category: "Address Pain Point",
          hook: "Visual alur antrian yang ringkas...",
          body: "Perbandingan manual vs digital... Langkah demi langkah aktivasi akun...",
          cta: "CTA - bagikan infografik ini ke keluarga!",
          hashtags: ["antreanmandiri", "rumahsakit", "layanankesehatan"],
          justification: "Infografik dengan visual simpel cenderung lebih disukai audiens.",
        },
      ],
    },
  },
  {
    id: "hist-2",
    keyword: "Biaya Scaling",
    angle: "Edukasi Informatif",
    periode: "14",
    timestamp: "22 Juni 2026, 10:15",
    result: {
      keyword: "Biaya Scaling",
      angle: "Edukasi Informatif",
      periode: "14",
      timestamp: "22 Juni 2026, 10:15",
      analysis: {
        keyword: "Biaya Scaling",
        total_comments: 214,
        distribution: { Negatif: 20, Netral: 55, Positif: 25 },
        dominant_phrases: {
          negative: [{ keyword: "gigi ngilu", count: 12 }],
          neutral: [
            { keyword: "biaya scaling gigi", count: 38 },
            { keyword: "prosedur scaling", count: 22 },
          ],
          positive: [{ keyword: "gigi lebih bersih", count: 18 }],
        },
        recommended_strategy: { key: "edukasi_informatif", label: "Edukasi Informatif" },
      },
      ideas: [
        {
          id: "idea-2-1",
          title: "Mitos vs Fakta Scaling Gigi Bikin Gigi Tipis",
          format: "FEED - CAROUSEL",
          category: "Edukasi Informatif",
          hook: "Pernah dengar kalau scaling gigi bisa bikin gigi tipis dan ngilu? Jangan percaya dulu sebelum baca slide ini!",
          body: "Sebenarnya, scaling gigi hanya membersihkan karang gigi yang keras menggunakan alat ultrasonik khusus. Karang gigi inilah yang membuat gusi meradang, bukan gigi yang dikikis. Scaling minimal 6 bulan sekali wajib agar terhindar dari penyakit gusi.",
          cta: "Bagikan ke temanmu yang masih takut scaling gigi!",
          hashtags: ["scalinggigi", "kesehatangigi", "faktagigi", "doktergigi"],
          justification: "Edukasi visual tentang scaling gigi membantu meredakan kecemasan publik.",
        },
      ],
    },
  },
];

// ─── Saran topik (chip di SearchForm) ───
export const TOPIC_SUGGESTIONS = [
  { text: "Antrian lama di RS", badge: "Urgent", badgeBg: "bg-red-50 border-red-200 text-red-700" },
  { text: "Biaya Scaling", badge: "Disorot", badgeBg: "bg-amber-50 border-amber-200 text-amber-700" },
  { text: "Pelayanan Klinik", badge: "Disorot", badgeBg: "bg-amber-50 border-amber-200 text-amber-700" },
  { text: "Awareness BPJS", badge: "Meningkat", badgeBg: "bg-red-50 border-red-200 text-red-700" },
];

// ─── Pain point (InsightSection) ───
export const PAIN_POINTS = [
  { text: "Antrian lama di RS", count: "486 komentar", pct: 85 },
  { text: "Biaya yang mahal", count: "250 komentar", pct: 60 },
  { text: "Dokter judes/galak", count: "150 komentar", pct: 40 },
  { text: "Pelayanan lambat", count: "87 komentar", pct: 25 },
  { text: "Ruang tunggu kotor", count: "36 komentar", pct: 10 },
];

// ─── Distribusi sentimen (InsightSection donut + legend) ───
export const SENTIMENT_LEGEND = [
  { label: "Negatif", pct: "48%", color: "bg-red-500" },
  { label: "Positif", pct: "32%", color: "bg-emerald-500" },
  { label: "Netral", pct: "20%", color: "bg-amber-500" },
];

// ─── Kartu pilihan angle (SearchForm Step 1) ───
export const ANGLE_OPTIONS = [
  {
    id: "Address Pain Point",
    title: "Address Pain Point",
    desc: "Fokus menjawab keluhan dan memberikan solusi praktis untuk membangun trust dengan empati.",
    badge: "URGENCY SENTIMEN TINGGI",
    badgeStyle: "bg-red-50 border-red-100 text-red-700",
    comments: "3.240 komentar relevan",
    icon: "💬",
    iconColor: "text-rose-500 bg-rose-50 border-rose-100",
  },
  {
    id: "Edukasi Informatif",
    title: "Edukasi Informatif",
    desc: "Konten edukatif yang mengulas prosedur, biaya, dan regulasi agar audiens lebih paham.",
    badge: "EDUKASI & LITERASI",
    badgeStyle: "bg-blue-50 border-blue-100 text-blue-700",
    comments: "1.250 komentar relevan",
    icon: "💡",
    iconColor: "text-amber-500 bg-amber-50 border-amber-100",
  },
  {
    id: "Showcase Positif",
    title: "Showcase Positif",
    desc: "Angkat cerita sukses, testimoni, atau layanan prima untuk membangun sentimen positif.",
    badge: "APRESIASI & PRESTASI",
    badgeStyle: "bg-orange-50 border-orange-100 text-orange-700",
    comments: "1.420 komentar relevan",
    icon: "⭐",
    iconColor: "text-yellow-500 bg-yellow-50 border-yellow-100",
  },
];

// ─── Helper warna badge angle (dipakai di HistorySection & halaman /history) ───
export function angleBadgeStyle(angle: string): string {
  const found = ANGLE_OPTIONS.find((a) => a.id === angle);
  if (found) return found.badgeStyle;
  return "bg-teal-50 border-teal-100 text-teal-700";
}
