from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Create database engine
engine = create_engine(DATABASE_URL)

# Create a session factory for DB operations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all database models
Base = declarative_base()
