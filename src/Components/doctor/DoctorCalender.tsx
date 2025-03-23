import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaInfoCircle } from "react-icons/fa";

// Generate dates dynamically from today to one month ahead
const generateDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const newDate = new Date();
    newDate.setDate(today.getDate() + i);
    const formattedDate = newDate.toISOString().split("T")[0]; // YYYY-MM-DD
    dates.push(formattedDate);
  }

  return dates;
};

const timeSlots = [
  "9:00am - 10:00am",
  "10:00am - 11:00am",
  "12:00am - 01:00pm",
  "12:30pm - 01:30pm",
  "01:00pm - 02:00pm",
  "02:00pm - 03:00pm",
  "03:00pm - 04:00pm",
  "04:30pm - 05:30pm",
  "05:00pm - 06:00pm",
];

interface Slot {
  time: string;
}

interface DateSlots {
  date: string;
  slots: Slot[];
}

const DoctorCalender = ({availabilityDetails}:any) => {
  const [dateSlotData, setDateSlotData] = useState<DateSlots[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [visibleDates, setVisibleDates] = useState<number[]>([0, 1, 2, 3]);
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    setDates(generateDates());
    console.log(availabilityDetails);
  }, []);

  const updateDateSlotData = (date: string, slotTime: string) => {
    setDateSlotData((prev) => {
      const dateIndex = prev.findIndex((entry) => entry.date === date);

      if (dateIndex === -1) {
        return [...prev, { date, slots: [{ time: slotTime }] }];
      } else {
        const dateEntry = prev[dateIndex];
        const slotIndex = dateEntry.slots.findIndex((slot) => slot.time === slotTime);

        if (slotIndex === -1) {
          const updatedSlots = [...dateEntry.slots, { time: slotTime }];
          return [
            ...prev.slice(0, dateIndex),
            { ...dateEntry, slots: updatedSlots },
            ...prev.slice(dateIndex + 1),
          ];
        } else {
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

  const handlePrevDate = () => {
    if (visibleDates[0] > 0) {
      setVisibleDates(visibleDates.map((date) => date - 1));
      setSelectedDateIndex(selectedDateIndex - 1);
    }
  };

  const handleNextDate = () => {
    if (visibleDates[visibleDates.length - 1] < dates.length - 1) {
      setVisibleDates(visibleDates.map((date) => date + 1));
      setSelectedDateIndex(selectedDateIndex + 1);
    }
  };

  const handleSaveAvailability = async () => {
    const formattedPayload = {
      availability: dateSlotData.map((entry) => ({
        date: entry.date,
        slots: entry.slots.map((slot) => ({
          time: convertTo12HourFormat(slot.time),
        })),
      })),
    };

    try {
      const response = await fetch("http://localhost:8000/api/doctor/availability/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formattedPayload),
      });

      if (response.ok) {
        alert("Availability saved successfully!");
        setDateSlotData([]);
      } else {
        alert("Failed to save availability.");
      }
    } catch (error) {
      console.error("Error saving availability:", error);
      alert("An error occurred while saving availability.");
    }
  };

  const handleMarkBusy = async () => {
    // Construct the payload with all dates and their time slots
    const payload = {
      schedules: dateSlotData.map((entry) => ({
        date: entry.date,
        times: entry.slots.map((slot) => slot.time), // Keep the original format with spaces
      })),
    };
  
    // Log the payload for debugging
    console.log(JSON.stringify(payload, null, 2));
  
    try {
      const response = await fetch("http://localhost:8000/api/doctor/availability/busy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert("Slots marked as busy successfully!");
        // Update the state to reflect the busy status
        setDateSlotData((prev) =>
          prev.map((entry) => ({
            ...entry,
            slots: entry.slots.map((slot) =>
              payload.schedules.find((s) => s.date === entry.date)?.times.includes(slot.time)
                ? { ...slot, status: "busy" }
                : slot
            ),
          }))
        );
      } else {
        alert("Failed to mark slots as busy.");
      }
    } catch (error) {
      console.error("Error marking slots as busy:", error);
      alert("An error occurred while marking slots as busy.");
    }
  };

  
  
  

  const convertTo12HourFormat = (slot: string) => {
    const match = slot.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (!match) return slot;

    const [_, startH, startM, endH, endM] = match.map(Number);

    const formatAMPM = (h: number, m: number) => {
      const ampm = h >= 12 ? "pm" : "am";
      const hour = h % 12 || 12;
      return `${hour}:${m.toString().padStart(2, "0")}${ampm}`;
    };

    return `${formatAMPM(startH, startM)}-${formatAMPM(endH, endM)}`;
  };

  const selectedDate = dates[selectedDateIndex];
  const selectedDateData = availabilityDetails.find((entry:any) => entry.date === selectedDate);
  const availableSlots = selectedDateData?.slots.filter((slot:any) => slot.status === "available") || [];
  const busySlots = selectedDateData?.slots.filter((slot:any) => slot.status === "busy") || [];

  return (
    <div className="bg-white rounded-lg p-6 my-4 border border-[#D9EAF3]">
      <h2 className="text-lg sm:text-xl font-bold mb-6">Your Calendar</h2>

      <div className="flex items-center justify-between sm:justify-start gap-4 mb-4">
        <FaInfoCircle className="text-lg" />
        <button className="flex items-center gap-2 bg-red-500 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-red-700"  onClick={handleMarkBusy}>
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

      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <FaChevronLeft
          size={25}
          className={`cursor-pointer ${visibleDates[0] === 0 ? "text-gray-300" : "text-primary"}`}
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
            visibleDates[visibleDates.length - 1] === dates.length - 1 ? "text-gray-300" : "text-primary"
          }`}
          onClick={handleNextDate}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {timeSlots.map((slot, index) => {
          const dateEntry = dateSlotData.find((entry) => entry.date === dates[selectedDateIndex]);
          const isSelected = dateEntry?.slots.some((s) => s.time === slot);

          return (
            <button
              key={index}
              className={`py-3 rounded-md text-center text-sm font-medium ${
                isSelected ? "bg-primary text-white" : "bg-[#F6F6F6] text-gray-700 hover:bg-[#E6F8F6] hover:text-primary"
              }`}
              onClick={() => updateDateSlotData(dates[selectedDateIndex], slot)}
            >
              {slot}
            </button>
          );
        })}
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Marked Available Slots</h3>
        {availableSlots.length > 0 ? (
          <ul className="list-disc pl-6">
            {availableSlots.map((slot:any) => (
              <li key={slot._id}>{slot.time}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No slot mark as available</p>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Busy Slots</h3>
        {busySlots.length > 0 ? (
          <ul className="list-disc pl-6 text-red-500">
            {busySlots.map((slot:any) => (
              <li key={slot._id}>{slot.time}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No busy slots</p>
        )}
      </div>
    </div>
  );
};

export default DoctorCalender;
