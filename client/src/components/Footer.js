// client/src/components/Footer.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-950 to-blue-950 text-white py-16 px-4 mt-24 relative overflow-hidden"> {/* Deeper gradient, increased padding, more top margin */}
      {/* Subtle background circles/blobs for a modern feel, similar to hero section */}
      <div className="absolute top-0 -left-16 w-48 h-48 bg-blue-700 rounded-full mix-blend-screen opacity-10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 -right-16 w-48 h-48 bg-purple-700 rounded-full mix-blend-screen opacity-10 animate-pulse-slow animation-delay-2000"></div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-y-12 md:gap-x-12 relative z-10"> {/* Changed to 4 columns for better distribution */}

        {/* Brand/Logo Section (New) */}
        <div className="footer-section brand-info md:col-span-1">
          <h2 className="text-3xl font-extrabold text-blue-400 mb-4 tracking-tight">LearnBridge</h2> {/* Prominent brand name */}
          <p className="text-gray-400 text-md leading-relaxed mb-4">
            Empowering your learning journey without limits. Discover, grow, and build your future with us.
          </p>
          <div className="flex space-x-4 mt-6">
            <a href="https://github.com/your-github" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white transition duration-300 transform hover:scale-110">
              <FontAwesomeIcon icon={faGithub} size="2x" />
            </a>
            <a href="https://instagram.com/your-instagram" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white transition duration-300 transform hover:scale-110">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a href="https://linkedin.com/in/your-linkedin" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white transition duration-300 transform hover:scale-110">
              <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section quick-links md:col-span-1">
          <h3 className="text-xl font-bold mb-5 text-blue-300">Quick Links</h3>
          <ul className="space-y-3">
            <li><a href="/" className="text-gray-300 hover:text-white transition duration-300 text-base">Home</a></li> {/* Added Home link */}
            <li><a href="/about" className="text-gray-300 hover:text-white transition duration-300 text-base">About Us</a></li> {/* Changed from '/' to '/about' */}
            <li><a href="/courses" className="text-gray-300 hover:text-white transition duration-300 text-base">All Courses</a></li> {/* Added All Courses link */}
            <li><a href="/contact" className="text-gray-300 hover:text-white transition duration-300 text-base">Contact Us</a></li>
            <li><a href="/focus-mode" className="text-gray-300 hover:text-white transition duration-300 text-base">Focus Mode</a></li>
            <li><a href="/testimonials" className="text-gray-300 hover:text-white transition duration-300 text-base">Testimonials</a></li>
          </ul>
        </div>

        {/* Connect With Us Section */}
        <div className="footer-section connect md:col-span-1">
          <h3 className="text-xl font-bold mb-5 text-blue-300">Get In Touch</h3> {/* Renamed heading */}
          <p className="text-gray-300 mb-3 flex items-start text-base"> {/* Adjusted items-start for longer addresses */}
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 mt-1 text-blue-400 flex-shrink-0" /> {/* Added flex-shrink-0 */}
            Visakhapatnam, Andhra Pradesh, India
          </p>
          <p className="text-gray-300 mb-3 flex items-center text-base">
            <FontAwesomeIcon icon={faPhone} className="mr-3 text-blue-400" />
            +91 80197 88123
          </p>
          <p className="text-gray-300 mb-5 flex items-center text-base">
            <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-blue-400" />
            ravikumartekkali2006@gmail.com
          </p>
        </div>

        {/* About LearnBridge Section (renamed to Newsletter/Mission) */}
        <div className="footer-section mission-statement md:col-span-1">
          <h3 className="text-xl font-bold mb-5 text-blue-300">Our Mission</h3> {/* Renamed heading */}
          <p className="text-gray-300 leading-relaxed text-base mb-6">
            We are passionately committed to democratizing high-quality education, providing free, accessible, and engaging resources to help everyone master essential skills and build thriving careers.
          </p>
          {/* Optional: Add a newsletter signup form here */}
          {/* <h3 className="text-xl font-bold mb-4 text-blue-300">Stay Updated</h3>
          <form className="flex">
            <input
              type="email"
              placeholder="Your Email"
              className="flex-grow p-3 rounded-l-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-r-md transition duration-300"
            >
              Subscribe
            </button>
          </form> */}
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-700 mt-16 pt-8 text-center text-gray-500 text-sm relative z-10"> {/* Increased top margin */}
        &copy; {new Date().getFullYear()} LearnBridge. All Rights Reserved.
        <p className="mt-3 text-gray-400">Designed with <span style={{ color: '#ef4444' }}>&hearts;</span> in India</p> {/* Changed 'Made with' to 'Designed with' */}
      </div>
    </footer>
  );
}

export default Footer;