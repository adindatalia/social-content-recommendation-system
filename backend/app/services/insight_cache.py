"""
insight_cache.py
------------------
Cache in-memory untuk ringkasan insight umum (GET /api/insights).
Dataset statis, jadi dihitung SEKALI saat server startup, di dalam app
context (lihat app/__init__.py), lalu disimpan di sini.

Route /api/insights (app/routes/insight.py) HANYA membaca cache ini --
tidak pernah menghitung ulang saat ada request. Kalau cache masih
kosong (precompute gagal saat startup), route akan balas 503.
"""

_general_summary: dict | None = None


def get() -> dict | None:
    return _general_summary


def set(value: dict) -> None:
    global _general_summary
    _general_summary = value


def is_ready() -> bool:
    return _general_summary is not None
