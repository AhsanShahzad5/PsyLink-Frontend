import { MapPin, Search } from "lucide-react";
import React from "react";

interface SearchByNameAndLocProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}

export default function SearchByNameAndLoc({ 
  searchTerm, 
  setSearchTerm, 
  handleSearch 
}: SearchByNameAndLocProps) {
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col md:flex-row mb-6 gap-0.5 px-4 md:px-32">
      {/* Search by Name Input */}
      <div className="flex-1 relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search By Name"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Search Button */}
      <button 
        className="bg-teal-600 text-white px-4 py-2 hover:bg-teal-700 transition-colors md:ml-2"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}