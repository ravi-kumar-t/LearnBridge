// client/src/pages/Home.js
import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Flashcard from '../components/Flashcard';
import CategoryTile from '../components/CategoryTile';

function Home() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  const handleExploreNowClick = () => {
    navigate('/courses'); 
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="home-page">

      <section className="relative overflow-hidden flex items-center justify-center min-h-[90vh]">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/ai-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 to-transparent"></div>

        <div className="container mx-auto flex flex-col items-center px-4 relative z-20 text-white text-center pt-36 pb-24 md:pt-40 md:pb-32">
          <div className="md:w-3/4 lg:w-2/3 xl:w-1/2">
            <p className="text-sm md:text-base font-semibold uppercase tracking-wider mb-2 drop-shadow">
              Online Learning Platform
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
              Learn without <span className="relative inline-block cursor-pointer glow-on-hover">Limits</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-lg mx-auto drop-shadow-md">
              Your journey to knowledge starts here. Discover a world of expert-led courses,
              personalized learning paths, and a community dedicated to your growth.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleExploreNowClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
              >
                Explore Now
              </button>
              <Link to="/about" className="bg-transparent border border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105">
                Join Free
              </Link>
            </div>
          </div>
        </div>

        <img
          src="/images/678a4aae3ee9f2e87506de82_Clyde (1).webp"
          alt="Clyde the AI Assistant"
          className="absolute bottom-0 right-0 md:right-8 lg:right-16 w-32 md:w-48 lg:w-64 h-auto z-30 animate-float pointer-events-none"
        />

      </section>

      <section className="pt-8 pb-16 md:pt-12 md:pb-24 bg-section-light-bg">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Invest in your professional goals with LearnBridge
          </h3>
          <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
            Get unlimited access to over 90% courses, projects, specializations, courses, certificates on Coursera, taught by top instructors.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Flashcard
              iconSrc="/images/cap-icon.png"
              title="Learn Anything"
              description="Access a vast library of courses covering a wide range of subjects, from tech to arts and everything in between."
            />
            <Flashcard
              iconSrc="/images/money-icon.png"
              title="Save Money"
              description="Affordable learning options and subscriptions that provide access to premium content without breaking the bank."
            />
            <Flashcard
              iconSrc="/images/brain-icon.png"
              title="Flexible Learning"
              description="Learn at your own pace, on your own schedule. Fit education seamlessly into your busy life."
            />
            <Flashcard
              iconSrc="/images/certificate-icon.png"
              title="Unlimited Certificates"
              description="Earn professional certificates from top universities and companies to enhance your resume and career prospects."
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="container mx-auto px-4 space-y-20"> 

          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 bg-white p-8 md:p-12 rounded-3xl shadow-2xl transform transition duration-500 hover:scale-[1.01] hover:shadow-3xl border border-blue-200">
            <div className="md:w-1/2 flex justify-center order-2 md:order-1 relative group">
              <img
                src="/images/welcome-to-elearning.jpg" 
                alt="Welcome to E-learning - Students collaborating"
                className="rounded-2xl shadow-xl w-full max-w-lg h-auto object-cover transform transition duration-300 group-hover:rotate-1 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="md:w-1/2 text-center md:text-left order-1 md:order-2">
              <p className="text-base font-semibold text-blue-600 mb-2 uppercase tracking-wide">Our Mission</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
                Welcome to <span className="text-blue-700">LearnBridge</span>
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6"> 
                Join a vibrant global community of lifelong learners and passionate educators. Our cutting-edge platform is meticulously designed to make <span className="font-semibold text-blue-800">education accessible, profoundly engaging, and truly effective</span> for every individual, irrespective of their background.
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                We pride ourselves on fostering a dynamic and supportive environment where knowledge doesn't just grow – it flourishes, igniting passions and building strong foundations for successful careers.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16 bg-white p-8 md:p-12 rounded-3xl shadow-2xl transform transition duration-500 hover:scale-[1.01] hover:shadow-3xl border border-indigo-200">
            <div className="md:w-1/2 flex justify-center order-2 md:order-1 relative group">
              <img
                src="/images/explore-free-courses.jpg" 
                alt="Person exploring online courses on a tablet"
                className="rounded-2xl shadow-xl w-full max-w-lg h-auto object-cover transform transition duration-300 group-hover:-rotate-1 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="md:w-1/2 text-center md:text-right order-1 md:order-2">
              <p className="text-base font-semibold text-indigo-600 mb-2 uppercase tracking-wide">Start Learning Today</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight"> 
                Unlock Knowledge with <span className="text-indigo-700">Free Courses</span>
              </h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6"> 
                Ready to dive in? Kickstart your transformative learning journey with our curated selection of <span className="font-semibold text-indigo-800">high-quality free courses</span>. These are perfect for exploring new passions, honing existing skills, or simply discovering the joy of learning without any initial commitment.
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8"> 
                Pure, unadulterated knowledge is now truly at your fingertips, ready to empower your next step.
              </p>
              <button
                onClick={() => navigate('/free-courses')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-75"
              >
                Browse Free Courses
              </button>
            </div>
          </div>

        </div>
      </section>
      {/* ENHANCED SECTION END */}

      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Categories</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">Popular Courses to Explore</h2>
          <div className="slider-container">
            <Slider {...settings}>
              <div className="px-2 py-4">
                <CategoryTile imageSrc="/images/python-icon.png" title="Python" />
              </div>
              <div className="px-2 py-4">
                <CategoryTile imageSrc="/images/javascript-icon.png" title="JavaScript" />
              </div>
              <div className="px-2 py-4">
                <CategoryTile imageSrc="/images/java-icon.png" title="Java" />
              </div>
              <div className="px-2 py-4">
                <CategoryTile imageSrc="/images/html-css-icon.png" title="HTML/CSS" />
              </div>
              <div className="px-2 py-4">
                <CategoryTile imageSrc="/images/react-icon.png" title="React" />
              </div>
              <div className="px-2 py-4">
                <CategoryTile imageSrc="/images/node-icon.png" title="Node.js" />
              </div>
              <div className="px-2 py-4">
                <CategoryTile imageSrc="/images/dbms-icon.png" title="DBMS" />
              </div>
              <div className="px-2 py-4">
                <CategoryTile imageSrc="/images/data-structures-icon.png" title="Data Structures" />
              </div>
              <div className="px-2 py-4">
                <CategoryTile imageSrc="/images/cloud-icon.png" title="Cloud Computing" />
              </div>
              <div className="px-2 py-4">
                <CategoryTile imageSrc="/images/ai-ml-icon.png" title="AI/ML" />
              </div>
              <div className="px-2 py-4">
                <CategoryTile imageSrc="/images/cybersecurity-icon.png" title="Cybersecurity" />
              </div>
              <div className="px-2 py-4">
                <CategoryTile imageSrc="/images/ux-ui-icon.png" title="UX/UI Design" />
              </div>
            </Slider>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;