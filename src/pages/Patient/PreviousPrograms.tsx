import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Updated interface to include dailyProgress
interface Task {
  taskName: string;
  repetitions: number;
  completed: boolean;
}

interface DailyProgress {
  date: string;
  tasks: Task[];
}

interface Program {
  programId: string;
  planName: string;
  startDate: string;
  endDate: string;
  statistics: {
    totalDays: number;
    totalTasks: number;
    completedTasks: number;
    completionPercentage: number;
  };
  dailyProgress: DailyProgress[];
}

export default function PreviousPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPreviousPrograms = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/patient/programs/previous', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setPrograms(data.programs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch programs');
        console.error('Error fetching previous programs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousPrograms();
  }, []);

  // Navigate to the details page with program data
  const handleProgramClick = (program: Program) => {
    navigate(`/patient/previous-program-details/${program.programId}`, { 
      state: { program } 
    });
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  // Empty state message
  const EmptyState = () => (
    <div className="text-center py-10">
      <p className="text-gray-600 text-lg">No previous programs found.</p>
      <p className="text-gray-500 mt-2">Completed programs will appear here once you finish them.</p>
    </div>
  );

  // Error message component
  const ErrorMessage = () => (
    <div className="text-center py-10">
      <p className="text-red-600 text-lg">Failed to load programs.</p>
      <p className="text-gray-500 mt-2">{error}</p>
    </div>
  );

  return (
    <div className="px-4 sm:px-8 md:px-16 py-4 md:py-8">
      {/* Table Header */}
      <div className="hidden sm:flex items-center justify-between font-semibold text-[#B1B1B1] pb-2 mb-2">
        <div className="flex-1 text-left">Program Name</div>
        <div className="flex-1 text-center">Completion Status</div>
        <div className="flex-1 text-center">Tasks Done</div>
        <div className="flex justify-end px-4 md:px-14"></div>
      </div>

      {/* White background container */}
      <div className="rounded-xl bg-white p-4 shadow-md border border-gray-200 min-h-[300px]">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage />
        ) : programs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {programs.map((program) => (
              <div
                key={program.programId}
                className="flex flex-col sm:flex-row items-start sm:items-center rounded-xl bg-gray-50 p-4 shadow-sm border border-gray-100 space-y-4 sm:space-y-0 sm:space-x-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleProgramClick(program)}
              >
                {/* Program Name */}
                <div className="flex-1 text-left font-semibold text-gray-800 w-full sm:w-auto">
                  {program.planName}
                </div>

                {/* Status */}
                <div className="flex-1 text-left sm:text-center text-gray-600 w-full sm:w-auto">
                  {program.statistics.completionPercentage}% Complete
                </div>

                {/* Tasks Done */}
                <div className="flex-1 text-left sm:text-center text-teal-600 font-semibold w-full sm:w-auto">
                  {program.statistics.completedTasks} / {program.statistics.totalTasks}
                </div>

                {/* View Button */}
                <div className="flex justify-start sm:justify-end w-full sm:w-auto">
                  <button 
                    className="bg-teal-600 text-white px-4 py-2 hover:bg-teal-700 transition-colors flex items-center rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProgramClick(program);
                    }}
                  >
                    View
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}