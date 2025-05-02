import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import userAtom from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";
import CommentsSection from "./PsyncComment";
import BackButton from "../patient/backButton";
import { toast } from "@/hooks/use-toast";
import { DeleteButton } from "./PostComponent";
import { Badge } from "../ui/badge";
import { FaPenAlt } from "react-icons/fa";
import EditPostModal from "./EditPostModal";
import { LoadingSpinner } from "../LoadingSpinner";

const FullPost = () => {
    const { postId } = useParams();
    const user = useRecoilValue(userAtom);
    const userId = user?._id;
    const [post, setPost] = useState<any>(null);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [commentCount, setCommentCount] = useState<number>(0);
    const [isFavorited, setIsFavorited] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [showCommentBox, setShowCommentBox] = useState<boolean>(false);
    const [commentText, setCommentText] = useState<string>("");
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [newComment, setNewComment] = useState<any>(null);
    const commentsEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Extract the first part of the pathname (i.e., "doctor" or "patient")
    const role = location.pathname.split("/")[1];
    const isAdmin = role === "admin"; // Check if current user role is admin
    
    // Fetch the full post data
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/psync/post/${postId}`);
                const result = await response.json();
                
                if (response.ok) {
                    setPost(result);
                    setLikeCount(result.likes.length);
                    setCommentCount(result.comments.length);
                    
                    // Check if the current user has liked or favorited the post
                    setIsLiked(result.likes.includes(userId));
                    setIsFavorited(result.favouritedBy.includes(userId));
                } else {
                    console.error("Error fetching post:", result.error);
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };
        if (postId) fetchPost();
    }, [postId, userId, refresh]); // Add refresh to the dependency array

    // Handle Like Action
    const handleLike = async () => {
        if (isAdmin) return; // Prevent admin from liking
        
        try {
            const response = await fetch(`http://localhost:8000/api/psync/likeUnlikePost/${postId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            const result = await response.json();
            if (response.ok) {
                // Toggle the liked state and update count
                const newLikedState = !isLiked;
                setIsLiked(newLikedState);
                setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);
                
                toast({
                    description: newLikedState ? "Post liked!" : "Post unliked!",
                    variant: "default",
                    duration: 1000,
                });
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error("Error liking/unliking post:", error);
        }
    };

    // Scroll to comments after adding new comment
    const scrollToComments = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Handle Comment Submission
    const handleComment = async () => {
        if (isAdmin) return; // Prevent admin from commenting
        if (!commentText.trim()) return;

        try {
            const response = await fetch(`http://localhost:8000/api/psync/commentOnPost/${postId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, comment: commentText }),
            });

            const result = await response.json();
            if (response.ok) {
                // Update comment count
                setCommentCount((prev) => prev + 1);
                
                // Create a new comment object to pass to CommentsSection
                const newCommentObj = {
                    _id: result._id || Date.now().toString(), // Use the returned ID or fallback
                    userId: userId,
                    comment: commentText,
                    createdAt: new Date().toISOString()
                };
                
                // Set the new comment to trigger CommentsSection update
                setNewComment(newCommentObj);
                
                // Clear input after posting
                setCommentText("");
                
                // Hide input box
                setShowCommentBox(false);
                
                // Scroll to comments section
                setTimeout(scrollToComments, 300);
                
                // Show success toast
                toast({
                    description: "Comment posted successfully!",
                    variant: "default",
                    duration: 1000,
                });
            } else {
                console.error(result.error);
                toast({
                    description: "Failed to post comment. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error commenting on post:", error);
            toast({
                description: "An error occurred while posting your comment.",
                variant: "destructive",
            });
        }
    };

    // Handle Favorite Action
    const handleFavorite = async () => {
        if (isAdmin) return; // Prevent admin from favoriting
        
        try {
            const response = await fetch(`http://localhost:8000/api/psync/addToFavourites/${postId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            const result = await response.json();
            if (response.ok) {
                // Toggle the favorited state
                const newFavoritedState = !isFavorited;
                setIsFavorited(newFavoritedState);
                
                toast({
                    description: newFavoritedState ? "Post added to favorites!" : "Post removed from favorites!",
                    variant: "default",
                    duration: 1000,
                });
            } else {
                console.error(result.error);
                toast({
                    description: "Failed to update favorites.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error managing favorites:", error);
            toast({
                description: "An error occurred while updating favorites.",
                variant: "destructive",
            });
        }
    };

    const handlePostDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/psync/deletePost/${postId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId,
                    isAdmin // Send admin flag to backend
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    description: "Post deleted successfully!",
                    variant: "default",
                    duration: 1000,
                });

                navigate(-1);
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

    // Function to handle edit button click
    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    // Create post data object for edit modal
    const postDataForEdit = post ? {
        postId: post._id,
        title: post.title || "",
        description: post.description,
        img: post.img || ""
    } : null;

    // Handle comment added callback
    const handleCommentAdded = () => {
        setNewComment(null); // Reset the new comment after it's been processed
    };

    // Define button styles based on states
    const getButtonStyle = () => {
        return isAdmin
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-teal-600 hover:bg-teal-700';
    };
    
    // Define heart and bookmark icon styles
    const getHeartIconStyle = () => {
        return isLiked ? 'text-red-500' : 'text-white';
    };
    
    const getBookmarkIconStyle = () => {
        return isFavorited ? 'text-yellow-500' : 'text-white';
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
          return interval === 1 ? "1 year ago" : `${interval} years ago`;
        }
        
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
          return interval === 1 ? "1 month ago" : `${interval} months ago`;
        }
        
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          return interval === 1 ? "1 day ago" : `${interval} days ago`;
        }
        
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
        }
        
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
          return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
        }
        
        return seconds <= 5 ? "just now" : `${Math.floor(seconds)} seconds ago`;
    };
    
    if (loading) return ( 

        <div className="mt-[15rem]"> 
        <LoadingSpinner text={
            "Loading post..."
        } />
        {/* <p className="flex justify-center align-middle">Loading...</p> */}
        </div>

);
    if (!post) return <p className="mt-6">Post not found</p>;

    return (
        <div className="mt-7 p-4 md:p-8 lg:p-12">
            <BackButton className="mt-4 ml-4 md:ml-8 lg:ml-[16rem] mb-5" />
            <div className="w-full flex align-middle justify-center">
                <Card className="bg-white rounded-lg overflow-hidden w-full max-w-4xl">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={post.user?.profilePicture || "/default-avatar.png"} alt={post.user?.name || "User"} />
                                <AvatarFallback className="bg-teal-600 text-white">
                                    {post.user?.name?.[0] || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex gap-3">
                                            <h3 className={`font-semibold text-lg text-gray-900`}>{post.user?.name}</h3>
                                            {post.user?.role === "doctor" &&
                                                <Badge className="mt-1 bg-transparent border-teal-300 text-primary pointer-events-none">
                                                    {post.user?.role}
                                                </Badge>
                                            }
                                        </div>
                                        <p className="text-sm text-teal-600">{post.series[0]?.title || 'No SERIES'} </p>
                                        {post.user?.title && <p className="text-sm text-teal-600">{post.user.title}</p>}
                                    </div>

                                    {/* Show edit and delete buttons for author or admin */}
                                    {(post.user?._id === userId || isAdmin) ? (
                                        <div className="flex gap-3">
                                            {post.user?._id === userId && (
                                                <FaPenAlt
                                                    className="w-5 h-5 text-gray-600 cursor-pointer hover:text-teal-600 transition-colors duration-200"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditClick();
                                                    }}
                                                />
                                            )}
                                            <DeleteButton onClick={handlePostDelete} />
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-500">
                                            {getTimeAgo(post.createdAt)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <h1 className="text-gray-800 mb-4 font-bold leading-relaxed">{post.title}</h1>
                        <p className="text-gray-800 mb-4 text-base leading-relaxed">{post.description}</p>

                        {post.img && (
                            <div className="mb-4 rounded-2xl overflow-hidden">
                                <img src={post.img} alt="Post content" className="w-full h-auto object-cover" />
                            </div>
                        )}

                        <div className="text-sm text-gray-500 mt-4">{likeCount} Likes, {commentCount} Comments</div>
                    </CardContent>

                    <CardFooter className="border-t border-gray-100 p-3">
                        <div className="grid grid-cols-3 w-full gap-2">
                            <button
                                onClick={isAdmin ? undefined : handleLike}
                                className={`flex items-center justify-center gap-2 ${getButtonStyle()} text-white px-4 py-2.5 rounded-full transition-colors`}
                                disabled={isAdmin}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${getHeartIconStyle()} transition-colors`}>
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <span>{isAdmin ? 'View Only' : isLiked ? 'Liked' : 'Like'}</span>
                            </button>

                            <button
                                onClick={isAdmin ? undefined : () => setShowCommentBox(!showCommentBox)}
                                className={`flex items-center justify-center gap-2 ${getButtonStyle()} text-white px-4 py-2.5 rounded-full transition-colors`}
                                disabled={isAdmin}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                                <span>{isAdmin ? 'View Only' : 'Comment'}</span>
                            </button>

                            <button
                                onClick={isAdmin ? undefined : handleFavorite}
                                className={`flex items-center justify-center gap-2 ${getButtonStyle()} text-white px-4 py-2.5 rounded-full transition-colors`}
                                disabled={isAdmin}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${getBookmarkIconStyle()} transition-colors`}>
                                    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                                </svg>
                                <span>{isAdmin ? 'View Only' : isFavorited ? 'Favorited' : 'Favorite'}</span>
                            </button>
                        </div>
                    </CardFooter>

                    {/* Dynamic Comment Box - Only show if not admin */}
                    {showCommentBox && !isAdmin && (
                        <div className="p-4 bg-gray-100 border-t border-gray-200">
                            <textarea 
                                value={commentText} 
                                onChange={(e) => setCommentText(e.target.value)} 
                                placeholder="Write a comment..." 
                                className="w-full p-3 border rounded-lg focus:ring focus:ring-teal-300 min-h-24" 
                            />
                            <div className="flex justify-end mt-2">
                                <button 
                                    onClick={() => setShowCommentBox(false)}
                                    className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleComment} 
                                    disabled={!commentText.trim()}
                                    className={`bg-teal-600 text-white px-4 py-2 rounded-lg ${commentText.trim() ? 'hover:bg-teal-700' : 'opacity-50 cursor-not-allowed'} transition-colors`}
                                >
                                    Post Comment
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="px-6 py-4" ref={commentsEndRef}>
                        <h3 className="text-lg font-semibold mb-4">Comments</h3>
                        <CommentsSection 
                            postId={postId || ""} 
                            newComment={newComment}
                            onCommentAdded={handleCommentAdded}
                        />
                    </div>
                </Card>
            </div>

            {/* Edit Post Modal */}
            {isEditModalOpen && postDataForEdit && (
                <EditPostModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    setRefresh={setRefresh}
                    postData={postDataForEdit}
                />
            )}
        </div>
    );
};

export default FullPost;