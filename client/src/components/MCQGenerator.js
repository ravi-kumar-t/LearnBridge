// client/src/components/MCQGenerator.js
import React, { useState } from 'react';

function MCQGenerator() {
  const [contextText, setContextText] = useState('');
  const [numMCQs, setNumMCQs] = useState(5); 
  const [generatedMCQs, setGeneratedMCQs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAnswers, setShowAnswers] = useState({}); 

  const handleGenerateMCQs = async () => {
    if (!contextText.trim()) {
      setError('Please enter some text or a topic to generate MCQs.');
      setGeneratedMCQs([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedMCQs([]); 
    setShowAnswers({}); 

    try {
      const response = await fetch('/api/generate-mcqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: contextText, num_mcqs: numMCQs }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedMCQs(data.mcqs || []);
    } catch (err) {
      console.error('Error generating MCQs:', err);
      setError(`Failed to generate MCQs: ${err.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAnswerVisibility = (index) => {
    setShowAnswers(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-xl shadow-lg mt-8">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">AI-Powered MCQ Generator</h2>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1">
          <label htmlFor="contextText" className="block text-gray-700 text-lg font-semibold mb-2">
            Enter Topic or Context Text:
          </label>
          <textarea
            id="contextText"
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            rows="10"
            placeholder="e.g., 'The capital of France is Paris. It is famous for the Eiffel Tower and the Louvre Museum, which houses the Mona Lisa.'"
            value={contextText}
            onChange={(e) => setContextText(e.target.value)}
          ></textarea>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <label htmlFor="numMCQs" className="block text-gray-700 text-lg font-semibold mb-2">
              Number of MCQs to Generate:
            </label>
            <input
              type="number"
              id="numMCQs"
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              min="1"
              max="10" 
              value={numMCQs}
              onChange={(e) => setNumMCQs(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))} 
            />
            <p className="text-sm text-gray-500 mt-2">Generate between 1 and 10 MCQs.</p>
          </div>

          <button
            onClick={handleGenerateMCQs}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading}
          >
            {isLoading ? 'Generating MCQs...' : 'Generate MCQs'}
          </button>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-gray-200">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Generated Multiple Choice Questions</h3>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {!isLoading && !error && generatedMCQs.length === 0 && (
          <p className="text-gray-500 text-center text-lg">Your generated MCQs will appear here.</p>
        )}

        {isLoading && (
          <div className="text-center text-blue-600 text-lg">
            <svg className="animate-spin h-8 w-8 text-blue-600 inline-block mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating MCQs... This may take a moment.
          </div>
        )}

        {!isLoading && generatedMCQs.length > 0 && (
          <div className="space-y-8">
            {generatedMCQs.map((mcq, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
                <p className="font-semibold text-blue-800 text-xl mb-4">
                  {index + 1}. {mcq.question}
                </p>
                <div className="space-y-3">
                  {mcq.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center text-gray-700 text-lg">
                      <input
                        type="radio"
                        name={`mcq-${index}`} 
                        id={`mcq-${index}-option-${optIndex}`}
                        className="mr-3"
                        disabled 
                      />
                      <label htmlFor={`mcq-${index}-option-${optIndex}`} className="cursor-pointer">
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-blue-200">
                  <button
                    onClick={() => toggleAnswerVisibility(index)}
                    className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold py-2 px-4 rounded-full transition duration-200"
                  >
                    {showAnswers[index] ? 'Hide Answer' : 'Show Answer'}
                  </button>
                  {showAnswers[index] && (
                    <p className="text-green-700 font-bold text-lg mt-3">
                      Correct Answer: {mcq.correct_answer}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MCQGenerator;