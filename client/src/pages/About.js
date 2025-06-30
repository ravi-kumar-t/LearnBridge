// client/src/pages/About.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page bg-gray-50 pt-20">
      <section className="relative bg-gradient-to-r from-blue-500 to-indigo-700 text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 to-transparent"></div> 

        <div className="container mx-auto px-4 text-center relative z-20"> 
          <p className="text-sm md:text-base font-semibold uppercase tracking-wider mb-2 opacity-80">Our Story</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Connecting Minds, Shaping Futures
          </h1>
          <p className="text-lg md:text-xl max-w-4xl mx-auto mb-10 opacity-90">
            At LearnBridge, we are passionate about making quality education accessible to everyone, everywhere. We believe
            that learning is a lifelong journey, and our platform is designed to empower individuals to achieve their full potential.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/courses')}
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
            >
              Explore Courses
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="bg-transparent border border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-blue-600 transition duration-300 transform hover:scale-105"
            >
              Get in Touch
            </button>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full z-0"> 
            <svg className="absolute opacity-10" width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 64L48 80C96 96 192 128 288 128C384 128 480 96 576 96C672 96 768 128 864 128C960 128 1056 96 1152 80C1248 64 1344 48 1392 40L1440 32L1440 0L1392 0C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0L0 0Z" fill="currentColor"></path>
            </svg>
              <svg className="absolute bottom-0 right-0 opacity-10 transform rotate-180" width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 64L48 80C96 96 192 128 288 128C384 128 480 96 576 96C672 96 768 128 864 128C960 128 1056 96 1152 80C1248 64 1344 48 1392 40L1440 32L1440 0L1392 0C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0L0 0Z" fill="currentColor"></path>
            </svg>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white relative">
        <div className="absolute inset-0 bg-gray-100 opacity-50 -skew-y-3"></div>
        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">Our Mission: Empowering Global Learning</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our core mission is to **democratize education** by making high-quality, relevant learning experiences accessible to
              everyone, regardless of their background or location. We strive to foster a vibrant, global community of learners and
              educators who can **share knowledge, collaborate, and grow together.**
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We are committed to providing an intuitive and engaging platform where students can acquire job-ready skills,
              explore new passions, and **achieve their academic and professional aspirations** with confidence.
            </p>
          </div>
          <div className="flex justify-center md:justify-start">
            <img
              src="/images/flexible-learning.png"
              alt="Our Mission - Empowering Global Learning"
              className="rounded-xl shadow-2xl w-full max-w-lg object-cover border border-gray-100 transform rotate-3 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Why LearnBridge Stands Out</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
            We are dedicated to providing an unparalleled learning experience with a focus on **quality, flexibility, and real-world impact**.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-xl border border-blue-100 hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 ease-in-out">
              <div className="text-blue-600 text-6xl mb-4">👩‍🏫</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Expert-Led Courses</h3>
              <p className="text-gray-700 leading-relaxed">
                Dive deep into subjects with **seasoned professionals and top academics**. Our instructors bring practical insights and deep knowledge, ensuring you learn from the best.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl border border-purple-100 hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 ease-in-out">
              <div className="text-purple-600 text-6xl mb-4">⏱️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Flexible Learning Paths</h3>
              <p className="text-gray-700 leading-relaxed">
                Learn at your own pace, on your own schedule. Our **self-paced model** seamlessly integrates into your busy life, allowing you to learn whenever and wherever it suits you.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl border border-green-100 hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 ease-in-out">
              <div className="text-green-600 text-6xl mb-4">🌐</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Vibrant Community</h3>
              <p className="text-gray-700 leading-relaxed">
                Connect, collaborate, and grow with **fellow learners and supportive educators**. Our passionate community is here to help you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-500 to-indigo-700 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of learners who are transforming their lives with LearnBridge. Browse our extensive catalog of courses today.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-white text-blue-700 font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
          >
            Browse All Courses
          </button>
        </div>
      </section>
    </div>
  );
}

export default About;