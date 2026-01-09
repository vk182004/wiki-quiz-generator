from pydantic import BaseModel
from typing import List, Any

# Response model used when sending quiz data to the frontend
class QuizResponse(BaseModel):
    id: int
    url: str
    title: str
    summary: str
    sections: List[str]        # Article sections
    quiz: Any                  # Quiz questions and answers
    related_topics: List[str]  # Related Wikipedia topics
