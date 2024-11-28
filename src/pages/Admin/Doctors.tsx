import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRegStickyNote } from "react-icons/fa"; // Font Awesome
import { FaTrash } from "react-icons/fa"; // Font Awesome

export interface Doctor {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  profilePicture: string;
  country: string;
  city: string;
  phone: string;
  specialization: string;
  pmdcNumber: string;
  education: string[];
  licenseCertification: string;
  cnicNumber: string;
  availability: string;
  feeRate: string;
  bankAccountNumber: string;
  appointments: { sessionId: string; patientName: string }[];
  posts: { postId: string; postedOn: string }[];
}

const Doctors: React.FC = () => {
  const navigate = useNavigate();

  const doctorData: Doctor[] = [
    {
      id: "1",
      name: "Dr. Sarah Ahmed",
      email: "sarah.ahmed@gmail.com",
      dateOfBirth: "1985-05-20",
      gender: "Female",
      profilePicture: "https://via.placeholder.com/150",
      country: "Pakistan",
      city: "Lahore",
      phone: "+923001234567",
      specialization: "Psychiatrist",
      pmdcNumber: "123456789",
      education: ["MBBS", "FCPS Psychiatry"],
      licenseCertification: "LC-001",
      cnicNumber: "12345-6789012-3",
      availability: "Monday to Friday, 9 AM to 5 PM",
      feeRate: "PKR 5,000 per session",
      bankAccountNumber: "1234-5678-9012",
      appointments: [
        { sessionId: "S001", patientName: "John Doe" },
        { sessionId: "S002", patientName: "Jane Smith" },
      ],
      posts: [
        { postId: "P001", postedOn: "2024-01-10" },
        { postId: "P002", postedOn: "2024-02-15" },
      ],
    },
    {
      "id": "2",
      "name": "Dr. John Smith",
      "email": "john.smith@gmail.com",
      "dateOfBirth": "1982-03-14",
      "gender": "Male",
      "profilePicture": "https://via.placeholder.com/150",
      "country": "USA",
      "city": "New York",
      "phone": "+12025551234",
      "specialization": "Psychiatrist",
      "pmdcNumber": "987654321",
      "education": ["MBBS", "MD Psychiatry"],
      "licenseCertification": "LC-002",
      "cnicNumber": "23456-7890123-4",
      "availability": "Monday to Thursday, 10 AM to 6 PM",
      "feeRate": "USD 150 per session",
      "bankAccountNumber": "2345-6789-0123",
      "appointments": [
        { "sessionId": "S003", "patientName": "Alice Brown" },
        { "sessionId": "S004", "patientName": "Bob Green" }
      ],
      "posts": [
        { "postId": "P003", "postedOn": "2024-03-01" },
        { "postId": "P004", "postedOn": "2024-04-12" }
      ]
    },
    {
      "id": "3",
      "name": "Dr. Emily Davis",
      "email": "emily.davis@gmail.com",
      "dateOfBirth": "1990-07-25",
      "gender": "Female",
      "profilePicture": "https://via.placeholder.com/150",
      "country": "Canada",
      "city": "Toronto",
      "phone": "+14165551234",
      "specialization": "Psychiatrist",
      "pmdcNumber": "112233445",
      "education": ["MBBS", "MSc in Psychiatry"],
      "licenseCertification": "LC-003",
      "cnicNumber": "34567-8901234-5",
      "availability": "Tuesday to Saturday, 8 AM to 4 PM",
      "feeRate": "CAD 180 per session",
      "bankAccountNumber": "3456-7890-1234",
      "appointments": [
        { "sessionId": "S005", "patientName": "Charlie Black" },
        { "sessionId": "S006", "patientName": "Daniel White" }
      ],
      "posts": [
        { "postId": "P005", "postedOn": "2024-05-05" },
        { "postId": "P006", "postedOn": "2024-06-01" }
      ]
    },
    {
      "id": "4",
      "name": "Dr. Michael Turner",
      "email": "michael.turner@gmail.com",
      "dateOfBirth": "1988-11-30",
      "gender": "Male",
      "profilePicture": "https://via.placeholder.com/150",
      "country": "Australia",
      "city": "Sydney",
      "phone": "+61234567890",
      "specialization": "Psychiatrist",
      "pmdcNumber": "564738291",
      "education": ["MBBS", "FRANZCP"],
      "licenseCertification": "LC-004",
      "cnicNumber": "45678-9012345-6",
      "availability": "Wednesday to Sunday, 9 AM to 5 PM",
      "feeRate": "AUD 200 per session",
      "bankAccountNumber": "4567-8901-2345",
      "appointments": [
        { "sessionId": "S007", "patientName": "Eva Gray" },
        { "sessionId": "S008", "patientName": "Frankie Blue" }
      ],
      "posts": [
        { "postId": "P007", "postedOn": "2024-07-10" },
        { "postId": "P008", "postedOn": "2024-08-15" }
      ]
    },
    {
      "id": "5",
      "name": "Dr. Olivia Wilson",
      "email": "olivia.wilson@gmail.com",
      "dateOfBirth": "1983-09-18",
      "gender": "Female",
      "profilePicture": "https://via.placeholder.com/150",
      "country": "UK",
      "city": "London",
      "phone": "+442078612345",
      "specialization": "Psychiatrist",
      "pmdcNumber": "672819304",
      "education": ["MBBS", "DPM"],
      "licenseCertification": "LC-005",
      "cnicNumber": "56789-0123456-7",
      "availability": "Monday to Friday, 10 AM to 6 PM",
      "feeRate": "GBP 120 per session",
      "bankAccountNumber": "5678-9012-3456",
      "appointments": [
        { "sessionId": "S009", "patientName": "George Yellow" },
        { "sessionId": "S010", "patientName": "Hannah Red" }
      ],
      "posts": [
        { "postId": "P009", "postedOn": "2024-08-20" },
        { "postId": "P010", "postedOn": "2024-09-01" }
      ]
    },
    {
      "id": "6",
      "name": "Dr. Liam Harris",
      "email": "liam.harris@gmail.com",
      "dateOfBirth": "1992-04-22",
      "gender": "Male",
      "profilePicture": "https://via.placeholder.com/150",
      "country": "India",
      "city": "Mumbai",
      "phone": "+919167543210",
      "specialization": "Psychiatrist",
      "pmdcNumber": "908172631",
      "education": ["MBBS", "DPM Psychiatry"],
      "licenseCertification": "LC-006",
      "cnicNumber": "67890-1234567-8",
      "availability": "Monday to Saturday, 11 AM to 7 PM",
      "feeRate": "INR 4000 per session",
      "bankAccountNumber": "6789-0123-4567",
      "appointments": [
        { "sessionId": "S011", "patientName": "Isla White" },
        { "sessionId": "S012", "patientName": "Jack Black" }
      ],
      "posts": [
        { "postId": "P011", "postedOn": "2024-09-10" },
        { "postId": "P012", "postedOn": "2024-10-05" }
      ]
    }
    // Add more doctor data here
  ];

  const handleDetails = (doctor: Doctor) => {
    navigate("/admin/doctors/doctor-details", { state: { doctor } });
  };

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg overflow-auto max-h-[470px] h-screen custom-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Find Doctors</h1>
          <input
            type="text"
            placeholder="Search by Name or Specialization"
            className="p-2 border rounded w-64"
          />
        </div>
        <p className="text-gray-500 mb-2">
          <span className="font-semibold">{doctorData.length} Results Found</span>
        </p>
        <div className="divide-y divide-gray-200">
          {doctorData.map((doctor) => (
            <div key={doctor.id} className="flex justify-between py-4">
              {/* Left Section: Doctor Details */}
              <div className="flex flex-col items-start min-w-[200px]">
                <p className="text-lg font-medium truncate">{doctor.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {doctor.specialization}
                </p>
              </div>

              {/* Right Section: Buttons */}
              <div className="flex-shrink-0 flex gap-2">
                <button
                  className="px-4 py-2 bg-[#F0F0F0] flex font-light border border-gray-300 text-primary rounded-lg shadow hover:bg-primary hover:text-white"
                  onClick={() => handleDetails(doctor)}
                >
                  <FaRegStickyNote className="w-4 h-7 mr-2" />
                  Details
                </button>
                <button className="px-4 py-2 flex bg-[#F0F0F0] font-light border border-gray-300 text-primary rounded-lg shadow hover:bg-primary hover:text-white">
                  <FaTrash className="w-4 h-7 mr-2" />
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

export default Doctors;
