import { useState } from "react";
import QuizCard from "../QuizCard";
import { FaSpinner, FaCheck, FaExclamationTriangle, FaExternalLinkAlt, FaBook } from "react-icons/fa";
import "./index.css";

// Main component for generating and taking quizzes
const GenerateQuiz = () => {
  // State variables for URL input, preview, quiz data, and UI status
  const [url, setUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Simple check to ensure the URL is a Wikipedia article link
  const isValidWikiUrl = (value) =>
    value.startsWith("https://en.wikipedia.org/wiki/");

  // Fetch article title for preview when user types a URL
  const handlePreview = async (value) => {
    setUrl(value);
    setPreviewTitle("");
    setError("");

    if (!value) return;

    if (!isValidWikiUrl(value)) {
      setError("Please enter a valid Wikipedia URL");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/preview?url=${encodeURIComponent(value)}`
      );
      if (!res.ok) throw new Error("Article not found");

      const data = await res.json();
      setPreviewTitle(data.title);
    } catch {
      setError("Unable to fetch article preview");
    }
  };

  // Call backend to generate a quiz from the given URL
  const generateQuiz = async () => {
    if (!url) {
      setError("Please enter a Wikipedia URL");
      return;
    }

    if (!isValidWikiUrl(url)) {
      setError("Please enter a valid Wikipedia article URL");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `http://127.0.0.1:8000/generate?url=${encodeURIComponent(url)}`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Failed to generate quiz");

      const data = await res.json();
      setQuizData(data);
      setAnswers({});
      setSubmitted(false);
    } catch {
      setError("Unable to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Submit the quiz only if all questions are answered
  const submitQuiz = () => {
    if (Object.keys(answers).length !== quizData?.quiz.length) {
      setError("Please answer all questions before submitting");
      return;
    }
    setSubmitted(true);
    setError("");
  };

  // Reset everything to start a new quiz
  const resetQuiz = () => {
    setQuizData(null);
    setAnswers({});
    setSubmitted(false);
    setError("");
  };

  // Calculate score based on correct answers
  const score =
    quizData?.quiz.reduce(
      (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
      0
    ) || 0;

  return (
    <div className="generate-container">
      <div className="generate-header">
        <h2>Create New Quiz</h2>
        <p className="generate-description">
          Enter a Wikipedia URL to generate a quiz from the article content
        </p>
      </div>

      <div className="input-section">
        <div className="url-input-group">
          <input
            type="text"
            placeholder="https://en.wikipedia.org/wiki/..."
            value={url}
            onChange={(e) => handlePreview(e.target.value)}
            className="url-input"
          />
          <button
            onClick={generateQuiz}
            disabled={loading || !url}
            className="generate-btn"
          >
            {loading ? (
              <>
                <FaSpinner className="spin" />
                Generating...
              </>
            ) : (
              "Generate Quiz"
            )}
          </button>
        </div>

        {/* Show error messages if any */}
        {error && (
          <div className="error-message">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}

        {/* Show article preview if URL is valid */}
        {previewTitle && !quizData && (
          <div className="preview-card">
            <FaCheck className="preview-icon" />
            <div className="preview-content">
              <h4>Article Found</h4>
              <p className="preview-title">{previewTitle}</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="preview-link"
              >
                <FaExternalLinkAlt />
                Open Article
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Quiz section appears after quiz is generated */}
      {quizData && (
        <div className="quiz-section">
          <div className="quiz-header">
            <h3>{quizData.title}</h3>
            <button onClick={resetQuiz} className="reset-btn">
              New Quiz
            </button>
          </div>

          <div className="quiz-stats">
            <span className="stat-item">
              <span className="stat-label">Questions:</span>
              <span className="stat-value">{quizData.quiz.length}</span>
            </span>

            {/* Show score only after submission */}
            {submitted && (
              <span className="stat-item score-display">
                <span className="stat-label">Score:</span>
                <span className="stat-value">
                  {score} / {quizData.quiz.length}
                  <span className="score-percent">
                    ({Math.round((score / quizData.quiz.length) * 100)}%)
                  </span>
                </span>
              </span>
            )}
          </div>

          <div className="questions-container">
            {quizData.quiz.map((q, i) => (
              <QuizCard
                key={i}
                quiz={q}
                index={i}
                mode="take"
                selected={answers[i]}
                onSelect={(ans) => {
                  setAnswers({ ...answers, [i]: ans });
                  setError("");
                }}
                showAnswer={submitted}
                isCorrect={submitted ? answers[i] === q.answer : null}
              />
            ))}
          </div>

          {/* Related topics section */}
          {quizData.related_topics && quizData.related_topics.length > 0 && (
            <div className="related-topics-section">
              <h4>
                <FaBook className="topic-icon" />
                Related Topics for Further Reading
              </h4>
              <div className="related-topics-list">
                {quizData.related_topics.map((topic, index) => (
                  <a
                    key={index}
                    href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                      topic
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="topic-link"
                  >
                    <FaExternalLinkAlt className="topic-link-icon" />
                    {topic}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Submit button shown only before submission */}
          {!submitted && quizData && (
            <div className="submit-section">
              <button onClick={submitQuiz} className="submit-btn">
                Submit Answers
              </button>
              <p className="progress-text">
                {Object.keys(answers).length} of {quizData.quiz.length} questions
                answered
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GenerateQuiz;
