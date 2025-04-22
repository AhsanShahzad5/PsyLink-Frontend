import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userAtom from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";
import { toast } from "@/hooks/use-toast";

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



export interface PostProps {
  postId: string;
  authoreRole: string;
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
  seriesTitle
}: PostProps) => {
  const user = useRecoilValue(userAtom);
  const userId = user?._id;
  const [likeCount, setLikeCount] = useState(likes);
  const [commentCount, setCommentCount] = useState(comments);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");

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

    //console.log("deleted post succesfuly" , authorId);
    //if (!postId || !userId) return;

    try {
      const response = await fetch(`http://localhost:8000/api/psync/deletePost/${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
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
  }


  return (
    <>
      <Card className="mt-[25px] bg-white rounded-[10px] overflow-hidden">
        <CardContent className="p-5 cursor-pointer" >
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={authorImage} alt={authorName} />
              <AvatarFallback className="bg-teal-600 text-white">{authorName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">

              <div className="flex items-center justify-between">
                <div>

                  <div className="flex gap-3">

                    <h3 className={`font-semibold text-lg text-gray-900  ${authoreRole === "patient" ? "" : ""}`}>{authorName}</h3>
                    {authoreRole === "doctor" && <Badge
                      // className="bg-primary hover:bg-primaryHover text-white"
                      className="mt-1 bg-transparent border-teal-300 text-primary pointer-events-none"
                    >
                      {authoreRole}
                    </Badge>}
                  </div>
                  <p className="text-sm text-teal-600">{seriesTitle} </p>
                  {/* <p className="text-sm text-teal-600">{authoreRole}</p> */}

                </div>
                {authorId === userId ? (
                  <DeleteButton onClick={handlePostDelete} />
                ) : (
                  <span className="text-sm text-gray-500">{timeAgo}</span>
                )}
              </div>
            </div>
          </div>

          {/* content div to open full post */}
          <div onClick={() => navigate(`/${authoreRole}/psync/post/${postId}`)}>
            <h1 className="text-gray-800 mb-4 font-bold leading-relaxed">{title}</h1>
            <p className="text-gray-800 mb-4 text-base leading-relaxed">{content}</p>

            {image && (
              <div className="mb-4 rounded-2xl overflow-hidden">
                <img src={image} alt="Post content" className="w-full h-auto object-cover" />
              </div>
            )}
            <div className="text-sm text-gray-500 mt-4">{likeCount} Likes, {commentCount} Comments</div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-gray-100 p-3">
          <div className="grid grid-cols-3 w-full gap-2">
            <button onClick={handleLike} className="flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-full hover:bg-teal-700 transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>

              Like
            </button>

            <button
              onClick={() => setShowCommentBox(!showCommentBox)}
              className="flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-full hover:bg-teal-700 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>


              Comment
            </button>

            <button onClick={handleFavorite} className="flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-full hover:bg-teal-700 transition-colors">

              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
              Favorite
            </button>
          </div>
        </CardFooter>

        {/* Dynamic Comment Box */}
        {showCommentBox && (
          <div className="p-4 bg-gray-100 border-t border-gray-200">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border rounded-lg focus:ring focus:ring-teal-300"
            />
            <button
              onClick={handleComment}
              className="mt-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Submit
            </button>
          </div>
        )}
      </Card>
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
          className="w-5 h-5 text-gray-600 cursor-pointer hover:text-teal-600 transition-colors duration-200"
          onClick={handleDeleteClick}
        />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white border-teal-500 border-2">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-teal-700">
            Are you sure you want to delete?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-black">
            This action cannot be undone. This will permanently delete the item.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-teal-700 border-teal-500 hover:bg-teal-50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Post;
