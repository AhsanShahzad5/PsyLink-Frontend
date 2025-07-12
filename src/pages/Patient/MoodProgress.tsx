import React, { useState, useEffect } from 'react';
import GenerateReport from '../../Components/patient/GenerateReport';

interface MoodEntry {
  date: string;
  feeling: string;
}

interface MoodHistoryResponse {
  success: boolean;
  message: string;
  data: {
    moodHistory: Array<{
      date: string;
      mood: string | null;
    }>;
    summary: {
      totalDays: number;
      daysWithMoodLogged: number;
    };
  };
}

const MoodTrackerPage = () => {
  const [medicines, setMedicines] = useState<string>('');
  const [showReport, setShowReport] = useState(false);
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [patientData, setpatientData] = useState<any>();
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState({
    totalDays: 0,
    daysWithMoodLogged: 0
  });

  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/api/patient/getMoodHistory',
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Transform data to match the expected format
          const transformedData = data.data.moodHistory
          .map(item => ({
            date: formatDate(item.date), // Format date from YYYY-MM-DD to DD/MM/YYYY
            feeling: item.mood ? capitalizeFirstLetter(item.mood) : "-" // Show "-" for null moods
          }));
          
          setMoodData(transformedData);
          console.table(data);
          setpatientData(data);
          setSummary(data.data.summary);
        } else {
          setError('Failed to fetch mood data');
        }
      } catch (err) {
        console.error('Error fetching mood history:', err);
        setError('Failed to load mood data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodHistory();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleGenerateReport = () => {
    setShowReport(true);
  };

  // Filter entries with no mood logged
const daysWithNoMood = moodData.filter(item => 
  item.feeling === "-" || !item.feeling
).length;

// Calculate good days based on your mood categories
const daysGoingWell = moodData.filter(item => 
  ["neutral", "happy", "joyful"].includes(item.feeling.toLowerCase())
).length;

// Calculate bad days based on your mood categories
const daysGoingBad = moodData.filter(item => 
  ["depressed", "sad"].includes(item.feeling.toLowerCase())
).length;

// Calculate mood average percentage (only considering days with mood logged)
const daysWithMoodLogged = moodData.length - daysWithNoMood;
const moodAvgPercentage = daysWithMoodLogged > 0 
  ? Math.round((daysGoingWell / daysWithMoodLogged) * 100) 
  : 0;


  return (
    <div className="bg-[#fff] flex justify-center py-4 min-h-screen">
      <div className="bg-white w-full max-w-[1655px] rounded-lg shadow-lg p-4 md:p-6">
  
        <h1 className="text-2xl md:text-3xl font-semibold text-black mb-4 md:mb-6 text-center md:text-left">
          Your Overall Mood has <br /> been better!
        </h1>
  
        {isLoading ? (
          <div className="text-center py-6">
            <p className="text-lg">Loading mood data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">
            <p className="text-lg">{error}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 space-y-3 md:space-y-0">
              <div className="flex flex-col items-center md:items-start space-y-1">
                <div className="flex justify-between w-52">
                  <p className="text-lg md:text-xl font-semibold">Days Going Well</p>
                  <p className="text-lg md:text-xl text-[#02968A] font-semibold">{daysGoingWell}</p>
                </div>
                <div className="flex justify-between w-52">
                  <p className="text-lg md:text-xl font-semibold">Days Going Bad</p>
                  <p className="text-lg md:text-xl text-[#02968A] font-semibold">{daysGoingBad}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="relative w-24 h-24 md:w-[140px] md:h-[140px] rounded-full border-6 border-gray-300 flex items-center justify-center">
                  <p className="text-lg md:text-2xl font-semibold">{moodAvgPercentage}% Avg</p>
                </div>
                <button className="mt-3 md:mt-4 bg-gradient-to-r from-[#02968A] to-black text-white text-base font-semibold rounded-lg px-5 py-2 md:px-6">
                  Keep Going!
                </button>
              </div>
            </div>
  
            <div className="flex flex-col md:flex-row items-center mt-4 md:mt-6 space-y-3 md:space-y-0">
              <input
                type="text"
                placeholder="Enter Medicines if you take any"
                value={medicines}
                onChange={(e) => setMedicines(e.target.value)}
                className="border border-black rounded-lg px-3 py-2 w-full md:w-3/5 text-base"
              />
              <button 
                onClick={handleGenerateReport} 
                className="bg-[#02968A] text-white text-base font-semibold rounded-lg px-6 py-2 mt-3 md:mt-0 md:ml-4 w-full md:w-auto"
              >
                Generate Report
              </button>
            </div>
  
            <div className="mt-4 md:mt-6 overflow-auto custom-scrollbar max-h-48 md:max-h-64">
              {moodData.length > 0 ? (
                <table className="w-full border border-black text-left text-sm md:text-base">
                  <thead className="bg-[#02968A]">
                    <tr>
                      <th className="p-2 md:p-3">Date</th>
                      <th className="p-2 md:p-3">Feeling</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moodData.map((entry, index) => (
                      <tr key={index} className="border-b text-black">
                        <td className="p-2 md:p-3">{entry.date}</td>
                        <td className="p-2 md:p-3">{entry.feeling}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-base text-gray-500">No mood data logged yet</p>
                </div>
              )}
            </div>
          </>
        )}
  
        {showReport && (
          <GenerateReport 
            NotfilesPage={false}
            patientName={patientData.patientName}
            patientAge={patientData.patientAge}
            patientGender={patientData.patientGender}
            medicines={medicines} 
            moodData={moodData} 
            setShowReport={setShowReport}
            summary={summary}
          />
        )}
      </div>
    </div>
  );

  // old
  // return (
  //   <div className="bg-[#fff] flex justify-center py-10 min-h-screen">
  //     <div className="bg-white w-full max-w-[1655px] rounded-lg shadow-lg p-6 md:p-10">

  //       <h1 className="text-3xl md:text-5xl font-semibold text-black mb-6 md:mb-8 text-center md:text-left">
  //         Your Overall Mood has <br /> been better!
  //       </h1>

  //       {isLoading ? (
  //         <div className="text-center py-10">
  //           <p className="text-xl">Loading mood data...</p>
  //         </div>
  //       ) : error ? (
  //         <div className="text-center py-10 text-red-500">
  //           <p className="text-xl">{error}</p>
  //         </div>
  //       ) : (
  //         <>
  //           <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-10 space-y-4 md:space-y-0">
  //             <div className="flex flex-col items-center md:items-start space-y-2">
  //               <div className="flex justify-between w-60">
  //                 <p className="text-xl md:text-2xl font-semibold">Days Going Well</p>
  //                 <p className="text-xl md:text-2xl text-[#02968A] font-semibold">{daysGoingWell}</p>
  //               </div>
  //               <div className="flex justify-between w-60">
  //                 <p className="text-xl md:text-2xl font-semibold">Days Going Bad</p>
  //                 <p className="text-xl md:text-2xl text-[#02968A] font-semibold">{daysGoingBad}</p>
  //               </div>
  //             </div>
  //             <div className="text-center">
  //               <div className="relative w-32 h-32 md:w-[200px] md:h-[200px] rounded-full border-8 border-gray-300 flex items-center justify-center">
  //                 <p className="text-xl md:text-3xl font-semibold">{moodAvgPercentage}% Avg</p>
  //               </div>
  //               <button className="mt-4 md:mt-6 bg-gradient-to-r from-[#02968A] to-black text-white text-lg font-semibold rounded-lg px-6 py-2 md:px-8">
  //                 Keep Going!
  //               </button>
  //             </div>
  //           </div>

  //           <div className="flex flex-col md:flex-row items-center mt-6 md:mt-10 space-y-4 md:space-y-0">
  //             <input
  //               type="text"
  //               placeholder="Enter Medicines if you take any"
  //               value={medicines}
  //               onChange={(e) => setMedicines(e.target.value)}
  //               className="border border-black rounded-lg px-4 py-2 w-full md:w-3/5 text-lg"
  //             />
  //             <button 
  //               onClick={handleGenerateReport} 
  //               className="bg-[#02968A] text-white text-lg font-semibold rounded-lg px-8 py-2 mt-4 md:mt-0 md:ml-4 w-full md:w-auto"
  //             >
  //               Generate Report
  //             </button>
  //           </div>

  //           <div className="mt-8 md:mt-10 overflow-auto custom-scrollbar max-h-60 md:max-h-96">
  //             {moodData.length > 0 ? (
  //               <table className="w-full border border-black text-left text-sm md:text-lg">
  //                 <thead className="bg-[#02968A] text-white">
  //                   <tr>
  //                     <th className="p-2 md:p-4">Date</th>
  //                     <th className="p-2 md:p-4">Feeling</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {moodData.map((entry, index) => (
  //                     <tr key={index} className="border-b">
  //                       <td className="p-2 md:p-4">{entry.date}</td>
  //                       <td className="p-2 md:p-4">{entry.feeling}</td>
  //                     </tr>
  //                   ))}
  //                 </tbody>
  //               </table>
  //             ) : (
  //               <div className="text-center py-8">
  //                 <p className="text-lg text-gray-500">No mood data logged yet</p>
  //               </div>
  //             )}
  //           </div>
  //         </>
  //       )}

  //       {showReport && (
  //         <GenerateReport 
  //         NotfilesPage={false}
  //         patientName={patientData.patientName}
  //         patientAge={patientData.patientAge}
  //         patientGender={patientData.patientGender}
  //           medicines={medicines} 
  //           moodData={moodData} 
  //           setShowReport={setShowReport}
  //          summary={summary}
  //         />
  //       )}
  //     </div>
  //   </div>
  // );
};

export default MoodTrackerPage;