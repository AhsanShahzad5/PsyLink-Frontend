import React, { useState, useEffect } from "react";

interface Comment {
  _id: string;
  userId: string;
  comment: string;
}

interface UserDetails {
  _id: string;
  name: string;
  email: string;
}

const CommentsSection: React.FC<{ postId: string }> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsWithUserDetails, setCommentsWithUserDetails] = useState<
    (Comment & { userDetails: UserDetails | null })[]
  >([]);

  // Fetch comments for the post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/psync/getPostComments/${postId}`
        );
        if (response.ok) {
          const data: Comment[] = await response.json();
          setComments(data);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, [postId,comments,commentsWithUserDetails]);

  // Fetch user details for each comment
  useEffect(() => {
    const fetchUserDetailsForComments = async () => {
      const updatedComments = await Promise.all(
        comments.map(async (comment) => {
          try {
            const response = await fetch(
              `http://localhost:8000/api/user/userDetails/${comment.userId}`
            );
            const userDetails = response.ok ? await response.json() : null;

            return {
              ...comment,
              userDetails,
            };
          } catch (err) {
            console.error("Error fetching user details:", err);
            return { ...comment, userDetails: null };
          }
        })
      );

      setCommentsWithUserDetails(updatedComments);
    };

    if (comments.length > 0) {
      fetchUserDetailsForComments();
    }
  }, [postId,comments,commentsWithUserDetails]);

  return (
    <div className="mt-4">
      {commentsWithUserDetails.map((comment) => (
        <div
          key={comment._id}
          className="flex items-start space-x-3 border-b border-gray-200 py-3"
        >
          <div>
            {/* Render user name if available */}
            <h4 className="font-bold text-gray-800">
              {comment.userDetails?.name || "Unknown User"}
            </h4>
            {/* Render user email */}
            <p className="text-sm text-gray-500">
              {comment.userDetails?.email || "No email"}
            </p>
            {/* Comment content */}
            <p className="text-gray-700 mt-1">{comment.comment}</p>
          </div>
        </div>
      ))}
      {comments.length === 0 && (
        <p className="text-gray-500 italic">No comments yet.</p>
      )}
    </div>
  );
};

export default CommentsSection;
