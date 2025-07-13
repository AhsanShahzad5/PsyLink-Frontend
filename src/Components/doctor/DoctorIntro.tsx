import React, { useEffect, useState } from "react";
import { FaClock, FaMapMarkerAlt, FaPenAlt, FaStar, FaSpinner } from "react-icons/fa";

const DoctorIntro = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    specialisation: "",
    educationBackground: "",
    city: "",
    country: "",
    startTime: "",
    endTime: "",
    consultationFee: "",
  });

  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("/default-doctor.jpg"); // Better path, change if needed

  useEffect(() => {
    const fetchClinicDetails = async () => {
      setIsFetching(true);
      try {
        const response = await fetch("http://localhost:8000/api/doctor/clinic-details", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setFormData(prev => ({
            ...prev,
            ...data.clinic,
          }));
  
          if (data.clinic.image) {
            setImagePreview(data.clinic.image);
          }
        }
      } catch (err) {
        console.error("Error fetching clinic details", err);
      } finally {
        setIsFetching(false);
      }
    };
  
    fetchClinicDetails();
  }, []);
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let base64Image = "";
  
      if (newImage) {
        base64Image = await toBase64(newImage) as string;
      }
  
      const response = await fetch("http://localhost:8000/api/doctor/clinic-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          image: base64Image, // add base64 encoded image if available
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        setFormData(prevState => ({
          ...prevState,
          ...data.clinic,
        }));
  
        if (data.clinic.image) {
          setImagePreview(data.clinic.image); // Update preview after saving
        }
  
        setIsEditing(false);
      } else {
        alert("Failed to save clinic details.");
      }
    } catch (err) {
      console.error("Error saving clinic details", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  
  

  const safeDisplay = (text, placeholder = "Not available") => {
    if (typeof text === "string") {
      return text.trim() !== "" ? text : placeholder;
    }
    if (typeof text === "number") {
      return text.toString();
    }
    return placeholder;
  };

  const formatTime = (time24) => {
    if (!time24) return "";
    const [hoursStr, minutes] = time24.split(":");
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? "" : "";
    hours = hours % 12 || 12; // 0 -> 12
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };
  

  return (
    <div className="bg-[#F5FAFE] border border-[#D6E4EF] shadow-md rounded-lg p-6">
      <div className="flex justify-between mb-8">
        <h2 className="text-[1.8rem] ml-4">Your personal details</h2>
        <FaPenAlt
          size={28}
          className="cursor-pointer text-gray-600 hover:text-primary transition-all"
          onClick={() => setIsEditing(true)}
        />
      </div>

      {isFetching ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner size={40} className="text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
          {/* Doctor Image Section */}
          <div className="sm:col-span-3 flex flex-col items-center">
            <div className="sm:col-span-3 flex justify-center">
              <img
                src={imagePreview}
                className="w-[160px] h-[240px] sm:w-[285px] sm:h-[355px] bg-gray-200 rounded-lg object-cover"
                alt="img"
              />
            </div>
            {isEditing && (
              <div className="flex flex-col items-center w-full max-w-xs space-y-3">
                <label className="w-full">
                  <div className="flex flex-col items-center px-4 py-3 bg-white rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 transition">
                    <span className="text-sm font-medium text-gray-700">Choose new photo</span>
                    <span className="text-xs text-gray-500">JPG, PNG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </label>
              </div>
            )}
          </div>


          {/* Doctor Info Section */}
          <div className="sm:col-span-6 relative flex flex-col">
            <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#222] leading-[28px]">
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="text-[22px] sm:text-[24px] border-b-2 outline-none w-full"
                />
              ) : (
                safeDisplay(formData.fullName, "Full Name not set")
              )}
            </h1>

            <p className="text-[16px] sm:text-[18px] font-light text-[#333] mt-5">
              {isEditing ? (
                <input
                  type="text"
                  name="specialisation"
                  placeholder="Specialisation"
                  value={formData.specialisation}
                  onChange={handleInputChange}
                  className="border-b-2 outline-none w-full"
                />
              ) : (
                safeDisplay(formData.specialisation, "Specialisation not set")
              )}
            </p>

            <p className="text-[16px] sm:text-[18px] font-light text-[#333] mt-5">
              {isEditing ? (
                <input
                  type="text"
                  name="educationBackground"
                  placeholder="Education Background"
                  value={formData.educationBackground}
                  onChange={handleInputChange}
                  className="border-b-2 outline-none w-full"
                />
              ) : (
                safeDisplay(formData.educationBackground, "Education not set")
              )}
            </p>

            <p className="text-[14px] sm:text-[16px] font-medium text-[#707070] flex items-center mt-6">
              <FaMapMarkerAlt className="text-primary mr-2" />
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="border-b-2 outline-none mr-2"
                  />
                  -
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="border-b-2 outline-none ml-2"
                  />
                </>
              ) : (
                `${safeDisplay(formData.city, "City")} - ${safeDisplay(formData.country, "Country")}`
              )}
            </p>
            <p className="text-[16px] sm:text-[18px] font-light text-[#222] mt-4">
              {isEditing ? (
                <input
                  type="number"
                  name="consultationFee"
                  placeholder="Consultation Fee"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  className="border-b-2 outline-none"
                />
              ) : (
                `Rs${safeDisplay(formData.consultationFee, "Fee not set")}`
              )}
            </p>
          </div>

          {/* Clinic Timing and Fee */}
          <div className="sm:col-span-3 text-center flex flex-col justify-center items-center gap-2">
            {/* <p className="text-[16px] sm:text-[18px] font-light text-[#222] flex items-center gap-2">
              <FaClock className="text-primary" />
              {isEditing ? (
                <>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="border-b-2 outline-none"
                  />
                  -
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="border-b-2 outline-none"
                  />
                </>
              ) : (
                <>
                  {formatTime(formData.startTime)} - {formatTime(formData.endTime)}
                </>
              )}
            </p> */}


           

            {isEditing && (
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="mt-4 bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2 rounded-lg shadow-md transition flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorIntro;