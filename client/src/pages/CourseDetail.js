import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function CourseDetail() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [videoDetails, setVideoDetails] = useState(null);
  const [loadingVideoDetails, setLoadingVideoDetails] = useState(true);
  const [videoDetailsError, setVideoDetailsError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

  const chatHistoryRef = useRef(null);
  const youtubeEmbedUrl = `http://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  useEffect(() => {
    const fetchVideoDetails = async () => {
      setLoadingVideoDetails(true);
      setVideoDetailsError(null);
      try {
        const response = await axios.get(`${BACKEND_API_BASE_URL}/api/youtube-video-details/${videoId}`);
        if (response.data.items && response.data.items.length > 0) {
          setVideoDetails(response.data.items[0]);
          setShowFullDescription(false);
          setChatHistory([]);
        } else {
          setVideoDetailsError("Video details not found. Please ensure the video ID is valid.");
        }
      } catch (err) {
        console.error("Error fetching video details from backend:", err);
        if (err.response) {
          if (err.response.status === 403) {
            setVideoDetailsError("Backend API Error: Access Forbidden. Check server-side API key or its restrictions.");
          } else if (err.response.status === 400) {
            setVideoDetailsError("Backend API Error: Bad Request. The video ID might be invalid or YouTube API quota exceeded.");
          } else {
            setVideoDetailsError(`Failed to load video details: ${err.response.status} ${err.response.statusText}. Ensure backend is running.`);
          }
        } else {
          setVideoDetailsError("Network Error or Backend Not Running. Failed to connect to the backend server.");
        }
      } finally {
        setLoadingVideoDetails(false);
      }
    };

    if (videoId) {
      fetchVideoDetails();
    }
  }, [videoId]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const formatNumber = (num) => {
    if (typeof num === 'string') num = parseInt(num);
    if (isNaN(num)) return 'N/A';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const descriptionText = videoDetails?.snippet.description || '';
  const truncationLimit = 300;
  const truncatedDescription = descriptionText.substring(0, truncationLimit);
  const displayDescription = showFullDescription ? descriptionText : truncatedDescription;
  const needsTruncation = descriptionText.length > truncationLimit;

  const handleAskAI = async () => {
    if (!currentQuestion.trim() || isAskingAI) return;
    const userQuestion = currentQuestion.trim();
    setChatHistory(prev => [...prev, { type: 'user', text: userQuestion }]);
    setCurrentQuestion('');
    setIsAskingAI(true);
    setAiError(null);

    try {
      const response = await axios.post(`${BACKEND_API_BASE_URL}/ask-ai`, {
        question: userQuestion,
        videoTitle: videoDetails?.snippet.title,
        videoDescription: videoDetails?.snippet.description,
        videoId: videoId
      });

      const aiAnswer = response.data.answer;
      setChatHistory(prev => [...prev, { type: 'ai', text: aiAnswer }]);
    } catch (err) {
      console.error("Error asking AI:", err);
      setAiError("Failed to get AI response. Please ensure your backend server is running correctly and has access to AI models.");
      setChatHistory(prev => [...prev, { type: 'error', text: "Error: Could not get AI response." }]);
    } finally {
      setIsAskingAI(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isAskingAI) {
      e.preventDefault();
      handleAskAI();
    }
  };

  return (
    <div className="container mx-auto px-4 font-sans pt-24 pb-12">

      <div className="mb-6">
        <button
  onClick={() => navigate('/courses')}
  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg inline-flex items-center transition-colors duration-200"
>
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
  Back
</button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl aspect-video mb-6 relative">
            {loadingVideoDetails ? (
              <div className="flex items-center justify-center h-full text-white text-lg bg-gray-800">
                <p>Loading video player...</p>
              </div>
            ) : videoDetailsError ? (
              <div className="flex items-center justify-center h-full text-red-400 bg-gray-800 p-4 text-center">
                <p>{videoDetailsError}</p>
              </div>
            ) : videoId ? (
              <iframe
                width="100%"
                height="100%"
                src={youtubeEmbedUrl}
                title={videoDetails?.snippet.title || "YouTube video player"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-white text-lg bg-gray-800">
                <p>No video ID provided.</p>
              </div>
            )}
          </div>

          {loadingVideoDetails ? (
            <div className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          ) : videoDetailsError ? null : videoDetails ? (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
                {videoDetails.snippet.title}
              </h1>
              <div className="flex items-center text-gray-600 text-sm mb-4 flex-wrap gap-x-4">
                <a
                  href={`https://www.youtube.com/channel/${videoDetails.snippet.channelId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  {videoDetails.snippet.channelTitle}
                </a>
                <span className="text-gray-400">•</span>
                <span>{formatNumber(videoDetails.statistics?.viewCount)} views</span>
                <span className="text-gray-400">•</span>
                <span>
                  Published{' '}
                  {new Date(videoDetails.snippet.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-gray-400">•</span>
                <span>{formatNumber(videoDetails.statistics?.likeCount)} likes</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 text-base whitespace-pre-wrap leading-relaxed">
                  {displayDescription}
                  {!showFullDescription && needsTruncation && (
                    <span className="text-gray-500">...</span>
                  )}
                </p>
                {needsTruncation && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 hover:underline text-sm mt-3 font-medium"
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-lg flex flex-col h-full min-h-[600px] md:min-h-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4 border-gray-200">Your Study Workspace</h2>
          <div className="mb-8 flex-grow">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">📝 Your Notes</h3>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[180px] text-gray-700 leading-relaxed"
              placeholder="Jot down key points, summarize sections, or list questions..."
            ></textarea>
          </div>

          <div className="flex flex-col h-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">🤖 Ask AI about this video</h3>
            <div ref={chatHistoryRef} className="bg-gray-100 p-4 rounded-lg mb-4 flex-grow overflow-y-auto custom-scrollbar shadow-inner">
              {chatHistory.length === 0 ? (
                <p className="text-gray-600 text-sm italic">
                  Ask AI anything specific about the video, concepts explained, or related topics!
                </p>
              ) : (
                chatHistory.map((message, index) => (
                  <div key={index} className={`mb-3 last:mb-0 ${message.type === 'user' ? 'text-blue-800 text-right' : 'text-gray-800 text-left'}`}>
                    <span className={`inline-block p-3 rounded-lg max-w-[85%] ${message.type === 'user' ? 'bg-blue-100' : 'bg-gray-200'}`}>
                      {message.type === 'user' && <strong className="block text-blue-700 mb-1">You:</strong>}
                      {message.type === 'ai' && <strong className="block text-gray-700 mb-1">AI:</strong>}
                      <p className="text-base">{message.text}</p>
                    </span>
                  </div>
                ))
              )}
              {isAskingAI && (
                <div className="mb-3 text-left">
                  <span className="inline-block p-3 rounded-lg bg-gray-200 text-gray-600 animate-pulse">
                    AI is thinking...
                  </span>
                </div>
              )}
              {aiError && (
                <p className="text-red-500 text-sm text-center mt-2">
                  <span className="inline-block p-2 bg-red-100 rounded-md">{aiError}</span>
                </p>
              )}
            </div>
            <textarea
              type="text"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-y text-gray-700 min-h-[60px] max-h-[120px]"
              placeholder={isAskingAI ? "AI is thinking..." : "Ask a question about the video or topic..."}
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isAskingAI}
            ></textarea>
            <button
              onClick={handleAskAI}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01]"
              disabled={isAskingAI || !currentQuestion.trim()}
            >
              {isAskingAI ? 'Asking AI...' : 'Ask AI'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
