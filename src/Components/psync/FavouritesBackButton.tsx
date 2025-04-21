import { useNavigate } from "react-router-dom";

interface FavouritesHeaderProps {
  text?: string; // Optional className prop for styling
}

export default function FavouritesBackButton({ text = "" }: FavouritesHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className={`flex items-center mt-4  p-2 rounded-xl bg-white w-fit`}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#02968A] transition-transform transform hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 mr-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Heart Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7 text-[#02968A] mx-2"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>

      {/* Title */}
      <h1 className="text-[#02968A] text-2xl font-semibold">{text}</h1>
    </div>
  );
}
