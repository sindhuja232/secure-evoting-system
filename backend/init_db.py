import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'voters.db')

PHOTO_FOLDER_NAME = "stored_photos"
PHOTO_FOLDER_FULL_PATH = os.path.join(BASE_DIR, PHOTO_FOLDER_NAME)

CONSTITUENCIES = [
    (1, "Secunderabad"),
    (2, "Hyderabad"),
]

PARTIES = [
    (1, "Bharatiya Janata Party", "bjp_logo.png"),
    (2, "Indian National Congress", "inc_logo.png"),
    (3, "Telangana Rashtra Samithi", "trs_logo.png"),
    (4, "All India Majlis-e-Ittehadul Muslimeen", "aimim_logo.png"),
    (5, "Independent", "independent_logo.png"),
]

CANDIDATES = [
    (1, "G. Kishan Reddy", 1, 1),
    (2, "Anjan Kumar Yadav", 2, 1),
    (3, "T. Padma Rao Goud", 3, 1),
    (4, "Asaduddin Owaisi", 4, 2),
    (5, "Madhavi Latha", 1, 2),
    (6, "Mohammed Waliullah Sameer", 2, 2),
    (7, "Gaddam Srinivas Yadav", 3, 2),
]

VOTERS_DATA = [
    ("v0001", "v0001.jpg", 1),
    ("v0002", "v0002.jpg", 1),
    ("v0003", "v0003.jpg", 1),
    ("v0004", "v0004.jpg", 1),
    ("v0005", "v0005.jpg", 1),
    ("v0006", "v0006.jpg", 1),
    ("v0007", "v0007.jpg", 1),
    ("v0008", "v0008.jpg", 1),
    ("v0009", "v0009.jpg", 1),
    ("v0010", "v0010.jpg", 1),
    ("v0011", "v0011.jpg", 2),
    ("v0012", "v0012.jpg", 2),
    ("v0013", "v0013.jpg", 2),
    ("v0014", "v0014.jpg", 2),
    ("v0015", "v0015.jpg", 2),
    ("v0016", "v0016.jpg", 2),
    ("v0017", "v0017.jpg", 2),
    ("v0018", "v0018.jpg", 2),
    ("v0019", "v0019.jpg", 2),
    ("v0020", "v0020.jpg", 2),
]

def init_db():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE constituencies (
            id INTEGER PRIMARY KEY,
            name TEXT UNIQUE
        )
    """)

    cur.execute("""
        CREATE TABLE parties (
            id INTEGER PRIMARY KEY,
            name TEXT UNIQUE,
            logo_url TEXT
        )
    """)

    cur.execute("""
        CREATE TABLE candidates (
            id INTEGER PRIMARY KEY,
            name TEXT,
            party_id INTEGER,
            constituency_id INTEGER
        )
    """)

    cur.execute("""
        CREATE TABLE voters (
            voter_id TEXT PRIMARY KEY,
            photo_path TEXT,
            has_voted INTEGER DEFAULT 0,
            constituency_id INTEGER,
            is_registered INTEGER DEFAULT 0
        )
    """)

    cur.execute("""
        CREATE TABLE votes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            candidate_id INTEGER,
            constituency_id INTEGER,
            voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cur.executemany("INSERT INTO constituencies VALUES (?,?)", CONSTITUENCIES)
    cur.executemany("INSERT INTO parties VALUES (?,?,?)", PARTIES)
    cur.executemany("INSERT INTO candidates VALUES (?,?,?,?)", CANDIDATES)

    for voter_id, photo, constituency in VOTERS_DATA:
        photo_path = os.path.join(PHOTO_FOLDER_NAME, photo)
        cur.execute(
            "INSERT INTO voters (voter_id, photo_path, constituency_id) VALUES (?,?,?)",
            (voter_id, photo_path, constituency)
        )

    conn.commit()
    conn.close()
    print("Database initialized successfully")

if __name__ == "__main__":
    init_db()
