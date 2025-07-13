import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaInfoCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const generateDates = () => {
  const dates: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day
  
  for (let i = 0; i < 30; i++) {
    const newDate = new Date(today);
    newDate.setDate(today.getDate() + i);
    
    // Format the date manually to avoid timezone issues
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    dates.push(formattedDate);
  }
  return dates;
};

const baseTimeSlots = [
  "9:00am-10:00am",
  "10:00am-11:00am",
  "11:00am-12:00am",
  "12:00pm-01:00pm",
  "01:00pm-02:00pm",
  "02:00pm-03:00pm",
  "03:00pm-04:00pm",
  "04:00pm-05:00pm",
  "05:00pm-06:00pm",
  "06:00pm-07:00pm",
  "07:00pm-08:00pm",
  "08:00pm-09:00pm",
  "09:00pm-10:00pm",
];

interface SlotStatus {
  availableSlots: string[];
  bookedSlots: string[];
  busySlots: string[];
}

const DoctorCalender = () => {
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [visibleDates, setVisibleDates] = useState([0, 1, 2, 3]);
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, SlotStatus>>({});
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [savingAvailable, setSavingAvailable] = useState(false);
  const [savingBusy, setSavingBusy] = useState(false);

  useEffect(() => {
    setDates(generateDates());
    fetchAvailability();
  }, []);

  // Add useEffect to filter time slots based on current date and time
  useEffect(() => {
    if (dates.length === 0) return;

    const today = new Date();
    const currentDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    const selectedDate = dates[selectedDateIndex];

    // Only filter time slots if the selected date is today
    if (selectedDate === currentDate) {
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      
      // Filter time slots based on current time
      const filteredSlots = baseTimeSlots.filter(slot => {
        const [startTime, ] = slot.split('-');
        const [hourStr, minuteStr] = startTime.slice(0, 5).split(':');
        let hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);
        const isPM = startTime.toLowerCase().includes('pm');
        
        // Convert to 24-hour format for comparison
        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;
        
        // Compare with current time
        return hour > currentHour || (hour === currentHour && minute > currentMinute);
      });
      
      setTimeSlots(filteredSlots);
    } else {
      // If not today, show all time slots
      setTimeSlots(baseTimeSlots);
    }
  }, [dates, selectedDateIndex]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/doctor/availability", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);

      // Process the API response correctly based on the format you're receiving
      const mappedData: Record<string, SlotStatus> = {};
      
      if (data.availability && Array.isArray(data.availability)) {
        data.availability.forEach((entry: any) => {
          // Normalize slot format if needed
          const availableSlots = Array.isArray(entry.availableSlots) 
            ? entry.availableSlots.map((slot: string) => normalizeSlotFormat(slot))
            : [];
          
          const bookedSlots = Array.isArray(entry.bookedSlots)
            ? entry.bookedSlots.map((slot: string) => normalizeSlotFormat(slot))
            : [];
          
          const busySlots = Array.isArray(entry.busySlots)
            ? entry.busySlots.map((slot: string) => normalizeSlotFormat(slot))
            : [];

          mappedData[entry.date] = {
            availableSlots,
            bookedSlots,
            busySlots,
          };
        });
      }

      setAvailabilityMap(mappedData);
      toast.success("Calendar data loaded");
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      toast.error("Failed to fetch availability data");
    } finally {
      setLoading(false);
    }
  };

  // Function to normalize slot format to ensure consistent comparison
  const normalizeSlotFormat = (slot: string): string => {
    // Convert formats like "09:00PM" to "09:00pm-10:00pm"
    if (!slot.includes("-")) {
      const time = slot.slice(0, 5);
      const period = slot.slice(5).toLowerCase();
      
      // Extract hour and parse it
      const hourStr = slot.slice(0, 2);
      const hour = parseInt(hourStr);
      
      // Calculate end time (add 1 hour)
      const endHour = hour === 12 ? 1 : (hour + 1) % 12 || 12;
      const endHourStr = endHour < 10 ? `0${endHour}` : `${endHour}`;
      
      return `${time.toLowerCase()}${period}-${endHourStr}:00${period}`;
    }
    return slot.toLowerCase();
  };

  const handlePrevDate = () => {
    if (visibleDates[0] > 0) {
      setVisibleDates(visibleDates.map((d) => d - 1));
      setSelectedDateIndex(selectedDateIndex - 1);
    }
  };

  const handleNextDate = () => {
    if (visibleDates[visibleDates.length - 1] < dates.length - 1) {
      setVisibleDates(visibleDates.map((d) => d + 1));
      setSelectedDateIndex(selectedDateIndex + 1);
    }
  };

  const toggleSlot = (slot: string) => {
    const slotStatus = getSlotStatus(slot);
    
    // Don't allow toggling already booked slots
    if (slotStatus === "booked") {
      toast.info("This slot is already booked");
      return;
    }
    
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSaveAvailability = async () => {
    if (selectedSlots.length === 0) {
      toast.error("Select slots first!");
      return;
    }

    setSavingAvailable(true);

    const payload = {
      availability: [
        {
          date: dates[selectedDateIndex],
          slots: selectedSlots.map((slot) => ({
            time: slot.split("-")[0].toUpperCase(), // Only sending start time
          })),
        },
      ],
    };

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
        toast.success("Availability saved!");
        setSelectedSlots([]);
        fetchAvailability();
      } else {
        toast.error("Failed to save availability");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save");
    } finally {
      setSavingAvailable(false);
    }
  };

  const handleMarkBusy = async () => {
    if (selectedSlots.length === 0) {
      toast.error("Select slots first!");
      return;
    }

    setSavingBusy(true);

    const payload = {
      schedules: [
        {
          date: dates[selectedDateIndex],
          times: selectedSlots.map((slot) => slot.split("-")[0].toUpperCase()),
        },
      ],
    };

    try {
      const response = await fetch("http://localhost:8000/api/doctor/availability/busy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Slots marked busy!");
        setSelectedSlots([]);
        fetchAvailability();
      } else {
        toast.error("Failed to mark busy");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark busy");
    } finally {
      setSavingBusy(false);
    }
  };

  const getSlotStatus = (slot: string): "free" | "available" | "booked" | "busy" => {
    const todayDate = dates[selectedDateIndex];
    const availability = availabilityMap[todayDate];
    const normalizedSlot = slot.toLowerCase();

    if (!availability) return "free";

    // Check if the slot is in any of the status arrays
    if (availability.bookedSlots.some(s => s.toLowerCase() === normalizedSlot)) return "booked";
    if (availability.availableSlots.some(s => s.toLowerCase() === normalizedSlot)) return "available";
    if (availability.busySlots.some(s => s.toLowerCase() === normalizedSlot)) return "busy";

    return "free";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderSlotButton = (slot: string) => {
    const status = getSlotStatus(slot);
    const isSelected = selectedSlots.includes(slot);

    // Base style for all slots
    let baseStyle = "py-3 rounded-md text-center text-sm font-medium transition-all";
    
    // Status-specific styles
    let statusStyle = "";
    switch (status) {
      case "free":
        statusStyle = "bg-gray-100 text-gray-700 hover:bg-gray-200";
        break;
      case "available":
        statusStyle = "bg-green-100 text-green-700 hover:bg-green-200";
        break;
      case "booked":
        statusStyle = "bg-blue-100 text-blue-700 cursor-not-allowed";
        break;
      case "busy":
        statusStyle = "bg-red-100 text-red-700 hover:bg-red-200";
        break;
    }

    // Selected state (only for non-booked slots)
    let selectedStyle = "";
    if (isSelected && status !== "booked") {
      selectedStyle = "ring-2 ring-primary ring-offset-1";
    }

    return (
      <button
        key={slot}
        onClick={() => toggleSlot(slot)}
        disabled={status === "booked"}
        className={`${baseStyle} ${statusStyle} ${selectedStyle}`}
      >
        {slot}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 my-4 border border-[#D9EAF3]">
      <h2 className="text-[1.8rem] ml-4">Your Calendar</h2>

      <div className="flex items-center justify-between w-full mb-4">
  <div className="flex items-center text-blue-600">
    <FaInfoCircle className="text-lg mr-2" />
    <span className="text-sm">Select slots to mark as available or busy</span>
  </div>
  <div className="flex gap-2">
    <button 
      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors disabled:opacity-70 flex items-center justify-center" 
      onClick={handleMarkBusy}
      disabled={savingBusy}
    >
      {savingBusy ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
          Marking...
        </>
      ) : (
        "Mark Busy"
      )}
    </button>
    <button 
      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center justify-center" 
      onClick={handleSaveAvailability}
      disabled={savingAvailable}
    >
      {savingAvailable ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
          Saving...
        </>
      ) : (
        "Mark Available"
      )}
    </button>
  </div>
</div>

      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <button 
          onClick={handlePrevDate}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FaChevronLeft size={20} className="text-gray-600" />
        </button>
        
        <div className="flex space-x-2">
          {visibleDates.map((i) => (
            <button
              key={i}
              onClick={() => setSelectedDateIndex(i)}
              className={`px-4 py-2 rounded-md ${
                selectedDateIndex === i 
                  ? "bg-primary bg-opacity-10 text-primary font-bold" 
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {dates[i] ? formatDate(dates[i]) : ""}
            </button>
          ))}
        </div>
        
        <button 
          onClick={handleNextDate}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FaChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {timeSlots.map((slot) => renderSlotButton(slot))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-4 justify-start">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-100 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Free</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
          <span className="text-sm text-green-600">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
          <span className="text-sm text-blue-600">Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 rounded mr-2"></div>
          <span className="text-sm text-red-600">Busy</span>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default DoctorCalender;