from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json
import random

from .database import SessionLocal, engine
from . import models, crud
from .scraper import scrape_wikipedia
from .llm import generate_quiz

# Create DB tables (runs once at startup)
models.Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(title="Wiki Quiz App")

# Allow frontend (React) to access backend APIs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Shuffle options so the correct answer isn't always in the same position
def shuffle_quiz_options(quiz_list):
    for q in quiz_list:
        options = q.get("options", [])
        correct = q.get("answer")

        if not options or correct not in options:
            continue

        random.shuffle(options)

        # Make sure the correct answer is still present
        if correct not in options:
            options[0] = correct

# Preview endpoint – just returns the article title
@app.get("/preview")
def preview_article(url: str):
    scraped = scrape_wikipedia(url)
    return {
        "title": scraped["title"]
    }

# Generate quiz from a Wikipedia URL
@app.post("/generate")
def generate_quiz_api(url: str, db: Session = Depends(get_db)):

    # Check if quiz already exists for this URL
    existing = crud.get_quiz_by_url(db, url)
    if existing:
        return existing

    # Scrape Wikipedia content
    scraped = scrape_wikipedia(url)

    # Generate quiz using the LLM
    llm_response = generate_quiz(scraped["content"])
    parsed = json.loads(llm_response)

    # Shuffle options to avoid answer bias
    quiz_list = parsed["quiz"]
    shuffle_quiz_options(quiz_list)

    # Prepare data for database storage
    data = {
        "url": url,
        "title": scraped["title"],
        "summary": scraped["summary"],
        "sections": scraped["sections"],
        "quiz": quiz_list,
        "related_topics": parsed.get("related_topics", []),
        "key_entities": parsed.get(
            "key_entities",
            {
                "people": [],
                "organizations": [],
                "locations": []
            }
        )
    }

    # Save quiz to the database
    quiz = crud.create_quiz(db, data)
    return quiz

# Fetch all previously generated quizzes
@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    return crud.get_all_quizzes(db)
