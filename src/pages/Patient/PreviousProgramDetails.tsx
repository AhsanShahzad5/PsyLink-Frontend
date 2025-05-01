import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, CheckCircle, Circle } from 'lucide-react';

// Interfaces
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

interface LocationState {
  program: Program;
}

export default function PreviousProgramDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { program } = (location.state as LocationState) || { program: null };
  
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  // If no program data is available, show error and return button
  if (!program) {
    return (
      <div className="px-4 sm:px-8 md:px-16 py-4 md:py-8">
        <div className="rounded-xl bg-white p-8 shadow-md border border-gray-200 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Program data not found</h2>
          <p className="text-gray-600 mb-6">The program details you're looking for are not available.</p>
          <button
            onClick={() => navigate('/patient/programs/previous')}
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center mx-auto"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Handle day navigation
  const goToPreviousDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };

  const goToNextDay = () => {
    if (currentDayIndex < program.dailyProgress.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  // Get current day data
  const currentDay = program.dailyProgress[currentDayIndex] || { date: '', tasks: [] };
  
  // Calculate completion for current day
  const tasksCompleted = currentDay.tasks.filter(task => task.completed).length;
  const totalTasks = currentDay.tasks.length;
  const dayCompletionPercentage = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

  return (
    <div className="px-4 sm:px-8 md:px-16 py-4 md:py-8">
      {/* Header with back button */}
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate('/patient/programs/previous')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{program.planName}</h1>
      </div>

      {/* Single Card for Program Summary and Daily Progress */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        {/* Program Summary Section with Back Button */}
        <div className=" mb-4">
        <button
            onClick={() => navigate('/patient/history')}
            className="flex items-center mb-5 text-teal-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Programs
          </button>
          
          <h2 className="text-xl font-semibold text-gray-800">Program Summary</h2>
         
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border-r border-gray-100 pr-4">
            <p className="text-gray-500">Duration</p>
            <p className="font-semibold">
              {formatDate(program.startDate)} - {formatDate(program.endDate)}
            </p>
          </div>
          <div className="border-r border-gray-100 pr-4">
            <p className="text-gray-500">Completion</p>
            <p className="font-semibold text-teal-600">
              {program.statistics.completionPercentage}% Complete
            </p>
          </div>
          <div>
            <p className="text-gray-500">Tasks</p>
            <p className="font-semibold">
              {program.statistics.completedTasks} / {program.statistics.totalTasks} Completed
            </p>
          </div>
        </div>
        
        {/* Divider Line */}
        <hr className="border-gray-200 my-6 mb-10" />
        
        {/* Daily Progress Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Daily Progress</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousDay}
              disabled={currentDayIndex === 0}
              className={`p-2 rounded-full ${currentDayIndex === 0 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
            >
              <ArrowLeft size={20} />
            </button>
            <span className="text-gray-700">
              Day {currentDayIndex + 1} of {program.dailyProgress.length}
            </span>
            <button
              onClick={goToNextDay}
              disabled={currentDayIndex === program.dailyProgress.length - 1}
              className={`p-2 rounded-full ${currentDayIndex === program.dailyProgress.length - 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Date and progress */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Calendar size={18} className="mr-2 text-gray-500" />
            <span className="text-gray-700 font-medium">
              {formatDate(currentDay.date)}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="bg-teal-600 h-2.5 rounded-full" 
                style={{ width: `${dayCompletionPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {dayCompletionPercentage}%
            </span>
          </div>
        </div>

        {/* Tasks list */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 mb-2">Tasks for the day:</h3>
          {currentDay.tasks.length === 0 ? (
            <p className="text-gray-500">No tasks recorded for this day.</p>
          ) : (
            currentDay.tasks.map((task, index) => (
              <div 
                key={index} 
                className="flex items-start p-4 rounded-lg border border-gray-100 bg-gray-50"
              >
                {task.completed ? (
                  <CheckCircle size={20} className="mr-3 text-teal-600 mt-0.5" />
                ) : (
                  <Circle size={20} className="mr-3 text-gray-400 mt-0.5" />
                )}
                <div>
                  <p className="font-medium text-gray-800">{task.taskName}</p>
                  <p className="text-gray-500 text-sm">
                    {task.repetitions} repetition{task.repetitions !== 1 ? 's' : ''}
                    {task.completed ? ' • Completed' : ' • Not completed'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}