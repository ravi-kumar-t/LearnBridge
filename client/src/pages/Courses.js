// client/src/pages/Courses.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CategoryTile from '../components/CategoryTile'; // Make sure this is the updated one from Step 1
import CourseCard from '../components/CourseCard';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuery, setCurrentQuery] = useState("Python programming tutorial"); // Initial query
  const [searchInput, setSearchInput] = useState("");

  const coursesSectionRef = useRef(null);

  const fetchYouTubeVideos = async (query) => {
    setCurrentQuery(query); // Update current query state
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/search-youtube-videos`, {
        params: {
          q: query,
          maxResults: 12,
          order: 'relevance',
          videoDuration: 'long', // Ensure we get longer content
        },
      });

      const fetchedCourses = response.data.items.map(item => ({
        id: item.id.videoId,
        imageUrl: item.snippet.thumbnails.high.url,
        title: item.snippet.title,
        description: item.snippet.description,
        instructor: item.snippet.channelTitle,
        rating: 'N/A', // YouTube API doesn't provide this directly
        reviews: 'N/A', // YouTube API doesn't provide this directly
        price: 'Free',
        // FIX: Correct YouTube link format for external viewing
        courseLink: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));

      setCourses(fetchedCourses);

    } catch (err) {
      console.error("Error fetching YouTube videos:", err);
      setError("Failed to fetch courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      fetchYouTubeVideos(searchInput.trim());
      // Scroll to courses section after search
      setTimeout(() => {
        if (coursesSectionRef.current) {
          coursesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleCategoryClick = (query) => {
    fetchYouTubeVideos(query);
    // Scroll to courses section after category click
    setTimeout(() => {
      if (coursesSectionRef.current) {
        coursesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchYouTubeVideos(currentQuery);
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="py-8 pt-20">
      {/* ENHANCED SEARCH BAR SECTION START - ADDED DARK TOP GRADIENT */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20 md:py-28 text-white relative overflow-hidden">
        {/* NEW: Dark gradient overlay from top */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 to-transparent"></div>

        {/* Subtle background pattern/texture overlay - Ensure it's behind the dark gradient */}
        <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 20v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 46v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6-20v-4H4v4H0v2h4v4h2v-4h4v-2H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div> {/* Added z-0 */}

        <div className="container mx-auto px-4 text-center relative z-20"> {/* z-20 for content */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Find Your Next <span className="text-yellow-300">Learning Adventure!</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Dive into thousands of free, expert-led courses. Simply select a category below or use our powerful search bar to begin your journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto bg-white rounded-full p-2 shadow-xl">
            <input
              type="text"
              placeholder="e.g., Data Structures, Web Development, Calculus"
              className="w-full p-3 rounded-full sm:rounded-l-full sm:rounded-r-none border-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-6 pr-3 py-3"
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap"
            >
              Search Courses
            </button>
          </div>
        </div>
      </section>
      {/* ENHANCED SEARCH BAR SECTION END */}

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Categories</h3>
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Popular Courses to explore</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {/* These now correctly use the onClick prop to trigger handleCategoryClick */}
            <CategoryTile imageSrc="/images/python-icon.png" title="Python" onClick={() => handleCategoryClick("Python programming tutorial")} />
            <CategoryTile imageSrc="/images/javascript-icon.png" title="JavaScript" onClick={() => handleCategoryClick("JavaScript full course")} />
            <CategoryTile imageSrc="/images/java-icon.png" title="Java" onClick={() => handleCategoryClick("Java comprehensive tutorial")} />
            <CategoryTile imageSrc="/images/html-css-icon.png" title="HTML CSS" onClick={() => handleCategoryClick("HTML CSS responsive design tutorial")} />
            <CategoryTile imageSrc="/images/react-icon.png" title="React" onClick={() => handleCategoryClick("React JS complete course")} />
            <CategoryTile imageSrc="/images/node-icon.png" title="Node.js" onClick={() => handleCategoryClick("Node JS backend development")} />

            <CategoryTile imageSrc="/images/dbms-icon.png" title="DBMS" onClick={() => handleCategoryClick("Database Management Systems full course")} />
            <CategoryTile imageSrc="/images/data-structures-icon.png" title="Data Structures" onClick={() => handleCategoryClick("Data Structures and Algorithms full course")} />
            <CategoryTile imageSrc="/images/cloud-icon.png" title="Cloud Computing" onClick={() => handleCategoryClick("Cloud Computing fundamentals tutorial")} />
            <CategoryTile imageSrc="/images/ai-ml-icon.png" title="AI/ML" onClick={() => handleCategoryClick("Artificial Intelligence Machine Learning course")} />
            <CategoryTile imageSrc="/images/cybersecurity-icon.png" title="Cybersecurity" onClick={() => handleCategoryClick("Cybersecurity basics tutorial")} />
            <CategoryTile imageSrc="/images/ux-ui-icon.png" title="UX/UI Design" onClick={() => handleCategoryClick("UX UI Design complete course")} />
          </div>
        </div>
      </section>

      {/* Courses Section: Attach the ref */}
      <section ref={coursesSectionRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Courses</h3>
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Popular Courses for "{currentQuery}"</h2>
          {loading && <p className="text-center text-lg text-gray-700">Loading courses...</p>}
          {error && <p className="text-center text-lg text-red-500">{error}</p>}
          {!loading && !error && courses.length === 0 && (
            <p className="text-center text-lg text-gray-700">No long videos found for "{currentQuery}". Try a different category or search term.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map(course => (
              <CourseCard
                key={course.id}
                id={course.id}
                imageUrl={course.imageUrl}
                title={course.title}
                description={course.description}
                instructor={course.instructor}
                rating={course.rating}
                reviews={course.reviews}
                price={course.price}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Courses;