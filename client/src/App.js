// client/src/App.js
import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Import Clerk components for routing protection
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

// header and footer
import Header from './components/Header';
import Footer from './components/Footer';

// different page compomets
import Home from './pages/Home';
import Courses from './pages/Courses';
import About from './pages/About';
import Contact from './pages/Contact';
import CourseDetail from './pages/CourseDetail';

// these are all ai related pages
import ExploreDashboard from './pages/ExploreDashboard';
import MCQGeneratorPage from './pages/MCQGeneratorPage';
import FlashcardGeneratorPage from './pages/FlashcardGeneratorPage';
import BookSummarizerPage from './pages/BookSummarizerPage';
import ResearchPaperSummarizerPage from './pages/ResearchPaperSummarizerPage';
import CareerRecommendationPage from './pages/CareerRecommendationPage';
import AIHomeworkHelperPage from './pages/AIHomeworkHelperPage';

// auth opages
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';


function PrivateRoute({ children }) {
  const navigate = useNavigate();

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function App() {
  const location = useLocation();

  const hideHeaderAndFooterPaths = ['/sign-in', '/sign-up'];
  const shouldHideHeaderAndFooter = hideHeaderAndFooterPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideHeaderAndFooter && <Header />}

      {/* MODIFIED: Removed 'pt-24' from the main element. */}
      {/* This allows content (like the hero banner) to start from the top of the viewport. */}
      <main className={`flex-grow ${!shouldHideHeaderAndFooter ? '' : ''}`}>
        <Routes>
          {/* all routs that user can see */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/course/:videoId" element={<CourseDetail />} />

          {/* authentication routessignin/sighup*/}
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />

          {/* other ai routsh */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/explore" element={<PrivateRoute><ExploreDashboard /></PrivateRoute>} />
          <Route path="/mcqgenerator" element={<PrivateRoute><MCQGeneratorPage /></PrivateRoute>} />
          <Route path="/flashcardgenerator" element={<PrivateRoute><FlashcardGeneratorPage /></PrivateRoute>} />
          <Route path="/aibook" element={<PrivateRoute><BookSummarizerPage /></PrivateRoute>} />
          <Route path="/airesearchpaper" element={<PrivateRoute><ResearchPaperSummarizerPage /></PrivateRoute>} />
          <Route path="/aicareer" element={<PrivateRoute><CareerRecommendationPage /></PrivateRoute>} />
          <Route path="/aihomework" element={<PrivateRoute><AIHomeworkHelperPage /></PrivateRoute>} />

          <Route path="/aicollege" element={<div className="container mx-auto p-8 text-center text-xl min-h-screen"><h2>AI College Admission Chatbot Page (Coming Soon!)</h2></div>} />
          <Route path="/aicode-review" element={<div className="container mx-auto p-8 text-center text-xl min-h-screen"><h2>AI Code Review Assistant Page (Coming Soon!)</h2></div>} />
          <Route path="/ailegaldocument" element={<div className="container mx-auto p-8 text-center text-xl min-h-screen"><h2>AI Legal Document Summarizer Page (Coming Soon!)</h2></div>} />

          <Route path="*" element={<h1 className="text-center text-4xl mt-20">404 - Page Not Found</h1>} />
        </Routes>
      </main>

      {!shouldHideHeaderAndFooter && <Footer />}
    </div>
  );
}

export default App;