import Navbar from "@/Components/Navbar";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProgramsPage: React.FC = () => {

  // Data for each section
  const popular = [
    { title: "Breathing Exercise", bgColor: "#80C2FF" },
    { title: "Yoga Basics", bgColor: "#FCADE0" },
    { title: "Mindfulness Practice", bgColor: "#A9FFB7" },
    { title: "Stress Relief", bgColor: "#FFDB7E" },
    { title: "Advanced Yoga", bgColor: "#80C2FF" },
    { title: "Morning Stretch", bgColor: "#FCADE0" },
    { title: "Focus Techniques", bgColor: "#A9FFB7" },
    { title: "Energy Boost", bgColor: "#FFDB7E" },
  ];

  const yourCourses = [
    { title: "Meditation Basics", bgColor: "#80C2FF" },
    { title: "Deep Breathing", bgColor: "#FCADE0" },
    { title: "Gratitude Practice", bgColor: "#A9FFB7" },
    { title: "Sleep Aid", bgColor: "#FFDB7E" },
    { title: "Self-Love Meditation", bgColor: "#80C2FF" },
    { title: "Evening Wind Down", bgColor: "#FCADE0" },
    { title: "Visualization", bgColor: "#A9FFB7" },
    { title: "Relaxation Techniques", bgColor: "#FFDB7E" },
  ];

  const calming = [
    { title: "Nature Sounds", bgColor: "#80C2FF" },
    { title: "Ocean Waves", bgColor: "#FCADE0" },
    { title: "Rain Sounds", bgColor: "#A9FFB7" },
    { title: "Forest Ambience", bgColor: "#FFDB7E" },
    { title: "Chimes & Bells", bgColor: "#80C2FF" },
    { title: "Campfire Relaxation", bgColor: "#FCADE0" },
    { title: "Gentle Breeze", bgColor: "#A9FFB7" },
    { title: "Evening Serenade", bgColor: "#FFDB7E" },
  ];

  const [popularIndex, setPopularIndex] = useState(0);
  const [yourCoursesIndex, setYourCoursesIndex] = useState(0);
  const [calmingIndex, setCalmingIndex] = useState(0);

  const maxVisibleCards = 4;


  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/patient/exercise-details");
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-between items-center w-full p-4 bg-white shadow-md mt-24 rounded-2xl">
        <div className="min-h-screen bg-[#FFFFFF] p-8">
          {/* Header Section */}
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold font-syne">Programs</h1>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search for Course"
                className="px-4 py-2 w-80 border rounded-lg text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#02968A]"
              />
              <button className="absolute right-3 top-2 text-[#02968A]">
                <span className="material-icons">search</span>
              </button>
            </div>
          </header>

          {/* Categories Section */}
          <div className="space-y-8">
            {/* Popular Section */}
            <div>
              <h2 className="text-2xl font-outfit mb-4 text-[#02968A] bg-[#fff] border border-gray-200 rounded-2xl px-4">
                Popular
              </h2>
              <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                {/* Left Button */}
                {popularIndex > 0 && (
                  <button
                    onClick={() => setPopularIndex((prev) => Math.max(0, prev - 1))}
                    className="text-[#02968A] text-2xl p-2"
                  >
                    &larr;
                  </button>
                )}
                <div className="flex space-x-4">
                  {popular
                    .slice(popularIndex, popularIndex + maxVisibleCards)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl shadow-md min-w-[250px]"
                        style={{ backgroundColor: item.bgColor }}
                        onClick={handleCardClick}
                      >
                        <p className="text-xl font-bold font-outfit text-center text-[#000] mt-24">
                          {item.title}
                        </p>
                      </div>
                    ))}
                </div>
                {/* Right Button */}
                {popularIndex + maxVisibleCards < popular.length && (
                  <button
                    onClick={() =>
                      setPopularIndex((prev) =>
                        Math.min(popular.length - maxVisibleCards, prev + 1)
                      )
                    }
                    className="text-[#02968A] text-2xl p-2"
                  >
                    &rarr;
                  </button>
                )}
              </div>
            </div>

            {/* Your Courses Section */}
            <div>
              <h2 className="text-2xl font-outfit mb-4 text-[#02968A] bg-[#fff] border border-gray-200 rounded-2xl px-4">
                Your Courses
              </h2>
              <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                {/* Left Button */}
                {yourCoursesIndex > 0 && (
                  <button
                    onClick={() =>
                      setYourCoursesIndex((prev) => Math.max(0, prev - 1))
                    }
                    className="text-[#02968A] text-2xl p-2"
                  >
                    &larr;
                  </button>
                )}
                <div className="flex space-x-4">
                  {yourCourses
                    .slice(yourCoursesIndex, yourCoursesIndex + maxVisibleCards)
                    .map((item, index) => (
                        <div
                        key={index}
                        className="p-4 rounded-xl shadow-md min-w-[250px]"
                        style={{ backgroundColor: item.bgColor }}
                        onClick={handleCardClick}
                      >
                        <p className="text-xl font-bold font-outfit text-center text-[#000] mt-24">
                          {item.title}
                        </p>
                      </div>
                    ))}
                </div>
                {/* Right Button */}
                {yourCoursesIndex + maxVisibleCards < yourCourses.length && (
                  <button
                    onClick={() =>
                      setYourCoursesIndex((prev) =>
                        Math.min(yourCourses.length - maxVisibleCards, prev + 1)
                      )
                    }
                    className="text-[#02968A] text-2xl p-2"
                  >
                    &rarr;
                  </button>
                )}
              </div>
            </div>

            {/* Calming Section */}
            <div>
              <h2 className="text-2xl font-outfit mb-4 text-[#02968A] bg-[#fff] border border-gray-200 rounded-2xl px-4">
                Calming
              </h2>
              <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                {/* Left Button */}
                {calmingIndex > 0 && (
                  <button
                    onClick={() =>
                      setCalmingIndex((prev) => Math.max(0, prev - 1))
                    }
                    className="text-[#02968A] text-2xl p-2"
                  >
                    &larr;
                  </button>
                )}
                <div className="flex space-x-4">
                  {calming
                    .slice(calmingIndex, calmingIndex + maxVisibleCards)
                    .map((item, index) => (
                        <div
                        key={index}
                        className="p-4 rounded-xl shadow-md min-w-[250px]"
                        style={{ backgroundColor: item.bgColor }}
                        onClick={handleCardClick}
                      >
                        <p className="text-xl font-bold font-outfit text-center text-[#000] mt-24">
                          {item.title}
                        </p>
                      </div>
                    ))}
                </div>
                {/* Right Button */}
                {calmingIndex + maxVisibleCards < calming.length && (
                  <button
                    onClick={() =>
                      setCalmingIndex((prev) =>
                        Math.min(calming.length - maxVisibleCards, prev + 1)
                      )
                    }
                    className="text-[#02968A] text-2xl p-2"
                  >
                    &rarr;
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgramsPage;
