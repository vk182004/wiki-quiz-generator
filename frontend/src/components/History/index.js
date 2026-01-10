import { useEffect, useState } from "react";
import QuizModal from "../QuizModal";
import { FaEye, FaPlay, FaHashtag } from "react-icons/fa";
import "./index.css";

const API_BASE = "https://wiki-quiz-generator-jdgi.onrender.com";

// Shows a list of previously generated quizzes
const History = () => {
  // State for quiz history, selected quiz, and UI status
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("view"); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load quiz history when the page opens
  useEffect(() => {
    fetchHistory();
  }, []);

  // Fetch quiz history from the backend
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/history`);

      if (!res.ok) throw new Error("Failed to fetch history");

      const data = await res.json();
      setHistory(data);
    } catch (err) {
      setError("Unable to load quiz history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Quiz History</h2>
        <p className="history-description">
          View previously generated quizzes or retake them to test your knowledge
        </p>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading history...</p>
        </div>

      ) : error ? (
        // Error state
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchHistory} className="retry-btn">
            Retry
          </button>
        </div>

      ) : history.length === 0 ? (
        // Empty state
        <div className="empty-state">
          <h3>No Quiz History</h3>
          <p>Generate quizzes to see them here</p>
        </div>

      ) : (
        <>
          {/* Table showing all saved quizzes */}
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th><FaHashtag /> ID</th>
                  <th>Title</th>
                  <th>Questions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="history-row">
                    <td className="history-id">#{item.id}</td>
                    <td className="history-title">{item.title}</td>
                    <td className="history-count">
                      <span className="count-badge">
                        {item.quiz?.length || 0}
                      </span>
                    </td>
                    <td className="history-actions">
                      {/* View quiz in read-only mode */}
                      <button 
                        onClick={() => {
                          setSelected(item);
                          setMode("view");
                        }}
                        className="action-btn view-btn"
                      >
                        <FaEye />
                        View
                      </button>

                      {/* Retake the quiz in interactive mode */}
                      <button 
                        onClick={() => {
                          setSelected(item);
                          setMode("take");
                        }}
                        className="action-btn take-btn"
                      >
                        <FaPlay />
                        Retake
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Show quiz modal when a quiz is selected */}
          {selected && (
            <QuizModal
              quizData={selected}
              mode={mode}
              onClose={() => {
                setSelected(null);
                setMode("view");
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default History;
