import Navbar from "@/Components/Navbar";
import React, { useState } from "react";

interface ProgramDetail {
  title: string;
  startDate: string;
  endDate: string;
  courseType: string;
  courseStatus: string;
  completedTasks: number;
  totalTasks: number;
  exercises: { id: number; name: string; reps: string }[];
}

const ProgramDetails: React.FC = () => {
  // Dummy data
  const [programData, setProgramData] = useState<ProgramDetail>({
    title: "Breathing Exercise",
    startDate: "7th April, 2024",
    endDate: "15th April, 2024",
    courseType: "Breathing",
    courseStatus: "Ongoing",
    completedTasks: 7,
    totalTasks: 10,
    exercises: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: "Deep Breathing",
      reps: `${20 + i}/20`,
    })),
  });

  return (
    <>    
    <Navbar />
    <div className="w-full max-w-[1200px] bg-[#fff] rounded-[20px] shadow-lg  mx-auto mt-20">
      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between p-6 space-y-6 lg:space-y-0">
        {/* Left Section */}
        <div className="flex-1 lg:w-1/2 text-center lg:text-left p-6">
          <h1 className="text-[24px] lg:text-[30px] font-medium leading-[40px] mb-4">
            {programData.title}
          </h1>
          {/* Course Details */}
          <div className="space-y-4">
            <p className="text-[18px] lg:text-[24px] font-medium">
              Starting Date: {programData.startDate}
            </p>
            <p className="text-[18px] lg:text-[24px] font-medium">
              Ending Date: {programData.endDate}
            </p>
            <p className="text-[18px] lg:text-[24px] font-medium">
              Course Type: {programData.courseType}
            </p>
            <p className="text-[18px] lg:text-[24px] font-medium">
              Course Status: {programData.courseStatus}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 lg:w-1/2 text-right p-4  ">
          <p className="text-[24px] lg:text-[40px] font-medium pr-10">You did</p>
          <p className="text-[60px] lg:text-[100px] font-medium text-primary">
            {programData.completedTasks}/{programData.totalTasks}
          </p>
          <p className="text-[24px] lg:text-[40px] font-medium pr-14">Tasks</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-8 w-full border border-gray-200 rounded-t-[16px] overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-3 text-center bg-gray-100 text-[16px] lg:text-[24px] font-medium p-3">
          <div>No</div>
          <div>Exercise</div>
          <div>Reps</div>
        </div>

        {/* Scrollable Table Body */}
        <div className="h-[200px] lg:h-[350px] overflow-y-auto">
          {programData.exercises.map((exercise) => (
            <div
              key={exercise.id}
              className={`grid grid-cols-3 text-center text-[16px] lg:text-[24px] font-medium p-3 ${
                exercise.id % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div>{exercise.id < 10 ? `0${exercise.id}` : exercise.id}.</div>
              <div>{exercise.name}</div>
              <div>{exercise.reps}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    </>

  );
};

export default ProgramDetails;
