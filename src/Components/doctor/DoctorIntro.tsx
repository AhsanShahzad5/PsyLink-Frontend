import { FaClock, FaMapMarkerAlt, FaPenAlt, FaStar } from "react-icons/fa";

const DoctorIntro = () => {
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
                        Dr Fahad Tariq Aziz
                    </h1>
                    <p className="text-[16px] sm:text-[18px] font-light text-[#333] mt-5">
                        Psychologist
                    </p>
                    <p className="text-[16px] sm:text-[18px] font-light text-[#333] mt-5">
                        MBBS, Mphil, FCPS
                    </p>
                    <p className="text-[14px] sm:text-[16px] font-medium text-[#707070] flex items-center mt-6">
                        <FaMapMarkerAlt className="text-primary mr-2" />
                        H-Block, Street #18, Sector-D, Johar Town, Lahore
                    </p>
                </div>

                {/* Timings and Fee Section */}
                <div className="sm:col-span-3 text-center flex flex-col justify-center items-center gap-2">
                    <p className="text-[16px] sm:text-[18px] font-light text-[#222] flex items-center gap-2">
                        <FaClock className="text-primary" /> 12:30pm - 8:00pm
                    </p>
                    <p className="text-[16px] sm:text-[18px] font-light text-[#222] mt-4">
                        Rs.1400
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
