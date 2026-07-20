from flask import Blueprint, request, jsonify
from app.services.sentiment_service import sentiment_service
import random

insight_bp = Blueprint('insight', __name__)

@insight_bp.route('/api/insights', methods=['GET'])
def get_insights():
    keyword = request.args.get('keyword', '').strip()
    
    if not keyword:
        # Default fallback general mock values if no keyword is queried yet
        return jsonify({
            "total_comments": 424,
            "distribution": {
                "Negatif": 48,
                "Positif": 32,
                "Netral": 20
            },
            "pain_points": [
                {"text": "Antrian lama di RS", "count": "486 komentar", "pct": 85},
                {"text": "Biaya yang mahal", "count": "250 komentar", "pct": 60},
                {"text": "Dokter judes/galak", "count": "150 komentar", "pct": 40},
                {"text": "Pelayanan lambat", "count": "87 komentar", "pct": 25},
                {"text": "Ruang tunggu kotor", "count": "36 komentar", "pct": 10}
            ],
            "trend": {
                "labels": ["10 Mei", "14 Mei", "18 Mei", "22 Mei", "26 Mei", "30 Mei", "03 Juni"],
                "positive": [120, 100, 110, 80, 75, 55, 50],
                "negative": [70, 90, 85, 95, 110, 115, 125],
                "neutral": [140, 135, 142, 130, 125, 138, 132]
            }
        })
        
    # If a keyword is provided, we simulate comments and run them through sentiment analysis!
    # This shows real IndoBERT/Rule-Based analysis in action.
    simulated_comments = []
    
    # Generate some dynamic mock comments containing keywords
    neg_comments = [
        f"Aduh kesel banget pelayanan {keyword} lama sekali, nunggu berjam-jam bikin capek.",
        f"Sistem penanganan {keyword} buruk sekali, petugasnya judes dan lamban.",
        f"Kecewa dengan {keyword}, antriannya mengular panjang dan tidak tertib.",
        f"Mengapa biaya untuk {keyword} mahal sekali? Rakyat kecil tidak mampu.",
        f"Loket pelayanan {keyword} kotor dan pengap sekali, tolong diperbaiki faskes.",
        f"Nunggu tindakan {keyword} dari pagi sampai siang belum dipanggil juga."
    ]
    
    pos_comments = [
        f"Pelayanan {keyword} sekarang sangat memuaskan, cepat dan dokternya ramah.",
        f"Terima kasih BPJS, biaya {keyword} saya sepenuhnya gratis dan mudah diklaim.",
        f"Dokter faskes sangat informatif menjelaskan soal {keyword}, saya merasa terbantu.",
        f"Fasilitas ruang tunggu {keyword} bersih, ber-AC, dan nyaman sekarang.",
        f"Prosedur pendaftaran {keyword} online sangat memotong waktu antrean fisik."
    ]
    
    neu_comments = [
        f"Kemarin saya mencoba pendaftaran {keyword}, prosedurnya biasa saja.",
        f"Apakah {keyword} ditanggung oleh semua jenis asuransi?",
        f"Menunggu info terbaru mengenai jadwal pelayanan {keyword} minggu depan.",
        f"Bagaimana alur rujukan dari puskesmas untuk pemeriksaan {keyword}?"
    ]
    
    # Mix comments based on standard sentiment expectation (e.g. 50% neg, 30% pos, 20% neu)
    random.seed(len(keyword)) # consistent mock comments for the same keyword
    for _ in range(15):
        simulated_comments.append(random.choice(neg_comments))
    for _ in range(9):
        simulated_comments.append(random.choice(pos_comments))
    for _ in range(6):
        simulated_comments.append(random.choice(neu_comments))
        
    # Run through Sentiment Service
    neg_count = 0
    pos_count = 0
    neu_count = 0
    
    for comment in simulated_comments:
        res = sentiment_service.predict_sentiment(comment)
        sent = res["sentiment"]
        if sent == "Negatif":
            neg_count += 1
        elif sent == "Positif":
            pos_count += 1
        else:
            neu_count += 1
            
    total = len(simulated_comments)
    neg_pct = round((neg_count / total) * 100)
    pos_pct = round((pos_count / total) * 100)
    neu_pct = 100 - neg_pct - pos_pct # make sure it sums to 100
    
    # Calculate pain points dynamically based on keyword
    pain_points = [
        {"text": f"Waktu tunggu {keyword}", "count": f"{random.randint(150, 300)} komentar", "pct": random.randint(70, 95)},
        {"text": f"Biaya penanganan {keyword}", "count": f"{random.randint(80, 150)} komentar", "pct": random.randint(50, 70)},
        {"text": f"Keramahan petugas {keyword}", "count": f"{random.randint(40, 80)} komentar", "pct": random.randint(30, 50)},
        {"text": f"Informasi regulasi {keyword}", "count": f"{random.randint(20, 40)} komentar", "pct": random.randint(15, 30)}
    ]
    
    # Sort pain points by percentage
    pain_points.sort(key=lambda x: x["pct"], reverse=True)
    
    # Generate dynamic 7-point trend line data
    positive_trend = [random.randint(40, 100) for _ in range(7)]
    negative_trend = [random.randint(60, 130) for _ in range(7)]
    neutral_trend = [random.randint(80, 140) for _ in range(7)]
    
    return jsonify({
        "total_comments": total * 10, # scaled to look realistic
        "distribution": {
            "Negatif": neg_pct,
            "Positif": pos_pct,
            "Netral": neu_pct
        },
        "pain_points": pain_points,
        "trend": {
            "labels": ["10 Mei", "14 Mei", "18 Mei", "22 Mei", "26 Mei", "30 Mei", "03 Juni"],
            "positive": positive_trend,
            "negative": negative_trend,
            "neutral": neutral_trend
        }
    })
