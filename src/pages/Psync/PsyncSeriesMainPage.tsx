import FavouritesBackButton from "@/Components/psync/FavouritesBackButton";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { useRecoilValue } from "recoil";
import  userAtom  from "../../atoms/userAtom"; // Adjust the import path if needed

// Define the interfaces for the data structures
interface Post {
  id: number;
  authorName: string;
  authorRole: string;
  authorImage: string;
  title: string;
  content: string;
  timeAgo: string;
  likeCount: number;
  commentCount: number;
  img: string;
}

interface SeriesItem {
  id: number;
  title: string;
  posts: Post[];
}

interface HoveredPostData {
  post: Post;
  seriesTitle: string;
}

// API response interfaces
interface ApiPost {
  _id: string;
  title: string;
  description: string;
  img: string;
  likes?: string[]; // Add this
  comments?: { userId: string; comment: string; _id: string }[]; // Add this
  createdAt: string;
  updatedAt: string;
}

interface ApiUser {
  _id: string;
  name: string;
  email: string;
}

interface ApiSeriesItem {
  _id: string;
  title: string;
  posts: ApiPost[];
  createdBy: ApiUser;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const PsyncSeries = () => {
  const navigate = useNavigate();
  const [series, setSeries] = useState<SeriesItem[]>([]);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<number | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const postRefs = useRef<{ [key: number]: HTMLElement }>({});
  
  // Get user ID from Recoil state
  const user = useRecoilValue(userAtom);
  const userId = user?._id;
  const location = useLocation();

  // Extract the first part of the pathname (i.e., "doctor" or "patient")
  const role = location.pathname.split("/")[1];
  
  // Fetch data from API
  useEffect(() => {
    const fetchSeries = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`http://localhost:8000/api/psync/series/user/${userId}`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const apiData: ApiSeriesItem[] = await response.json();
        
        // Transform API data to match our component's data structure
        const transformedSeries: any = apiData.map(item => {
          return {
            //id: parseInt(item._id.substring(0, 8), 16), // Convert MongoDB ID to a number for our interface
            id: item._id ,
            title: item.title,
            posts: item.posts.map(post => {
              // Calculate time ago
              const createdAt = new Date(post.createdAt);
              const now = new Date();
              const diffInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
              const timeAgo = diffInDays <= 0 ? "Today" : diffInDays === 1 ? "Yesterday" : `${diffInDays} days ago`;
              
              return {
                id: post._id , // Convert MongoDB ID to a number
                authorName: item.createdBy.name,
                authorRole: "patient", // Default role, adjust if needed
                authorImage: "/api/placeholder/40/40", // Use post image or placeholder
                title: post.title,
                content: post.description,
                timeAgo: timeAgo,
                likeCount: post.likes?.length || 0, // Use the actual likes array length
                commentCount: post.comments?.length || 0, // Use the actual comments array length
                img: post.img || "" ,
              };
            })
          };
        });
        
        setSeries(transformedSeries);
      } catch (error) {
        console.error("Error fetching series data:", error);
        // You might want to set an error state here
      }
    };

    fetchSeries();
  }, [userId]);

  const handlePostClick = (postId: any) => {
    navigate(`/${role}/psync/post/${postId}`);
  };

  // Setup click outside listener to close the hover preview
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (previewRef.current && !previewRef.current.contains(event.target as Node)) {
        setHoveredPost(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleMouseEnter = (postId: number, event: React.MouseEvent<HTMLDivElement>) => {
    // Clear any existing timeout to prevent flickering
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
    }
    
    // Store reference to the current target element
    if (event && event.currentTarget) {
      postRefs.current[postId] = event.currentTarget;
    }
    
    // Set a small delay before showing preview to prevent accidental triggers
    hoverTimeoutRef.current = window.setTimeout(() => {
      // Use the stored reference instead of event.currentTarget
      const element = postRefs.current[postId];
      
      if (element) {
        const rect = element.getBoundingClientRect();
        setHoverPosition({
          x: rect.left + rect.width,
          y: rect.top
        });
        setHoveredPost(postId);
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    // Clear timeout if mouse leaves before preview is shown
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
    }
    
    // Set a small delay before hiding to prevent flickering when moving between post and preview
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHoveredPost(null);
    }, 300);
  };

  // Find the hovered post data
  const getHoveredPostData = (): HoveredPostData | null => {
    if (!hoveredPost) return null;
    
    for (const seriesItem of series) {
      for (const post of seriesItem.posts) {
        if (post.id === hoveredPost) {
          return { post, seriesTitle: seriesItem.title  };
        }
      }
    }
    return null;
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current !== null) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const hoveredPostData = getHoveredPostData();

  const hoverToIndividualSeriesPage = (seriesId: number) => {
    navigate(`/${role}/psync/myseries/${seriesId}`);
  };

  return (
    <div className="flex justify-center mt-12 bg-secondary">
      <div className="w-full max-w-7xl p-6 rounded-lg shadow-lg  h-screen">
        <div className="pt-3 max-w-7xl w-full mx-auto">
          <FavouritesBackButton text="My Series" />
          
          {series.length === 0 ? (
            <div className="mt-8 flex justify-center items-center h-64">
              <p className="text-gray-500 text-lg">No series found. Create a new series to get started.</p>
            </div>
          ) : (
            <div className="mt-8 space-y-10">
              {series.map((seriesItem) => (
                <div key={seriesItem.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Series Title */}
                    <div className="md:w-1/4 bg-gray-50 p-6 flex items-center justify-center border-r border-gray-200">
                      <h2 
                        className="text-2xl font-bold text-gray-800 hover:cursor-pointer hover:underline" 
                        onClick={() => hoverToIndividualSeriesPage(seriesItem.id)}
                      >
                        {seriesItem.title}
                      </h2>
                    </div>
                    
                    {/* Posts Preview */}
                    <div className="md:w-3/4 p-6">
                      {seriesItem.posts.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No posts in this series yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {seriesItem.posts.map((post) => (
                            <div 
                              key={post.id} 
                              className="relative group"
                              onMouseEnter={(e) => handleMouseEnter(post.id, e)}
                              onMouseLeave={handleMouseLeave}
                            >
                              <div 
                                className="bg-teal-50 border border-teal-200 rounded-lg p-4 h-40 cursor-pointer 
                                transition-all duration-200 group-hover:shadow-lg group-hover:border-teal-300"
                                onClick={() => handlePostClick(post.id)}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm">
                                    {post.authorName[0]}
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">{post.authorName}</span>
                                  {post.authorRole === "doctor" && (
                                    <Badge className="bg-transparent border border-teal-300 text-teal-600 text-xs">
                                      {post.authorRole}
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{post.title}</h3>
                                <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Fixed position preview that appears to emerge from the post box */}
      {hoveredPost !== null && hoveredPostData && (
        <div 
          ref={previewRef}
          className="fixed z-50 transition-opacity duration-300 opacity-100"
          style={{
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y}px`,
            transform: 'translate(20px, -10px)'
          }}
          onMouseEnter={() => {
            if (hoverTimeoutRef.current !== null) {
              window.clearTimeout(hoverTimeoutRef.current);
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          <Card className="w-96 shadow-2xl border-none animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={hoveredPostData.post.authorImage} alt={hoveredPostData.post.authorName} />
                  <AvatarFallback className="bg-teal-600 text-white">{hoveredPostData.post.authorName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex gap-2 items-center">
                    <h3 className="font-semibold text-lg text-gray-900">{hoveredPostData.post.authorName}</h3>
                    {hoveredPostData.post.authorRole === "doctor" && (
                      <Badge className="bg-transparent border-teal-300 text-teal-600">
                        {hoveredPostData.post.authorRole}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-teal-600">{hoveredPostData.seriesTitle}</p>
                  <p className="text-xs text-gray-500">{hoveredPostData.post.timeAgo}</p>
                </div>
              </div>
              
              <h1 className="text-xl font-bold text-gray-800 mb-3">{hoveredPostData.post.title}</h1>
              <div className="max-h-60 overflow-y-auto pr-2 mb-4">
                {console.log(hoveredPostData) as any}
                <p className="text-gray-700">{hoveredPostData.post.content}</p>
              </div>
              
              <div className="text-sm text-gray-500 mt-2 mb-4">
                {hoveredPostData.post.likeCount || 0} Likes • {hoveredPostData.post.commentCount || 0} Comments
              </div>
              
             {/* a small preview div to show post.img if it exisits */}

                {hoveredPostData.post.img && (
                <div className="relative mb-4">
                  <img 
                  src={hoveredPostData.post.img} 
                  alt="Post Preview" 
                  className="w-full h-20 object-cover rounded-lg opacity-80"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
                </div>
                )}
              
              {/* Button to view full post */}

              
              <button 
                className="w-full mt-4 bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                onClick={() => handlePostClick(hoveredPostData.post.id)}
              >
                View Full Post
              </button>
            </CardContent>
          </Card>
          
          {/* Triangle pointer that visually connects preview to original post */}
          <div 
            className="absolute w-4 h-4 bg-white rotate-45 border-t border-l border-gray-200"
            style={{
              top: '15px',
              left: '0',
              transform: 'translateX(-50%)'
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default PsyncSeries;