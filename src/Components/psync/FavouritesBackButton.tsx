import { useNavigate } from "react-router-dom";

interface FavouritesHeaderProps {
  text?: string; // Optional text prop for the header
}

export default function FavouritesBackButton({ text = "" }: FavouritesHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center mt-2 sm:mt-3 md:mt-4 p-1 sm:p-2 rounded-lg sm:rounded-xl bg-white w-fit">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#02968A] transition-transform transform hover:scale-110"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-1 sm:mr-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Heart Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#02968A] mx-1 sm:mx-2"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      {/* Title */}
      <h1 className="text-[#02968A] text-lg sm:text-xl md:text-2xl font-semibold">
        {text}
      </h1>
    </div>
  );
}