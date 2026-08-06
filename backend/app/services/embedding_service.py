from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

import csv
import os


class EmbeddingService:

    def __init__(self):
        self.model = None
        self.comment_embeddings = None
        self.comments = []

    def load_model(self):

        if self.model is None:

            print("Loading Embedding Model...")

            self.model = SentenceTransformer(
                "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
            )

            print("Embedding Model Loaded.")

    def build_embeddings(self, comments):
        """
        Encode seluruh komentar sekali saja.
        """

        self.load_model()

        self.comments = comments

        texts = [
            c.get("normalized_text", "")
            for c in comments
        ]

        print("=" * 60)
        print("DEBUG DATA YANG DI-EMBEDDING")
        print("=" * 60)

        for i in range(10):
            print(f"\nDATA #{i+1}")
            print("TEXT       :", comments[i]["text"][:120])
            print("NORMALIZED :", texts[i])

        print("=" * 60)

        self.comment_embeddings = self.model.encode(
            texts,
            convert_to_numpy=True,
            show_progress_bar=True
        )

    def search(self, keyword, top_k=200, threshold=0.45):

        self.load_model()

        query_embedding = self.model.encode(
            [keyword],
            convert_to_numpy=True
        )

        print("=" * 60)
        print("QUERY")
        print("=" * 60)
        print(keyword)

        similarity = cosine_similarity(
            query_embedding,
            self.comment_embeddings
        )[0]

        print("\nSTATISTIK SIMILARITY")
        print(f"Max  : {similarity.max():.3f}")
        print(f"Mean : {similarity.mean():.3f}")
        print(f"Min  : {similarity.min():.3f}")

        print("\nJUMLAH HASIL PER THRESHOLD")
        print(f">0.50 : {(similarity > 0.50).sum()}")
        print(f">0.45 : {(similarity > 0.45).sum()}")
        print(f">0.40 : {(similarity > 0.40).sum()}")
        print(f">0.35 : {(similarity > 0.35).sum()}")
        print(f">0.30 : {(similarity > 0.30).sum()}")

        # ===============================
        # DEBUG SEMANTIC SEARCH
        # ===============================
        print("=" * 60)
        print("QUERY")
        print("=" * 60)
        print(keyword)

        print("\nSTATISTIK SIMILARITY")
        print(f"Max  : {similarity.max():.3f}")
        print(f"Mean : {similarity.mean():.3f}")
        print(f"Min  : {similarity.min():.3f}")

        print("\nJUMLAH HASIL PER THRESHOLD")
        print(f"> 0.50 : {np.sum(similarity > 0.50)}")
        print(f"> 0.45 : {np.sum(similarity > 0.45)}")
        print(f"> 0.40 : {np.sum(similarity > 0.40)}")
        print(f"> 0.35 : {np.sum(similarity > 0.35)}")
        print(f"> 0.30 : {np.sum(similarity > 0.30)}")

        top_idx = np.argsort(similarity)[::-1]
        print(self.comments[1594])

        print("\nTOP 20 SIMILARITY")
        print("=" * 60)

        for idx in top_idx[:20]:
            print("=" * 60)
            print("INDEX      :", idx)
            print("SIMILARITY :", round(similarity[idx], 3))
            print("TEXT       :", self.comments[idx]["text"][:120])
            print("NORMALIZED :", self.comments[idx]["normalized_text"])
            print("SENTIMENT  :", self.comments[idx]["sentiment"])

        results = []

        for idx in top_idx:

            score = similarity[idx]

            if score < threshold:
                continue

            comment = self.comments[idx].copy()
            comment["similarity"] = float(score)

            results.append(comment)

            if len(results) >= top_k:
                break

        print("="*60)
        print("HASIL SEMANTIC SEARCH")
        print("="*60)

        for r in results[:10]:
            print(
                round(r["similarity"],3),
                "|",
                r["text"][:120]
            )
        print("="*70 + "\n")

        # ===============================
        # Simpan hasil semantic search
        # ===============================
        os.makedirs("logs", exist_ok=True)

        filename = f"logs/semantic_search_{keyword.replace(' ', '_')}.csv"

        with open(filename, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.writer(f)

            writer.writerow([
                "Rank",
                "Similarity",
                "Sentiment",
                "Comment"
            ])

            for rank, r in enumerate(results, start=1):
                writer.writerow([
                    rank,
                    round(r["similarity"], 4),
                    r.get("sentiment", ""),
                    r.get("text", "")
                ])

        print(f"CSV disimpan ke: {filename}")

        print("=" * 60)
        print("STATISTIK SEMANTIC SEARCH")
        print("=" * 60)
        print(f"Keyword              : {keyword}")
        print(f"Threshold            : {threshold}")
        print(f"Top K                : {top_k}")
        print(f"Jumlah hasil         : {len(results)}")

        if results:
            print(f"Similarity tertinggi : {results[0]['similarity']:.3f}")
            print(f"Similarity terendah  : {results[-1]['similarity']:.3f}")

        print("=" * 60)
        return results



embedding_service = EmbeddingService()

