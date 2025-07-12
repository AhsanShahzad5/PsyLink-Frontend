import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const MoodLogging = () => {
  const [selectedMood, setSelectedMood] = useState("");
  const [todayMoodLogged, setTodayMoodLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch today's mood when component mounts
    fetchTodayMood();
  }, []);

  const fetchTodayMood = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/patient/getTodayMood', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Important for sending cookies with the request
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setSelectedMood(data.data.mood);
        setTodayMoodLogged(true);
      }
    } catch (error) {
      console.error('Error fetching today\'s mood:', error);
      toast.error('Failed to fetch today\'s mood');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSelection = (mood) => {
    // Just update the selected mood without submitting
    if (!todayMoodLogged) {
      setSelectedMood(mood);
    } else {
      toast.error('You have already logged your mood for today. You can log again tomorrow.');
    }
  };

  const handleSaveMood = async () => {
    // Check if a mood is selected
    if (!selectedMood) {
      toast.error('Please select a mood before saving');
      return;
    }

    // If mood already logged today, don't allow changes
    if (todayMoodLogged) {
      toast.error('You have already logged your mood for today. You can log again tomorrow.');
      return;
    }
    
    // Submit mood to API
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:8000/api/patient/moodLogging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Important for sending cookies with the request
        body: JSON.stringify({ mood: selectedMood })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Mood logged successfully');
        setTodayMoodLogged(true);
      } else {
        toast.error(data.message || 'Failed to log mood');
      }
    } catch (error) {
      console.error('Error logging mood:', error);
      toast.error('Failed to log mood. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md flex justify-center items-center h-[220px]">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md relative h-[220px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-center lg:text-left">How Are You Feeling Today?</h2>
        
        {/* {!todayMoodLogged && (
        <div className="mb-1 p-1 bg-teal-50 border border-teal-200 rounded-lg text-teal-800">
         
           </div>
      )} */}


        {!todayMoodLogged && (
          <button 
            onClick={handleSaveMood}
            disabled={isSubmitting || !selectedMood}
            className={`px-4 py-2 rounded-lg font-medium ${
              isSubmitting 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : selectedMood 
                  ? "bg-[#02968A] text-white hover:bg-teal-700" 
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save Mood"}
          </button>
        )}
      </div>
      
      {todayMoodLogged && (
        <div className="mb-1 p-1 bg-teal-50 border border-teal-200 rounded-lg text-teal-800">
          You've logged your mood for today as <strong>{selectedMood}</strong>. You can log again tomorrow.
        </div>
      )}
      
      <div className="flex flex-wrap justify-center gap-4 lg:justify-around">
        {["Depressed", "Sad", "Neutral", "Happy", "Joyful"].map((mood) => (
          <div
            key={mood}
            className={`flex flex-col items-center cursor-pointer p-2 transition-all duration-300 ${
              selectedMood === mood 
                ? "border-2 border-[#02968A] rounded-xl" 
                : todayMoodLogged 
                  ? "opacity-60 hover:opacity-80" 
                  : "hover:border-2 hover:border-gray-300 rounded-lg"
            }`}
            onClick={() => handleMoodSelection(mood)}
            style={{ minWidth: '120px', maxWidth: '160px' }}
          >
            <div className="bg-[#fff] h-10 w-10 mt-3 rounded-full flex items-center justify-center text-white text-3xl">
              <img src={`/src/assets/patient/homepage/${mood}.png`} alt={mood} />
            </div>
            <span className="mt-2 text-lg font-medium">{mood}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodLogging;