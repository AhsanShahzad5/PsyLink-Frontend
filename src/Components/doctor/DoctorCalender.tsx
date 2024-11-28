import { useState } from "react";
import { dates, timeSlots } from "@/pages/Doctor/data/doctorpagedata";
import { FaChevronLeft, FaChevronRight, FaInfoCircle } from "react-icons/fa";

const DoctorCalender = () => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [visibleDates, setVisibleDates] = useState<number[]>([0, 1, 2, 3]); // Only show 4 dates at a time

  // Handle previous date set
  const handlePrevDate = () => {
    if (selectedDate > 0) {
      setSelectedDate(selectedDate - 1);
    }
    // Update the visible dates when going backwards
    setVisibleDates([visibleDates[0] - 1, visibleDates[1] - 1, visibleDates[2] - 1, visibleDates[3] - 1]);
  };

  // Handle next date set
  const handleNextDate = () => {
    if (selectedDate < dates.length - 1) {
      setSelectedDate(selectedDate + 1);
    }
    // Update the visible dates when going forwards
    setVisibleDates([visibleDates[0] + 1, visibleDates[1] + 1, visibleDates[2] + 1, visibleDates[3] + 1]);
  };

  return (
    <div className="bg-white rounded-lg p-6 my-4 border border-[#D9EAF3]">
      <h2 className="text-lg sm:text-xl font-bold mb-6">Your Calendar</h2>

      {/* Action Buttons */}
      <div className="flex items-center justify-between sm:justify-start gap-4 mb-4">
          <FaInfoCircle className="text-lg" />
        <button className="flex items-center gap-2 bg-red-500 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-red-700">
          Mark Busy
        </button>
        <button className="bg-primary text-white text-sm font-medium py-2 px-6 rounded-md hover:bg-[#027A73]">
          Booked
        </button>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <FaChevronLeft
        size={25}
          className={`cursor-pointer ${
            visibleDates[0] === 0 ? "text-gray-300" : "text-primary"
          }`}
          onClick={handlePrevDate}
        />
          {visibleDates.map((index) => (
              <button
              key={index}
              className={`text-[1rem] font-medium px-4 py-2 rounded-md ${
                selectedDate === index
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
              onClick={() => setSelectedDate(index)}
            >
              {dates[index]}
            </button>
          ))}
                  {/* <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        </div> */}
        <FaChevronRight
        size={25}
          className={`cursor-pointer ${
            visibleDates[3] === dates.length - 1 ? "text-gray-300" : "text-primary"
          }`}
          onClick={handleNextDate}
        />
      </div>

      {/* Time Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {timeSlots.map((slot, index) => (
          <button
            key={index}
            className={`py-3 rounded-md text-center text-sm font-medium ${
              selectedSlot === slot
                ? "bg-primary text-white"
                : "bg-[#F6F6F6] text-gray-700 hover:bg-[#E6F8F6] hover:text-primary"
            }`}
            onClick={() => setSelectedSlot(slot)}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DoctorCalender;
