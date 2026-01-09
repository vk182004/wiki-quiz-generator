import { useState } from "react";
import GenerateQuiz from "./components/GenerateQuiz";
import History from "./components/History";
import { FaBook, FaHistory } from "react-icons/fa";
import "./App.css";

// Root component for the WikiQuiz app
function App() {
  // Tracks which tab is currently active
  const [activeTab, setActiveTab] = useState("generate");

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <FaBook className="title-icon" />
          WikiQuiz Generator
        </h1>
        <p className="app-subtitle">
          Generate quizzes from Wikipedia articles and track your history
        </p>
      </header>

      {/* Tab buttons for navigation */}
      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "generate" ? "active" : ""}`}
            onClick={() => setActiveTab("generate")}
          >
            <FaBook className="tab-icon" />
            Generate Quiz
          </button>

          <button
            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <FaHistory className="tab-icon" />
            History
          </button>
        </div>
      </div>

      {/* Render component based on selected tab */}
      <main className="main-content">
        {activeTab === "generate" && <GenerateQuiz />}
        {activeTab === "history" && <History />}
      </main>
    </div>
  );
}

export default App;
