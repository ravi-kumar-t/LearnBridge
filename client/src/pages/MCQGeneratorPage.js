// client/src/pages/MCQGeneratorPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MCQGeneratorPage() {
  const [text, setText] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [mcqs, setMcqs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();

  const handleGenerateMCQs = async () => {
    setIsLoading(true);
    setError(null);
    setMcqs([]);
    setSelectedAnswers({});
    setShowResults(false);

    if (!text.trim()) {
      setError("Please provide text to generate MCQs.");
      setIsLoading(false);
      return;
    }
    if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 10) {
      setError("Number of questions must be between 1 and 10.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/generate-mcqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, numQuestions: parseInt(numQuestions) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong with generating MCQs.');
      }

      const data = await response.json();
      setMcqs(data.mcqs);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching MCQs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (questionIndex, selectedOption) => {
    if (!showResults) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: selectedOption,
      }));
    }
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
  };

  const getOptionClass = (questionIndex, option, correctOption, userSelected) => {
    if (!showResults) return '';

    if (option === correctOption) {
      return 'bg-green-100 text-green-800 border-green-500 font-semibold'; 
    }
    if (option === userSelected && option !== correctOption) {
      return 'bg-red-100 text-red-800 border-red-500 font-semibold'; 
    }
    return '';
  };

  return (
    <div className="container mx-auto p-8 pt-24 min-h-screen bg-gradient-to-br from-gray-50 to-purple-50"> {/* Adjusted pt-24, purple gradient */}
      <div className="flex justify-start mb-8">
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center text-purple-700 hover:text-purple-900 font-medium px-4 py-2 rounded-full border border-purple-600 hover:border-purple-800 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md bg-white"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Explore
        </button>
      </div>

      <h1 className="text-4xl font-extrabold text-purple-800 mb-4 text-center">AI MCQ Generator</h1> {/* Purple heading */}
      <p className="text-xl text-gray-700 mb-10 text-center max-w-2xl mx-auto">
        Enter your text below to generate multiple-choice questions automatically.
      </p>

      <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-xl mb-8 border border-purple-100"> {/* Purple-themed border/shadow */}
        <div className="mb-4">
          <label htmlFor="textInput" className="block text-lg font-semibold text-gray-800 mb-3">
            Text for MCQs:
          </label>
          <textarea
            id="textInput"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-purple-600 focus:border-purple-600 transition duration-200 ease-in-out text-gray-800 resize-y h-40 placeholder-gray-400"
            placeholder="Paste your course material, article, or notes here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="numQuestions" className="block text-lg font-semibold text-gray-800 mb-3">
            Number of Questions (1-10):
          </label>
          <input
            type="number"
            id="numQuestions"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-600 focus:border-purple-600 transition duration-200 ease-in-out text-gray-800"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            min="1"
            max="10"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleGenerateMCQs}
            disabled={isLoading || !text.trim()}
            className={`
              bg-purple-700 hover:bg-purple-800 text-white font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-3 focus:ring-purple-500 focus:ring-offset-2
              ${isLoading || !text.trim() ? 'opacity-60 cursor-not-allowed hover:scale-100' : ''}
            `}
          >
            {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating MCQs...
                </span>
              ) : (
                'Generate MCQs'
              )}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mt-6 text-center" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
      </div>

      {mcqs.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-xl border border-purple-100">
          <h2 className="text-3xl font-bold text-purple-800 mb-8 text-center">Generated MCQs</h2>
          {mcqs.map((mcq, qIndex) => (
            <div key={qIndex} className="mb-10 p-8 border border-purple-200 rounded-xl shadow-md bg-purple-50"> {/* Purple-themed question card */}
              <p className="text-xl font-bold text-gray-900 mb-5">
                {qIndex + 1}. {mcq.question}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5"> 
                {mcq.options.map((option, oIndex) => (
                  <label
                    key={oIndex}
                    className={`
                      flex items-center p-4 rounded-lg border cursor-pointer transition-colors duration-200
                      ${selectedAnswers[qIndex] === option ? 'bg-purple-100 border-purple-500 shadow-md' : 'bg-white border-gray-300 hover:bg-gray-100'}
                      ${getOptionClass(qIndex, option, mcq.answer, selectedAnswers[qIndex])}
                    `}
                  >
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      value={option}
                      checked={selectedAnswers[qIndex] === option}
                      onChange={() => handleOptionChange(qIndex, option)}
                      disabled={showResults}
                      className="mr-3 h-5 w-5 text-purple-600 focus:ring-purple-500" 
                    />
                    <span className="text-gray-800 text-lg">{option}</span> 
                  </label>
                ))}
              </div>
              {showResults && (
                <p className="mt-6 text-lg font-medium"> 
                  Your Answer: <span className={selectedAnswers[qIndex] === mcq.answer ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                    {selectedAnswers[qIndex] || 'Not answered'}
                  </span>
                  <br />
                  Correct Answer: <span className="text-green-700 font-bold">{mcq.answer}</span>
                </p>
              )}
            </div>
          ))}
          {mcqs.length > 0 && !showResults && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleCheckAnswers}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
              >
                Check Answers
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MCQGeneratorPage;