import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import userAtom from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";

export interface PostProps {
  postId: string;
  authorName: string;
  authorImage?: string;
  content: string;
  timeAgo: string;
  likes: number;
  comments: number;
  image?: string;
  title?: string;
  isFavorited?: boolean;
}


const Post = ({
  authorName,
  authorImage,
  content,
  timeAgo,
  likes,
  comments,
  image,
  title,
  postId,
}: PostProps) => {
  const user = useRecoilValue(userAtom);
  const userId = user?._id;
  const [likeCount, setLikeCount] = useState(likes);
  const [commentCount, setCommentCount] = useState(comments);
  const [isFavorited, setIsFavorited] = useState(false);


  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/psync/likeUnlikePost/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();
      if (response.ok) {
        if (result.message === "Post unliked successfully") {
          if (likeCount > 0) {
            setLikeCount((prev) => prev - 1);
          }
        } else {
          setLikeCount((prev) => prev + 1);
        }
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();
      if (response.ok) {
        setIsFavorited(true);
        alert("Post added to favorites successfully");
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error adding post to favorites:", error);
    }
  };

  const handleComment = async (comment: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/psync/commentOnPost/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, comment }),
      });

      const result = await response.json();
      if (response.ok) {
        setCommentCount((prev) => prev + 1);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };
  const navigate = useNavigate();

 
  return (
    <>
      <Card className="mt-[25px] bg-white rounded-[10px] overflow-hidden"      
      >
        <CardContent className="p-6 cursor-pointer"
        
        onClick={() => navigate(`/patient/psync/post/${postId}`)}

        >
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="h-12 w-12">

              <AvatarImage src={authorImage} alt={authorName} />
              <AvatarFallback className="bg-teal-600 text-white">
                {authorName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{authorName}</h3>
                  {title && <p className="text-sm text-teal-600">{title}</p>}
                </div>
                <span className="text-sm text-gray-500">{timeAgo}</span>
              </div>
            </div>
          </div>

          <h1 className="text-gray-800 mb-4 font-bold leading-relaxed flex">{title}</h1>
          <p className="text-gray-800 mb-4 text-base leading-relaxed flex">{content}</p>

          {image && (
            <div className="mb-4 rounded-2xl overflow-hidden">
              <img src={image} alt="Post content" className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="text-sm text-gray-500 mt-4 flex">
            {likeCount} Likes, {commentCount} Comments
          </div>
        </CardContent>

        <CardFooter className="border-t border-gray-100 p-3">
          <div className="grid grid-cols-3 w-full gap-2">
            <button
              onClick={handleLike}
              className="flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-full hover:bg-teal-700 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Like
            </button>

            <button
              onClick={() => handleComment(prompt("Enter your comment:") || "")}
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

            <button
              onClick={handleFavorite}
              className="flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-full hover:bg-teal-700 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
              Add To Favourites
            </button>
          </div>
        </CardFooter>
      </Card>
    </>

  );
};

export default Post;
