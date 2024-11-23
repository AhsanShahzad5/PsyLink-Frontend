import React from 'react';

interface ActiveTabProps {
  tabs: string[];
  activeTab: string;
  onTabClick: (tab: string) => void;
}

const ActiveTab: React.FC<ActiveTabProps> = ({ tabs, activeTab, onTabClick }) => {
  return (
    <nav className="flex justify-between items-center w-full p-2 sm:p-4 bg-white shadow-md fixed top-0 left-0 right-0 z-10 mt-24">
      {/* Tabs visible on small screens only */}
      <div className="flex-1 flex sm:hidden overflow-x-auto space-x-2 justify-center px-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-1 px-2 min-w-[80px] font-medium text-xs sm:text-sm whitespace-nowrap ${
              activeTab === tab ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'
            }`}
            onClick={() => onTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tabs visible on larger screens only */}
      <div className="hidden sm:flex justify-between flex-1 px-20 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 font-medium text-base sm:text-lg ${
              activeTab === tab ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'
            }`}
            onClick={() => onTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default ActiveTab;
