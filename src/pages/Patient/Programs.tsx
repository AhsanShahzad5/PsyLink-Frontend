import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";

// Define the Task interface based on TaskSchema
interface Task {
  taskName: string;
  taskDescription: string;
  repetitions: number;
  _id: string;
}

// Define the Program interface based on ProgramSchema
interface Program {
  _id: string;
  planName: string;
  planDescription: string;
  duration: "15 days" | "30 days";
  tasks: Task[];
  createdAt: string;
  bgColor?: string; // Make bgColor optional in the base interface
}

// Type for program with required bgColor
type ProgramWithColor = Program & { bgColor: string };

// Type that allows null values for placeholder cards
type ProgramOrNull = ProgramWithColor | null;

// Interface for ongoing program data based on the debug output
interface OngoingProgram {
  daysCompleted: number;
  endDate: string;
  planName: string;
  programId: string;
  startDate: string;
  tasksCompleted: number;
  todayProgressId: string;
  todayTasks: Array<any>;
  totalDays: number;
  totalTasks: number;
}

// Interface for the response from getOngoingPrograms
interface OngoingProgramsResponse {
  programs: OngoingProgram[];
}

const Programs: React.FC = () => {
  const navigate = useNavigate();
  
  // State for storing programs by category
  const [popularPrograms, setPopularPrograms] = useState<ProgramWithColor[]>([]);
  const [yourPrograms, setYourPrograms] = useState<ProgramWithColor[]>([]);
  const [calmingPrograms, setCalmingPrograms] = useState<ProgramWithColor[]>([]);
  const [allPrograms, setAllPrograms] = useState<ProgramWithColor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ongoingPrograms, setOngoingPrograms] = useState<OngoingProgram[]>([]);
  
  // State for pagination
  const [popularIndex, setPopularIndex] = useState(0);
  const [yourCoursesIndex, setYourCoursesIndex] = useState(0);
  const [calmingIndex, setCalmingIndex] = useState(0);
  const [allIndex, setAllIndex] = useState(0);
  const maxVisibleCards = 5;

  // Map of program themes to gradient backgrounds
  const programThemes: Record<string, string> = {
    // Mental health themes
    "anxiety": "linear-gradient(to right, #0f0c29, #302b63, #24243e)", // Deep Blue
    "depression": "linear-gradient(to right, #c84e89, #f15f79)", // Pink-Purple
    "stress": "linear-gradient(to right, #8A2387, #E94057, #F27121)", // Purple-Red-Orange
    "mindfulness": "linear-gradient(to right, #56ab2f, #a8e063)", // Green
    "meditation": "linear-gradient(to right, #1a2980, #26d0ce)", // Blue-Teal
    "adhd": "linear-gradient(to right, #FFD200, #F7971E)", // Yellow-Orange
    "burnout": "linear-gradient(to right, #11998e, #38ef7d)", // Teal-Green
    "nutrition": "linear-gradient(to right, #b4ec51, #429321)", // Green-Yellow
    "sleep": "linear-gradient(to right, #141E30, #243B55)", // Dark Blue
    "wellness": "linear-gradient(to right, #00F260, #0575E6)", // Green-Blue
    "goal" : " linear-gradient(90deg,rgba(98, 107, 33, 1) 0%, rgba(11, 69, 27, 1) 36%, rgba(9, 38, 48, 1) 100%)",
    "connection" : "linear-gradient(90deg,rgba(74, 19, 19, 1) 0%, rgba(255, 64, 147, 1) 36%, rgba(128, 0, 26, 1) 100%)",
    "creative" : "linear-gradient(90deg,rgba(0, 255, 183, 1) 0%, rgba(0, 153, 36, 1) 36%, rgba(255, 247, 0, 1) 100%)",
    //"cognitive" : "linear-gradient(nulldeg,rgba(63, 94, 251, 1) 0%, rgba(252, 70, 107, 1) 100%)",
    "affirmation" : "linear-gradient(90deg,rgba(71, 203, 255, 1) 0%, rgba(0, 78, 173, 1) 50%, rgba(255, 245, 245, 1) 100%)",
    "digital" : "linear-gradient(90deg,rgba(0, 240, 236, 1) 13%, rgba(0, 0, 0, 1) 52%, rgba(0, 55, 255, 1) 92%)",
    "Nature" : "linear-gradient(90deg,rgba(14, 207, 0, 1) 13%, rgba(0, 92, 23, 1) 52%, rgba(14, 207, 0, 1) 92%)",
    "yoga" : "linear-gradient(90deg,rgba(209, 169, 212, 1) 13%, rgba(255, 157, 0, 1) 52%, rgba(176, 51, 72, 1) 92%)",
    "journaling":"linear-gradient(90deg,rgba(97, 47, 36, 1) 0%, rgba(105, 61, 4, 1) 35%, rgba(201, 138, 0, 1) 100%",
    // Default gradient for programs without specific theme matches
    "default": "linear-gradient(to right, #4776E6, #8E54E9)" // Blue-Purple
  };

  // Get appropriate gradient for a program based on name keywords
  const getThemeGradient = (programName: string): string => {
    const nameLower = programName.toLowerCase();
    
    // Check for keyword matches in the program name
    for (const [keyword, gradient] of Object.entries(programThemes)) {
      if (nameLower.includes(keyword)) {
        return gradient;
      }
    }
    
    // Return default gradient if no match found
    return programThemes.default;
  };

  // Fetch ongoing programs from API
  const fetchOngoingPrograms = async () => {
    try {
      const response = await fetch("/api/patient/getOngoingPrograms", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ongoing programs");
      }

      const data = await response.json();
      console.log("this is ongoing Program", data);
      
      // Extract the ongoing programs from the nested structure
      if (data && data.programs && Array.isArray(data.programs)) {
        setOngoingPrograms(data.programs);
        return data.programs;
      }
      
      return [];
    } catch (err) {
      console.error("Error fetching ongoing programs:", err);
      return [];
    }
  };

  // Fetch programs from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // First fetch all programs
        const programsResponse = await fetch("http://localhost:8000/api/program/getPrograms");
        
        if (!programsResponse.ok) {
          throw new Error(`HTTP error! Status: ${programsResponse.status}`);
        }
        
        const allProgramsData = await programsResponse.json();
        console.log("this is fetched programs:", allProgramsData);
        
        // Then fetch ongoing programs
        const userOngoingPrograms = await fetchOngoingPrograms();
        
        if (allProgramsData && Array.isArray(allProgramsData)) {
          // Assign theme-appropriate colors to programs based on name
          const programsWithColors = allProgramsData.map((program: Program) => ({
            ...program,
            bgColor: getThemeGradient(program.planName)
          }));
          
          // Get the last 5 plans for Popular
          const lastSix = programsWithColors.length >= 6 
            ? programsWithColors.slice(-6) 
            : programsWithColors;
          
          // Get All Programs
          setAllPrograms(programsWithColors);  
          
          // Get the first 5 plans for Calming
          const firstSix = programsWithColors.length >= 6 
            ? programsWithColors.slice(0, 6) 
            : programsWithColors;
          
          setPopularPrograms(lastSix);
          
          // Filter for Your Programs - programs that match planName in ongoingPrograms
          if (userOngoingPrograms && userOngoingPrograms.length > 0) {
            const ongoingPlanNames = userOngoingPrograms.map(program => program.planName);
            console.log("Ongoing plan names:", ongoingPlanNames);
            
            const yourProgramsFiltered = programsWithColors.filter(program => 
              ongoingPlanNames.includes(program.planName)
            );
            console.log("Your programs filtered:", yourProgramsFiltered);
            
            setYourPrograms(yourProgramsFiltered);
          } else {
            setYourPrograms([]); // Empty array if no ongoing programs
          }
          
          setCalmingPrograms(firstSix);
        }
      } catch (err) {
        setError("Failed to fetch programs. Please try again later.");
        console.error("Error fetching programs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle program card click
  const handleCardClick = (program: ProgramWithColor) => {
    navigate("/patient/exercise-details", { state: program });
  };

  // Function to render program cards with fixed dimensions
  const renderProgramCards = (
    programs: ProgramWithColor[],
    startIndex: number,
    maxVisible: number
  ) => {
    // If no programs, return null (empty section message will be handled by parent)
    if (programs.length === 0) {
      return null;
    }
    
    // Create visible programs array from the current startIndex
    const visiblePrograms = programs.slice(startIndex, startIndex + maxVisible);
    
    // Create an array of the correct size with programs and/or placeholders
    const displayPrograms: ProgramOrNull[] = [];
    
    // Add actual programs
    for (let i = 0; i < visiblePrograms.length; i++) {
      displayPrograms.push(visiblePrograms[i]);
    }
    
    // Fill the rest with nulls
    for (let i = visiblePrograms.length; i < maxVisible; i++) {
      displayPrograms.push(null);
    }

    return displayPrograms.map((program, index) => (
      <div
        key={program?._id || `placeholder-${index}`}
        className={`rounded-lg shadow-md w-full h-64 flex items-center justify-center ${program ? 'cursor-pointer' : 'opacity-0'}`}
        style={{ 
          background: program?.bgColor || 'transparent',
          minWidth: '200px' 
        }}
        onClick={() => program && handleCardClick(program)}
      >
        {program && (
          <div className="text-center text-white p-6">
            <h3 className="text-xl sm:text-2xl font-bold">
              {program.planName}
            </h3>
          </div>
        )}
      </div>
    ));
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] p-8 my-24 mx-4 rounded-xl flex justify-center items-center">
        <p className="text-xl text-[#02968A]">Loading programs...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] p-8 my-24 mx-4 rounded-xl flex justify-center items-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  // Helper function to render a category section
  const renderCategorySection = (
    title: string,
    programs: ProgramWithColor[],
    currentIndex: number,
    setIndex: React.Dispatch<React.SetStateAction<number>>
  ) => {
    return (
      <div className="mb-12">
        <h2 className="text-xl sm:text-2xl font-outfit mb-4 text-[#02968A] bg-white border-b-2 border-gray-200 pb-2">
          {title}
        </h2>
        
        {programs.length === 0 ? (
          // No courses message for empty sections
          <div className="w-full py-16 flex justify-center items-center bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <p className="text-lg text-gray-500 italic mb-2">No courses enrolled yet</p>
              {title === "Your Courses" && (
                <p className="text-sm text-gray-400">
                  Explore other categories to find programs that interest you
                </p>
              )}
            </div>
          </div>
        ) : (
          // Regular carousel display with cards
          <div className="relative w-full">
            {/* Left Button - Always shown */}
            <button
              onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 text-[#02968A] text-xl sm:text-3xl p-4 h-12 w-12 flex items-center justify-center bg-white/80 rounded-full shadow-md ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={24} strokeWidth={4}  />
            </button>
            
            {/* Cards Container */}
            <div className="flex space-x-4 overflow-x-auto py-4 px-10 scrollbar-hide">
              {renderProgramCards(programs, currentIndex, maxVisibleCards)}
            </div>
            
            {/* Right Button - Always shown */}
            <button
              onClick={() => setIndex((prev) => Math.min(Math.max(0, programs.length - maxVisibleCards), prev + 1))}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 text-[#02968A] text-xl sm:text-3xl p-4 h-12 w-12 flex items-center justify-center bg-white/80 rounded-full shadow-md ${currentIndex + maxVisibleCards >= programs.length ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentIndex + maxVisibleCards >= programs.length}
            >
              <ChevronRight size={24} strokeWidth={4}  />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#FFFFFF] p-10 mt-12">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-0">Programs</h1>
         
         {/* search not wokring */}
          {/* <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search for Course"
              className=" text-black px-4 py-2 w-full border rounded-lg text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#02968A]"
            />
            <button className="absolute right-3 top-2 text-[#02968A]">
              <span className="material-icons">search</span>
            </button>
          </div> */}
        </header>

        {/* Categories Section */}
        <div className="space-y-8">
          {/* Popular Section */}
          {renderCategorySection("Popular", popularPrograms, popularIndex, setPopularIndex)}

          {/* Your Courses Section */}
          {renderCategorySection("Your Courses", yourPrograms, yourCoursesIndex, setYourCoursesIndex)}

          {/* Calming Section */}
          {renderCategorySection("Calming", calmingPrograms, calmingIndex, setCalmingIndex)}

          {/* All Programs Section */}
          {renderCategorySection("All Programs", allPrograms, allIndex, setAllIndex)}
        </div>
      </div>
    </>
  );
};

export default Programs;

