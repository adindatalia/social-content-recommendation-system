// ─── Saran topik (chip di SearchForm) ───
export const TOPIC_SUGGESTIONS = [
  {
    text: "Antrian lama di RS",
    badge: "Urgent",
    badgeBg: "bg-red-50 border-red-200 text-red-700",
  },
  {
    text: "Biaya Scaling",
    badge: "Disorot",
    badgeBg: "bg-amber-50 border-amber-200 text-amber-700",
  },
  {
    text: "Pelayanan Klinik",
    badge: "Disorot",
    badgeBg: "bg-amber-50 border-amber-200 text-amber-700",
  },
  {
    text: "Awareness BPJS",
    badge: "Meningkat",
    badgeBg: "bg-red-50 border-red-200 text-red-700",
  },
];

// ─── Kartu pilihan strategi ───
export const ANGLE_OPTIONS = [
  {
    id: "Address Pain Point",
    title: "Address Pain Point",
    desc: "Fokus menjawab keluhan dan memberikan solusi praktis untuk membangun trust dengan empati.",
    badge: "URGENCY SENTIMEN TINGGI",
    badgeStyle: "bg-red-50 border-red-100 text-red-700",
    icon: "💬",
    iconColor:
      "text-rose-500 bg-rose-50 border-rose-100",
  },
  {
    id: "Edukasi Informatif",
    title: "Edukasi Informatif",
    desc: "Konten edukatif yang mengulas prosedur, biaya, dan regulasi agar audiens lebih paham.",
    badge: "EDUKASI & LITERASI",
    badgeStyle:
      "bg-blue-50 border-blue-100 text-blue-700",
    icon: "💡",
    iconColor:
      "text-amber-500 bg-amber-50 border-amber-100",
  },
  {
    id: "Showcase Positif",
    title: "Showcase Positif",
    desc: "Angkat cerita sukses, testimoni, atau layanan prima untuk membangun sentimen positif.",
    badge: "APRESIASI & PRESTASI",
    badgeStyle:
      "bg-orange-50 border-orange-100 text-orange-700",
    icon: "⭐",
    iconColor:
      "text-yellow-500 bg-yellow-50 border-yellow-100",
  },
];

// ─── Helper warna badge strategi ───
export function angleBadgeStyle(
  angle: string
): string {
  const found = ANGLE_OPTIONS.find(
    (a) => a.id === angle
  );

  if (found) {
    return found.badgeStyle;
  }

  return "bg-teal-50 border-teal-100 text-teal-700";
}