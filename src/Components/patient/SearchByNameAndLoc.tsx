import { MapPin, Search } from "lucide-react";
import React from "react";

export default function SearchByNameAndLoc() {
  return (
    
    <div className="flex flex-col  md:flex-row mb-6 gap-0.5 px-4 md:px-32">
      {/* Search by Name Input */}
      <div className="flex-1 relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search By Name"
          className="w-full pl-10 pr-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Location Input */}
      <div className="flex-1 relative">
        <MapPin
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Location"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Search Button */}
      <button className="bg-teal-600 text-white px-4 py-2 hover:bg-teal-700 transition-colors md:ml-2">
        Search
      </button>
    </div>
  );
}
