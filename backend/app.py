from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from deepface import DeepFace

backend_dir = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(backend_dir, 'voters.db')
TEMP_FOLDER = os.path.join(backend_dir, 'temp')

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/check_id', methods=['POST'])
def check_id_route():
    data = request.get_json()
    voter_id = data.get('voter_id')

    conn = get_db_connection()
    voter = conn.execute(
        "SELECT voter_id, has_voted, is_registered FROM voters WHERE voter_id=?",
        (voter_id,)
    ).fetchone()
    conn.close()

    if not voter:
        return jsonify({'valid': False, 'message': 'Voter ID not found'})

    return jsonify({'valid': True})

@app.route('/verify_face', methods=['POST'])
def verify_face_route():
    voter_id = request.form.get('voter_id')
    photo_file = request.files.get('photo')

    if not voter_id or not photo_file:
        return jsonify({'success': False, 'message': 'Missing data'})

    conn = get_db_connection()
    voter = conn.execute(
        "SELECT photo_path, has_voted, constituency_id FROM voters WHERE voter_id=?",
        (voter_id,)
    ).fetchone()
    conn.close()

    if not voter:
        return jsonify({'success': False, 'message': 'Invalid voter ID'})

    if voter['has_voted']:
        return jsonify({'success': False, 'message': 'You have already voted'})

    if not os.path.exists(TEMP_FOLDER):
        os.makedirs(TEMP_FOLDER)

    captured_path = os.path.join(TEMP_FOLDER, f"{voter_id}.jpg")
    photo_file.save(captured_path)

    reference_image = os.path.join(backend_dir, voter['photo_path'])

    if not os.path.exists(reference_image):
        return jsonify({
            "success": False,
            "message": "Reference image not found for this voter"
        })

    try:
        result = DeepFace.verify(
            img1_path=reference_image,
            img2_path=captured_path,
            model_name="ArcFace",
            distance_metric="cosine",
            enforce_detection=False
        )

        distance = float(result["distance"])
        print("Distance:", distance)

        if distance <= 0.45:
            return jsonify({
                "success": True,
                "voter_id": voter_id,
                "confidence": distance
            })
        else:
            return jsonify({
                "success": False,
                "message": "Face does not match. Please try again.",
                "confidence": distance
            })

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/candidates/<int:constituency_id>')
def get_candidates(constituency_id):
    conn = get_db_connection()
    candidates = conn.execute("""
        SELECT c.id, c.name, p.name as party_name, p.logo_url
        FROM candidates c
        JOIN parties p ON c.party_id = p.id
        WHERE c.constituency_id = ?
    """, (constituency_id,)).fetchall()
    conn.close()

    return jsonify([dict(row) for row in candidates])

@app.route('/api/vote', methods=['POST'])
def cast_vote():
    data = request.get_json()
    voter_id = data.get('voter_id')
    candidate_id = data.get('candidate_id')

    conn = get_db_connection()
    voter = conn.execute(
        "SELECT has_voted, constituency_id FROM voters WHERE voter_id=?",
        (voter_id,)
    ).fetchone()

    if voter['has_voted']:
        conn.close()
        return jsonify({'success': False, 'message': 'Already voted'})

    conn.execute(
        "INSERT INTO votes (candidate_id, constituency_id) VALUES (?,?)",
        (candidate_id, voter['constituency_id'])
    )

    conn.execute(
        "UPDATE voters SET has_voted=1 WHERE voter_id=?",
        (voter_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({'success': True})

@app.route('/api/results')
def get_results():
    conn = get_db_connection()

    results = conn.execute("""
        SELECT c.name as candidate_name,
               p.name as party_name,
               COUNT(v.id) as votes
        FROM candidates c
        LEFT JOIN votes v ON c.id = v.candidate_id
        LEFT JOIN parties p ON c.party_id = p.id
        GROUP BY c.id
    """).fetchall()

    conn.close()

    return jsonify([dict(row) for row in results])

if __name__ == '__main__':
    app.run(debug=True, port=5000)