import os
import json
import re
import uuid
import logging

import google.generativeai as genai

from google.api_core.exceptions import ResourceExhausted
from app.services.prompt_builder import build_prompt


logger = logging.getLogger(__name__)

GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-flash-latest"
)

GEMINI_KEYS = [
    os.getenv("GEMINI_API_KEY_1"),
    os.getenv("GEMINI_API_KEY_2"),
    os.getenv("GEMINI_API_KEY_3"),
]


def _configure_gemini(api_key):
    if not api_key:
        raise RuntimeError(
            "Gemini API Key kosong"
        )

    genai.configure(
        api_key=api_key
    )


def _generate_with_gemini(prompt):
    last_error = None

    for i, api_key in enumerate(GEMINI_KEYS):

        if not api_key:
            continue

        try:
            print("=" * 60)
            print(f"Menggunakan Gemini API #{i + 1}")
            print(f"Model : {GEMINI_MODEL}")
            print("=" * 60)

            _configure_gemini(api_key)

            model = genai.GenerativeModel(
                GEMINI_MODEL
            )

            response = model.generate_content(
                prompt,
                request_options={
                    "timeout": 60
                }
            )

            print(
                f"Gemini API #{i + 1} berhasil.\n"
            )

            return response.text

        except ResourceExhausted as e:
            print(
                f"Quota API #{i + 1} habis"
            )
            last_error = e

        except Exception as e:
            print(
                f"API #{i + 1} gagal: {e}"
            )
            last_error = e

    if last_error:
        raise last_error

    raise RuntimeError(
        "Tidak ada Gemini API Key yang tersedia."
    )


def _extract_json(raw_text: str) -> dict:
    """
    Mengambil JSON dari response Gemini.
    """

    text = raw_text.strip()

    # Buang markdown fence
    if text.startswith("```"):
        text = re.sub(
            r"^```(?:json)?",
            "",
            text
        ).strip()

        text = re.sub(
            r"```$",
            "",
            text
        ).strip()

    # Cari object JSON jika ada teks tambahan
    if not text.startswith("{"):
        start = text.find("{")
        end = text.rfind("}")

        if start != -1 and end != -1:
            text = text[start:end + 1]

    return json.loads(text)


def _normalize_body(body):
    if isinstance(body, str):
        return body.strip()

    if isinstance(body, list):

        result = []

        for item in body:

            if isinstance(item, str):
                result.append(item)

            elif isinstance(item, dict):
                text = item.get(
                    "text",
                    ""
                )

                if text:
                    result.append(text)

        return "\n".join(result)

    return str(body)


def _sanitize_ideas(ideas: list) -> list:
    """
    Memastikan setiap ide memiliki field
    yang dibutuhkan frontend.
    """

    cleaned = []

    for idea in ideas:

        if not isinstance(idea, dict):
            continue

        hashtags = idea.get(
            "hashtags",
            []
        )

        if not isinstance(
            hashtags,
            list
        ):
            hashtags = [
                str(hashtags)
            ]

        cleaned.append({
            "id": str(
                uuid.uuid4()
            )[:8],

            "title": str(
                idea.get(
                    "title",
                    ""
                )
            ).strip(),

            "format": str(
                idea.get(
                    "format",
                    ""
                )
            ).strip().upper(),

            "hook": str(
                idea.get(
                    "hook",
                    ""
                )
            ).strip(),

            "body": _normalize_body(
                idea.get(
                    "body",
                    ""
                )
            ),

            "cta": str(
                idea.get(
                    "cta",
                    ""
                )
            ).strip(),

            "hashtags": hashtags,

            "justification": str(
                idea.get(
                    "justification",
                    ""
                )
            ).strip(),
        })

    return cleaned


def generate_ideas(
    topic: str,
    comment: str,
    sentiment: str,
    strategy: dict
) -> list:
    """
    Generate ide konten berdasarkan:

    - topik
    - satu komentar user
    - hasil sentimen IndoBERTweet
    - strategi yang ditentukan sistem

    Confidence tidak dikirim ke LLM.
    """

    prompt = build_prompt(
        topic=topic,
        comment=comment,
        sentiment=sentiment,
        strategy=strategy
    )

    raw_text = _generate_with_gemini(
        prompt
    )

    print("=" * 50)
    print(raw_text)
    print("=" * 50)

    try:
        parsed = _extract_json(
            raw_text
        )

        print("=" * 80)
        print("HASIL JSON DARI GEMINI")
        print(
            json.dumps(
                parsed,
                indent=2,
                ensure_ascii=False
            )
        )
        print("=" * 80)

    except Exception as e:

        logger.error(
            "Gagal parse JSON: %s\nRaw:\n%s",
            e,
            raw_text[:500]
        )

        raise ValueError(
            "LLM tidak mengembalikan JSON valid"
        )

    ideas = parsed.get(
        "ideas",
        []
    )

    if not ideas:
        raise ValueError(
            "LLM tidak menghasilkan ide"
        )

    return _sanitize_ideas(
        ideas
    )