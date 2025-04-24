import { useState } from "react";
import { User } from "lucide-react";
import PostModal from "./PsyncPostCreationModal";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchBar } from "./SearchBar";

const PsyncTopBar = ({ setRefresh }: any) => {
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
  const handleMySeriesPage = () => {
    navigate(`/${role}/psync/myseries`);
  };

  return (
    <div className="bg-white rounded-lg md:rounded-xl lg:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 flex flex-col items-center w-full">
      {/* Header with Logo */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8 w-full justify-center">
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-teal-600 rounded-full flex items-center justify-center">
          {/* Globe icon */}
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white"
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
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-center">
          <span className="hidden sm:inline">PsyLink Community - </span>Psync
        </h1>
      </div>

      {/* Search Bar */}
      <div className="w-full mb-4 sm:mb-6">
        <SearchBar />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 w-full">
        
        {/* add post button */}
        
        <button
          onClick={role === 'admin' ? undefined : () => setIsPostModalOpen(true)}
          className={`flex items-center gap-1 sm:gap-2 ${role === 'admin'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-700'
            } text-white px-3 sm:px-4 md:px-6 lg:px-8 py-2 md:py-3 rounded-full text-xs sm:text-sm md:text-base transition-colors`}
          disabled={role === 'admin'}
        >
          {/* Plus icon */}
          <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z" />
          </svg>
          <span>{role === 'admin' ? 'View Only' : 'Add Post'}</span>
        </button>

{/* my series button */}
        <button
          className={`flex items-center gap-1 sm:gap-2 ${role === 'admin'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-teal-600 hover:bg-teal-700'
            } text-white px-3 sm:px-4 md:px-6 lg:px-8 py-2 md:py-3 rounded-full text-xs sm:text-sm md:text-base transition-colors`}
          onClick={role === 'admin' ? undefined : handleMySeriesPage}
          disabled={role === 'admin'}
        >
          {/* Star-like icon for Post in Series */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
            <path d="M12.86 2.86l1.33 3.13l3.11 1.46c1.59.75 2.13 2.89.96 4.28l-2.13 2.53l.53 3.27c.28 1.73-1.46 3.14-3.07 2.49l-2.98-1.2l-2.98 1.2c-1.61.65-3.35-.76-3.07-2.49l.53-3.27l-2.13-2.53c-1.16-1.39-.63-3.53.96-4.28l3.11-1.46l1.33-3.13C8.86 1.29 10.74 1.29 12.86 2.86z" />
          </svg>
          <span>{role === 'admin' ? 'View Only' : 'My Series'}</span>
        </button>

        {/* FAVOURITES BUTTON */}
        <button
          className={`flex items-center gap-1 sm:gap-2 ${role === 'admin'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-teal-600 hover:bg-teal-700'
            } text-white px-3 sm:px-4 md:px-6 lg:px-8 py-2 md:py-3 rounded-full text-xs sm:text-sm md:text-base transition-colors`}
          onClick={role === 'admin' ? undefined : handleFavourites}
          disabled={role === 'admin'}
        >
          {/* Heart icon */}
          <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>{role === 'admin' ? 'View Only' : 'Favourites'}</span>
        </button>

        <button
          className={`flex items-center gap-1 sm:gap-2 ${role === 'admin'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-teal-600 hover:bg-teal-700'
            } text-white px-3 sm:px-4 md:px-6 lg:px-8 py-2 md:py-3 rounded-full text-xs sm:text-sm md:text-base transition-colors`}
          onClick={role === 'admin' ? undefined : handleMyPostsPage}
          disabled={role === 'admin'}
        >
          {/* User icon */}
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{role === 'admin' ? 'View Only' : 'My Posts'}</span>
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