// client/src/pages/ExploreDashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ExploreDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const icons = {
    homework: (
      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.105A9.795 9.795 0 0112 4c4.97 0 9 3.582 9 8z"></path></svg>
    ),
    book: (
      <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.5v9M9 9.5l3-3m0 0l3 3m-3-3v9M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
    ),
    mcq: (
      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
    ),
    flashcard: (
        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-4 6h-4m4 0h4m-4 0v4m0-4h-4m4 0v-4m-4 4V7m4 0V3m-4 4H7a2 2 0 00-2 2v4a2 2 0 002 2h4l-3 3v-3h3"></path></svg>
    ),
    career: (
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.5C21 17.064 16.732 21 12 21C7.268 21 3 17.064 3 13.5C3 9.936 7.268 6 12 6C16.732 6 21 9.936 21 13.5Z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V3"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13.5C15 14.881 13.657 16 12 16C10.343 16 9 14.881 9 13.5C9 12.119 10.343 11 12 11C13.657 11 15 12.119 15 13.5Z"></path></svg>
    ),
    college: (
      <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
    ),
    codeReview: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
    ),
    researchPaper: (
      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.5v9M9 9.5l3-3m0 0l3 3m-3-3v9M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
    ),
    legal: (
      <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
    ),
  };

  const allTools = [
    {
      id: 'ai-homework',
      title: 'AI Homework Helper',
      description: 'Explains homework answers step-by-step',
      icon: icons.homework,
      category: 'Learning Tools',
    },
    {
      id: 'ai-book',
      title: 'AI Book Summarizer',
      description: 'Summarize books for students',
      icon: icons.book,
      category: 'Learning Tools',
    },
    {
      id: 'mcq-generator',
      title: 'MCQ Generator',
      description: 'Generate multiple-choice questions based on a topic',
      icon: icons.mcq,
      category: 'Learning Tools',
    },
    {
      id: 'flashcard-generator',
      title: 'AI Flashcard Generator',
      description: 'Generate flashcards from any text or topic',
      icon: icons.flashcard,
      category: 'Learning Tools',
    },
    {
      id: 'ai-career',
      title: 'AI Career Recommendation System',
      description: 'AI-powered career guidance based on skills',
      icon: icons.career,
      category: 'Career Development',
    },
    {
      id: 'ai-code-review',
      title: 'AI Code Review Assistant',
      description: 'Detect vulnerabilities in code',
      icon: icons.codeReview,
      category: 'Professional Tools',
    },
    {
      id: 'ai-research-paper',
      title: 'AI Research Paper Summarizer',
      description: 'Summarize long research papers into key insights',
      icon: icons.researchPaper,
      category: 'Professional Tools',
    },
    {
      id: 'ai-legal-document',
      title: 'AI Legal Document Summarizer',
      description: 'Summarize legal documents effectively',
      icon: icons.legal,
      category: 'Professional Tools',
    }
  ];

  const filteredTools = allTools.filter(tool => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Learning Tools', 'Career Development', 'Professional Tools'];

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
  };

  return (
    <div className="flex bg-gray-50 pt-20">
      <aside className="w-56 bg-white shadow-lg p-6 fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto hidden md:block z-40">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Categories</h2>
        <nav>
          <ul>
            {categories.map(category => (
              <li key={category} className="mb-2">
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    flex items-center p-2 rounded-md w-full text-left transition duration-200
                    ${selectedCategory === category ? 'bg-blue-600 text-white font-semibold shadow-md' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'}
                  `}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex-1 p-8 pt-8 ml-0 md:ml-56">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Browse All Templates</h1> 
        <p className="text-lg text-gray-600 mb-6">What would you like to create today?</p> 

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Search</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 transition duration-200 ease-in-out" // Enhanced search input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        {(selectedCategory !== 'All' || searchTerm) && (
          <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg mb-6 border border-indigo-200 text-indigo-800 shadow-sm">
            <p className="text-sm font-medium">
              {selectedCategory !== 'All' && <span className="font-semibold">Category:</span>} {selectedCategory !== 'All' && selectedCategory}
              {selectedCategory !== 'All' && searchTerm && ' | '}
              {searchTerm && <span className="font-semibold">Search:</span>} {searchTerm && `"${searchTerm}"`}
            </p>
            <button
              onClick={handleClearFilters}
              className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition duration-200 ease-in-out px-2 py-1 rounded hover:bg-indigo-100"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              Clear Filters
            </button>
          </div>
        )}

        <hr className="my-8 border-gray-200" /> 

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> 
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <Link
                key={tool.id}
                to={`/${tool.id.replace(/-/g, '')}`}
                className="group p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 flex flex-col items-center text-center bg-white transform-gpu" // Added shadow, scale, transition
              >
                <div className="flex justify-center items-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 mb-4 text-blue-700 group-hover:from-blue-300 group-hover:to-indigo-300 transition-all duration-300 shadow-md"> {/* Gradient icon background */}
                    {tool.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-700 transition duration-200">{tool.title}</h4> {/* Darker title, hover color */}
                <p className="text-gray-600 mb-4 text-sm">{tool.description}</p>
                <span className="text-indigo-600 group-hover:text-indigo-800 font-medium mt-auto group-hover:underline transition duration-200"> {/* Indigo "Try Now" */}
                  Try Now →
                </span>
              </Link>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-full py-10">
              No templates found matching your criteria.
              <br/>
              <button onClick={handleClearFilters} className="text-indigo-600 hover:underline mt-2 font-medium">
                Clear Filters
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExploreDashboard;