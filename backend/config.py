
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key")
    
    # Database config
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/db_kontenkesehatan")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # LLM API config
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    
    # Model config
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    INDOBERT_MODEL_PATH = os.path.join(BASE_DIR, "app", "ml_models", "indobert")
