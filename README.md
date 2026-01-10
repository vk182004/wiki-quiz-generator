Wiki Quiz Generator
Overview

Wiki Quiz Generator is a full-stack web application that creates quizzes from Wikipedia articles using a Large Language Model (LLM).
Users can generate quizzes, view previously created quizzes, and retake them in an interactive mode.

The system scrapes Wikipedia content, sends it to an LLM for quiz generation, stores the results in a PostgreSQL database, and displays them through a React-based frontend.


Features

- Generate quizzes from Wikipedia URLs
- AI-based quiz generation using LangChain
- Quiz history with modal view
- Retake quiz with scoring
- Related topic suggestions
- URL validation and article preview
- Cached results to avoid duplicate processing


Tech Stack
Frontend
- React(Create React App)
- deployed on vercel

Backend
- FastAPI
- Deployed on Render

Database
- PostgreSQL

AI/LLM
- Groq (via LangChain)

Web Scraping
- BeautifulSoup

Project Structure
WikiQuiz/
  |- backend/
  |- frontend/
  |- sample_data/
  |- screenshots/
  |- README.md
  |_ prompts.txt

Live Deployment
- Frontend(Vercel):
  https://wiki-quiz-generator-virid.vercel.app/
- Backend (Render):
  https://wiki-quiz-generator-jdgi.onrender.com


Setup Instructions

Backend Setup
- cd backend
- pip install -r requirements.txt


Create a .env file inside the backend folder:
DATABASE_URL=postgresql://username:password@localhost/dbname
GROQ_API_KEY=your_groq_api_key


Run the backend server:
uvicorn app.main:app --reload


Frontend Setup
- cd frontend
- npm install
- npm start


The app will run at:
http://localhost:3000

Environment Variables (Production)
Frontend (Vercel)
- REACT_APP_API_URL=https://wiki-quiz-generator-jdgi.onrender.com


API Endpoints
1. Preview Article

POST /preview?url=
Returns the article title for validation.

2. Generate Quiz

POST /generate?url=
Scrapes the article, generates a quiz using the LLM, and stores the data.

3. Quiz History

GET /history
Returns all previously generated quizzes from the database.


How to Use the Application

1. Open the frontend in your browser
2. Paste a Wikipedia URL
3. Click Generate Quiz
4. Answer the questions
5. Submit to see your score
6. Open the History tab
7. View or retake previous quizzes


LangChain Prompt Templates 
(The full prompt is available in prompts.txt)
Quiz Generation Prompt

"You are an educational quiz generator.

Use ONLY the content below. Do NOT add outside knowledge.

Generate:
- 5–10 multiple-choice questions
- 4 options per question
- correct answer
- difficulty (easy / medium / hard)
- short explanation
- related Wikipedia topics
- key entities (people, organizations, locations) mentioned in the content



Return STRICT JSON in this format:
{{
  "quiz": [
    {{
      "question": "",
      "options": ["", "", "", ""],
      "answer": "",
      "difficulty": "",
      "explanation": ""
    }}
  ],
  "related_topics": [],
  "key_entities": {{
    "people": [],
    "organizations": [],
    "locations": []
  }}
}}

Content:
"

Sample Data
- The sample_data/ folder contains:
- Example Wikipedia URLs tested
- Corresponding JSON API outputs


Screenshots
The screenshots/ folder includes:
- Quiz generation page (Tab 1)
- History view (Tab 2)
- Quiz details modal



Notes
- The system uses caching to avoid regenerating quizzes for the same URL (stored in PostgreSQL)
- Invalid URLs and network errors are handled gracefully
- The UI is designed to be clean and minimal




Author
- Vinodkumar Hiremath
- Final Year Computer Science Engineering Student
