"""
benchmark_sentiment.py
----------------------
Mengukur waktu inferensi IndoBERT SEBELUM (single) vs SESUDAH (batch),
sekaligus memverifikasi hasil prediksi IDENTIK.

Cara pakai (jalankan dari root folder backend):
    python tools/benchmark_sentiment.py

Script ini pakai app context supaya sentiment_service bisa baca config.
"""
import time
from app import create_app
from app.services import data_loader
from app.services.sentiment_service import sentiment_service


def main():
    app = create_app()
    with app.app_context():
        sentiment_service.init_model()

        # Ambil 200 komentar (simulasi hasil semantic search)
        comments = data_loader.get_all_comments()[:200]
        texts = [c.get("normalized_text") or c.get("text") or "" for c in comments]
        print(f"Menguji {len(texts)} komentar\n")

        # ---------- CARA LAMA: single (satu per satu) ----------
        t0 = time.time()
        single_results = [sentiment_service.predict_sentiment(t)["sentiment"] for t in texts]
        t_single = time.time() - t0
        print(f"[SEBELUM] Single inference : {t_single:.2f} detik")

        # ---------- CARA BARU: batch 32 ----------
        t0 = time.time()
        batch_results = sentiment_service.predict_batch(texts, batch_size=32)
        t_batch = time.time() - t0
        print(f"[SESUDAH] Batch inference   : {t_batch:.2f} detik")

        # ---------- Perbandingan kecepatan ----------
        if t_batch > 0:
            speedup = t_single / t_batch
            print(f"\nSpeedup: {speedup:.1f}x lebih cepat "
                  f"(hemat {t_single - t_batch:.1f} detik)")

        # ---------- Verifikasi IDENTIK ----------
        beda = [(i, s, b) for i, (s, b) in enumerate(zip(single_results, batch_results)) if s != b]
        total = len(texts)
        sama = total - len(beda)
        print(f"\nVerifikasi hasil:")
        print(f"  Identik : {sama}/{total} ({sama/total*100:.1f}%)")
        if beda:
            print(f"  Berbeda : {len(beda)} komentar")
            for i, s, b in beda[:5]:
                print(f"    #{i}: single='{s}' vs batch='{b}'  | {texts[i][:60]}")
        else:
            print("  ✅ 100% IDENTIK — batch tidak mengubah output model.")


if __name__ == "__main__":
    main()
