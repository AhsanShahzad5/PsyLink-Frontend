import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userAtom from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";
import CommentsSection from "./PsyncComment";
import BackButton from "../patient/backButton";
import FavouritesBackButton from "./FavouritesBackButton";

const FullPost = () => {
    const { postId } = useParams();
    const user = useRecoilValue(userAtom);
    const userId = user?._id;
    const [post, setPost] = useState<any | null>(null);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [isFavorited, setIsFavorited] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch the full post data
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/psync/post/${postId}`);
                const result = await response.json();
                if (response.ok) {
                    setPost(result);
                    setLikeCount(result.likes.length); // Likes count
                    setCommentCount(result.comments.length); // Comments count
                    setIsFavorited(result.favouritedBy.includes(userId)); // Check if user has favorited
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
    }, [postId]);

    // Handle Like Action
    const handleLike = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/psync/likeUnlikePost/${postId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            const result = await response.json();
            if (response.ok) {
                setLikeCount(result.likes?.length); // Update like count
                // console.log(result.likes?.length);
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    // Handle Comment Action
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

    // Handle Favorite Action
    const handleFavorite = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/psync/${postId}/favorite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId }),
            });

            const result = await response.json();
            if (response.ok) {
                setIsFavorited(true);
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error("Error adding post to favorites:", error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!post) return <p>Post not found</p>;

    return (
        <div className="mt-6 p-[5rem] ">
            <BackButton className="ml-[13rem] mb-5" />
            <div className=" w-[100%] flex align-middle justify-center ">
                <Card className=" bg-white rounded-[10px] overflow-hidden w-[70%] ">
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
                                        <h3 className="font-semibold text-gray-900">{post.user?.name}</h3>
                                        {post.user?.title && <p className="text-sm text-teal-600">{post.user.title}</p>}
                                    </div>
                                    <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-gray-800 mb-4 font-bold leading-relaxed flex">{post.title}</h1>
                        <p className="text-gray-800 mb-4 text-base leading-relaxed flex">{post.description}</p>

                        {post.img && (
                            <div className="mb-4 rounded-2xl overflow-hidden">
                                <img src={post.img} alt="Post content" className="w-full h-auto object-cover" />
                            </div>
                        )}

                        <div className="text-sm text-gray-500 mt-4 flex">
                            {likeCount || 0} Likes, {commentCount} Comments
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

                    {/* Comments Section */}
                    <div className="px-6 py-4">
                        <CommentsSection postId={postId || ''} />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default FullPost;