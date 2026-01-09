from sqlalchemy import Column, Integer, String, JSON
from .database import Base

# Quiz table model for storing generated quiz data
class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, nullable=False)  # Wikipedia article URL
    title = Column(String)                            # Article title
    summary = Column(String)                          # Short summary of the article
    sections = Column(JSON)                           # Section-wise content
    quiz = Column(JSON)                               # Generated quiz questions
    related_topics = Column(JSON)                     # Related Wikipedia topics
    key_entities = Column(JSON)                       # People, orgs, locations from content
