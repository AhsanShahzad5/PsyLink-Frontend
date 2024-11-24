import React from "react";
import { useNavigate } from "react-router-dom";

const BreathingExercisePage: React.FC = () => {
  const tasks = [
    {
      task: "Deep Belly Breathing",
      description:
        "Focus on breathing deeply from the diaphragm to relax your body and mind.",
      repetitions: "5-10 breaths",
    },
    {
      task: "Box Breathing",
      description:
        "A rhythmic technique involving inhaling, holding, exhaling, and holding again in equal measures.",
      repetitions: "4-5 cycles",
    },
    {
      task: "4-7-8 Breathing",
      description: "Inhale for 4 seconds, hold for 7, and exhale for 8 seconds.",
      repetitions: "4-6 cycles",
    },
    {
      task: "Alternate Nostril Breathing",
      description: "Breathing alternately through each nostril.",
      repetitions: "5-10 cycles",
    },
    {
      task: "Paced Breathing",
      description:
        "Control the pace of your breathing to maintain a steady, slow rhythm.",
      repetitions: "5-10 minutes",
    },
    {
      task: "4-7-8 Breathing",
      description: "Inhale for 4 seconds, hold for 7, and exhale for 8 seconds.",
      repetitions: "4-6 cycles",
    },
    {
      task: "Alternate Nostril Breathing",
      description: "Breathing alternately through each nostril.",
      repetitions: "5-10 cycles",
    },
    {
      task: "Paced Breathing",
      description:
        "Control the pace of your breathing to maintain a steady, slow rhythm.",
      repetitions: "5-10 minutes",
    },
    {
      task: "Alternate Nostril Breathing",
      description: "Breathing alternately through each nostril.",
      repetitions: "5-10 cycles",
    },
    {
      task: "Paced Breathing",
      description:
        "Control the pace of your breathing to maintain a steady, slow rhythm..",
      repetitions: "5-10 minutes",
    },
  ];


  const navigate = useNavigate();


  return (
    
      
      <div className="flex justify-center items-center min-h-screen bg-transparent p-6 mt-16">
        <div className="w-full bg-white shadow-lg rounded-xl p-8">
         {/* Header Section */}
<div className="flex flex-wrap lg:flex-row justify-between items-center mb-6">
<button
  className="text-[#02968A] text-lg font-bold sm:mb-4 lg:mb-0 flex items-center space-x-2 "
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
  <span>Breathing Exercise</span>
</button>

  
  <button
    className="px-10 py-2 text-white font-outfit font-normal text-lg sm:text-base rounded-full flex items-center justify-center"
    style={{
      background: "linear-gradient(360deg, #064034 20%, #047D72 100%)",
    }}
  >
    Apply
  </button>
</div>


          {/* Description Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2 text-left p-4">Description</h2>
            <p className="text-gray-600 leading-relaxed text-left p-4">
              Our Breathing Exercises Program is designed to guide you through
              effective techniques that promote relaxation, reduce anxiety, and
              enhance mental clarity. By dedicating just a few minutes each
              day, you can experience a deeper sense of calm and control over
              your stress levels.
            </p>
          </div>

          {/* Image Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#fff] rounded-lg p-4">
              <img
                src="/src/assets/patient/Exercise/breathing1.png"
                alt="Deep Breathing"
                className="w-full h-48 object-fit rounded-lg"
              />
            </div>
            <div className="bg-[#fff] rounded-lg p-4">
              <img
                src="/src/assets/patient/Exercise/breathing2.png"
                alt="Meditation Pose"
                className="w-full h-48 object-fit rounded-lg"
              />
            </div>
            <div className="bg-[#fff] rounded-lg p-4">
              <img
                src="/src/assets/patient/Exercise/breathing3.png"
                alt="Calm Breathing"
                className="w-full h-48 object-fit rounded-lg"
              />
            </div>
          </div>

         {/* Table Section */}
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
                {tasks.map((task, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-[#E8F5FF]" : "bg-[#FFF5E8]"
                    }`}
                  >
                    <td className="p-4 font-medium text-left">{task.task}</td>
                    <td className="p-4 text-gray-600 text-left">{task.description}</td>
                    <td className="p-4 text-gray-800 text-left">{task.repetitions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


        </div>
      </div>
    
  );
};

export default BreathingExercisePage;
