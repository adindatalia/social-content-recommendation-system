export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-teal-600/30">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-[17px] tracking-tight text-zinc-900">SehatFlow Content</span>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-[10px] font-bold tracking-wider uppercase">
          Decision Support System
        </div>
      </div>
    </header>
  );
}
