import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

# Load environment variables from .env file
load_dotenv()

# Initialize the Groq LLM with required settings
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.3,
    api_key=os.getenv("GROQ_API_KEY")
)

# Prompt template used to generate quiz questions from Wikipedia content
quiz_prompt = PromptTemplate(
    input_variables=["content"],
    template="""
You are an educational quiz generator.

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
{content}
"""
)

# Generate quiz data using the LLM based on given content
def generate_quiz(content: str):
    prompt = quiz_prompt.format(content=content)  # Insert content into prompt
    response = llm.invoke(prompt)                 # Send prompt to the model
    return response.content                      # Return generated quiz JSON
