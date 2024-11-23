import React, { useState } from "react";
import Navbar from "@/Components/Navbar";

const AIChatbotPage: React.FC = () => {
  // State to track the active saved search or "New Chat"
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isNewChatActive, setIsNewChatActive] = useState<boolean>(false);

  const handleNewChatClick = () => {
    setIsNewChatActive(true);
    setActiveIndex(null); // Deactivate saved searches
  };

  const handleSavedSearchClick = (index: number) => {
    setActiveIndex(index);
    setIsNewChatActive(false); // Deactivate "New Chat"
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between items-center w-full p-4 mt-4 mb-4 bg-white shadow-md fixed top-16 left-0 right-0 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 h-[calc(100vh-80px)] pb-4">
          {/* Left Section (1/3): Saved Searches */}
          <div className="bg-[#fff] border-r border-gray-300 h-full flex flex-col">
            {/* Upper Div: Heading */}
            <div className="flex justify-between items-center px-6 py-4">
              <h2 className="font-semibold text-3xl">Chats</h2>
              <button
                onClick={handleNewChatClick}
                className={`flex items-center px-4 py-2 rounded-lg shadow-md transition ${
                  isNewChatActive
                    ? "focus:ring-2 focus:ring-offset-2 focus:ring-[#047D72]  flex items-center px-4 py-2 bg-[#047D72] text-white font-medium rounded-lg shadow-md hover:bg-[#064034] "
                    : " "
                }`}
              >
                New Chat
              </button>
            </div>
            

            {/* Lower Div: Saved Searches */}
            <div className="flex flex-col overflow-y-auto px-4 py-4 space-y-4">
              {[1, 2, 3, 4].map((chat, index) => (
                <div
                  key={index}
                  onClick={() => handleSavedSearchClick(index)}
                  className={`p-4 rounded-2xl border cursor-pointer hover:shadow ${
                    activeIndex === index
                      ? "bg-[#047D72] text-white"
                      : "bg-white text-black"
                  }`}
                >
                  Hello my Name is Jhon do...
                </div>
              ))}
            </div>
          </div>

          {/* Right Section (2/3): Chatbot Info and Input */}
          <div className="col-span-3 flex flex-col">
            {/* Top Div: Image and Description */}
            <div className="flex-grow flex flex-col items-center justify-center">
              <img
                src="/src/assets/patient/landingPage/Allen.png"
                alt="Chatbot"
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
              <p className="text-center px-6 text-gray-700">
                Meet <strong>Allen</strong>, PsyLink’s AI chatbot, here to help
                you release stress in a safe space. Use Allen to express your
                frustrations and receive calming, supportive responses, guiding
                you through tough moments with empathy. Whenever you need to vent
                or seek comfort, Allen is just a chat away.
              </p>
            </div>

            {/* Bottom Div: Search Input Area */}
            <div className="border-t border-gray-300 flex items-center px-4 py-2">
              <input
                type="text"
                placeholder="Write here"
                className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#047D72]"
              />
              <button className="ml-4 p-3 bg-[#047D72] text-white rounded-full hover:bg-[#064034]">
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatbotPage;
