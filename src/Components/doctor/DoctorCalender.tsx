import { useState } from "react";
// import { dates, timeSlots } from "@/pages/Doctor/data/doctorpagedata";
import { FaChevronLeft, FaChevronRight, FaInfoCircle } from "react-icons/fa";

interface Slot {
  time: string;
}

interface DateSlots {
  date: string;
  slots: Slot[];
}

export const dates = [
    
  "1 Oct",
  "2 Oct",
  "3 Oct",
  "4 Oct",
  "5 Oct",
  "6 Oct",
  "7 Oct",
  "8 Oct",
  "9 Oct",
  "10 Oct",
  "11 Oct",
  "12 Oct",
  "13 Oct",
  "14 Oct",
  "15 Oct",
  "16 Oct",
  "17 Oct",
  "18 Oct",
  "19 Oct",
  "20 Oct",
  "21 Oct",
  "22 Oct",
  "23 Oct",
  "24 Sept",
  "25 Sept",
  "26 Sept",
  "27 Sept",
  "28 Sept",
  "29 Sept",
  "30 Sept",
  "31 Sept",
  
];

// Time slots
export const timeSlots = [
  "9:00 - 10:00",
  "10:00 - 11:00",
  "12:00 - 01:00",
  "12:30 - 01:30",
  "01:00 - 02:00",
  "02:00 - 03:00",
  "03:00 - 04:00",
  "04:30 - 05:30",
  "05:00 - 06:00",
  
];

const DoctorCalender = () => {


  const [dateSlotData, setDateSlotData] = useState<DateSlots[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [visibleDates, setVisibleDates] = useState<number[]>([0, 1, 2, 3]);

  // Format the date to "YYYY-MM-DD"
  const formatDate = (dateIndex: number) => {
    const date = new Date(dates[dateIndex]);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Update the slots for a specific date
  const updateDateSlotData = (date: string, slotTime: string) => {
    setDateSlotData((prev) => {
      const dateIndex = prev.findIndex((entry) => entry.date === date);

      if (dateIndex === -1) {
        // Add new date and slot
        return [...prev, { date, slots: [{ time: slotTime }] }];
      } else {
        const dateEntry = prev[dateIndex];
        const slotIndex = dateEntry.slots.findIndex((slot) => slot.time === slotTime);

        if (slotIndex === -1) {
          // Add new slot to the existing date
          const updatedSlots = [...dateEntry.slots, { time: slotTime }];
          return [
            ...prev.slice(0, dateIndex),
            { ...dateEntry, slots: updatedSlots },
            ...prev.slice(dateIndex + 1),
          ];
        } else {
          // Remove the slot if it already exists (toggle functionality)
          const updatedSlots = dateEntry.slots.filter((slot) => slot.time !== slotTime);
          return updatedSlots.length > 0
            ? [
                ...prev.slice(0, dateIndex),
                { ...dateEntry, slots: updatedSlots },
                ...prev.slice(dateIndex + 1),
              ]
            : [...prev.slice(0, dateIndex), ...prev.slice(dateIndex + 1)];
        }
      }
    });
  };

  // Navigate to the previous set of dates
  const handlePrevDate = () => {
    if (visibleDates[0] > 0) {
      setVisibleDates(visibleDates.map((date) => date - 1));
      setSelectedDateIndex(selectedDateIndex - 1);
    }
  };

  // Navigate to the next set of dates
  const handleNextDate = () => {
    if (visibleDates[visibleDates.length - 1] < dates.length - 1) {
      setVisibleDates(visibleDates.map((date) => date + 1));
      setSelectedDateIndex(selectedDateIndex + 1);
    }
  };

  // Save availability to the server
  const handleSaveAvailability = async () => {
    const payload = dateSlotData.map((entry) => ({
      date: entry.date,
      slots: entry.slots.map((slot) => ({ time: slot.time })),
    }));

    try {
      const response = await fetch("http://localhost:8000/api/doctor/availability/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Availability saved successfully!");
        setDateSlotData([]); // Optionally clear the data after saving
      } else {
        alert("Failed to save availability.");
      }
    } catch (error) {
      console.error("Error saving availability:", error);
      alert("An error occurred while saving availability.");
    }
  };

  const selectedDate = formatDate(selectedDateIndex);

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
        <button
          className="bg-primary text-white text-sm font-medium py-2 px-6 rounded-md hover:bg-[#027A73]"
          onClick={handleSaveAvailability}
        >
          Available
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
              selectedDateIndex === index
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-primary"
            }`}
            onClick={() => setSelectedDateIndex(index)}
          >
            {dates[index]}
          </button>
        ))}
        <FaChevronRight
          size={25}
          className={`cursor-pointer ${
            visibleDates[visibleDates.length - 1] === dates.length - 1
              ? "text-gray-300"
              : "text-primary"
          }`}
          onClick={handleNextDate}
        />
      </div>

      {/* Time Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {timeSlots.map((slot, index) => {
          const dateEntry = dateSlotData.find((entry) => entry.date === selectedDate);
          const isSelected = dateEntry?.slots.some((s) => s.time === slot);

          return (
            <button
              key={index}
              className={`py-3 rounded-md text-center text-sm font-medium ${
                isSelected
                  ? "bg-primary text-white"
                  : "bg-[#F6F6F6] text-gray-700 hover:bg-[#E6F8F6] hover:text-primary"
              }`}
              onClick={() => updateDateSlotData(selectedDate, slot)}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorCalender;
