from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "sb_publishable_tC3HsmtsJssk6NJGDuvVTg_q8HCRWmF")

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_db():
    """Return Supabase client for database operations"""
    return supabase