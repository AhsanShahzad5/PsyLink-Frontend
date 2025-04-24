import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mirror your Program & Task interfaces
interface Task {
  taskName: string;
  taskDescription: string;
  repetitions: number;
  _id: string;
}

interface Program {
  _id: string;
  planName: string;
  planDescription: string;
  duration: "15 days" | "30 days";
  tasks: Task[];
  createdAt: string;
  bgColor?: string;
}

interface ProgressTask {
  taskName: string;
  repetitions: number;
  completed: boolean;
}

interface DailyProgress {
  date: Date;
  tasks: ProgressTask[];
}

// Interface for ongoing program based on debug output
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

const ExerciseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Try to pull the program off of location.state
  const program = (location.state as Program) || null;

  // Fetch ongoing programs to check if this program is already enrolled
  useEffect(() => {
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
        console.log("Ongoing programs:", data);
        
        // Check if the current program is already enrolled
        if (data && data.programs && Array.isArray(data.programs) && program) {
          const isEnrolled = data.programs.some(
            (ongoingProgram: OngoingProgram) => ongoingProgram.planName === program.planName
          );
          
          setIsAlreadyEnrolled(isEnrolled);
          console.log("Is program already enrolled:", isEnrolled);
        }
      } catch (error) {
        console.error("Error fetching ongoing programs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (program) {
      fetchOngoingPrograms();
    }
  }, [program]);

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-lg text-red-500">No program data found.</p>
      </div>
    );
  }

  const handleApply = async () => {
    // If already enrolled, show message and return
    if (isAlreadyEnrolled) {
      toast.info("You are already enrolled in this program", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    // 1. compute start & end dates
    const startDate = new Date();
    const days = parseInt(program.duration); // 15 or 30
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + days);

    // 2. build dailyProgress array
    const dailyProgress: DailyProgress[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dailyProgress.push({
        date: date,
        tasks: program.tasks.map((t) => ({
          taskName: t.taskName,
          repetitions: t.repetitions,
          completed: false,
        })),
      });
    }

    // 3. POST to your backend
    try {
      const res = await fetch("/api/patient/programs/applyProgram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programId: program._id,
          planName: program.planName,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          dailyProgress,
        }),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      
      // Show success toast
      toast.success(`Successfully applied program: ${program.planName}`, {
        position: "bottom-right",
        autoClose: 3000,
      });
      
      // Update enrolled status
      setIsAlreadyEnrolled(true);
      
      // Optional: navigate after success
      // navigate("/patient/dashboard");
      
    } catch (err: any) {
      console.error("Failed to apply program:", err);
      
      // Show error toast
      toast.error(err.message || "Could not apply program. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-lg text-[#02968A]">Loading program details...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent p-6 mt-16">
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
      
      <div className="w-full bg-white shadow-lg rounded-xl p-8">
        {/* Header Section */}
        <div className="flex flex-wrap lg:flex-row justify-between items-center mb-6">
          <button
            className="text-[#02968A] text-lg font-bold sm:mb-4 lg:mb-0 flex items-center space-x-2"
            onClick={() => navigate(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            <span>{program.planName}</span>
          </button>

          <button
            className={`px-10 py-2 text-white font-outfit font-normal text-lg sm:text-base rounded-full flex items-center justify-center ${
              isAlreadyEnrolled ? 'opacity-50 cursor-not-allowed bg-gray-500' : ''
            }`}
            onClick={handleApply}
            disabled={isAlreadyEnrolled}
            style={{
              background: isAlreadyEnrolled 
                ? "linear-gradient(360deg, #888888 20%, #AAAAAA 100%)" 
                : "linear-gradient(360deg, #064034 20%, #047D72 100%)",
            }}
          >
            {isAlreadyEnrolled ? "Already Enrolled" : "Apply"}
          </button>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-left p-4">Description</h2>
          <p className="text-gray-600 leading-relaxed text-left p-4">
            {program.planDescription}
          </p>
          <p className="text-sm text-gray-500 px-4">
            Duration: <strong>{program.duration}</strong>
          </p>
        </div>

        {/* (Optional) you could swap these images based on program._id or theme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#fff] rounded-lg p-4">
            <img
              src="/src/assets/patient/Exercise/breathing1.png"
              alt="Exercise 1"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
          <div className="bg-[#fff] rounded-lg p-4">
            <img
              src="/src/assets/patient/Exercise/breathing2.png"
              alt="Exercise 2"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
          <div className="bg-[#fff] rounded-lg p-4">
            <img
              src="/src/assets/patient/Exercise/breathing3.png"
              alt="Exercise 3"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Tasks Table */}
        <div className="overflow-y-auto max-h-96 border border-gray-200 rounded-xl custom-scrollbar">
          <table className="w-full table-auto border-collapse border border-gray-200 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-[#02968A] text-white">
                <th className="p-4 text-left w-1/5">Task</th>
                <th className="p-4 text-left w-3/5">Description</th>
                <th className="p-4 text-left w-1/5">Repetitions</th>
              </tr>
            </thead>
            <tbody>
              {program.tasks.map((t) => (
                <tr
                  key={t._id}
                  className={`${
                    program.tasks.indexOf(t) % 2 === 0
                      ? "bg-[#E8F5FF]"
                      : "bg-[#FFF5E8]"
                  }`}
                >
                  <td className="p-4 font-medium text-left">{t.taskName}</td>
                  <td className="p-4 text-gray-600 text-left">
                    {t.taskDescription}
                  </td>
                  <td className="p-4 text-gray-800 text-left">
                    {t.repetitions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailPage;