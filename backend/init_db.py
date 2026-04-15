import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "voters.db")

def init_db():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Constituencies
    cur.execute("""
    CREATE TABLE constituencies (
        id INTEGER PRIMARY KEY,
        name TEXT
    )
    """)

    # Parties
    cur.execute("""
    CREATE TABLE parties (
        id INTEGER PRIMARY KEY,
        name TEXT,
        logo_url TEXT
    )
    """)

    # Candidates
    cur.execute("""
    CREATE TABLE candidates (
        id INTEGER PRIMARY KEY,
        name TEXT,
        party_id INTEGER,
        constituency_id INTEGER
    )
    """)

    # Voters
    cur.execute("""
    CREATE TABLE voters (
        voter_id TEXT PRIMARY KEY,
        photo_path TEXT,
        has_voted INTEGER DEFAULT 0,
        constituency_id INTEGER
    )
    """)

    # Votes
    cur.execute("""
    CREATE TABLE votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_id INTEGER,
        constituency_id INTEGER
    )
    """)

    # Insert Constituencies
    cur.executemany("INSERT INTO constituencies VALUES (?,?)", [
        (1, "Greenfield"),
        (2, "Riverside")
    ])

    # Insert Parties (MATCH YOUR LOGOS)
    cur.executemany("INSERT INTO parties VALUES (?,?,?)", [
    (1, "Unity Front", "unity_front_logo.png"),
    (2, "People's Voice", "people_voice_logo.png"),
    (3, "Progress Alliance", "progress_alliance_logo.png"),
    (4, "Future Vision Party", "future_vision_logo.png")
])

    cur.executemany("INSERT INTO candidates VALUES (?,?,?,?)", [

    # Greenfield (constituency 1)
    (1, "G. Kishan Reddy", 1, 1),
    (2, "Anjan Kumar Yadav", 2, 1),
    (3, "Ravi Kumar", 3, 1),
    (4, "Suresh Reddy", 4, 1),

    # Riverside (constituency 2)
    (5, "T. Padma Rao Goud", 1, 2),
    (6, "Mohammed Sameer", 2, 2),
    (7, "Srinivas Yadav", 3, 2),
    (8, "Asaduddin Owaisi", 4, 2)

])

    # Insert Voters (ONLY FEW FOR DEMO)
    voters = [
        ("v0001", "stored_photos/v0001.jpg", 1),
        ("v0002", "stored_photos/v0002.jpg", 1),
        ("v0003", "stored_photos/v0003.jpg", 1),
        ("v0004", "stored_photos/v0004.jpg", 2),
        ("v0005", "stored_photos/v0005.jpg", 2),
    ]

    for v in voters:
        cur.execute(
            "INSERT INTO voters (voter_id, photo_path, constituency_id) VALUES (?,?,?)",
            v
        )

    conn.commit()
    conn.close()

    print("Database created successfully!")

if __name__ == "__main__":
    init_db()