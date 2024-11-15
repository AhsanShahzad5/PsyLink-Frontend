import React, { useState } from 'react';
import GenerateReport from '../../Components/GenerateReport';


const moodData = [
  { date: '20/4/2024', feeling: 'Depressing', courseEnrolled: 'Breathing Exercises', sessionDay: '-' },
  { date: '19/4/2024', feeling: 'Anxious', courseEnrolled: 'Mindfulness Meditation', sessionDay: '2' },
  { date: '18/4/2024', feeling: 'Happy', courseEnrolled: 'Yoga', sessionDay: '5' },
  { date: '17/4/2024', feeling: 'Sad', courseEnrolled: 'Breathing Exercises', sessionDay: '-' },
  { date: '16/4/2024', feeling: 'Stressed', courseEnrolled: 'Progressive Relaxation', sessionDay: '1' },
  { date: '18/4/2024', feeling: 'Happy', courseEnrolled: 'Yoga', sessionDay: '5' },
  { date: '17/4/2024', feeling: 'Sad', courseEnrolled: 'Breathing Exercises', sessionDay: '-' },
  { date: '16/4/2024', feeling: 'Stressed', courseEnrolled: 'Progressive Relaxation', sessionDay: '1' },
];



const MoodTrackerPage = () => {
  const [medicines, setMedicines] = useState<string>('');
  const [showReport, setShowReport] = useState(false);

  const handleGenerateReport = () => {
    setShowReport(true);
  };

  const handleCloseReport = () => {
    setShowReport(false);
  };

  

  return (
    <div className="bg-[#fff] flex justify-center py-10 min-h-screen">
      <div className="bg-white w-full max-w-[1655px] rounded-lg shadow-lg p-6 md:p-10">

        <h1 className="text-3xl md:text-5xl font-semibold text-black mb-6 md:mb-8 text-center md:text-left">
          Your Overall Mood has <br /> been better!
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-10 space-y-4 md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex justify-between w-60">
              <p className="text-xl md:text-2xl font-semibold">Days Going Well</p>
              <p className="text-xl md:text-2xl text-[#02968A] font-semibold">21</p>
            </div>
            <div className="flex justify-between w-60">
              <p className="text-xl md:text-2xl font-semibold">Days Going Bad</p>
              <p className="text-xl md:text-2xl text-[#02968A] font-semibold">7</p>
            </div>
          </div>
          <div className="text-center">
            <div className="relative w-32 h-32 md:w-[200px] md:h-[200px] rounded-full border-8 border-gray-300 flex items-center justify-center">
              <p className="text-xl md:text-3xl font-semibold">70% Avg</p>
            </div>
            <button className="mt-4 md:mt-6 bg-gradient-to-r from-[#02968A] to-black text-white text-lg font-semibold rounded-lg px-6 py-2 md:px-8">
              Keep Going!
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center mt-6 md:mt-10 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Enter Medicines if you take any"
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
            className="border border-black rounded-lg px-4 py-2 w-full md:w-3/5 text-lg"
          />
          <button onClick={handleGenerateReport} className="bg-[#02968A] text-white text-lg font-semibold rounded-lg px-8 py-2 mt-4 md:mt-0 md:ml-4 w-full md:w-auto">
            Generate Report
          </button>
        </div>

        <div className="mt-8 md:mt-10 overflow-auto custom-scrollbar max-h-60 md:max-h-96">
          <table className="w-full border border-black text-left text-sm md:text-lg">
            <thead className="bg-[#02968A] text-white">
              <tr>
                <th className="p-2 md:p-4">Date</th>
                <th className="p-2 md:p-4">Feeling</th>
                <th className="p-2 md:p-4">Course Enrolled</th>
                <th className="p-2 md:p-4">Session Day</th>
              </tr>
            </thead>
            <tbody>
              {moodData.map((entry, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 md:p-4">{entry.date}</td>
                  <td className="p-2 md:p-4">{entry.feeling}</td>
                  <td className="p-2 md:p-4">{entry.courseEnrolled}</td>
                  <td className="p-2 md:p-4">{entry.sessionDay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showReport && (
            <GenerateReport medicines={medicines} moodData={moodData} setShowReport={setShowReport}  />
)}

      </div>
    </div>
  );
};

export default MoodTrackerPage;
