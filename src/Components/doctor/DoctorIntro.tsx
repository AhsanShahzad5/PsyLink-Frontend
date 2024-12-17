import { useState, useEffect } from "react";
import { FaClock, FaMapMarkerAlt, FaPenAlt, FaStar } from "react-icons/fa";

const DoctorIntro = () => {
    const [clinicDetails, setClinicDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch clinic details
    useEffect(() => {
        const fetchClinicDetails = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/doctor/get/clinic-details', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include cookies
                });

                if (response.ok) {
                    const data = await response.json();
                    setClinicDetails(data.clinic); // Assuming the API returns { clinic: {...} }
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || "Failed to fetch clinic details");
                }
            } catch (err) {
                return "Error while getting clinic data"
            } finally {
                setLoading(false);
            }
        };

        fetchClinicDetails();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!clinicDetails) {
        return <div>No clinic details available</div>;
    }

    const {
        fullName,
        specialisation,
        educationBackground,
        image,
        city,
        country,
        startTime,
        endTime,
        consultationFee,
    } = clinicDetails;

    
    return (
        <div className="bg-[#F5FAFE] border border-[#D6E4EF] shadow-md rounded-lg p-6">
            <div className="flex justify-between mb-5">

                    <h2 className="text-[2rem] font-bold  "> Your personal details</h2>
                    <FaPenAlt size={30} className="cursor-pointer text-gray-700" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                {/* Image Section */}
                <div className="sm:col-span-3 flex flex-col items-center">

                    <img
                        src="/src/assets/patient/doctor/doctor.jpg"
                        className="w-[200px] h-[180px] sm:w-[315px] sm:h-[285px] bg-gray-200 rounded-lg object-cover"
                        alt="Doctor"
                    />
                    <button className="mt-4 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm">
                        Change Photo
                    </button>
                </div>

                {/* Info Section */}
                <div className="sm:col-span-6 relative flex flex-col">
                    {/* Pencil Icon */}
                    
                    <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#222] leading-[28px]">
                        {fullName}
                    </h1>
                    <p className="text-[16px] sm:text-[18px] font-light text-[#333] mt-5">
                        {specialisation}
                    </p>
                    <p className="text-[16px] sm:text-[18px] font-light text-[#333] mt-5">
                        {educationBackground}
                    </p>
                    <p className="text-[14px] sm:text-[16px] font-medium text-[#707070] flex items-center mt-6">
                        <FaMapMarkerAlt className="text-primary mr-2" />
                        {city} - {country}
                    </p>
                </div>

                {/* Timings and Fee Section */}
                <div className="sm:col-span-3 text-center flex flex-col justify-center items-center gap-2">
                    <p className="text-[16px] sm:text-[18px] font-light text-[#222] flex items-center gap-2">
                        <FaClock className="text-primary" /> {startTime} - {endTime}
                    </p>
                    <p className="text-[16px] sm:text-[18px] font-light text-[#222] mt-4">
                        {consultationFee}
                    </p>
                    <p className="text-[14px] sm:text-[16px] font-light text-[#2C43D6] underline flex items-center gap-1">
                        <FaStar className="text-[#FFD700]" /> 4.8 (224 reviews)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DoctorIntro;
