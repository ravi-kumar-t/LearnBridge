// client/src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 

  const headerContainerClasses = `
    container mx-auto px-4 py-4
    flex justify-between items-center
    transition-all duration-300 ease-in-out /* Smooth transition for property changes */
    rounded-2xl                        /* Makes the header rounded on all corners */
    my-4                              /* Adds margin top/bottom to make it "float" */
    ${scrolled
      ? 'bg-white bg-opacity-80 backdrop-blur-md shadow-lg' 
      : 'bg-white shadow-md'                                 
    }
  `;

  return (
    <nav className="fixed w-full z-50 top-0"> 
      <div className={headerContainerClasses}>
        <Link to="/" className="flex items-center space-x-2"> 
          <img
            src="/images/learnbridge-logo.png"
            alt="LearnBridge Logo"
            className="h-8 w-auto"
          />
          <span className="text-2xl font-bold text-blue-600">
            LearnBridge
          </span>
        </Link>
        <div className="flex space-x-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/courses" className="text-gray-700 hover:text-blue-600">Courses</Link>
          <Link to="/explore" className="text-gray-700 hover:text-blue-600">AI Tools</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link to="/sign-in" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Sign In
            </Link>
            <Link to="/sign-up" className="text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition">
              Sign Up
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

export default Header;