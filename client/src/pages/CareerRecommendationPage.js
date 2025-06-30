// client/src/pages/CareerRecommendationPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';

function CareerRecommendationPage() {
  const [userInput, setUserInput] = useState('');
  const [inferredInterests, setInferredInterests] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleGenerateRecommendation = async () => {
    setIsLoading(true);
    setError(null);
    setInferredInterests('');
    setRecommendation('');

    if (!userInput.trim()) {
      setError("Please provide your skills, technologies, or keywords.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/career-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: userInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong with generating the career recommendation.');
      }

      const data = await response.json();
      const fullRecommendation = data.recommendation;

      const sections = {};
      // Updated regex to handle Roman numerals and potential extra spaces
      const sectionRegex = /\*\*(I|II|III|IV|V|VI|VII)\.\s*(.*?)\*\*\s*([\s\S]*?)(?=(?:\*\*(?:I|II|III|IV|V|VI|VII)\.\s*.*?\*|\s*$))/g;
      let match;

      while ((match = sectionRegex.exec(fullRecommendation)) !== null) {
        const sectionHeading = `**${match[1]}. ${match[2].trim()}**`; // Trim heading title
        const sectionContent = match[3].trim();
        sections[sectionHeading] = sectionContent;
      }

      const inferredInterestsHeading = '**I. Inferred Interests**';
      if (sections[inferredInterestsHeading]) {
        setInferredInterests(sections[inferredInterestsHeading]);
      } else {
        setInferredInterests("Could not find 'Inferred Interests' section.");
      }

      let mainRecommendationContent = '';
      const orderedHeadings = [
        '**II. Recommended Career Path**',
        '**III. Essential Skill Sets**',
        '**IV. Technologies to Learn**',
        '**V. Resources for Learning**',
        '**VI. Job Market Insights (General Trends)**',
        '**VII. Action Plan**'
      ];

      orderedHeadings.forEach(heading => {
        if (sections[heading]) {
          mainRecommendationContent += `${heading}\n${sections[heading]}\n\n`;
        }
      });

      setRecommendation(mainRecommendationContent.trim());

    } catch (err) {
      setError(err.message);
      console.error("Error fetching career recommendation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 pt-24 min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50"> {/* Adjusted pt-24, indigo gradient */}
      <div className="flex justify-start mb-8">
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center text-indigo-700 hover:text-indigo-900 font-medium px-4 py-2 rounded-full border border-indigo-600 hover:border-indigo-800 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md bg-white"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Explore
        </button>
      </div>

      <h1 className="text-4xl font-extrabold text-indigo-800 mb-4 text-center">AI Career Recommendation System</h1> {/* Indigo heading */}
      <p className="text-xl text-gray-700 mb-10 text-center max-w-3xl mx-auto">
        Enter your skills, technologies, and interests below. Our AI will infer your potential interests and suggest a personalized career path, roadmap, and learning resources.
      </p>

      <div className="max-w-6xl mx-auto bg-white p-10 rounded-xl shadow-xl flex flex-col md:flex-row gap-8 border border-indigo-100"> {/* Wider container, indigo theme */}
        <div className="flex-1">
          <div className="mb-6">
            <label htmlFor="userInput" className="block text-lg font-semibold text-gray-800 mb-3">
              Your Skills, Technologies, and Keywords:
            </label>
            <textarea
              id="userInput"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 transition duration-200 ease-in-out text-gray-800 resize-y h-36 placeholder-gray-400"
              placeholder="e.g., HTML, CSS, JavaScript, React.js, Python, Data Analysis, Cloud Computing..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            ></textarea>
          </div>

          <div className="flex justify-center mb-6 md:mb-0">
            <button
              onClick={handleGenerateRecommendation}
              disabled={isLoading || !userInput.trim()}
              className={`bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-3 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Recommendation...
                </span>
              ) : (
                'Generate Recommendation'
              )}
            </button>
          </div>

          {inferredInterests && !error && (
            <div className="mt-8 p-6 bg-purple-50 border border-purple-200 rounded-xl shadow-inner"> {/* Distinct color for inferred interests */}
              <h3 className="text-xl font-semibold text-purple-800 mb-3 border-b pb-2 border-purple-200">Inferred Interests:</h3>
              <div className="prose max-w-none text-gray-800 leading-relaxed">
                <Markdown>{inferredInterests}</Markdown>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mt-6 text-center" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
        </div>


        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Recommended Career Path & Details:</h3>
          {recommendation && !error ? (
            <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-xl shadow-inner prose max-w-none leading-relaxed">
              <Markdown>{recommendation}</Markdown>
            </div>
          ) : (
            !isLoading && !error && (
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-inner text-gray-600 text-center italic">
                    Your detailed career recommendation will appear here.
                </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default CareerRecommendationPage;