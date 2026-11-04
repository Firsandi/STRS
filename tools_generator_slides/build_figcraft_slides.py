#!/usr/bin/env python3
"""
Generator Slide Presentasi FigCraft (Native .figcraft)
Topik: Sistem Terdistribusi - Minggu 11: Race Condition & Data Consistency
Studi Kasus: Multi-Instance Layanan Apotek dengan PostgreSQL Terpusat (Laravel + PostgreSQL)
Mengikuti Standar Baku Kelompok 2 (Clean Porcelain) & Materi Baku 11 Slide User.
"""

import json
import subprocess
import os

def create_deck():
    commands = []
    
    current_id = 1
    def next_id():
        nonlocal current_id
        current_id += 1
        return current_id

    # 4 Columns Grid layout for 11 slides
    SLIDE_W = 1920
    SLIDE_H = 1080
    GAP_X = 160
    GAP_Y = 160
    COLS = 4

    def get_slide_pos(index):
        col = index % COLS
        row = index // COLS
        x = col * (SLIDE_W + GAP_X)
        y = row * (SLIDE_H + GAP_Y)
        return x, y

    # Helper functions
    def add_frame(name, x, y, w, h, fill="#f8fafc", corner_radius=0):
        fid = next_id()
        commands.append({
            "command": "frame.create",
            "params": {
                "name": name,
                "x": x,
                "y": y,
                "width": w,
                "height": h,
                "props": {
                    "fill": fill,
                    "cornerRadius": corner_radius,
                    "clip": True
                }
            }
        })
        return fid

    def add_rect(name, parent, x, y, w, h, fill="#ffffff", stroke="#e2e8f0", stroke_w=1, corner_radius=12):
        rid = next_id()
        commands.append({
            "command": "shape.rectangle",
            "params": {
                "name": name,
                "parent": parent,
                "x": x,
                "y": y,
                "width": w,
                "height": h,
                "props": {
                    "fill": fill,
                    "stroke": stroke,
                    "strokeWeight": stroke_w,
                    "cornerRadius": corner_radius
                }
            }
        })
        return rid

    def add_text(text, parent, x, y, width=None, size=24, color="#0f172a", bold=False, align="left"):
        tid = next_id()
        props = {
            "fill": color,
            "fontSize": size,
            "textAlign": align
        }
        if bold:
            props["fontStyle"] = "Bold"
        params = {
            "text": text,
            "parent": parent,
            "x": x,
            "y": y,
            "props": props
        }
        if width:
            params["width"] = width
        commands.append({
            "command": "text.create",
            "params": params
        })
        return tid

    def add_header(parent, kicker, title, subhead, kicker_color="#1e40af"):
        # Top Accent Line
        add_rect("Top Accent", parent, 0, 0, SLIDE_W, 12, fill=kicker_color, stroke="none", corner_radius=0)
        # Kicker Badge
        add_rect("Kicker Box", parent, 100, 50, 360, 38, fill="#eff6ff", stroke="#bfdbfe", corner_radius=8)
        add_text(kicker.upper(), parent, 120, 58, size=15, color=kicker_color, bold=True)
        # Title
        add_text(title, parent, 100, 102, width=1720, size=46, color="#0f172a", bold=True)
        # Subhead
        add_text(subhead, parent, 100, 162, width=1720, size=22, color="#475569")

    # =========================================================================
    # SLIDE 1: COVER
    # =========================================================================
    x, y = get_slide_pos(0)
    s1 = add_frame("01. Cover", x, y, SLIDE_W, SLIDE_H, fill="#f8fafc")
    add_rect("Top Accent", s1, 0, 0, SLIDE_W, 14, fill="#1e40af", stroke="none", corner_radius=0)
    
    # Eyebrow Pill
    add_rect("Eyebrow Pill", s1, 100, 90, 480, 44, fill="#eff6ff", stroke="#bfdbfe", corner_radius=8)
    add_text("SISTEM TERDISTRIBUSI • FASILKOM UNEJ", s1, 120, 100, size=18, color="#1e40af", bold=True)
    
    # Main Title
    add_text("Konsistensi Data &\nRace Condition", s1, 100, 160, width=1720, size=64, color="#0f172a", bold=True)
    add_text("Studi Kasus: Multi-Instance Layanan Apotek dengan PostgreSQL Terpusat", s1, 100, 320, width=1720, size=30, color="#1e40af", bold=True)
    add_text("Analisis Komparasi: Naive, Atomic Operation, Database Transaction, dan Optimistic Locking", s1, 100, 375, width=1720, size=22, color="#475569")
    
    # Tech Spec Card
    add_rect("Tech Bar", s1, 100, 435, 1720, 54, fill="#ffffff", stroke="#e2e8f0", stroke_w=1, corner_radius=12)
    add_text("Teknologi: Laravel (PHP 8.3)  •  PostgreSQL 16  •  Concurrency Engine Simulator", s1, 120, 448, width=1680, size=20, color="#0f172a", bold=True, align="center")

    # Visual Architecture Box
    add_rect("Arch Card", s1, 100, 525, 1720, 480, fill="#ffffff", stroke="#e2e8f0", stroke_w=1.5, corner_radius=20)
    add_text("3 SERVICE  →  1 DATABASE", s1, 140, 560, size=24, color="#1e40af", bold=True)
    
    # 3 Service Cards
    services = [
        ("Service :8001", "Kasir IGD", "#2563eb"),
        ("Service :8002", "Kasir Rawat Inap", "#3b82f6"),
        ("Service :8003", "Kasir Poli Anak", "#60a5fa")
    ]
    for i, (sname, cname, col) in enumerate(services):
        sx = 140 + i * 360
        add_rect(f"Svc {i+1}", s1, sx, 620, 330, 200, fill="#f8fafc", stroke=col, stroke_w=2, corner_radius=16)
        add_text(sname, s1, sx + 20, 660, width=290, size=26, color="#0f172a", bold=True, align="center")
        add_text(cname, s1, sx + 20, 715, width=290, size=20, color=col, bold=True, align="center")
        add_text("Akses Simultan", s1, sx + 20, 755, width=290, size=16, color="#64748b", align="center")

    # Arrow indicator
    add_rect("Arrow Box", s1, 1240, 690, 80, 60, fill="#eff6ff", stroke="#bfdbfe", corner_radius=12)
    add_text("➔", s1, 1240, 700, width=80, size=32, color="#1e40af", bold=True, align="center")

    # Shared DB Box
    add_rect("DB Target", s1, 1360, 620, 420, 200, fill="#f0fdf4", stroke="#86efac", stroke_w=2, corner_radius=16)
    add_text("PostgreSQL 16", s1, 1380, 655, width=380, size=28, color="#166534", bold=True, align="center")
    add_text("stok = 1", s1, 1380, 705, width=380, size=32, color="#15803d", bold=True, align="center")
    add_text("Stok tersisa: 1 botol terakhir", s1, 1380, 755, width=380, size=18, color="#14532d", align="center")

    add_text("Kelompok 2: Ridho Rizky P. • Firsandi Andraw F. • Ahmad Rafif Nandra U.", s1, 140, 940, width=1640, size=18, color="#64748b", align="center")

    # =========================================================================
    # SLIDE 2: ARSITEKTUR SISTEM
    # =========================================================================
    x, y = get_slide_pos(1)
    s2 = add_frame("02. Arsitektur Sistem", x, y, SLIDE_W, SLIDE_H, fill="#f8fafc")
    add_header(s2, "1 • Arsitektur Sistem", "ARSITEKTUR SISTEM", "Model Skalabilitas: Multi Order Service & Single Database")

    col_w = 540
    gap_col = 50
    start_x = 100
    top_y = 230
    h_col = 780

    # Col 1: Multi-Client Concurrency
    c1 = add_rect("Col 1", s2, start_x, top_y, col_w, h_col, fill="#ffffff", stroke="#e2e8f0", stroke_w=1.5, corner_radius=16)
    add_rect("Num 1", s2, start_x + 30, top_y + 30, 48, 48, fill="#eff6ff", stroke="#bfdbfe", corner_radius=10)
    add_text("1", s2, start_x + 30, top_y + 40, width=48, size=24, color="#1e40af", bold=True, align="center")
    add_text("Multi-Client Concurrency", s2, start_x + 95, top_y + 38, width=410, size=24, color="#0f172a", bold=True)
    
    clients = ["Kasir IGD", "Kasir Rawat Inap", "Kasir Poli Anak"]
    for i, cl in enumerate(clients):
        add_rect(f"ClBox {i+1}", s2, start_x + 30, top_y + 110 + i * 110, 480, 90, fill="#f8fafc", stroke="#cbd5e1", corner_radius=12)
        add_text(cl, s2, start_x + 60, top_y + 140 + i * 110, size=22, color="#1e40af", bold=True)

    add_rect("Desc 1", s2, start_x + 30, top_y + 480, 480, 260, fill="#f8fafc", stroke="#e2e8f0", corner_radius=12)
    add_text("3 Kasir Rumah Sakit (IGD, Rawat Inap, Poli Anak) melakukan transaksi tebus resep secara simultan di milidetik yang sama saat jam sibuk operasional rumah sakit.", s2, start_x + 50, top_y + 510, width=440, size=20, color="#475569")

    # Col 2: Multi Service Instances
    c2 = add_rect("Col 2", s2, start_x + col_w + gap_col, top_y, col_w, h_col, fill="#ffffff", stroke="#3b82f6", stroke_w=2, corner_radius=16)
    add_rect("Num 2", s2, start_x + col_w + gap_col + 30, top_y + 30, 48, 48, fill="#eff6ff", stroke="#bfdbfe", corner_radius=10)
    add_text("2", s2, start_x + col_w + gap_col + 30, top_y + 40, width=48, size=24, color="#1e40af", bold=True, align="center")
    add_text("Multi Service Instances", s2, start_x + col_w + gap_col + 95, top_y + 38, width=410, size=24, color="#0f172a", bold=True)

    instances = [("Order Service :8001", "#2563eb"), ("Order Service :8002", "#3b82f6"), ("Order Service :8003", "#60a5fa")]
    for i, (inst, icol) in enumerate(instances):
        add_rect(f"InstBox {i+1}", s2, start_x + col_w + gap_col + 30, top_y + 110 + i * 110, 480, 90, fill="#f8fafc", stroke=icol, stroke_w=1.5, corner_radius=12)
        add_text(inst, s2, start_x + col_w + gap_col + 60, top_y + 140 + i * 110, size=22, color=icol, bold=True)

    add_rect("Desc 2", s2, start_x + col_w + gap_col + 30, top_y + 480, 480, 260, fill="#f8fafc", stroke="#e2e8f0", corner_radius=12)
    add_text("3 Instance Apotek Order Service berjalan mandiri di port 8001, 8002, dan 8003 untuk load balancing, isolasi beban, dan ketersediaan tinggi (High Availability).", s2, start_x + col_w + gap_col + 50, top_y + 510, width=440, size=20, color="#475569")

    # Col 3: Single Shared Database
    c3 = add_rect("Col 3", s2, start_x + (col_w + gap_col) * 2, top_y, col_w, h_col, fill="#ffffff", stroke="#e2e8f0", stroke_w=1.5, corner_radius=16)
    add_rect("Num 3", s2, start_x + (col_w + gap_col) * 2 + 30, top_y + 30, 48, 48, fill="#eff6ff", stroke="#bfdbfe", corner_radius=10)
    add_text("3", s2, start_x + (col_w + gap_col) * 2 + 30, top_y + 40, width=48, size=24, color="#1e40af", bold=True, align="center")
    add_text("Single Shared Database", s2, start_x + (col_w + gap_col) * 2 + 95, top_y + 38, width=410, size=24, color="#0f172a", bold=True)

    tables = ["PostgreSQL 16", "obats (stok obat)", "pesanan_obats"]
    for i, tbl in enumerate(tables):
        add_rect(f"TblBox {i+1}", s2, start_x + (col_w + gap_col) * 2 + 30, top_y + 110 + i * 110, 480, 90, fill="#f0fdf4", stroke="#86efac", corner_radius=12)
        add_text(tbl, s2, start_x + (col_w + gap_col) * 2 + 60, top_y + 140 + i * 110, size=22, color="#166534", bold=True)

    add_rect("Desc 3", s2, start_x + (col_w + gap_col) * 2 + 30, top_y + 480, 480, 260, fill="#f8fafc", stroke="#e2e8f0", corner_radius=12)
    add_text("Ketiga service terhubung ke satu database PostgreSQL terpusat yang menyimpan tabel obats (stok obat) dan pesanan_obats sebagai Single Source of Truth.", s2, start_x + (col_w + gap_col) * 2 + 50, top_y + 510, width=440, size=20, color="#475569")

    # =========================================================================
    # SLIDE 3: POLA MASALAH - SOLUSI
    # =========================================================================
    x, y = get_slide_pos(2)
    s3 = add_frame("03. Pola Masalah - Solusi", x, y, SLIDE_W, SLIDE_H, fill="#f8fafc")
    add_header(s3, "2 • Pola Masalah - Solusi", "POLA MASALAH - SOLUSI", "Mengapa Data Tidak Konsisten Meski Database Hanya Satu?", kicker_color="#dc2626")

    card_w2 = 835
    # Card Masalah
    add_rect("Card Problem", s3, 100, 230, card_w2, 780, fill="#ffffff", stroke="#fecaca", stroke_w=2, corner_radius=16)
    add_rect("Badge Prob", s3, 140, 260, 440, 40, fill="#fef2f2", stroke="#fca5a5", corner_radius=8)
    add_text("MASALAH NYATA: STOK OBAT KRITIS TERSISA 1", s3, 160, 270, size=16, color="#dc2626", bold=True)

    p_items = [
        ("Kasus:", "Obat 'Amoxicillin Sirup' hanya tersisa 1 botol terakhir."),
        ("Serentak:", "3 Kasir (IGD, Rawat Inap, Poli) menekan tombol konfirmasi tebus resep."),
        ("Race Condition:", "Ketiga service membaca stok = 1 pada saat bersamaan."),
        ("Overselling:", "3 botol dinyatakan berhasil terjual padahal fisik obat hanya ada 1 botol!"),
        ("Dampak Medis:", "Pasien yang resepnya disetujui tidak mendapatkan obat karena stok fisik kosong di lemari farmasi.")
    ]
    for i, (k, v) in enumerate(p_items):
        py = 330 + i * 78
        add_text(k, s3, 140, py, size=20, color="#b91c1c", bold=True)
        add_text(v, s3, 300, py, width=630, size=19, color="#0f172a")

    add_rect("Over Box", s3, 140, 760, 755, 200, fill="#fef2f2", stroke="#f87171", stroke_w=2, corner_radius=12)
    add_text("1 botol tersisa  ➔  3 botol terjual", s3, 160, 810, width=715, size=34, color="#b91c1c", bold=True, align="center")
    add_text("OVERSELLING FATAL: ANCAMAN KESELAMATAN PASIEN", s3, 160, 875, width=715, size=18, color="#7f1d1d", bold=True, align="center")

    # Card Solusi
    add_rect("Card Solution", s3, 985, 230, card_w2, 780, fill="#ffffff", stroke="#86efac", stroke_w=2, corner_radius=16)
    add_rect("Badge Sol", s3, 1025, 260, 480, 40, fill="#f0fdf4", stroke="#86efac", corner_radius=8)
    add_text("ARAH SOLUSI: KONSISTENSI DI LEVEL DATABASE", s3, 1045, 270, size=16, color="#166534", bold=True)

    add_text("Akar Masalah:", s3, 1025, 330, size=20, color="#15803d", bold=True)
    add_text("Aplikasi mempercayai data lokal di RAM yang sudah 'usang' (stale read).", s3, 1180, 330, width=600, size=19, color="#0f172a")

    add_text("Prinsip Solusi:", s3, 1025, 395, size=20, color="#15803d", bold=True)
    add_text("Memindahkan validasi stok dari memori aplikasi PHP ke mesin PostgreSQL.", s3, 1180, 395, width=600, size=19, color="#0f172a")

    add_text("3 Pendekatan Solusi Teruji:", s3, 1025, 480, size=22, color="#0f172a", bold=True)

    s_items = [
        ("1. Operasi Atomic", "UPDATE ... WHERE stok >= 1 langsung di level SQL."),
        ("2. Database Transaction", "SELECT FOR UPDATE: kunci baris data hingga commit/rollback."),
        ("3. Optimistic Locking", "Lacak nomor versi record (kolom versi) tanpa mengunci pembaca.")
    ]
    for i, (sk, sv) in enumerate(s_items):
        sy = 535 + i * 135
        add_rect(f"SBox {i+1}", s3, 1025, sy, 755, 115, fill="#f8fafc", stroke="#cbd5e1", corner_radius=10)
        add_text(sk, s3, 1055, sy + 20, size=22, color="#1e40af", bold=True)
        add_text(sv, s3, 1055, sy + 62, width=695, size=18, color="#475569")

    # =========================================================================
    # SLIDE 4: MASA LALU (THE NAIVE ERA)
    # =========================================================================
    x, y = get_slide_pos(3)
    s4 = add_frame("04. The Naive Era", x, y, SLIDE_W, SLIDE_H, fill="#f8fafc")
    add_header(s4, "3 • Masa Lalu (The Naive Era)", "MASA LALU (THE NAIVE ERA)", "Kegagalan Pola 'Read-Modify-Write' Saat Layanan Di-Scale", kicker_color="#dc2626")

    # Table Box
    add_rect("Table Container", s4, 100, 230, 1720, 600, fill="#ffffff", stroke="#e2e8f0", stroke_w=1.5, corner_radius=16)
    
    # Table Header Row
    add_rect("TH", s4, 100, 230, 1720, 70, fill="#f1f5f9", stroke="#cbd5e1", corner_radius=16)
    add_text("No", s4, 130, 252, size=18, color="#0f172a", bold=True)
    add_text("Pelaku / Instance", s4, 210, 252, size=18, color="#0f172a", bold=True)
    add_text("Aksi Pemrosesan", s4, 560, 252, size=18, color="#0f172a", bold=True)
    add_text("Database (Stok)", s4, 1180, 252, size=18, color="#0f172a", bold=True)
    add_text("Evaluasi Status", s4, 1460, 252, size=18, color="#0f172a", bold=True)

    t_rows = [
        ("1", "Service #1 (Port 8001)", "Membaca stok obat dari DB ➔ Hasil: 1", "Stok: 1", "Valid", "#059669"),
        ("2", "Service #2 (Port 8002)", "Membaca stok obat dari DB ➔ Hasil: 1", "Stok: 1", "Valid (Stale Read)", "#d97706"),
        ("3", "Service #3 (Port 8003)", "Membaca stok obat dari DB ➔ Hasil: 1", "Stok: 1", "Valid (Stale Read)", "#d97706"),
        ("4", "Service #1", "Perhitungan di RAM: 1 - 1 = 0 ➔ Simpan Stok = 0", "Stok: 0", "Order #1 Sukses", "#059669"),
        ("5", "Service #2", "Perhitungan di RAM: 1 - 1 = 0 ➔ Simpan Stok = 0", "Stok: 0", "Order #2 Sukses (OVERSELL!)", "#dc2626"),
        ("6", "Service #3", "Perhitungan di RAM: 1 - 1 = 0 ➔ Simpan Stok = 0", "Stok: 0", "Order #3 Sukses (OVERSELL!)", "#dc2626")
    ]
    for i, (no, pel, aks, db, ev, ev_col) in enumerate(t_rows):
        ry = 300 + i * 85
        bg = "#ffffff" if i % 2 == 0 else "#f8fafc"
        add_rect(f"TR_{i}", s4, 100, ry, 1720, 85, fill=bg, stroke="#e2e8f0", corner_radius=0)
        add_text(no, s4, 130, ry + 28, size=19, color="#0f172a", bold=True)
        add_text(pel, s4, 210, ry + 28, size=19, color="#0f172a", bold=True)
        add_text(aks, s4, 560, ry + 28, size=18, color="#334155")
        add_text(db, s4, 1180, ry + 28, size=19, color="#0f172a", bold=True)
        add_text(ev, s4, 1460, ry + 28, size=18, color=ev_col, bold=True)

    # Bottom Alert Box
    add_rect("Alert Box", s4, 100, 860, 1720, 140, fill="#fef2f2", stroke="#fca5a5", stroke_w=1.5, corner_radius=12)
    add_text("Langkah 1-3: Ketiga service membaca stok = 1 sebelum ada yang menulis.\nLangkah 5-6: Hasil hitung dari data usang tetap disimpan, sehingga terjadi overselling fatal!", s4, 140, 895, width=1640, size=21, color="#b91c1c", bold=True)

    # =========================================================================
    # SLIDE 5: RULE OF THREE
    # =========================================================================
    x, y = get_slide_pos(4)
    s5 = add_frame("05. Rule of Three", x, y, SLIDE_W, SLIDE_H, fill="#f8fafc")
    add_header(s5, "4 • Rule of Three", "RULE OF THREE", "Tiga Pilar Menjaga Konsistensi Data Sistem Terdistribusi")

    # 3 Cards
    pilars = [
        ("PILAR 1", "Atomic Operation", "EKSEKUSI TUNGGAL DI SQL", 
         "Menyerahkan pengurangan stok langsung ke mesin PostgreSQL. Tidak ada data yang dibaca ke memori PHP terlebih dahulu.",
         "UPDATE obats\nSET stok = stok - 1\nWHERE id = 1 AND stok >= 1;", "#2563eb", "#4ade80"),
        ("PILAR 2", "Database Transaction", "PESSIMISTIC LOCKING (ACID)",
         "Mengunci baris obat (SELECT FOR UPDATE) sehingga service lain harus antre menunggu hingga transaksi commit atau rollback.",
         "BEGIN TRANSACTION;\nSELECT ... FOR UPDATE;\nCOMMIT / ROLLBACK;", "#1e40af", "#38bdf8"),
        ("PILAR 3", "Optimistic Locking", "VERSION TRACKING",
         "Bebas antrean kunci. Setiap pembaruan memeriksa nomor versi data (kolom versi). Jika versi berubah, transaksi otomatis dibatalkan.",
         "UPDATE obats\nSET stok = 0, versi = 6\nWHERE id = 1 AND versi = 5;", "#0f766e", "#facc15")
    ]
    for i, (pno, ptitle, psub, pdesc, pcode, pcol, code_col) in enumerate(pilars):
        px = start_x + i * (col_w + gap_col)
        add_rect(f"PCard {i+1}", s5, px, top_y, col_w, h_col, fill="#ffffff", stroke="#e2e8f0", stroke_w=1.5, corner_radius=16)
        
        # Header Badge
        add_rect(f"PBadge {i+1}", s5, px + 30, top_y + 30, 140, 36, fill="#eff6ff", stroke="#bfdbfe", corner_radius=8)
        add_text(pno, s5, px + 45, top_y + 38, size=16, color="#1e40af", bold=True)
        
        add_text(ptitle, s5, px + 30, top_y + 85, width=480, size=28, color="#0f172a", bold=True)
        add_text(psub, s5, px + 30, top_y + 130, width=480, size=15, color=pcol, bold=True)
        
        add_text(pdesc, s5, px + 30, top_y + 180, width=480, size=19, color="#475569")
        
        # Code Window
        add_rect(f"CodeWin {i+1}", s5, px + 25, top_y + 360, 490, 360, fill="#0f172a", stroke="#1e293b", corner_radius=12)
        add_rect(f"CodeBar {i+1}", s5, px + 25, top_y + 360, 490, 45, fill="#1e293b", stroke="none", corner_radius=12)
        add_text("SQL Engine Execution", s5, px + 50, top_y + 372, size=14, color="#94a3b8", bold=True)
        add_text(pcode, s5, px + 45, top_y + 440, width=450, size=20, color=code_col, bold=True)

    # =========================================================================
    # SLIDE 6: MASA SEKARANG: SOLUSI 1
    # =========================================================================
    x, y = get_slide_pos(5)
    s6 = add_frame("06. Solusi 1 Atomic", x, y, SLIDE_W, SLIDE_H, fill="#f8fafc")
    add_header(s6, "5 • Masa Sekarang: Solusi 1", "MASA SEKARANG: SOLUSI 1", "Operasi Atomic: Mengandalkan Conditional Update di SQL")

    # Left: Mekanisme Kerja
    add_rect("Left Mech", s6, 100, 230, card_w2, 780, fill="#ffffff", stroke="#e2e8f0", stroke_w=1.5, corner_radius=16)
    add_text("Mekanisme Kerja", s6, 140, 270, size=28, color="#1e40af", bold=True)
    add_text("Alih-alih membaca stok ke PHP, query langsung dijalankan:", s6, 140, 325, size=20, color="#475569")
    
    # Query box
    add_rect("QBox", s6, 140, 380, 755, 130, fill="#0f172a", stroke="#1e293b", corner_radius=12)
    add_text("UPDATE obats SET stok = stok - :qty\nWHERE id = :id AND stok >= :qty;", s6, 170, 415, size=22, color="#4ade80", bold=True)

    add_text("PostgreSQL mengembalikan 'Affected Rows':", s6, 140, 545, size=22, color="#0f172a", bold=True)
    
    add_rect("AR1", s6, 140, 600, 755, 90, fill="#f0fdf4", stroke="#86efac", corner_radius=10)
    add_text("1 baris", s6, 170, 630, size=22, color="#166534", bold=True)
    add_text("Stok berhasil dipotong! Lanjut simpan pesanan.", s6, 290, 630, size=20, color="#0f172a")

    add_rect("AR0", s6, 140, 715, 755, 90, fill="#fef2f2", stroke="#fca5a5", corner_radius=10)
    add_text("0 baris", s6, 170, 745, size=22, color="#b91c1c", bold=True)
    add_text("Stok tidak cukup! Batalkan dan kembalikan HTTP 400.", s6, 290, 745, size=20, color="#0f172a")

    add_rect("Pros", s6, 140, 840, 755, 120, fill="#eff6ff", stroke="#bfdbfe", corner_radius=12)
    add_text("Keunggulan:", s6, 170, 865, size=20, color="#1e40af", bold=True)
    add_text("Sangat cepat, tanpa overhead transaksi panjang, dan non-blocking.", s6, 170, 905, size=19, color="#1e3a8a")

    # Right: Pertanyaan Kritis
    add_rect("Right Crit", s6, 985, 230, card_w2, 780, fill="#ffffff", stroke="#fca5a5", stroke_w=2, corner_radius=16)
    add_rect("Crit Badge", s6, 1025, 260, 260, 40, fill="#fef2f2", stroke="#fca5a5", corner_radius=8)
    add_text("PERTANYAAN KRITIS", s6, 1045, 270, size=16, color="#dc2626", bold=True)

    add_text("'Bagaimana jika stok berhasil dikurangi,\nnamun pesanan gagal disimpan ke database?'", s6, 1025, 335, width=755, size=26, color="#0f172a", bold=True)

    add_rect("Crit Box", s6, 1025, 450, 755, 360, fill="#fef2f2", stroke="#fecaca", corner_radius=12)
    add_text("Kelemahan Operasi Atomic Mandiri:", s6, 1060, 480, size=22, color="#b91c1c", bold=True)
    add_text("Jika server crash, koneksi putus, atau insert tabel pesanan_obats error setelah update stok berhasil, maka stok obat di database berkurang permanen tanpa ada bukti resep tercatat di sistem!\n\nStok fisik di gudang dan catatan resep menjadi tidak sinkron.", s6, 1060, 530, width=685, size=20, color="#7f1d1d")

    add_rect("Crit Bridge", s6, 1025, 840, 755, 120, fill="#eff6ff", stroke="#3b82f6", stroke_w=2, corner_radius=12)
    add_text("Inilah alasan mengapa kita membutuhkan Solusi 2:\nDatabase Transaction (ACID All-or-Nothing)!", s6, 1055, 868, width=695, size=21, color="#1e40af", bold=True, align="center")

    # =========================================================================
    # SLIDE 7: MASA SEKARANG: SOLUSI 2
    # =========================================================================
    x, y = get_slide_pos(6)
    s7 = add_frame("07. Solusi 2 DB Transaction", x, y, SLIDE_W, SLIDE_H, fill="#f8fafc")
    add_header(s7, "6 • Masa Sekarang: Solusi 2", "MASA SEKARANG: SOLUSI 2", "Database Transaction (ACID): Menjamin 'All or Nothing'")

    # Left: Prinsip Transaksi & Alur
    add_rect("Left TX", s7, 100, 230, 920, 780, fill="#ffffff", stroke="#3b82f6", stroke_w=2, corner_radius=16)
    add_text("Prinsip Transaksi", s7, 140, 270, size=28, color="#1e40af", bold=True)
    add_text("Tujuan: Jika salah satu tahapan gagal, perubahan yang terlanjur terjadi dapat dikembalikan ke kondisi semula (Rollback).", s7, 140, 320, width=840, size=19, color="#475569")

    add_text("Alur Business Logic:", s7, 140, 390, size=22, color="#0f172a", bold=True)
    
    tx_steps = [
        "1. BEGIN TRANSACTION",
        "2. SELECT * FROM obats WHERE id=1 FOR UPDATE (Lock baris)",
        "3. Kurangi stok jika masih mencukupi",
        "4. Simpan pesanan ke pesanan_obats",
        "5. COMMIT TRANSACTION (Perubahan permanen)",
        "6. Jika gagal di tengah jalan ➔ ROLLBACK TRANSACTION"
    ]
    for i, st in enumerate(tx_steps):
        sy = 440 + i * 85
        col_st = "#b91c1c" if i == 5 else "#1e40af"
        add_rect(f"StBox {i+1}", s7, 140, sy, 840, 72, fill="#f8fafc", stroke="#cbd5e1", corner_radius=10)
        add_text(st, s7, 170, sy + 22, size=19, color=col_st, bold=True)

    # Right Top: Keunggulan Integritas
    add_rect("RT Integ", s7, 1060, 230, 760, 360, fill="#ffffff", stroke="#86efac", stroke_w=2, corner_radius=16)
    add_text("Keunggulan Integritas", s7, 1100, 270, size=26, color="#166534", bold=True)
    add_text("Menjamin data tidak pernah korup. Kedua operasi (potong stok dan buat resep) berada dalam satu kesatuan atomik ACID.\n\nTidak ada skenario di mana stok berkurang tanpa resep tercipta, atau sebaliknya.", s7, 1100, 330, width=680, size=20, color="#0f172a")

    # Right Bottom: Konsekuensi Performa
    add_rect("RB Perf", s7, 1060, 630, 760, 380, fill="#ffffff", stroke="#fca5a5", stroke_w=2, corner_radius=16)
    add_text("Konsekuensi Performa", s7, 1100, 670, size=26, color="#b91c1c", bold=True)
    add_text("• Mengunci baris data (lock) membuat service lain harus menunggu (blocking) hingga transaksi selesai.\n\n• Dapat memicu bottleneck atau deadlock jika transaksi berjalan terlalu lama di bawah beban konkurensi ribuan request per detik.", s7, 1100, 730, width=680, size=20, color="#7f1d1d")

    # =========================================================================
    # SLIDE 8: MASA SEKARANG: SOLUSI 3
    # =========================================================================
    x, y = get_slide_pos(7)
    s8 = add_frame("08. Solusi 3 Optimistic", x, y, SLIDE_W, SLIDE_H, fill="#f8fafc")
    add_header(s8, "7 • Masa Sekarang: Solusi 3", "MASA SEKARANG: SOLUSI 3", "Optimistic Locking: Deteksi Konflik Berbasis Nomor Versi")

    # Left: Konsep Kolom Versi
    add_rect("Left Versi", s8, 100, 230, card_w2, 780, fill="#ffffff", stroke="#e2e8f0", stroke_w=1.5, corner_radius=16)
    add_text("Konsep Kolom Versi", s8, 140, 270, size=28, color="#1e40af", bold=True)
    
    v_points = [
        "Asumsi Optimis: Konflik konkurensi tidak selalu terjadi, sehingga data tidak perlu dikunci di awal.",
        "Proses lain tetap bisa membaca data yang sama secara bebas (non-blocking reads).",
        "Menambahkan kolom 'versi' pada tabel obats (contoh: stok = 1, versi = 5).",
        "Setiap kali data diperbarui, nilai versi dinaikkan (versi = versi + 1).",
        "Saat menyimpan, sistem mengecek apakah versi di database masih sama dengan versi saat pertama dibaca."
    ]
    for i, vp in enumerate(v_points):
        add_text(f"• {vp}", s8, 140, 335 + i * 85, width=755, size=19, color="#0f172a")

    add_rect("Versi Pill", s8, 140, 800, 755, 150, fill="#eff6ff", stroke="#3b82f6", stroke_w=2, corner_radius=12)
    add_text("stok = 1   |   versi = 5", s8, 170, 850, width=695, size=36, color="#1e40af", bold=True, align="center")

    # Right: Timeline Eksekusi Versi
    add_rect("Right Timeline", s8, 985, 230, card_w2, 780, fill="#ffffff", stroke="#3b82f6", stroke_w=2, corner_radius=16)
    add_text("Timeline Eksekusi Versi", s8, 1025, 270, size=28, color="#0f172a", bold=True)

    tl_steps = [
        ("1", "Service #1 membaca:", "Stok = 1, Versi = 5", "#1e40af"),
        ("2", "Service #2 membaca:", "Stok = 1, Versi = 5", "#1e40af"),
        ("3", "Service #1 update:", "SET stok = 0, versi = 6 WHERE versi = 5\n➔ SUKSES • 1 row terupdate", "#059669"),
        ("4", "Service #2 update:", "SET stok = 0, versi = 6 WHERE versi = 5\n➔ DITOLAK • 0 row terupdate", "#dc2626")
    ]
    for i, (num, lbl, val, col_t) in enumerate(tl_steps):
        ty = 330 + i * 115
        add_rect(f"TLB {i+1}", s8, 1025, ty, 755, 100, fill="#f8fafc", stroke="#cbd5e1", corner_radius=10)
        add_text(f"{num}. {lbl}", s8, 1055, ty + 16, size=18, color="#475569", bold=True)
        add_text(val, s8, 1055, ty + 46, width=700, size=19, color=col_t, bold=True)

    add_rect("TL Note", s8, 1025, 800, 755, 150, fill="#fef2f2", stroke="#fca5a5", stroke_w=1.5, corner_radius=12)
    add_text("Alasan Penolakan:", s8, 1055, 825, size=20, color="#b91c1c", bold=True)
    add_text("Versi di database sudah 6, bukan 5. Service #2 otomatis membatalkan pesanan (HTTP 409 Conflict) secara elegan tanpa lock!", s8, 1055, 865, width=695, size=19, color="#7f1d1d")

    # =========================================================================
    # SLIDE 9: BUKTI EKSPERIMEN NYATA
    # =========================================================================
    x, y = get_slide_pos(8)
    s9 = add_frame("09. Bukti Eksperimen", x, y, SLIDE_W, SLIDE_H, fill="#f8fafc")
    add_header(s9, "8 • Bukti Eksperimen Nyata", "BUKTI EKSPERIMEN NYATA", "Hasil Uji Concurrency Paralel 3 Pembeli (Stok Awal = 1)")

    # Table Box
    add_rect("Table Container 2", s9, 100, 230, 1720, 520, fill="#ffffff", stroke="#e2e8f0", stroke_w=1.5, corner_radius=16)
    
    # Header
    add_rect("TH2", s9, 100, 230, 1720, 70, fill="#f1f5f9", stroke="#cbd5e1", corner_radius=16)
    add_text("Skenario Uji", s9, 130, 252, size=18, color="#0f172a", bold=True)
    add_text("Service Instances", s9, 430, 252, size=18, color="#0f172a", bold=True)
    add_text("Respon Pembeli", s9, 750, 252, size=18, color="#0f172a", bold=True)
    add_text("Pesanan Masuk", s9, 1050, 252, size=18, color="#0f172a", bold=True)
    add_text("Stok Akhir", s9, 1260, 252, size=18, color="#0f172a", bold=True)
    add_text("Status Konsistensi", s9, 1460, 252, size=18, color="#0f172a", bold=True)

    exp_rows = [
        ("1. Naive (Tanpa Lock)", "Port 8001, 8002, 8003", "3x Berhasil (HTTP 200)", "3 Pesanan", "0 (Bocor)", "TIDAK KONSISTEN (OVERSELL)", "#dc2626"),
        ("2. Atomic Operation", "Port 8001, 8002, 8003", "1x 200, 2x 400 Gagal", "1 Pesanan", "0 (Akurat)", "KONSISTEN (SQL Conditional)", "#059669"),
        ("3. DB Transaction", "Port 8001, 8002, 8003", "1x 200, 2x 400 Gagal", "1 Pesanan", "0 (Akurat)", "KONSISTEN (ACID Rollback)", "#059669"),
        ("4. Optimistic Locking", "Port 8001, 8002, 8003", "1x 200, 2x 409 Ditolak", "1 Pesanan", "0 (Versi=6)", "KONSISTEN (Version Check)", "#059669")
    ]
    for i, (sken, inst, resp, pes, stok, stat, stat_col) in enumerate(exp_rows):
        ry = 300 + i * 110
        bg = "#ffffff" if i % 2 == 0 else "#f8fafc"
        add_rect(f"ETR_{i}", s9, 100, ry, 1720, 110, fill=bg, stroke="#e2e8f0", corner_radius=0)
        add_text(sken, s9, 130, ry + 40, size=19, color="#0f172a", bold=True)
        add_text(inst, s9, 430, ry + 40, size=18, color="#475569")
        add_text(resp, s9, 750, ry + 40, size=18, color="#0f172a")
        add_text(pes, s9, 1050, ry + 40, size=19, color="#1e40af", bold=True)
        add_text(stok, s9, 1260, ry + 40, size=19, color="#0f172a", bold=True)
        add_text(stat, s9, 1460, ry + 40, size=17, color=stat_col, bold=True)

    # 2 Callout highlights bawah
    add_rect("Highlight Red", s9, 100, 800, 835, 200, fill="#fef2f2", stroke="#fca5a5", stroke_w=2, corner_radius=14)
    add_text("3 pesanan masuk pada skenario Naive untuk stok 1:", s9, 140, 845, width=755, size=21, color="#b91c1c", bold=True)
    add_text("Terjadi overselling fatal! Sistem mengonfirmasi 3 botol padahal barang fisik hanya 1.", s9, 140, 895, width=755, size=19, color="#7f1d1d")

    add_rect("Highlight Green", s9, 985, 800, 835, 200, fill="#f0fdf4", stroke="#86efac", stroke_w=2, corner_radius=14)
    add_text("1 pesanan masuk pada ketiga solusi teruji:", s9, 1025, 845, width=755, size=21, color="#166534", bold=True)
    add_text("Stok akhir akurat dan konsisten 100%! Transaksi berlebih ditolak secara teratur.", s9, 1025, 895, width=755, size=19, color="#14532d")

    # =========================================================================
    # SLIDE 10: MASA DEPAN (NEXT-GEN DISTRIBUTED SYSTEMS)
    # =========================================================================
    x, y = get_slide_pos(9)
    s10 = add_frame("10. Next-Gen Distributed", x, y, SLIDE_W, SLIDE_H, fill="#f8fafc")
    add_header(s10, "9 • Masa Depan", "MASA DEPAN (NEXT-GEN DISTRIBUTED SYSTEMS)", "Tantangan Konkurensi Skala Lanjut (Database-per-Service)")

    # 3 Cards
    future_cards = [
        ("Distributed Locks (Redis)", "REDLOCK ALGORITHM",
         "Ketika database dipecah menjadi beberapa cluster terpisah, lock database tunggal tidak cukup. Redis Distributed Lock mengunci resource lintas cluster di level in-memory.",
         "#2563eb"),
        ("Saga Pattern & Event-Driven", "ORKESTRASI ASINKRON",
         "Menggunakan event broker (Apache Kafka / RabbitMQ) untuk pemesanan obat, verifikasi stok, dan pembayaran dengan mekanisme compensating transactions.",
         "#1e40af"),
        ("Eventual Consistency & CQRS", "PEMISAHAN BACA & TULIS",
         "Command Query Responsibility Segregation (CQRS) memisahkan alur pembacaan stok dengan alur transaksi pemotongan agar throughput mencapai puluhan ribu RPS.",
         "#0f766e")
    ]
    for i, (ftitle, fsub, fdesc, fcol) in enumerate(future_cards):
        fx = start_x + i * (col_w + gap_col)
        add_rect(f"FCard {i+1}", s10, fx, top_y, col_w, h_col, fill="#ffffff", stroke="#e2e8f0", stroke_w=1.5, corner_radius=16)
        
        add_rect(f"FBadge {i+1}", s10, fx + 30, top_y + 30, 260, 36, fill="#eff6ff", stroke="#bfdbfe", corner_radius=8)
        add_text(fsub, s10, fx + 45, top_y + 38, size=15, color=fcol, bold=True)
        
        add_text(ftitle, s10, fx + 30, top_y + 90, width=480, size=28, color="#0f172a", bold=True)
        
        add_rect(f"FDescBox {i+1}", s10, fx + 25, top_y + 200, 490, 520, fill="#f8fafc", stroke="#e2e8f0", corner_radius=12)
        add_text(fdesc, s10, fx + 50, top_y + 240, width=440, size=22, color="#475569")

    # =========================================================================
    # SLIDE 11: KESIMPULAN
    # =========================================================================
    x, y = get_slide_pos(10)
    s11 = add_frame("11. Kesimpulan", x, y, SLIDE_W, SLIDE_H, fill="#f8fafc")
    add_header(s11, "10 • Kesimpulan", "KESIMPULAN", "Panduan Pemilihan Strategi Konsistensi Data")

    # 3 Recommendation Cards
    recs = [
        ("Pilih Operasi Atomic Jika...",
         "Operasi hanya melibatkan 1 tabel tunggal, volume transaksi sangat tinggi, dan butuh performa tercepat tanpa overhead blocking."),
        ("Pilih DB Transaction Jika...",
         "Operasi melibatkan beberapa tabel (stok + pesanan + audit log) yang wajib konsisten bersama ('All or Nothing') di 1 DBMS."),
        ("Pilih Optimistic Locking Jika...",
         "Beban pembacaan jauh lebih tinggi daripada penulisan, latensi pengguna panjang (pengisian form), dan konflik jarang terjadi.")
    ]
    for i, (rtitle, rdesc) in enumerate(recs):
        rx = start_x + i * (col_w + gap_col)
        add_rect(f"RCard {i+1}", s11, rx, top_y, col_w, 520, fill="#ffffff", stroke="#3b82f6" if i==1 else "#e2e8f0", stroke_w=2 if i==1 else 1.5, corner_radius=16)
        
        add_text(rtitle, s11, rx + 30, top_y + 35, width=480, size=24, color="#1e40af", bold=True)
        add_text(rdesc, s11, rx + 30, top_y + 110, width=480, size=22, color="#0f172a")

    # Bottom Cards: Demo link & Q&A
    add_rect("Demo Link Card", s11, 100, 800, 1150, 180, fill="#ffffff", stroke="#e2e8f0", stroke_w=1.5, corner_radius=16)
    add_text("Demo Kode Praktikum & Simulator:", s11, 140, 840, size=24, color="#1e40af", bold=True)
    add_text("github.com/.../apotek-race-condition-pg", s11, 140, 895, size=22, color="#0f172a")

    add_rect("QA Card", s11, 1300, 800, 520, 180, fill="#1e40af", stroke="none", corner_radius=16)
    add_text("Q&A Session", s11, 1300, 860, width=520, size=36, color="#ffffff", bold=True, align="center")

    return commands

def main():
    print("Membangun definisi 11 slide FigCraft...")
    commands = create_deck()
    
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    out_dir = os.path.join(base_dir, "presentasi", "minggu_11_race_condition")
    os.makedirs(out_dir, exist_ok=True)
    
    script_path = os.path.join(os.path.dirname(__file__), "figcraft_commands.json")
    with open(script_path, "w", encoding="utf-8") as f:
        json.dump(commands, f, indent=2)
    print(f"File script commands disimpan: {script_path} ({len(commands)} instruksi)")

    out_figcraft = os.path.join(out_dir, "Presentasi_Minggu11_RaceCondition.figcraft")
    print("Menjalankan FigCraft CLI engine untuk meng-compile file asli .figcraft...")
    cmd = [
        "flatpak", "run",
        "--filesystem=/home/firsandia/Desktop/coba",
        "--command=figcraft-cli",
        "ai.storyteller.figcraft",
        "run",
        "--out", out_figcraft,
        script_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("Error saat menjalankan figcraft-cli:", res.stderr)
    else:
        print("Berhasil membuat:", out_figcraft)

    # Convert to PDF
    out_pdf = os.path.join(out_dir, "Presentasi_Minggu11_RaceCondition.pdf")
    print("Mengonversi slide ke format PDF...")
    cmd_pdf = [
        "flatpak", "run",
        "--filesystem=/home/firsandia/Desktop/coba",
        "--command=figcraft-cli",
        "ai.storyteller.figcraft",
        "convert",
        out_figcraft,
        out_pdf
    ]
    subprocess.run(cmd_pdf, capture_output=True, text=True)
    print("Berhasil membuat PDF:", out_pdf)

    # Export PNGs
    out_png_dir = os.path.join(out_dir, "slides_png")
    os.makedirs(out_png_dir, exist_ok=True)
    print("Mengekspor 11 slide ke PNG resolusi tinggi...")
    cmd_png = [
        "flatpak", "run",
        "--filesystem=/home/firsandia/Desktop/coba",
        "--command=figcraft-cli",
        "ai.storyteller.figcraft",
        "export",
        "--out", out_png_dir,
        out_figcraft
    ]
    subprocess.run(cmd_png, capture_output=True, text=True)
    print("Slide PNG selesai diekspor ke:", out_png_dir)

    # Export .fig
    out_fig = os.path.join(out_dir, "Presentasi_Minggu11_RaceCondition.fig")
    cmd_fig = [
        "flatpak", "run",
        "--filesystem=/home/firsandia/Desktop/coba",
        "--command=figcraft-cli",
        "ai.storyteller.figcraft",
        "export",
        "--out", out_fig,
        out_figcraft
    ]
    subprocess.run(cmd_fig, capture_output=True, text=True)
    print("Slide Figma (.fig) selesai diekspor ke:", out_fig)

if __name__ == "__main__":
    main()
