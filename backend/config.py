import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Database
    raw_db_url = os.getenv("DATABASE_URL", "")
    if not raw_db_url:
        print("WARNING: DATABASE_URL is not set!")
        
    # Strip literal quotes just in case they were pasted into Railway's UI
    raw_db_url = raw_db_url.strip('"').strip("'")
    
    # Auto-fix Railway's standard postgresql:// to use the asyncpg driver
    if raw_db_url.startswith("postgres://"):
        raw_db_url = raw_db_url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif raw_db_url.startswith("postgresql://"):
        raw_db_url = raw_db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
        
    # asyncpg expects `ssl=require` instead of `sslmode=require`
    if "sslmode=" in raw_db_url:
        raw_db_url = raw_db_url.replace("sslmode=", "ssl=")
        
    DATABASE_URL: str = raw_db_url

    # Auth
    JWT_SECRET: str = os.getenv("JWT_SECRET", "change_me_in_production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_SERVICE_ACCOUNT_JSON: str = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "")

    # AI
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # Payments
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "")
    RAZORPAY_WEBHOOK_SECRET: str = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")

    # App
    APP_NAME: str = "Sheetx"
    APP_URL: str = os.getenv("APP_URL", "http://localhost:8000")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:8000")
    SUPER_ADMIN_EMAIL: str = os.getenv("SUPER_ADMIN_EMAIL", "hello@sheetx.io")

    # Engine defaults
    GLOBAL_RATE_LIMIT_PER_HOUR: int = int(os.getenv("GLOBAL_RATE_LIMIT_PER_HOUR", 500))
    DEFAULT_BATCH_SIZE: int = int(os.getenv("DEFAULT_BATCH_SIZE", 10))
    DEFAULT_DELAY_SECONDS: int = int(os.getenv("DEFAULT_DELAY_SECONDS", 3))

settings = Settings()
