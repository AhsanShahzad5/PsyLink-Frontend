import React from "react";
import { useNavigate } from "react-router-dom";

export interface Appointment {
  sessionId: string;
  doctor: string;
}

export interface PsyncPost {
  postId: string;
  postedOn: string;
}

export interface Patient {
  id: string;
  name: string;
  time: string;
  date: string;
  email: string;
  age: number;
  gender: string;
  disability: string;
  country: string;
  city: string;
  phone: string;
  appointments: Appointment[];
  psyncPosts: PsyncPost[];
}

const Patients: React.FC = () => {
  const navigate = useNavigate();

  const patientData: Patient[] = [
    {
      id: "1",
      name: "Preshit Pimple",
      time: "10:30AM",
      date: "Today",
      email: "preshitpimple@gmail.com",
      age: 32,
      gender: "Male",
      disability: "None",
      country: "Pakistan",
      city: "Lahore",
      phone: "+923957395739",
      appointments: [
        { sessionId: "101", doctor: "Dr. Ayesha Khan" },
        { sessionId: "102", doctor: "Dr. Usman Ali" },
      ],
      psyncPosts: [
        { postId: "201", postedOn: "20th Nov 2024, 2:00 PM" },
        { postId: "202", postedOn: "21st Nov 2024, 11:30 AM" },
      ],
    },
    {
      id: "2",
      name: "Abbad Malik",
      time: "10:30AM",
      date: "Today",
      email: "abbadmalik@gmail.com",
      age: 30,
      gender: "Male",
      disability: "Vision Impaired",
      country: "Pakistan",
      city: "Karachi",
      phone: "+923157895632",
      appointments: [
        { sessionId: "103", doctor: "Dr. Sana Iqbal" },
        { sessionId: "104", doctor: "Dr. Umair Khan" },
      ],
      psyncPosts: [
        { postId: "203", postedOn: "22nd Nov 2024, 8:45 PM" },
        { postId: "204", postedOn: "23rd Nov 2024, 9:15 AM" },
      ],
    },
    {
      id: "3",
      name: "Hania Zafar",
      time: "11:00AM",
      date: "Today",
      email: "haniazafar@gmail.com",
      age: 25,
      gender: "Female",
      disability: "None",
      country: "Pakistan",
      city: "Islamabad",
      phone: "+923457894120",
      appointments: [
        { sessionId: "105", doctor: "Dr. Zeeshan Ali" },
        { sessionId: "106", doctor: "Dr. Saba Qureshi" },
      ],
      psyncPosts: [
        { postId: "205", postedOn: "24th Nov 2024, 10:30 AM" },
        { postId: "206", postedOn: "25th Nov 2024, 1:45 PM" },
      ],
    },
    {
      id: "4",
      name: "Iqbal Ahmed",
      time: "11:00AM",
      date: "10th October, 2024",
      email: "haniazafar@gmail.com",
      age: 25,
      gender: "Female",
      disability: "None",
      country: "Pakistan",
      city: "Islamabad",
      phone: "+923457894120",
      appointments: [
        { sessionId: "105", doctor: "Dr. Zeeshan Ali" },
        { sessionId: "106", doctor: "Dr. Saba Qureshi" },
      ],
      psyncPosts: [
        { postId: "205", postedOn: "24th Nov 2024, 10:30 AM" },
        { postId: "206", postedOn: "25th Nov 2024, 1:45 PM" },
      ],
    },

  ];

  const handleDetails = (patient: Patient) => {
    navigate("/admin/patients/patient-details", { state: { patient } });
  };

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg overflow-auto max-h-[470px] custom-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Find Patients</h1>
          <input
            type="text"
            placeholder="Search by Id or Name"
            className="p-2 border rounded w-64"
          />
        </div>
        <p className="text-gray-500 mb-2">
          <span className="font-semibold">{patientData.length} Results Found</span>
        </p>
        <div className="divide-y divide-gray-200">
  {patientData.map((patient) => (
    <div
    key={patient.id}
    className="flex justify-between py-4"
  >
    {/* Left Section: Patient Details */}
    <div className="flex flex-col items-start min-w-[200px]">
      <p className="text-lg font-medium truncate">{patient.name}</p>
      <p className="text-sm text-gray-500 truncate">
        {patient.time} - {patient.date}
      </p>
    </div>
  
    {/* Right Section: Buttons */}
    <div className="flex-shrink-0 flex gap-2">
      <button
        className="px-4 py-2 bg-teal-500 text-white rounded shadow"
        onClick={() => handleDetails(patient)}
      >
        Details
      </button>
      <button className="px-4 py-2 bg-red-500 text-white rounded shadow">
        Remove
      </button>
    </div>
  </div>
  
  
  ))}
</div>

      </div>
    </div>
  );
};

export default Patients;
