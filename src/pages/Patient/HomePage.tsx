import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import userAtom from '@/atoms/userAtom';
import { useRecoilValue } from 'recoil';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronRight, ChevronLeft } from "lucide-react";
import MoodLogging from '@/Components/patient/MoodLogging';




interface Task {
  taskName: string;
  repetitions: number;
  completed: boolean;
}

interface OngoingProgram {
  programId: string;
  planName: string;
  startDate: string;
  endDate: string;
  todayTasks: Task[];
  todayProgressId: string;
  daysCompleted: number;
  totalDays: number;
  tasksCompleted: number;
  totalTasks: number;
}

const HomePage: React.FC = () => {
  const user = useRecoilValue(userAtom);
  const [selectedCard, setSelectedCard] = useState("");
  const [programs, setPrograms] = useState<OngoingProgram[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTaskIndex, setLoadingTaskIndex] = useState<number | null>(null);

  const navigate = useNavigate();
  let h = window.innerWidth
  let w = window.innerHeight
  const currentProgram = programs[currentIndex] || null;

  useEffect(() => {
    fetchOngoingPrograms();
  }, []);

  const fetchOngoingPrograms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/patient/getOngoingPrograms", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ongoing programs");
      }

      const data = await response.json();
      console.log("this is ongoing Program", data)

      // Use the first ongoing program if available
      if (data.programs && data.programs.length > 0) {
        setPrograms(data.programs);
        setCurrentIndex(0); // start with the first program
      }

    } catch (error) {
      console.error("Error fetching ongoing programs:", error);
      toast.error("Failed to load your programs. Please try again.");
    } finally {
      setIsLoading(false);

    }
  };

  const handleMarkTask = async (taskIndex: number) => {
    if (!currentProgram) return;

    try {
      setLoadingTaskIndex(taskIndex);

      const response = await fetch("/api/patient/markTaskComplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          programId: currentProgram.programId,
          dailyProgressId: currentProgram.todayProgressId,
          taskIndex,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const data = await response.json();

      // Update the local state to reflect the change
      setPrograms(prev => {
        const updated = [...prev];

        if (!updated[currentIndex]) return prev;

        const updatedTasks = [...updated[currentIndex].todayTasks];
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          completed: data.completed,
        };

        const tasksCompletedDelta = data.completed ? 1 : -1;

        updated[currentIndex] = {
          ...updated[currentIndex],
          todayTasks: updatedTasks,
          tasksCompleted: updated[currentIndex].tasksCompleted + tasksCompletedDelta,
        };

        return updated;
      });

      toast.success(data.message);
    } catch (error) {
      console.error("Error marking task:", error);
      toast.error("Failed to update task. Please try again.");
    } finally {
      setLoadingTaskIndex(null);
    }
  };

  const handleQuickClick = (title: string) => {
    navigate(`/patient/${title}`);
    setSelectedCard(title);
  };

  return (
<div className="min-h-screen bg-[#D3EDEB] mt-3 mx-4 sm:mx-6 lg:mx-10">
        <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Main Content */}
      <div className="pt-[4.5rem] flex flex-col lg:flex-row w-full gap-4 sm:gap-6">        {/* {h} {w} */}
        {/* Welcome Section */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full h-auto min-h-[400px] sm:min-h-[480px] lg:w-1/3 flex flex-col items-center space-y-6 sm:space-y-10">
          <h2 className="text-xl sm:text-2xl font-bold text-center">Welcome Home</h2>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700">{user.name}</h3>
          <img src="/src/assets/patient/homepage/Sphere.png" alt="Welcome Image" className="w-full max-w-[200px] sm:max-w-[250px] rounded-lg" />
        </div>

        {/* Right Section: How Are You Feeling Today? and Quick Access */}
        <div className="w-full lg:w-2/3 space-y-4 sm:space-y-6 h-auto min-h-[400px] sm:min-h-[480px]">
          {/* How Are You Feeling Today? Section */}
          <MoodLogging />

          {/* Quick Access Section */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">             
  {["Notes", "History", "Files"].map((title) => (               
    <QuickAccessCard                 
      key={title}                 
      title={title}                 
      imgSrc={`/src/assets/patient/homepage/${title}.png`}                 
      isSelected={selectedCard === title}                 
      onClick={() => handleQuickClick(title)}               
    />             
  ))}           
</div>
        </div>
      </div>

      {/* Course Tasks Section */}
      <div className="w-full mt-4 sm:mt-7 px-0">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Course Tasks</h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading program data...</p>
            </div>
          ) : currentProgram ? (
            <>
              <div className="flex flex-col sm:flex-row items-center sm:space-x-4 md:space-x-6 text-center sm:text-left">
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center space-x-2 sm:space-x-4 justify-center sm:justify-start">
                    <button
                      disabled={currentIndex === 0}
                      onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                      className="text-2xl font-bold text-[#02968A] disabled:text-gray-400"
                      title="Previous Program"
                    >
                      <ChevronLeft size={24} strokeWidth={4} />

                    </button>
                    <p className="text-base sm:text-lg font-semibold">{currentProgram.planName}</p>
                    <button
                      disabled={currentIndex === programs.length - 1}
                      onClick={() => setCurrentIndex(prev => Math.min(prev + 1, programs.length - 1))}
                      className="text-2xl font-bold text-[#02968A] disabled:text-gray-400"
                      title="Next Program"
                    >
                      <ChevronRight size={24} strokeWidth={4} />

                    </button>
                  </div>

                  <p className="text-sm text-gray-600">
                    {currentProgram.daysCompleted}/{currentProgram.totalDays} Days
                  </p>
                </div>
                <div className="relative mb-4 sm:mb-0">
                  <svg viewBox="0 0 36 36" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto sm:mx-0">
                    <path
                      className="text-gray-300"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="3"
                      d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831 15.9155 15.9155 0 1 0 0-31.831"
                    />
                    <path
                      className="text-[#02968A]"
                      stroke="currentColor"
                      fill="none"
                      strokeDasharray={`${(currentProgram.tasksCompleted / currentProgram.totalTasks) * 100}, 100`}
                      strokeWidth="3"
                      d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831 15.9155 15.9155 0 1 0 0-31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-base sm:text-lg md:text-xl font-semibold">
                    {currentProgram.tasksCompleted} / {currentProgram.totalTasks}
                  </div>
                </div>
                <p className="text-base sm:text-lg font-semibold text-gray-600">Completed</p>
              </div>

              {/* Scrollable Task List with Completion Indicator */}
              <div className="mt-4 sm:mt-6 h-64 sm:h-80 md:h-96 overflow-y-auto space-y-4">
                {currentProgram.todayTasks.length > 0 ? (
                  currentProgram.todayTasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-center justify-between p-3 border-b last:border-b-0 space-y-2 sm:space-y-0 sm:space-x-4"
                    >
                      <span className="w-full sm:w-1/3 text-lg text-center sm:text-left">
                        {task.taskName}
                      </span>
                      <span className="w-full sm:w-1/3 text-lg text-center">
                        {task.repetitions} repetitions
                      </span>
                      <span className="w-full sm:w-1/3 flex justify-end">
                        {loadingTaskIndex === index ? (
                          <button
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium flex items-center justify-center"
                            disabled
                          >
                            <Spinner />
                          </button>
                        ) : task.completed ? (
                          <button
                            className="bg-green-100 text-green-800 px-4 py-2 rounded-md font-medium hover:bg-green-200 transition"
                            onClick={() => handleMarkTask(index)}
                          >
                            Unmark
                          </button>
                        ) : (
                          <button
                            className="bg-[#02968A] text-white px-4 py-2 rounded-md font-medium hover:bg-[#017D72] transition"
                            onClick={() => handleMarkTask(index)}
                          >
                            Mark Done
                          </button>
                        )}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-[14rem]">
                    <p>No tasks found for today.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-[14rem]">
              <p>No ongoing programs found. Please apply a program to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Spinner component for loading state
const Spinner: React.FC = () => {
  return (
    <div className="flex items-center space-x-1">
      <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Loading</span>
    </div>
  );
};

// QuickAccessCard component for Notes, History, Files sections
interface QuickAccessCardProps {
  title: string;
  imgSrc: string;
  isSelected: boolean;
  onClick: () => void;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ title, imgSrc, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-b from-[#02968A] to-white rounded-xl shadow-md p-3 flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${isSelected ? "border-4 border-[#02968A]" : ""
        }`}
    >
      <img src={imgSrc} alt={title} className="h-[8rem] sm:h-[10rem] md:h-[13rem] w-full rounded-lg object-contain" />
    </div>
  );
};

export default HomePage;