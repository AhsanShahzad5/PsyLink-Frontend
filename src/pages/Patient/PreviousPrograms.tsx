import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Course {
  id: number;
  courseName: string;
  status: string;
  tasksDone: string;
}

interface PreviousProgramsProps {
  courses: Course[];
}

export default function PreviousPrograms({ courses }: PreviousProgramsProps) {
  return (
    <div className="px-4 sm:px-8 md:px-16 py-4 md:py-8">
      {/* Table Header */}
      <div className="hidden sm:flex items-center justify-between font-semibold text-[#B1B1B1] pb-2 mb-2">
        <div className="flex-1 text-left">Course Name</div>
        <div className="flex-1 text-center">Status</div>
        <div className="flex-1 text-center">Tasks Done</div>
        <div className="flex justify-end px-4 md:px-14"></div>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col sm:flex-row items-start sm:items-center rounded-xl bg-white p-4 shadow-md border border-gray-200 space-y-4 sm:space-y-0 sm:space-x-4"
          >
            {/* Course Name */}
            <div className="flex-1 text-left font-semibold text-gray-800 w-full sm:w-auto">
              {course.courseName}
            </div>

            {/* Status */}
            <div className="flex-1 text-left sm:text-center text-gray-600 w-full sm:w-auto">
              {course.status}
            </div>

            {/* Tasks Done */}
            <div className="flex-1 text-left sm:text-center text-teal-600 font-semibold w-full sm:w-auto">
              {course.tasksDone}
            </div>

            {/* View Button */}
            <div className="flex justify-start sm:justify-end w-full sm:w-auto">
              <button className="bg-teal-600 text-white px-4 py-2 hover:bg-teal-700 transition-colors flex items-center rounded-md">
                View
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
