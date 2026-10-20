#!/usr/bin/env python3
"""
Konfigurasi Terpusat RabbitMQ dan Utilitas
Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ 2026
"""

import pika

import os

# ==========================================
# KONFIGURASI BROKER RABBITMQ
# Mendukung server Fasilkom dan fallback lokal (Docker)
# ==========================================
RABBIT_HOST = os.getenv("RABBIT_HOST", "rabbit.fasilkomapp.id")
RABBIT_PORT = int(os.getenv("RABBIT_PORT", "5672"))
RABBIT_USER = os.getenv("RABBIT_USER", "admin")
RABBIT_PASS = os.getenv("RABBIT_PASS", "PasswordRabbitMQAman123")
EXCHANGE_NAME = "hospital_prescriptions"

# Inisialisasi colorama dengan graceful fallback
try:
    from colorama import init, Fore, Style
    init(autoreset=True)
except ImportError:
    class DummyColor:
        def __getattr__(self, name):
            return ""
    Fore = DummyColor()
    Style = DummyColor()

def get_connection():
    """Membuka koneksi TCP dan channel ke server RabbitMQ (Fasilkom / Lokal)."""
    hosts_to_try = [
        ("rabbit.fasilkomapp.id", 5672, "admin", "PasswordRabbitMQAman123"),
        ("localhost", 5672, "guest", "guest")
    ]
    
    last_err = None
    for h, p, u, pwd in hosts_to_try:
        try:
            credentials = pika.PlainCredentials(u, pwd)
            parameters = pika.ConnectionParameters(
                host=h,
                port=p,
                credentials=credentials,
                connection_attempts=1,
                retry_delay=1,
                socket_timeout=1.5
            )
            connection = pika.BlockingConnection(parameters)
            channel = connection.channel()
            
            # Exchange bertipe FANOUT untuk siaran 1:N ke semua divisi
            channel.exchange_declare(
                exchange=EXCHANGE_NAME,
                exchange_type="fanout",
                durable=True
            )
            return connection, channel
        except Exception as e:
            last_err = e
            continue

    raise ConnectionError(f"Tidak dapat terhubung ke RabbitMQ (Fasilkom maupun Lokal): {last_err}")
