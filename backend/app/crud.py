from sqlalchemy.orm import Session
from .models import Quiz

# Fetch a quiz record using the Wikipedia URL
def get_quiz_by_url(db: Session, url: str):
    return db.query(Quiz).filter(Quiz.url == url).first()

# Create and store a new quiz entry in the database
def create_quiz(db: Session, data: dict):
    quiz = Quiz(**data)
    db.add(quiz)
    db.commit()        # Save changes to the database
    db.refresh(quiz)   # Refresh instance to get updated values (like ID)
    return quiz

# Retrieve all stored quizzes from the database
def get_all_quizzes(db: Session):
    return db.query(Quiz).all()
