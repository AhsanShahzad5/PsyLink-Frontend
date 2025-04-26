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

  const handleMoodSelection = async (mood: string) => {
    // If mood already logged today, don't allow changes
    if (todayMoodLogged) {
      toast.error('You have already logged your mood for today. You can log again tomorrow.');
      return;
    }

    setSelectedMood(mood);
    
    // Submit mood to API
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:8000/api/patient/moodLogging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Important for sending cookies with the request
        body: JSON.stringify({ mood })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Mood logged successfully');
        setTodayMoodLogged(true);
      } else {
        toast.error(data.message || 'Failed to log mood');
        setSelectedMood(""); // Reset selection if submission fails
      }
    } catch (error) {
      console.error('Error logging mood:', error);
      toast.error('Failed to log mood. Please try again.');
      setSelectedMood(""); // Reset selection if submission fails
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md flex justify-center items-center h-64">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center lg:text-left">How Are You Feeling Today?</h2>
      
      {todayMoodLogged && (
        <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-800">
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
            onClick={() => !isSubmitting && handleMoodSelection(mood)}
            style={{ minWidth: '120px', maxWidth: '160px' }}
          >
            <div className="bg-[#fff] h-16 w-16 mt-4 rounded-full flex items-center justify-center text-white text-3xl">
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