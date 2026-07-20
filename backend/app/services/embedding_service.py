from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


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

        similarity = cosine_similarity(
            query_embedding,
            self.comment_embeddings
        )[0]

        top_idx = np.argsort(similarity)[::-1]

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
        return results


embedding_service = EmbeddingService()