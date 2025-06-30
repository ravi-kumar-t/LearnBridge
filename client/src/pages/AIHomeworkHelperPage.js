// client/src/pages/AIHomeworkHelperPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AIHomeworkHelperPage() {
  const [problemText, setProblemText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleGenerateExplanation = async () => {
    if (problemText.trim() === '') {
      setError('Please enter a problem to get an explanation.');
      return;
    }

    setLoading(true);
    setError('');
    setExplanation('');

    try {
      const response = await fetch('http://localhost:5000/api/homework-helper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problem: problemText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get explanation from the server.');
      }

      const data = await response.json();
      setExplanation(data.explanation);

    } catch (err) {
      console.error('Error generating explanation:', err);
      setError('Failed to get homework explanation. Please try again. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 pt-24 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"> {/* Adjusted pt-24, added subtle gradient background */}
      <div className="flex justify-start mb-8"> 
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center text-blue-700 hover:text-blue-900 font-medium px-4 py-2 rounded-full border border-blue-600 hover:border-blue-800 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md bg-white" // More professional back button
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Explore
        </button>
      </div>

      <h1 className="text-4xl font-extrabold text-blue-800 mb-4 text-center">AI Homework Helper</h1> 
      <p className="text-xl text-gray-700 mb-10 text-center max-w-2xl mx-auto"> 
        Enter your math or science problem below, and get a step-by-step explanation.
      </p>

      <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-xl mb-8 border border-blue-100"> 
        <div className="mb-6">
          <label htmlFor="problemInput" className="block text-lg font-semibold text-gray-800 mb-3"> 
            Your Problem:
          </label>
          <textarea
            id="problemInput"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition duration-200 ease-in-out text-gray-800 resize-y h-40 placeholder-gray-400" // Enhanced focus, rounded, placeholder
            placeholder="E.g., 'Solve for x: 2x + 5 = 15' or 'Explain the process of photosynthesis.'"
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={handleGenerateExplanation}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100" // Darker blue, increased padding, strong focus, better disabled state
          disabled={loading || !problemText.trim()}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> {/* Larger spinner */}
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Getting Explanation...
            </span>
          ) : (
            'Get Explanation'
          )}
        </button>

        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mt-4 text-center"> {/* Styled error message */}
            {error}
          </p>
        )}
      </div>

      {explanation && (
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-xl mt-8 border border-blue-100"> {/* Consistent styling for output */}
          <h3 className="text-2xl font-bold text-blue-700 mb-5 border-b pb-3 border-blue-200">Explanation:</h3> {/* Styled heading with border */}
          <div className="prose lg:prose-lg max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: explanation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }}>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIHomeworkHelperPage;