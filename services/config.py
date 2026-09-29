#!/usr/bin/env python3
"""
Konfigurasi Terpusat RabbitMQ dan Utilitas
Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ
Studi Kasus: Sistem Layanan Kesehatan / Rumah Sakit
"""

import os
import pika

# ==========================================
# KONFIGURASI BROKER RABBITMQ
# Mendukung local RabbitMQ dan remote fasilkomapp
# ==========================================
RABBIT_HOST = os.getenv("RABBIT_HOST", "localhost")
RABBIT_PORT = int(os.getenv("RABBIT_PORT", "5672"))
RABBIT_USER = os.getenv("RABBIT_USER", "guest")  # default guest untuk local, atau admin
RABBIT_PASS = os.getenv("RABBIT_PASS", "guest")
EXCHANGE_NAME = "hospital_prescriptions"

# Inisialisasi colorama untuk tampilan log terminal
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
    """Membuka koneksi TCP dan channel ke server RabbitMQ dengan graceful timeout."""
    # Coba koneksi sesuai environment / config
    hosts_to_try = [
        (RABBIT_HOST, RABBIT_PORT, RABBIT_USER, RABBIT_PASS),
        ("localhost", 5672, "guest", "guest"),
        ("rabbit.fasilkomapp.id", 5672, "admin", "PasswordRabbitMQAman123")
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
                socket_timeout=1
            )
            connection = pika.BlockingConnection(parameters)
            channel = connection.channel()
            channel.exchange_declare(
                exchange=EXCHANGE_NAME,
                exchange_type="fanout",
                durable=True
            )
            return connection, channel
        except Exception as e:
            last_err = e
            continue

    raise ConnectionError(f"Tidak dapat terhubung ke RabbitMQ: {last_err}")
