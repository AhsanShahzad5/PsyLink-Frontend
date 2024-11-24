import React, { useState } from 'react';
import Navbar from '../../Components/Navbar';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {

  // Modified courseTasks array to include varying completion levels
  const courseTasks = [
    { id: 1, task: "Deep Breaths", progress: "20 / 20" },
    { id: 2, task: "Meditation", progress: "15 / 20" },
    { id: 3, task: "Journaling", progress: "10 / 20" },
    { id: 4, task: "Mindfulness Exercise", progress: "20 / 20" },
    { id: 5, task: "Positive Affirmations", progress: "18 / 20" },
    { id: 6, task: "Visualization", progress: "20 / 20" },
    { id: 7, task: "Gratitude Practice", progress: "17 / 20" },
    { id: 8, task: "Goal Setting", progress: "20 / 20" },
    { id: 9, task: "Stress Management", progress: "5 / 20" }, // Example of a task not completed
  ];

  const [selectedMood, setSelectedMood] = useState("");
  const [selectedCard, setSelectedCard] = useState("");

  const navigate = useNavigate();

  const handleQuickClick = (title:any) => {
    navigate(`/patient/${title}`);
    setSelectedCard(title)
  } 

  return (
    <div className="min-h-screen bg-[#D3EDEB] mt-4">
      {/* <Navbar/> */}

      {/* Main Content */}
      <div className="pt-20 flex flex-col lg:flex-row w-full gap-6">
        {/* Welcome Section */}
        <div className="bg-white p-6 rounded-xl shadow-md w-full h-[575px] lg:w-1/3 flex flex-col items-center space-y-10">
          <h2 className="text-3xl font-bold text-center">Welcome Home</h2>
          <h3 className="text-2xl font-semibold text-gray-700">JHON DOE</h3>
          <img src="/src/assets/patient/homepage/Sphere.png" alt="Welcome Image" className="w-full max-w-xs rounded-lg" />
        </div>

        {/* Right Section: How Are You Feeling Today? and Quick Access */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* How Are You Feeling Today? Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
  <h2 className="text-2xl font-semibold mb-4 text-center lg:text-left">How Are You Feeling Today?</h2>
  <div className="flex flex-wrap justify-center gap-4 lg:justify-around">
    {["Depressed", "Sad", "Neutral", "Happy", "Joyful"].map((mood) => (
      <div
        key={mood}
        className={`flex flex-col items-center cursor-pointer p-2 transition-all duration-300 ${
          selectedMood === mood ? "border-2 border-[#02968A] rounded-xl" : "hover:border-2 hover:border-gray-300 rounded-lg"
        }`}
        onClick={() => {
          setSelectedMood(mood);
          console.log(`Selected Mood: ${mood}`);
        }}
        style={{ minWidth: '120px', maxWidth: '160px' }} // Ensures that the items do not shrink too much or grow too large
      >
        <div className="bg-[#fff] h-16 w-16 mt-4 rounded-full flex items-center justify-center text-white text-3xl">
          <img src={`/src/assets/patient/homepage/${mood}.png`} alt={mood} />
        </div>
        <span className="mt-2 text-lg font-medium">{mood}</span>
      </div>
    ))}
  </div>
</div>


          {/* Quick Access Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="w-full mt-10">
        <div className="bg-white p-6 rounded-xl shadow-md w-full">
          <h2 className="text-2xl font-semibold mb-4">Course Tasks</h2>
          <div className="flex flex-col md:flex-row items-center md:space-x-6">
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-semibold">Plan - B</p>
              <p className="text-sm text-gray-600">5/14 Days</p>
            </div>
            <div className="relative mb-4 md:mb-0">
              <svg viewBox="0 0 36 36" className="w-24 h-24">
                <path
                  className="text-gray-300"
                  fill="none"
                  strokeWidth="3"
                  d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831 15.9155 15.9155 0 1 0 0-31.831"
                />
                <path
                  className="text-[#02968A]"
                  fill="none"
                  strokeDasharray="70, 100"
                  strokeWidth="3"
                  d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831 15.9155 15.9155 0 1 0 0-31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold">
                7 / 10
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-600">Completed</p>
          </div>

          {/* Scrollable Task List with Completion Indicator */}
          <div className="mt-6 h-96 overflow-y-auto space-y-4">
            {courseTasks.map((task) => {
              const isCompleted = task.progress === "20 / 20";
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border-b last:border-b-0 space-x-4"
                >
                  <span className="w-1/3 text-lg">{task.task}</span>
                  <span className="w-1/3 text-lg text-center">{task.progress}</span>
                  <span className="w-1/3 text-lg text-right">
                    {isCompleted ? (
                      <span className="text-green-600">✔</span>
                    ) : (
                      <span className="text-red-600">❌</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
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
      className={`bg-gradient-to-b from-[#02968A] to-white rounded-xl shadow-md p-4 flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isSelected ? "border-4 border-[#02968A]" : ""
      }`}
    >
      <img src={imgSrc} alt={title} className="h-72 w-full rounded-lg object-contain" />
    </div>
  );
};

export default HomePage;
