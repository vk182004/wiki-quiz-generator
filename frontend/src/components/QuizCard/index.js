import { FaCheckCircle, FaTimesCircle, FaQuestionCircle } from "react-icons/fa";
import "./index.css";

// Displays a single quiz question with options
const QuizCard = ({ 
  quiz, 
  index, 
  mode = "view", 
  selected, 
  onSelect, 
  showAnswer, 
  isCorrect,
  disabled = false 
}) => {
  // Check if the card is in "take quiz" mode
  const isTakeMode = mode === "take";

  // Check if a specific option is selected
  const isSelected = (option) => selected === option;
  
  // Decide CSS classes for each option based on state
  const getOptionClass = (option) => {
    let className = "option";
    
    if (isTakeMode) {
      if (isSelected(option)) {
        className += " selected";
        if (showAnswer) {
          className += option === quiz.answer ? " correct" : " incorrect";
        }
      }

      if (showAnswer && option === quiz.answer) {
        className += " correct-answer";
      }
    }
    
    return className;
  };

  // Show icons for correct / wrong answers after submission
  const getOptionIcon = (option) => {
    if (!showAnswer || !isTakeMode) return null;
    
    if (option === quiz.answer) {
      return <FaCheckCircle className="option-icon correct-icon" />;
    }

    if (isSelected(option) && option !== quiz.answer) {
      return <FaTimesCircle className="option-icon incorrect-icon" />;
    }

    return null;
  };

  return (
    <div className={`quiz-card ${isTakeMode ? 'take-mode' : 'view-mode'}`}>
      <div className="question-header">
        <span className="question-number">Q{index + 1}</span>

        <div className="question-content">
          <h4 className="question-text">{quiz.question}</h4>

          {/* Show difficulty only in view mode or after submission */}
          {(mode === "view" || showAnswer) && quiz.difficulty && (
            <span className={`difficulty-badge difficulty-${quiz.difficulty.toLowerCase()}`}>
              {quiz.difficulty}
            </span>
          )}
        </div>
      </div>
      
      <div className="options-container">
        {quiz.options.map((option, optIndex) => (
          <div
            key={optIndex}
            className={getOptionClass(option)}
            onClick={() => isTakeMode && !disabled && onSelect(option)}
          >
            <div className="option-content">
              <span className="option-letter">
                {String.fromCharCode(65 + optIndex)}
              </span>
              <span className="option-text">{option}</span>
            </div>

            {getOptionIcon(option)}
          </div>
        ))}
      </div>
      
      {/* Show correct answer and explanation after submission */}
      {showAnswer && (
        <div className="answer-section">
          <div className="answer-header">
            <FaQuestionCircle className="answer-icon" />
            <span className="answer-label">Answer & Explanation</span>
          </div>

          <div className="answer-content">
            <p className="correct-answer-text">
              <strong>Correct Answer:</strong> {quiz.answer}
            </p>

            {quiz.explanation && (
              <p className="explanation-text">
                <strong>Explanation:</strong> {quiz.explanation}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
