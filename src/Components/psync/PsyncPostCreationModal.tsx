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
import { ChevronDown, Plus, X } from "lucide-react";

// Dummy series data
const INITIAL_SERIES = [
  { id: 1, name: "Series 1" },
  { id: 2, name: "Series 2" },
  { id: 3, name: "Series 3" }
];

interface Series {
  id: number;
  name: string;
}

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, setRefresh }) => {
  const user = useRecoilValue(userAtom);
  const userId = user?._id;
  const [postData, setPostData] = useState({ title: "", description: "", img: "" });
  const [loading, setLoading] = useState(false);
  const [series, setSeries] = useState<Series[]>(INITIAL_SERIES);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [isSeriesDropdownOpen, setIsSeriesDropdownOpen] = useState(false);
  const [isCreatingNewSeries, setIsCreatingNewSeries] = useState(false);
  const [newSeriesName, setNewSeriesName] = useState("");

  // Image Upload
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { handleImageChange, imgUrl } = usePreviewImage();

  useEffect(() => {
    if (imgUrl) {
      setPostData((prev) => ({ ...prev, img: imgUrl }));
    }
  }, [imgUrl]);

  // Reset state when modal is closed or reopened
  useEffect(() => {
    if (!isOpen) {
      setSelectedSeries(null);
      setPostData({ title: "", description: "", img: "" });
      setIsSeriesDropdownOpen(false);
      setIsCreatingNewSeries(false);
      setNewSeriesName("");
    }
  }, [isOpen]);

  const handlePostSubmit = async () => {
    if (!postData.title || !postData.description) {
      toast({
        description: "Title and description are required.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/psync/createPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: postData.title,
          description: postData.description,
          img: postData.img,
          seriesId: selectedSeries?.id, // Now optional
        }),
      });

      if (response.ok) {
        toast({
          description: "Post created successfully!",
          variant: "default"
        });
        setPostData({ title: "", description: "", img: "" });
        setRefresh((prev) => !prev);
        onClose();
      } else {
        alert("Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSeriesSelect = (clickedSeries: Series) => {
    // If no series is selected or a different series is clicked
    if (!selectedSeries || selectedSeries.id !== clickedSeries.id) {
      setSelectedSeries(clickedSeries);
      console.log("Selected Series:", clickedSeries.name);
    } 
    // If the same series is clicked again, unselect it
    else if (selectedSeries.id === clickedSeries.id) {
      setSelectedSeries(null);
      console.log("Unselected Series:", clickedSeries.name);
    }
    
    setIsSeriesDropdownOpen(false);
  };

  const handleCreateNewSeries = () => {
    if (newSeriesName.trim()) {
      const newSeries = {
        id: series.length + 1,
        name: newSeriesName.trim()
      };
      setSeries([...series, newSeries]);
      setSelectedSeries(newSeries);
      setIsCreatingNewSeries(false);
      setNewSeriesName("");
      console.log("Created and Selected New Series:", newSeries);
    }
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
            <div className="relative">
              {selectedSeries ? (
                <button 
                  onClick={() => setIsSeriesDropdownOpen(!isSeriesDropdownOpen)}
                  className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 flex items-center hover:text-black"
                >
                  {selectedSeries.name}
                  <ChevronDown className="ml-2 w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={() => setIsSeriesDropdownOpen(!isSeriesDropdownOpen)}
                  className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 flex items-center"
                >
                  Select Series
                  <ChevronDown className="ml-2 w-4 h-4" />
                </button>
              )}
              
              {isSeriesDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
                  {series.map((seriesItem) => (
                    <button
                      key={seriesItem.id}
                      onClick={() => handleSeriesSelect(seriesItem)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between
                        ${selectedSeries?.id === seriesItem.id 
                          ? 'bg-teal-600 text-white' 
                          : ''}`}
                    >
                      {seriesItem.name}
                      {selectedSeries?.id === seriesItem.id && (
                        <span className="text-white">✓</span>
                      )}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setIsCreatingNewSeries(true);
                      setIsSeriesDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-teal-600"
                  >
                    <Plus className="mr-2 w-4 h-4" /> Create New Series
                  </button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

      
        {/* New Series Creation Popup */}
        {isCreatingNewSeries && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
              <button 
                onClick={() => setIsCreatingNewSeries(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold mb-4">Create New Series</h2>
              <input
                type="text"
                value={newSeriesName}
                onChange={(e) => setNewSeriesName(e.target.value)}
                placeholder="Enter new series name"
                className="w-full px-3 py-2 border rounded-md mb-4"
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsCreatingNewSeries(false)}
                  className="text-gray-600 hover:text-gray-800 mr-2"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateNewSeries}
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

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
            <LoadingComponent text="Saving..." />
          ) : (
            <button 
              onClick={handlePostSubmit} 
              className="bg-teal-600 text-white px-8 py-2 rounded-full hover:bg-teal-700"
            >
              Post
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;