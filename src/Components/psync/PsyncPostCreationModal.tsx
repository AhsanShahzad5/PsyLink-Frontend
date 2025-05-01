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
import useUserDetails from "@/hooks/useUserDetails";

interface Series {
  id: string;
  name: string;
}

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  preSelectedSeries?: Series; // Pre-selected series
  Series?: string;
  autoCreateSeries?: boolean; // New prop to automatically open series creation
}

const PostModal: React.FC<PostModalProps> = ({ 
  isOpen, 
  onClose, 
  setRefresh, 
  preSelectedSeries, 
  Series = "post",
  autoCreateSeries = false // Default to false to maintain backward compatibility
}) => {
  const user = useRecoilValue(userAtom);
  const userId = user?._id;
  const [postData, setPostData] = useState({ title: "", description: "", img: "" });
  const [loading, setLoading] = useState(false);
  const [series, setSeries] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [isSeriesDropdownOpen, setIsSeriesDropdownOpen] = useState(false);
  const [isCreatingNewSeries, setIsCreatingNewSeries] = useState(false);
  const [newSeriesName, setNewSeriesName] = useState("");
  const [isLoadingSeries, setIsLoadingSeries] = useState(false);
  const [newSeriesCreated, setNewSeriesCreated] = useState<Series | null>(null);
  interface UserDetails {
    profilePicture?: string;
    name?: string;
  }
  

  // Image Upload
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { handleImageChange, imgUrl } = usePreviewImage();

  useEffect(() => {
    if (imgUrl) {
      setPostData((prev) => ({ ...prev, img: imgUrl }));
    }
  }, [imgUrl]);

  // Set the pre-selected series when modal opens
  useEffect(() => {
    if (isOpen && preSelectedSeries) {
      setSelectedSeries(preSelectedSeries);
    }
  }, [isOpen, preSelectedSeries]);

  // Auto open series creation box when autoCreateSeries is true
  useEffect(() => {
    if (isOpen && autoCreateSeries && !preSelectedSeries) {
      setIsCreatingNewSeries(true);
    }
  }, [isOpen, autoCreateSeries, preSelectedSeries]);

  // Fetch user's series when modal opens (only if no preSelectedSeries)
  useEffect(() => {
    const fetchSeries = async () => {
      if (!userId || preSelectedSeries) return;

      setIsLoadingSeries(true);
      try {
        const response = await fetch(`http://localhost:8000/api/psync/series/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched series:", data);
          // Map the backend data structure to match frontend structure
          setSeries(data.map((item: any) => ({
            id: item._id,
            name: item.title
          })));
        } else {
          console.error("Failed to fetch series");
        }
      } catch (error) {
        console.error("Error fetching series:", error);
      } finally {
        setIsLoadingSeries(false);
      }
    };

    if (isOpen && userId && !preSelectedSeries) {
      fetchSeries();
    }
  }, [isOpen, userId, preSelectedSeries]);

  // Reset state when modal is closed or reopened
  useEffect(() => {
    if (!isOpen) {
      // Don't reset selectedSeries if preSelectedSeries is provided
      if (!preSelectedSeries) {
        setSelectedSeries(null);
      }
      setNewSeriesCreated(null);
      setPostData({ title: "", description: "", img: "" });
      setIsSeriesDropdownOpen(false);
      setIsCreatingNewSeries(false);
      setNewSeriesName("");
    }
  }, [isOpen, preSelectedSeries]);



  const { user:userDetails } = useUserDetails(userId);


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
      let response;

      // Case 1: Creating a new series with a post
      if (newSeriesCreated || (isCreatingNewSeries && newSeriesName.trim())) {
        const seriesTitle = newSeriesCreated ? newSeriesCreated.name : newSeriesName.trim();

        try {
          console.log("Attempting to create new series with post:", {
            title: seriesTitle,
            userId: userId,
            postTitle: postData.title,
            postDescription: postData.description,
            img: postData.img
          });

          response = await fetch("http://localhost:8000/api/psync/series/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: seriesTitle,
              userId: userId,
              postTitle: postData.title,
              postDescription: postData.description,
              img: postData.img
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error("Server error creating series:", {
              status: response.status,
              statusText: response.statusText,
              errorData
            });
            throw new Error(`Failed to create series: ${response.status} ${response.statusText}${errorData ? ' - ' + JSON.stringify(errorData) : ''}`);
          }

          const responseData = await response.json();
          console.log("Series creation successful:", responseData);

          // Check if the series was actually created in the response
          if (!responseData.series || !responseData.series.id) {
            console.warn("Series may not have been created properly:", responseData);
          }
        } catch (error) {
          console.error("Error creating series with post:", error);
          throw error;
        }
      }
      // Case 2: Adding post to an existing series
      else if (selectedSeries) {
        response = await fetch("http://localhost:8000/api/psync/series/add-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: postData.title,
            seriesId: selectedSeries.id,
            userId,
            description: postData.description,
            img: postData.img
          }),
        });
      }
      // Case 3: Creating a standalone post
      else {
        response = await fetch("http://localhost:8000/api/psync/createPost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            title: postData.title,
            description: postData.description,
            img: postData.img,
            series: [] // Empty array as no series is selected
          }),
        });
      }

      if (response.ok) {
        toast({
          description: `${Series} created successfully!`,
          variant: "default"
        });
        setPostData({ title: "", description: "", img: "" });
        setRefresh((prev) => !prev);
        onClose();
      } else {
        const errorData = await response.json();
        toast({
          description: errorData.error || "Failed to create post. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSeriesSelect = (clickedSeries: Series) => {
    // Reset new series created state when selecting an existing series
    setNewSeriesCreated(null);

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
      // Create a temporary series object with a temporary ID
      const tempNewSeries = {
        id: `temp-${Date.now()}`,
        name: newSeriesName.trim()
      };

      // Add the new series to the list
      setSeries([...series, tempNewSeries]);

      // Store the new series separately to track that it's newly created
      setNewSeriesCreated(tempNewSeries);

      // Reset selection and creation state
      setSelectedSeries(null);
      setIsCreatingNewSeries(false);
      setNewSeriesName("");

      toast({
        description: `Series "${tempNewSeries.name}" will be created when you submit the post`,
        variant: "default"
      });
    } else {
      toast({
        description: "Series name cannot be empty",
        variant: "destructive"
      });
    }
  };

  // Determine what to display in the series button
  const getSeriesButtonText = () => {
    if (newSeriesCreated) {
      return `New: ${newSeriesCreated.name}`;
    } else if (selectedSeries) {
      return selectedSeries.name;
    } else if (isCreatingNewSeries) {
      return "Creating New Series";
    } else {
      return "Select Series";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="hidden"></DialogTitle>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <img src={userDetails?.profilePicture || ""} alt="User avatar" className="w-12 h-12 rounded-full" />
              <span className="text-xl font-semibold">{user?.name}</span>
            </div>
            {/* Only show series selector if not pre-selected */}
            {!preSelectedSeries && (
              <div className="relative">
                <button
                  onClick={() => !isCreatingNewSeries && setIsSeriesDropdownOpen(!isSeriesDropdownOpen)}
                  className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 flex items-center"
                >
                  {getSeriesButtonText()}
                  {newSeriesCreated ? (
                    <X
                      className="ml-2 w-4 h-4 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewSeriesCreated(null);
                        // Remove the temporary series from the list
                        setSeries(series.filter(s => s.id !== newSeriesCreated.id));
                      }}
                    />
                  ) : !isCreatingNewSeries && (
                    <ChevronDown className="ml-2 w-4 h-4" />
                  )}
                </button>

                {isSeriesDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-10">
                    {isLoadingSeries ? (
                      <div className="px-4 py-2 text-center">Loading series...</div>
                    ) : series.length > 0 ? (
                      series.map((seriesItem) => (
                        <button
                          key={seriesItem.id}
                          onClick={() => handleSeriesSelect(seriesItem)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between
                            ${selectedSeries?.id === seriesItem.id
                              ? 'bg-teal-600 text-white'
                              : ''}`}
                        >
                          {seriesItem.name}
                          {seriesItem.id === newSeriesCreated?.id && " (New)"}
                          {selectedSeries?.id === seriesItem.id && (
                            <span className="text-white">✓</span>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-center text-gray-500">No series found</div>
                    )}
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
            )}
            {/* Show pre-selected series as disabled button */}
            {preSelectedSeries && (
              <div className="relative">
                <button
                  className="bg-teal-600 text-white px-6 py-2 rounded-full cursor-default flex items-center"
                >
                  {preSelectedSeries.name}
                </button>
              </div>
            )}
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
                autoFocus
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
              {preSelectedSeries ? "Add to Series" : "Post"}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;