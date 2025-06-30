// client/src/components/Header.js
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      // You can adjust this '50' value. It's the scroll threshold in pixels
      // after which the header will change its appearance.
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Add the scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts to prevent memory leaks
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Define the dynamic classes for the inner header container
  const headerContainerClasses = `
    container mx-auto px-4 py-4
    flex justify-between items-center
    transition-all duration-300 ease-in-out /* Smooth transition for property changes */
    rounded-2xl                        /* Makes the header rounded on all corners */
    my-4                              /* Adds margin top/bottom to make it "float" */
    ${scrolled
      ? 'bg-white bg-opacity-80 backdrop-blur-md shadow-lg' // Scrolled state: semi-transparent, blurred, larger shadow
      : 'bg-white shadow-md'                                 // Initial state: opaque white, smaller shadow
    }
  `;

  return (
    // The outer nav acts as a fixed full-width container for the header content
    <nav className="fixed w-full z-50 top-0"> {/* z-50 ensures it's on top of other content */}
      <div className={headerContainerClasses}>
        <Link to="/" className="flex items-center space-x-2"> {/* Added flex and space-x-2 to align logo and text */}
          {/* ADDED: Logo image */}
          <img
            src="/images/learnbridge-logo.png" // Replace with your actual logo path
            alt="LearnBridge Logo"
            className="h-8 w-auto" // Adjust height (h-8 means 2rem or 32px) as needed
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