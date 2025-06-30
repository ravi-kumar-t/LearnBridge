// client/src/pages/ResearchPaperSummarizerPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResearchPaperSummarizerPage() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSummarize = async () => {
    if (inputText.trim() === '') {
      setError('Please enter text to summarize.'); // Added client-side validation
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary('');

    try {
      const response = await fetch('http://localhost:5000/api/summarize-research-paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ textToSummarize: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong with summarizing the research paper.');
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching research paper summary:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 pt-24 min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <div className="flex justify-start mb-8">
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center text-teal-700 hover:text-teal-900 font-medium px-4 py-2 rounded-full border border-teal-600 hover:border-teal-800 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md bg-white"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Explore
        </button>
      </div>

      <h1 className="text-4xl font-extrabold text-teal-800 mb-4 text-center">AI Research Paper Summarizer</h1>
      <p className="text-xl text-gray-700 mb-10 text-center max-w-2xl mx-auto">
        Paste your research paper, article, or scientific text below, and our AI will summarize its key findings, methodology, and conclusions.
      </p>

      <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-xl mb-8 border border-teal-100">
        <div className="mb-6">
          <label htmlFor="inputText" className="block text-lg font-semibold text-gray-800 mb-3">
            Research Paper Text:
          </label>
          <textarea
            id="inputText"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600 transition duration-200 ease-in-out text-gray-800 resize-y h-48 placeholder-gray-400"
            placeholder="Enter your research paper text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
        </div>

        <div className="flex justify-center mb-6">
          <button
            // Darker teal, increased padding, strong focus, better disabled state
            className={`
              bg-teal-700 hover:bg-teal-800 text-white font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-3 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
            `}
            onClick={handleSummarize}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Summarizing Research Paper...
              </span>
            ) : (
              'Summarize Research Paper'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mt-4 text-center" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {summary && (
          <div className="mt-8 p-8 bg-teal-50 border border-teal-200 rounded-xl shadow-inner">
            <h3 className="text-2xl font-bold text-teal-700 mb-5 border-b pb-3 border-teal-200">Summary:</h3>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResearchPaperSummarizerPage;