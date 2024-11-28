
// Types
type AppointmentType = {
  date: string;
  time: string;
  patient: string;
};

const appointments: AppointmentType[] = [
  {
      date: "15th October,2024",
      time: "01:30pm - 02:30pm",
      patient: "Muhammad Shafaat Farooq",
  },
  {
      date: "16th October,2024",
      time: "02:30pm - 03:30pm",
      patient: "Anonymous",
  },
  {
      date: "17th October,2024",
      time: "12:30pm - 01:30pm",
      patient: "Ahmad Siddiqui",
  },
  {
      date: "17th October,2024",
      time: "12:30pm - 01:30pm",
      patient: "Ahmad Siddiqui",
  },
  {
      date: "22nd October,2024",
      time: "03:30pm - 04:30pm",
      patient: "Anonymous",
  },
  {
      date: "25th October,2024",
      time: "02:30pm - 03:30pm",
      patient: "Faiza Shareef",
  },
  {
      date: "25th October,2024",
      time: "02:30pm - 03:30pm",
      patient: "Faiza Shareef",
  },
  {
      date: "25th October,2024",
      time: "02:30pm - 03:30pm",
      patient: "Faiza Shareef",
  },
  {
      date: "25th October,2024",
      time: "02:30pm - 03:30pm",
      patient: "Faiza Shareef",
  },
  {
      date: "25th October,2024",
      time: "02:30pm - 03:30pm",
      patient: "Faiza Shareef",
  },
];


export const HomeUpcomingAppointments = () => {
  return (
      <div className=" col-span-2 bg-white rounded-lg shadow-md p-5 h-[22.5rem] overflow-auto custom-scrollbar">
          <h3 className="text-2xl font-bold mb-4 text-primary border-b pb-4">
              Upcoming Appointments
          </h3>
          <table className="w-full">
              <tbody className="divide-y">
                  {appointments.map((appointment, index) => (
                      <tr key={index}>
                          <td className="py-3 text-gray-600">{appointment.date}</td>
                          <td className="py-3 text-gray-600">{appointment.time}</td>
                          <td className="py-3 text-gray-600">{appointment.patient}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );
};


