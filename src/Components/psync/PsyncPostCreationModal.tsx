import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useRecoilValue } from "recoil";
import userAtom from "@/atoms/userAtom";
import usePreviewImage from "@/hooks/usePreviewImage";
import { Input } from "@/Components/ui/input";
import LoadingComponent from "../LoadingComponent";



interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, setRefresh }) => {
  const user = useRecoilValue(userAtom);
  const userId = user?._id;
  const [postData, setPostData] = useState({ title: "", description: "", img: "" });
  const [loading, setLoading] = useState(false); // ✅ Loading state

  // Image Upload
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { handleImageChange, imgUrl } = usePreviewImage();

  useEffect(() => {
    if (imgUrl) {
      setPostData((prev) => ({ ...prev, img: imgUrl }));
    }
  }, [imgUrl]);

  const handlePostSubmit = async () => {
    if (!postData.title || !postData.description) {
      alert("Title and description are required.");
      return;
    }

    setLoading(true); // ✅ Set loading before request

    try {
      const response = await fetch("http://localhost:8000/api/psync/createPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: postData.title,
          description: postData.description,
          img: postData.img,
        }),
      });

      if (response.ok) {
        alert("Post created successfully!");
        setPostData({ title: "", description: "", img: "" });
        setRefresh((prev) => !prev); // ✅ Trigger refresh
        onClose();
      } else {
        alert("Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false); // ✅ Reset loading after request
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="hidden"></DialogTitle>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <img src="/src/assets/shared/abbad.png" alt="User avatar" className="w-12 h-12 rounded-full" />
              <span className="text-xl font-semibold">{user.name}</span>
            </div>
            <button className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700">
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
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
          />
          <textarea
            name="description"
            value={postData.description}
            onChange={handleInputChange}
            placeholder="Write Something You want to express"
            className="w-full h-48 resize-none border border-gray-300 rounded-md"
          />

          {/* Image Upload */}
          <Input type="file" ref={fileRef} className="hidden" onChange={handleImageChange} />
          <button onClick={() => fileRef.current?.click()} className="text-teal-600 hover:text-teal-700 mt-2">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
              <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" strokeWidth="2" />
              <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="currentColor" />
              <path d="M20 15l-5-5L5 20" strokeWidth="2" />
            </svg>
          </button>

          {/* Image Preview */}
          {postData.img && <img src={postData.img} alt="Preview" className="mt-4 rounded-[15px]" />}
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t flex justify-between items-center">
          {loading ? (
            <LoadingComponent text="Saving..." /> // ✅ Show Loader while Posting
          ) : (
            <button onClick={handlePostSubmit} className="bg-teal-600 text-white px-8 py-2 rounded-full hover:bg-teal-700">
              Post
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;
