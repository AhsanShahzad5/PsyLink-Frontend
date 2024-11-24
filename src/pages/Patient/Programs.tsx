import Navbar from "@/Components/Navbar";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Programs: React.FC = () => {

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

  const maxVisibleCards = 5;


  const navigate = useNavigate();

  const handleCardClick = (item: { title: string; bgColor: string }) => {
    navigate("/patient/exercise-details", { state: item });
  };

  return (
    <>
      
      {/* <div className="flex justify-between items-center w-full p-4 bg-white shadow-md mt-24 rounded-2xl"> */}
        <div className="min-h-screen bg-[#FFFFFF] p-8 my-24 mx-4 rounded-xl ">
         {/* Header Section */}
            <header className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-0">Programs</h1>
            <div className="relative w-full sm:w-auto">
                <input
                type="text"
                placeholder="Search for Course"
                className="px-4 py-2 w-full border rounded-lg text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#02968A]"
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
            <h2 className="text-xl sm:text-2xl font-outfit mb-4 text-[#02968A] bg-white border border-gray-200 rounded-2xl px-4 py-2">
                Popular
            </h2>
            <div className="flex items-center overflow-x-auto space-x-2 sm:space-x-4 scrollbar-hide">
                {/* Left Button */}
                {popularIndex > 0 && (
                <button
                    onClick={() => setPopularIndex((prev) => Math.max(0, prev - 1))}
                    className="text-[#02968A] text-xl sm:text-2xl p-2 h-full flex items-center justify-center"
                >
                    &larr;
                </button>
                )}
                {/* Cards Container */}
                <div className="flex space-x-2 sm:space-x-4">
                {popular.slice(popularIndex, popularIndex + maxVisibleCards).map((item, index) => (
                    <div
                    key={index}
                    className="p-2 sm:p-4 rounded-xl shadow-md min-w-[180px] sm:min-w-[250px]"
                    style={{ backgroundColor: item.bgColor }}
                    onClick={() => handleCardClick(item)}
                    >
                    <p className="text-base sm:text-xl font-bold font-outfit text-center text-black mt-12 sm:mt-24">
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
                    className="text-[#02968A] text-xl sm:text-2xl p-2 h-full flex items-center justify-center"
                >
                    &rarr;
                </button>
                )}
            </div>
            </div>


           {/* Your Courses Section */}
            <div>
            <h2 className="text-xl sm:text-2xl font-outfit mb-4 text-[#02968A] bg-white border border-gray-200 rounded-2xl px-4 py-2">
                Your Courses
            </h2>
            <div className="flex items-center overflow-x-auto space-x-2 sm:space-x-4 scrollbar-hide">
                {/* Left Button */}
                {yourCoursesIndex > 0 && (
                <button
                    onClick={() => setYourCoursesIndex((prev) => Math.max(0, prev - 1))}
                    className="text-[#02968A] text-xl sm:text-2xl p-2 h-full flex items-center justify-center"
                >
                    &larr;
                </button>
                )}
                {/* Courses Container */}
                <div className="flex space-x-2 sm:space-x-4">
                {yourCourses.slice(yourCoursesIndex, yourCoursesIndex + maxVisibleCards).map((item, index) => (
                    <div
                    key={index}
                    className="p-2 sm:p-4 rounded-xl shadow-md min-w-[180px] sm:min-w-[250px]"
                    style={{ backgroundColor: item.bgColor }}
                    onClick={() => handleCardClick(item)}
                    >
                    <p className="text-base sm:text-xl font-bold font-outfit text-center text-black mt-12 sm:mt-24">
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
                    className="text-[#02968A] text-xl sm:text-2xl p-2 h-full flex items-center justify-center"
                >
                    &rarr;
                </button>
                )}
            </div>
            </div>


           {/* Calming Section */}
                <div>
                <h2 className="text-xl sm:text-2xl font-outfit mb-4 text-[#02968A] bg-white border border-gray-200 rounded-2xl px-4 py-2">
                    Calming
                </h2>
                <div className="flex items-center overflow-x-auto space-x-2 sm:space-x-4 scrollbar-hide">
                    {/* Left Button */}
                    {calmingIndex > 0 && (
                    <button
                        onClick={() => setCalmingIndex((prev) => Math.max(0, prev - 1))}
                        className="text-[#02968A] text-xl sm:text-2xl p-2 h-full flex items-center justify-center"
                    >
                        &larr;
                    </button>
                    )}
                    {/* Cards Container */}
                    <div className="flex space-x-2 sm:space-x-4">
                    {calming.slice(calmingIndex, calmingIndex + maxVisibleCards).map((item, index) => (
                        <div
                        key={index}
                        className="p-2 sm:p-4 rounded-xl shadow-md min-w-[180px] sm:min-w-[250px]"
                        style={{ backgroundColor: item.bgColor }}
                        onClick={() => handleCardClick(item)}
                        >
                        <p className="text-base sm:text-xl font-bold font-outfit text-center text-black mt-12 sm:mt-24">
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
                        className="text-[#02968A] text-xl sm:text-2xl p-2 h-full flex items-center justify-center"
                    >
                        &rarr;
                    </button>
                    )}
                </div>
                </div>




          </div>
        </div>
      
    </>
  );
};

export default Programs;
