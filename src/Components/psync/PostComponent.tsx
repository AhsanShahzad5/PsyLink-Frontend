import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userAtom from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";
import { toast } from "@/hooks/use-toast";
import { FaPenAlt } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/Components/ui/alert-dialog";
import { Badge } from "../ui/badge";
import EditPostModal from "./EditPostModal"; // Import the new component

export interface PostProps {
  postId: string;
  authoreRole?: string;
  authorName: string;
  authorImage?: string;
  content: string;
  timeAgo: string;
  likes: number;
  comments: number;
  image?: string;
  title?: string;
  isFavorited?: boolean;
  authorId?: string;
  seriesTitle?: string;
  roleOfLoggedInUser?: string;
}

const Post = ({
  authorName,
  authorImage,
  authoreRole,
  content,
  timeAgo,
  likes,
  comments,
  image,
  title,
  postId,
  authorId,
  seriesTitle,
  roleOfLoggedInUser
}: PostProps) => {
  const user = useRecoilValue(userAtom);
  const userId = user?._id;
  const [likeCount, setLikeCount] = useState(likes);
  const [commentCount, setCommentCount] = useState(comments);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/psync/likeUnlikePost/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();
      if (response.ok) {
        setLikeCount(result.message === "Post unliked successfully" ? likeCount - 1 : likeCount + 1);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handleFavorite = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/psync/addToFavourites/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();
      if (response.ok) {
        setIsFavorited(true);
        toast({
          description: "Post added to favorites!",
          variant: "default",
          duration: 1000,
        });
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error adding post to favorites:", error);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await fetch(`http://localhost:8000/api/psync/commentOnPost/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, comment: commentText }),
      });

      const result = await response.json();
      if (response.ok) {
        setCommentCount(commentCount + 1);
        setCommentText(""); // Clear input after posting
        setShowCommentBox(false); // Hide input after posting
        toast({
          description: "comment added successfully!",
          variant: "default",
          duration: 1000,
        });
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  const navigate = useNavigate();

  const handlePostDelete = async () => {
    try {
      // Check if current user is admin and include that in the request body
      const isAdmin = roleOfLoggedInUser === "admin"; // Assuming you have access to userRole
      
      const response = await fetch(`http://localhost:8000/api/psync/deletePost/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId,
          isAdmin // Send this flag to the backend
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast({
          description: "Post deleted successfully!",
          variant: "default",
          duration: 1000,
        });
  
        // 🔄 Refresh the page or remove post from UI (modify as needed)
        window.location.reload();
  
      } else {
        toast({
          description: result.error || "Failed to delete post",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        description: "An error occurred while deleting the post.",
        variant: "destructive",
      });
    }
  };

  // Function to open edit modal
  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  // Create post data object for edit modal
  const postDataForEdit = {
    postId,
    title: title || "",
    description: content,
    img: image || ""
  };

  // Effect to refresh the component when post is updated
  useEffect(() => {
    if (refresh) {
      // You could fetch updated post data here if needed
      setRefresh(false);
    }
  }, [refresh]);

  return (
    <>
      <Card className="mt-[25px] bg-white rounded-[10px] overflow-hidden shadow-sm">
        <CardContent className="p-3 sm:p-5 cursor-pointer">
          <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
              <AvatarImage src={authorImage} alt={authorName} />
              <AvatarFallback className="bg-teal-600 text-white">{authorName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-1 sm:mb-0">
                  <div className="flex flex-wrap gap-2 items-center">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">{authorName}</h3>
                    {authoreRole === "doctor" &&
                      <Badge className="bg-transparent border-teal-300 text-primary pointer-events-none text-xs">
                        {authoreRole}
                      </Badge>
                    }
                  </div>
                  <p className="text-xs sm:text-sm text-teal-600 truncate">{seriesTitle}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">

                  {(authorId === userId || authoreRole === 'admin') ? (
                    <div className="flex gap-3">
                      {authorId === userId && (
                        <FaPenAlt
                          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 cursor-pointer hover:text-teal-600 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick();
                          }}
                        />
                      )}
                      <DeleteButton onClick={handlePostDelete} />
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">{timeAgo}</span>
                  )}

                </div>
              </div>
            </div>
          </div>

          {/* content div to open full post */}
          <div onClick={() => navigate(`/${authoreRole}/psync/post/${postId}` 
            
            )} 
          
          className="w-full">
            {title && <h1 className="text-gray-800 mb-2 sm:mb-4 font-bold text-lg sm:text-xl leading-tight">{title}</h1>}
            <p className="text-gray-800 w-full mb-4">
              {content}
            </p>

            {image && (
              <div className="mb-3 sm:mb-4 rounded-lg sm:rounded-2xl overflow-hidden">
                <img src={image} alt="Post content" className="w-full h-auto object-cover" />
              </div>
            )}
            <div className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-4">
              {likeCount} Likes, {commentCount} Comments
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-gray-100 p-2 sm:p-3">
          <div className="flex flex-row w-full gap-1 sm:gap-2">

            <button
              onClick={authoreRole === 'admin' ? undefined : handleLike}
              className={`flex items-center justify-center gap-1 sm:gap-2 ${authoreRole === 'admin'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700'
                } text-white px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-full transition-colors flex-1 text-xs sm:text-base`}
              disabled={authoreRole === 'admin'}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="hidden xs:inline">{authoreRole === 'admin' ? 'View Only' : 'Like'}</span>
            </button>

            <button
              onClick={authoreRole === 'admin' ? undefined : () => setShowCommentBox(!showCommentBox)}
              className={`flex items-center justify-center gap-1 sm:gap-2 ${authoreRole === 'admin'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700'
                } text-white px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-full transition-colors flex-1 text-xs sm:text-base`}
              disabled={authoreRole === 'admin'}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="hidden xs:inline">{authoreRole === 'admin' ? 'View Only' : 'Comment'}</span>
            </button>

            <button
              onClick={authoreRole === 'admin' ? undefined : handleFavorite}
              className={`flex items-center justify-center gap-1 sm:gap-2 ${authoreRole === 'admin'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700'
                } text-white px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-full transition-colors flex-1 text-xs sm:text-base`}
              disabled={authoreRole === 'admin'}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
              <span className="hidden xs:inline">{authoreRole === 'admin' ? 'View Only' : 'Favorite'}</span>
            </button>


          </div>
        </CardFooter>

        {/* Dynamic Comment Box */}
        {showCommentBox && (
          <div className="p-3 sm:p-4 bg-gray-100 border-t border-gray-200">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border rounded-lg text-sm focus:ring focus:ring-teal-300 focus:outline-none"
            />
            <button
              onClick={handleComment}
              className="mt-2 bg-teal-600 text-white px-3 py-1.5 text-sm sm:px-4 sm:py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Submit
            </button>
          </div>
        )}
      </Card>

      {/* Edit Post Modal */}
      {isEditModalOpen && (
        <EditPostModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          setRefresh={setRefresh}
          postData={postDataForEdit}
        />
      )}
    </>
  );
};

export const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    onClick(); // Call the original delete handler
    setIsConfirmOpen(false);
  };

  return (
    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <AlertDialogTrigger asChild>
        <FaTrash
          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 cursor-pointer hover:text-teal-600 transition-colors duration-200"
          onClick={handleDeleteClick}
        />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white border-teal-500 border-2 max-w-[90%] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-teal-700 text-lg">
            Are you sure you want to delete?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-black text-sm">
            This action cannot be undone. This will permanently delete the item.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="bg-primary text-white border-teal-500 hover:bg-teal-700 text-sm sm:text-base">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            className="bg-red-700 hover:bg-red-800 text-white text-sm sm:text-base"
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Post;