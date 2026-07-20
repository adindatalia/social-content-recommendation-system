export default function HeroSection() {
  return (
    <section className="hero-section py-20 text-center space-y-6 max-w-3xl mx-auto px-6">

      <div
        className="px-4 py-1.5 border rounded-full text-xs font-bold tracking-wide inline-flex items-center gap-1.5 shadow-sm"
        style={{
          backgroundColor: "#ccfbf1",
          borderColor: "#99f6e4",
          color: "#0f766e",
        }}
      >
        Sentiment-Driven Content Generator
      </div>

      <h1 className="font-serif text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.12] tracking-tight text-zinc-900 font-extrabold">
        Konten yang{" "}
        <span className="text-teal-600">
          menjawab
        </span>
        <br />
        kebutuhan publik
      </h1>

      <p className="text-[15px] leading-relaxed max-w-lg mx-auto text-zinc-500 font-medium">
        Pilih strategi konten berdasarkan sentimen publik.
        Sistem akan menghasilkan ide konten spesifik untuk setiap
        strategi—pain point, edukasi, maupun positive showcase.
      </p>

    </section>
  );
}