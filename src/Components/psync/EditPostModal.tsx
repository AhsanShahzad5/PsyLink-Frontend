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
import { toast } from "@/hooks/use-toast";

interface PostData {
  postId: string;
  title: string;
  description: string;
  img: string;
}

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  postData: PostData;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ isOpen, onClose, setRefresh, postData }) => {
  const user = useRecoilValue(userAtom);
  const userId = user?._id;
  const [editFormData, setEditFormData] = useState({
    title: postData.title,
    description: postData.description,
    img: postData.img
  });
  const [loading, setLoading] = useState(false);

  // Image Upload
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { handleImageChange, imgUrl } = usePreviewImage();

  useEffect(() => {
    if (imgUrl) {
      setEditFormData((prev) => ({ ...prev, img: imgUrl }));
    }
  }, [imgUrl]);

  // Update form data when postData changes
  useEffect(() => {
    if (postData) {
      setEditFormData({
        title: postData.title,
        description: postData.description,
        img: postData.img
      });
    }
  }, [postData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async () => {
    if (!editFormData.title || !editFormData.description) {
      toast({
        description: "Title and description are required.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/psync/updatePost/${postData.postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: editFormData.title,
          description: editFormData.description,
          img: editFormData.img
        }),
      });

      if (response.ok) {
        toast({
          description: "Post updated successfully!",
          variant: "default" ,
          duration: 1000
        });
        setRefresh((prev) => !prev);
        onClose();
        // 🔄 Refresh the page or remove post from UI (modify as needed)
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast({
          description: errorData.error || "Failed to update post. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-xl font-semibold">Edit Post</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <input
            type="text"
            name="title"
            value={editFormData.title}
            onChange={handleInputChange}
            placeholder="Enter Post Title"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
          />
          <textarea
            name="description"
            value={editFormData.description}
            onChange={handleInputChange}
            placeholder="Write Something You want to express"
            className="w-full h-48 px-4 py-2 resize-none border border-gray-300 rounded-md"
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
          {editFormData.img && <img src={editFormData.img} alt="Preview" className="mt-4 rounded-[15px]" />}
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t flex justify-between items-center">
          <button 
            onClick={onClose} 
            className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-100"
          >
            Cancel
          </button>
          {loading ? (
            <LoadingComponent text="Updating..." />
          ) : (
            <button
              onClick={handleUpdateSubmit}
              className="bg-teal-600 text-white px-8 py-2 rounded-full hover:bg-teal-700"
            >
              Update Post
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostModal;