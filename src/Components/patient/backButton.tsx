import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  className?: string; // Optional className prop
}

export default function BackButton({ className = "" }: BackButtonProps) {
  const navigate = useNavigate();
  
  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-xl font-medium text-[#02968A] transition-transform transform hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back
      </button>
    </div>
  );
}
