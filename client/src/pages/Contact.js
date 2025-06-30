// client/src/pages/Contact.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('submitting');
    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);

      if (response.status === 200) {
        setSubmissionStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmissionStatus('error');
    }
  };

  return (
    // Changed to a uniform very dark background for the entire section
    // Added py-20 for more vertical padding, similar to hero sections
    <section className="py-20 bg-gray-950 text-white pt-24 min-h-screen flex items-center justify-center"> {/* Added min-h-screen, flex, items-center, justify-center for vertical centering on shorter content */}
      <div className="container mx-auto px-4 text-center">
        {/* Adjusted text color for readability on dark background */}
        <p className="text-sm font-extrabold text-blue-300 uppercase tracking-widest mb-2">
          CONNECT WITH US
        </p>
        {/* Title text gradient adjusted for better pop on very dark background */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
          Get In Touch
        </h1>
        {/* Adjusted text color for readability on dark background */}
        <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          {/* Visit Us Card - Background remains white */}
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center transform hover:scale-105 transition duration-300 border-b-4 border-purple-500">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 shadow-md">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-600 text-3xl animate-bounce" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
            <p className="text-gray-700 text-center">Lovely Professional University,</p>
            <p className="text-gray-700 text-center">Punjab, IN</p>
          </div>

          {/* Email Us Card - Background remains white */}
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center transform hover:scale-105 transition duration-300 border-b-4 border-blue-500">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-md">
              <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 text-3xl animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-700 text-center">ravikumartekkali2006@gmail.com</p>
            <p className="text-gray-700 text-center">support@elearning.com</p>
          </div>

          {/* Call Us Card - Background remains white */}
          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center transform hover:scale-105 transition duration-300 border-b-4 border-green-500">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-md">
              <FontAwesomeIcon icon={faPhone} className="text-green-600 text-3xl animate-spin-slow" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-700 text-center">+91 8019788123</p>
            <p className="text-gray-700 text-center">Mon-Fri, 9:00 AM - 6:00 PM</p>
          </div>
        </div>

        {/* Contact Form - Background remains white */}
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-200">
          {/* Heading within form remains in dark text as it's on a white background */}
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center text-purple-700">Send us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-gray-700 text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                placeholder="Inquiry about courses"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline resize-y focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                placeholder="Type your message here..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            {submissionStatus === 'submitting' && (
              // Adjusted text color for dark background
              <p className="text-blue-400 text-center font-medium">Sending message...</p>
            )}
            {submissionStatus === 'success' && (
              // Adjusted text color for dark background
              <p className="text-green-500 text-center font-bold">Message sent successfully! 🎉</p>
            )}
            {submissionStatus === 'error' && (
              // Adjusted text color for dark background
              <p className="text-red-500 text-center font-bold">Failed to send message. Please try again. 😔</p>
            )}
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 w-full transform hover:-translate-y-1"
              disabled={submissionStatus === 'submitting'}
            >
              {submissionStatus === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;