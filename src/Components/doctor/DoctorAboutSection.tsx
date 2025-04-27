import React, { useState, useEffect } from "react";
import { FaPenAlt } from "react-icons/fa";

const defaultDescription =
  "Hi! I'm here to provide expert care and support for your mental wellness journey.";
const defaultImage = "/default-doctor.jpg";

const isValidImageUrl = (image: string) => {
  return image.startsWith("http://") || image.startsWith("https://");
};

const DoctorAboutSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
  });
  const [imagePreview, setImagePreview] = useState(defaultImage);
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchClinicDetails = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/doctor/clinic-details",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("ABOUT ",data)
          setFormData((prev) => ({
            ...prev,
            ...data.clinic,
          }));

          if (data.clinic.image) {
            setImagePreview(data.clinic.image);
          }
        }
      } catch (err) {
        console.error("Error fetching clinic details", err);
      }
    };

    fetchClinicDetails();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSave = async () => {
    try {
      let base64Image = "";

      if (newImage) {
        base64Image = (await toBase64(newImage)) as string;
      }

      const response = await fetch(
        "http://localhost:8000/api/doctor/clinic-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...formData,
            image: base64Image, // new image if updated
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          ...data.clinic,
        }));

        if (data.clinic.image) {
          setImagePreview(data.clinic.image);
        }

        setIsEditing(false);
        setNewImage(null);
      } else {
        alert("Failed to save clinic details.");
      }
    } catch (err) {
      console.error("Error saving clinic details", err);
    }
  };

  return (
    <div className="bg-white rounded-lg p-5 my-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[2rem] font-bold">About Your Clinic</h2>
        <FaPenAlt
          size={30}
          className="cursor-pointer text-gray-600 hover:text-black transition"
          onClick={() => setIsEditing(true)}
        />
      </div>
      <div className="w-full h-1 bg-gray-300 mb-6"></div>

      <div className="flex flex-wrap md:flex-nowrap gap-8">
        <div className="flex-1">
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              placeholder="Write something about your clinic..."
              className="w-full h-[300px] p-4 border border-gray-300 rounded-md resize-none"
            />
          ) : (
            <p className="text-[1.1rem] leading-relaxed whitespace-pre-line">
              {formData.description || defaultDescription}
            </p>
          )}
        </div>

        <div className="relative w-full md:w-[23vw] h-[70vh] rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
              src={imagePreview}
              className="w-[200px] h-[180px] sm:w-[315px] sm:h-[285px] bg-gray-200 rounded-lg"
              alt="img"
            />
          {isEditing && (
            <div className="absolute mt-4 flex flex-col gap-2">
              <label className="bg-blue-600 text-white text-center py-2 px-4 rounded cursor-pointer hover:bg-blue-700 transition">
                Change Image
                <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
              </label>
              <span className="text-sm text-gray-500 text-center">
                PNG, JPG up to 2MB
              </span>
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorAboutSection;
