#!/usr/bin/env python3
"""
Konfigurasi Terpusat RabbitMQ dan Utilitas
Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ 2026
"""

import pika

# ==========================================
# KONFIGURASI BROKER RABBITMQ
# ==========================================
RABBIT_HOST = "rabbit.fasilkomapp.id"
RABBIT_PORT = 5672
RABBIT_USER = "admin"
RABBIT_PASS = "PasswordRabbitMQAman123"
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
    """Membuka koneksi TCP dan channel ke server RabbitMQ."""
    credentials = pika.PlainCredentials(RABBIT_USER, RABBIT_PASS)
    parameters = pika.ConnectionParameters(
        host=RABBIT_HOST,
        port=RABBIT_PORT,
        credentials=credentials,
        connection_attempts=3,
        retry_delay=2
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
