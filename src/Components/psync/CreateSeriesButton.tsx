import { useState } from "react";
import PostModal from "./PsyncPostCreationModal";
import { useLocation } from "react-router-dom";

const CreateSeriesButton = ({ setRefresh }: any) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const location = useLocation();

  // Extract the first part of the pathname (i.e., "doctor" or "patient")
  const role = location.pathname.split("/")[1];

  return (
    <div className="mt-5 flex justify-start w-full">
      {/* Post Creation Button */}
      <button
        onClick={role === 'admin' ? undefined : () => setIsPostModalOpen(true)}
        className={`flex items-center gap-1 sm:gap-2 ${
          role === 'admin'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-teal-600 hover:bg-teal-700'
        } text-white px-3 sm:px-4 md:px-6 lg:px-8 py-2 md:py-3 rounded-full text-xs sm:text-sm md:text-base transition-colors`}
        disabled={role === 'admin'}
      >
        {/* Plus icon */}
        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z" />
        </svg>
        <span>{role === 'admin' ? 'View Only' : 'Create new series'}</span>
      </button>

      {/* Post Creation Modal */}
      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        setRefresh={setRefresh}
        Series="series"
        autoCreateSeries={true}
      />
    </div>
  );
};

export default CreateSeriesButton;