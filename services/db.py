#!/usr/bin/env python3
"""
Modul Database Terpusat: Apotek DB (SQLite dengan mode WAL)
Menyediakan koneksi terisolasi per-thread dan inisialisasi skema tabel obat & pesanan.
"""

import sqlite3
import os
import threading

# Lokasi file database terpusat
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(BASE_DIR, "data")
DB_PATH = os.path.join(DATA_DIR, "apotek.db")

# Thread-local storage untuk koneksi SQLite
_local = threading.local()

def get_db():
    """Mendapatkan koneksi SQLite thread-safe dengan timeout dan row factory dict."""
    if not hasattr(_local, "connection") or _local.connection is None:
        os.makedirs(DATA_DIR, exist_ok=True)
        # timeout 20 detik agar transaksi yang mengunci tidak langsung error
        conn = sqlite3.connect(DB_PATH, timeout=20.0, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        # Aktifkan WAL mode untuk konkurensi multi-reader & single-writer
        conn.execute("PRAGMA journal_mode = WAL;")
        conn.execute("PRAGMA busy_timeout = 20000;")
        conn.execute("PRAGMA foreign_keys = ON;")
        _local.connection = conn
    return _local.connection

def init_db():
    """Inisialisasi tabel dan data awal obat jika belum ada."""
    os.makedirs(DATA_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=20.0)
    conn.execute("PRAGMA journal_mode = WAL;")
    cursor = conn.cursor()
    
    # 1. Tabel obat (menyimpan kuantitas stok dan kolom versi)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS obat (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama TEXT UNIQUE NOT NULL,
            stok INTEGER NOT NULL,
            versi INTEGER NOT NULL DEFAULT 1,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    # 2. Tabel pesanan (mencatat riwayat transaksi pesanan berhasil)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pesanan (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            obat_id INTEGER NOT NULL,
            nama_obat TEXT NOT NULL,
            qty INTEGER NOT NULL,
            pembeli TEXT NOT NULL,
            mode TEXT NOT NULL,
            instance_port INTEGER NOT NULL,
            status TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (obat_id) REFERENCES obat (id)
        );
    """)
    
    # Seed default medicines
    cursor.execute("""
        INSERT OR IGNORE INTO obat (id, nama, stok, versi)
        VALUES (1, 'Paracetamol 500mg', 1, 5);
    """)
    cursor.execute("""
        INSERT OR IGNORE INTO obat (id, nama, stok, versi)
        VALUES (2, 'Amoxicillin Sirup', 1, 5);
    """)
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print(f"[DB] Database SQLite berhasil diinisialisasi pada: {DB_PATH}")
