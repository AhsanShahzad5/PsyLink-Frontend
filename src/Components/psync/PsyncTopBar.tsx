import React, { useState} from "react";
import { Search, User } from "lucide-react";
import PostModal from "./PsyncPostCreationModal";
import { useLocation, useNavigate } from "react-router-dom";

const PsyncTopBar = ({setRefresh}:any) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  // Extract the first part of the pathname (i.e., "doctor" or "patient")
  const role = location.pathname.split("/")[1];
  // console.log(role);
  const handleFavourites = () => {
    navigate(`/${role}/psync/favouriteposts`);
  };

  const handleMyPostsPage = () => {
    navigate(`/${role}/psync/myposts`);
  };


  return (
    <div className="bg-white rounded-[2rem] shadow-sm p-8 flex flex-col items-center">
      {/* Header with Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
          {/* Globe icon */}
          <svg
            className="w-7 h-7 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M2 12h20" strokeWidth="2" />
            <path
              d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
              strokeWidth="2"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold">PsyLink Community - Psync</h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for Series"
          className="w-[50rem] py-4 pl-12 pr-4 rounded-full bg-[#e8f4f4] text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-700 transition-colors"
        >
          {/* Plus icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z" />
          </svg>
          Add a Post
        </button>

        <button className="flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-700 transition-colors">
          {/* Star-like icon for Post in Series */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12.86 2.86l1.33 3.13l3.11 1.46c1.59.75 2.13 2.89.96 4.28l-2.13 2.53l.53 3.27c.28 1.73-1.46 3.14-3.07 2.49l-2.98-1.2l-2.98 1.2c-1.61.65-3.35-.76-3.07-2.49l.53-3.27l-2.13-2.53c-1.16-1.39-.63-3.53.96-4.28l3.11-1.46l1.33-3.13C8.86 1.29 10.74 1.29 12.86 2.86z" />
          </svg>
          {/* Post in Series */}
          My Series
        </button>


          {/* FAVOURITES BUTTON */}
        <button className="flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-700 transition-colors"
        onClick={handleFavourites}
        >
          {/* Heart icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          Favourites
        </button>
        <button className="flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-700 transition-colors" 
        
        onClick={handleMyPostsPage}
        >
          {/* Heart icon */}
          <User className="w-5 h-5" />
          My Posts
        </button>
      </div>

      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default PsyncTopBar;
