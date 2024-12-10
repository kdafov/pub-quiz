import { useState, useEffect } from 'react';
import './QuizGame.css';
import { questionPool } from './questions';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    setQuestions(shuffleArray(questionPool).slice(0, 10));
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setGameStarted(true);
    }
  }, [countdown]);

  useEffect(() => {
    if (gameStarted && timeLeft === 0) {
      handleAnswer(null);
    }
    if (gameStarted) {
      const timer = setTimeout(() => {
        if (timeLeft > 0) setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameStarted]);

  const handleAnswer = (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setUserAnswers((prevAnswers) => [
        ...prevAnswers,
        {
          question: currentQuestion.question,
          selectedAnswer: selectedOption,
          correctAnswer: currentQuestion.answer,
        },
      ]);

      if (selectedOption === currentQuestion.answer) {
        setScore(score + 1);
      } else if (selectedOption !== null) {
        setScore(score > 0 ? score - 1 : 0);
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(15);
      } else {
        setIsGameOver(true);
        setShowSummary(true);
      }
    }
  };

  const handlePlayAgain = () => {
    setQuestions(shuffleArray(questionPool).slice(0, 10));
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(15);
    setIsGameOver(false);
    setShowSummary(false);
    setCountdown(3);
    setGameStarted(false);
    setUserAnswers([]);
  };

  if (countdown > 0 && !gameStarted) {
    return (
      <div className="quiz-container">
        <h2>Game starts in... {countdown}</h2>
      </div>
    );
  }

  if (isGameOver && showSummary) {
    return (
      <div className="quiz-container">
        <h2>Game Over</h2>
        <p>Your final score: {score}</p>

        <button onClick={handlePlayAgain}>Play Again</button>

        <div className="summary-container">
          <h3>Summary:</h3>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Your Answer</th>
                <th>Correct Answer</th>
              </tr>
            </thead>
            <tbody>
              {userAnswers.map((answer, index) => (
                <tr key={index}>
                  <td>{answer.question}</td>
                  <td>{answer.selectedAnswer || 'No answer'}</td>
                  <td>{answer.correctAnswer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quiz-container">
      <h2>Pub Quiz</h2>
      <p>Score: {score}</p>
      <div className="question-card fixed-width">
        <p style={{ color: 'black' }}>Q{currentQuestionIndex + 1}: {questions[currentQuestionIndex]?.question}</p>
        <div className="options-container">
          {questions[currentQuestionIndex]?.options.map((option) => (
            <button key={option} onClick={() => handleAnswer(option)}>
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="timer">
        <div className="progress-bar" style={{ width: `${(timeLeft / 15) * 100}%` }}></div>
        <p>{timeLeft} seconds left</p>
      </div>
    </div>
  );
};

export default QuizGame;