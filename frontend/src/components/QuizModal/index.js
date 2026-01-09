import { useState, useEffect } from "react";
import Modal from "react-modal";
import QuizCard from "../QuizCard";
import { FaTimes, FaClipboardCheck, FaRedo } from "react-icons/fa";
import "./index.css";

// Set the root element for accessibility
Modal.setAppElement("#root");

// Modal to view or retake a saved quiz
const QuizModal = ({ quizData, mode = "view", onClose }) => {
  // State for answers, submission status, and score
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Reset quiz state when switching to "take" mode
  useEffect(() => {
    if (mode === "take") {
      setAnswers({});
      setSubmitted(false);
      setScore(0);
    }
  }, [mode, quizData]);

  // Handle quiz submission and score calculation
  const handleSubmit = () => {
    if (Object.keys(answers).length !== quizData.quiz.length) {
      alert("Please answer all questions before submitting");
      return;
    }

    const calculatedScore = quizData.quiz.reduce(
      (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
      0
    );

    setScore(calculatedScore);
    setSubmitted(true);
  };

  // Reset quiz for a retake
  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      className="quiz-modal"
      overlayClassName="quiz-overlay"
      closeTimeoutMS={300}
    >
      <div className="modal-header">
        <div className="modal-title-section">
          <h3>{quizData.title}</h3>

          <div className="modal-stats">
            <span className="stat-badge">
              {quizData.quiz.length} Questions
            </span>

            {/* Show score only after submission in take mode */}
            {mode === "take" && submitted && (
              <span className="score-badge">
                Score: {score}/{quizData.quiz.length}
              </span>
            )}
          </div>
        </div>

        {/* Close modal button */}
        <button onClick={onClose} className="modal-close-btn">
          <FaTimes />
        </button>
      </div>

      <div className="modal-content">
        {/* Instructions before starting the quiz */}
        {mode === "take" && !submitted && (
          <div className="quiz-instructions">
            <FaClipboardCheck />
            <p>Select the correct answer for each question. Submit when done.</p>
          </div>
        )}

        {/* Result summary after submission */}
        {mode === "take" && submitted && (
          <div className="quiz-results">
            <h4>
              Quiz Completed: {score}/{quizData.quiz.length} correct
              <span className="score-percentage">
                ({Math.round((score / quizData.quiz.length) * 100)}%)
              </span>
            </h4>

            <button onClick={handleRetake} className="retake-btn">
              <FaRedo />
              Retake Quiz
            </button>
          </div>
        )}

        {/* Render all quiz questions */}
        <div className="questions-list">
          {quizData.quiz.map((q, i) => (
            <QuizCard
              key={i}
              quiz={q}
              index={i}
              mode={mode}
              selected={answers[i]}
              onSelect={(ans) => setAnswers({ ...answers, [i]: ans })}
              showAnswer={mode === "view" || submitted}
              isCorrect={submitted ? answers[i] === q.answer : null}
              disabled={mode === "take" && submitted}
            />
          ))}
        </div>

        {/* Submit section for take mode */}
        {mode === "take" && !submitted && (
          <div className="submit-section">
            <button onClick={handleSubmit} className="modal-submit-btn">
              Submit Answers
            </button>

            <p className="answers-progress">
              {Object.keys(answers).length} of {quizData.quiz.length} answered
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default QuizModal;
