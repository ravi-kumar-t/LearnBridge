// client/src/pages/FlashcardGeneratorPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FlashcardGeneratorPage() {
  const [inputText, setInputText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const navigate = useNavigate();

  const generateFlashcards = async () => {
    if (inputText.trim() === '') {
      setError('Please enter some text to generate flashcards.');
      return;
    }

    setLoading(true);
    setError('');
    setFlashcards([]);
    setCurrentFlashcardIndex(0);
    setShowAnswer(false);
    try {
      const response = await fetch('http://localhost:5000/api/generate-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong with generating flashcards from the backend.');
      }

      const data = await response.json();
      if (!data.flashcards || data.flashcards.length === 0) {
        setError('No flashcards could be generated from the provided text. Please try more detailed input.');
      } else {
        setFlashcards(data.flashcards);
      }

    } catch (err) {
      console.error('Error generating flashcards:', err);
      setError('Failed to generate flashcards. Please check server and try again. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextFlashcard = () => {
    if (currentFlashcardIndex < flashcards.length - 1) {
      setCurrentFlashcardIndex(prevIndex => prevIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePreviousFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(prevIndex => prevIndex - 1);
      setShowAnswer(false);
    }
  };

  const currentFlashcard = flashcards[currentFlashcardIndex];


  return (
    <div className="container mx-auto p-8 pt-24 min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50"> {/* Adjusted pt-24, yellow gradient */}
      <div className="flex justify-start mb-8">
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center text-yellow-700 hover:text-yellow-900 font-medium px-4 py-2 rounded-full border border-yellow-600 hover:border-yellow-800 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md bg-white"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Explore
        </button>
      </div>

      <h1 className="text-4xl font-extrabold text-yellow-800 mb-4 text-center">AI Flashcard Generator</h1> {/* Yellow heading */}
      <p className="text-xl text-gray-700 mb-10 text-center max-w-2xl mx-auto">
        Paste your text below to instantly generate a set of study flashcards.
      </p>


      <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-xl mb-8 border border-yellow-100"> {/* Yellow-themed border/shadow */}
        <div className="mb-6">
          <label htmlFor="inputText" className="block text-lg font-semibold text-gray-800 mb-3">
            Your Text/Topic:
          </label>
          <textarea
            id="inputText"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-yellow-600 focus:border-yellow-600 transition duration-150 ease-in-out text-gray-800 resize-y h-40 placeholder-gray-400"
            placeholder="E.g., 'Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water. Photosynthesis in plants generally involves the green pigment chlorophyll and generates oxygen as a byproduct.' or 'Key concepts of Newton's Laws of Motion.'"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={generateFlashcards}
          className="w-full bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-4 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-3 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          disabled={loading || !inputText.trim()}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            'Generate Flashcards'
          )}
        </button>

        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mt-4 text-center">
            {error}
          </p>
        )}
      </div>

      {flashcards.length > 0 && (
        <div className="max-w-xl mx-auto bg-white p-10 rounded-xl shadow-xl text-center border border-yellow-100">
          <h2 className="text-3xl font-bold text-yellow-800 mb-6">Your Flashcards</h2>
          <p className="text-gray-600 mb-8 text-xl font-medium">Card {currentFlashcardIndex + 1} of {flashcards.length}</p>

          <div
            className="w-full h-80 flex flex-col justify-center items-center bg-yellow-50 border border-yellow-200 rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <p className="text-2xl font-bold text-gray-800 p-6 break-words whitespace-pre-wrap"> {/* Larger font, break-words */}
              {showAnswer ? currentFlashcard.answer : currentFlashcard.question}
            </p>
            <p className="text-sm text-yellow-600 mt-4 font-semibold">
              (Click to flip)
            </p>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePreviousFlashcard}
              disabled={currentFlashcardIndex === 0}
              className={`
                bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105
                ${currentFlashcardIndex === 0 ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
              `}
            >
              Previous
            </button>
            <button
              onClick={handleNextFlashcard}
              disabled={currentFlashcardIndex === flashcards.length - 1}
              className={`
                bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2
                ${currentFlashcardIndex === flashcards.length - 1 ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
              `}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlashcardGeneratorPage;