import React, { useState } from "react";
import { Search, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useRecoilValue } from "recoil";
import userAtom from "@/atoms/userAtom";



interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose }) => {
  const user = useRecoilValue(userAtom);
  const userId = user?._id;
  const [postData, setPostData] = useState({
    title: "",
    description: "",
  });

  const handlePostSubmit = async () => {
    if (!postData.title || !postData.description) {
      alert("Title and description are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/psync/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId, // Replace this with the actual `userId` from context or Recoil
          title: postData.title,
          description: postData.description,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Post created successfully!");
        // Reset the form and close modal
        setPostData({ title: "", description: "" });
        onClose();
      } else {
        console.error("Failed to create post:", result.error);
        alert("Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 rounded-3xl">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="hidden"></DialogTitle>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/shared/abbad.png"
                alt="User avatar"
                className="w-12 h-12 rounded-full"
              />
              <span className="text-xl font-semibold">Alex Russo</span>
            </div>
            <button className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12.86 2.86l1.33 3.13l3.11 1.46c1.59.75 2.13 2.89.96 4.28l-2.13 2.53l.53 3.27c.28 1.73-1.46 3.14-3.07 2.49l-2.98-1.2l-2.98 1.2c-1.61.65-3.35-.76-3.07-2.49l.53-3.27l-2.13-2.53c-1.16-1.39-.63-3.53.96-4.28l3.11-1.46l1.33-3.13C8.86 1.29 10.74 1.29 12.86 2.86z" />
              </svg>
              Add In Series
            </button>
          </div>
        </DialogHeader>

        <div className="p-6">
          <input
            type="text"
            name="title"
            value={postData.title}
            onChange={handleInputChange}
            placeholder="Enter Post Title"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <textarea
            name="description"
            value={postData.description}
            onChange={handleInputChange}
            placeholder="Write Something You would want to express"
            className="w-full h-48 resize-none border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg placeholder:text-gray-400"
          />
        </div>

        <div className="p-4 border-t flex justify-between items-center">
          <button className="text-teal-600 hover:text-teal-700">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
                strokeWidth="2"
              />
              <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="currentColor" />
              <path d="M20 15l-5-5L5 20" strokeWidth="2" />
            </svg>
          </button>
          <button
            onClick={handlePostSubmit}
            className="bg-teal-600 text-white px-8 py-2 rounded-full hover:bg-teal-700"
          >
            Post
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


const CommunityHeader = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-[2rem] shadow-sm p-8 flex flex-col items-center">
      {/* Header with Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
          {/* Globe icon */}
          <svg
            className="w-7 h-7 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M2 12h20" strokeWidth="2" />
            <path
              d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
              strokeWidth="2"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold">PsyLink Community - Psync</h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for Series"
          className="w-[50rem] py-4 pl-12 pr-4 rounded-full bg-[#e8f4f4] text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-700 transition-colors"
        >
          {/* Plus icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z" />
          </svg>
          Add a Post
        </button>

        <button className="flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-700 transition-colors">
          {/* Star-like icon for Post in Series */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12.86 2.86l1.33 3.13l3.11 1.46c1.59.75 2.13 2.89.96 4.28l-2.13 2.53l.53 3.27c.28 1.73-1.46 3.14-3.07 2.49l-2.98-1.2l-2.98 1.2c-1.61.65-3.35-.76-3.07-2.49l.53-3.27l-2.13-2.53c-1.16-1.39-.63-3.53.96-4.28l3.11-1.46l1.33-3.13C8.86 1.29 10.74 1.29 12.86 2.86z" />
          </svg>
          Post in Series
        </button>

        <button className="flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-700 transition-colors">
          {/* Heart icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          Favourites
        </button>
        <button className="flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-full hover:bg-teal-700 transition-colors">
          {/* Heart icon */}
          <User className="w-5 h-5" />
          My Posts
        </button>
      </div>

      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </div>
  );
};

export default CommunityHeader;
