'use client'

import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Camera, FileText, Image, Mic, PhoneOff, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
    const [rating, setRating] = useState<number>(0);

    if (!isOpen) return null;
  
    const handleRating = (index: number) => {
      setRating(index);
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-lg max-w-4xl w-full">
          
          <div className="flex flex-row justify-between items-start">
            <div className="p-2">  
              
              <h2 className="text-2xl font-semibold text-left">Leave a Review</h2>
              <p className="text-left w-96 mt-4">
                We hope this session was helpful for you.
                Please be kind to leave a review for the doctor.
                You can even send the doctor a private review only visible to the doctor.
              </p>

            </div>
            
            <div className="flex flex-col m-6 mr-8">
                <div className="flex justify-center items-center space-x-2">
                    {/* Star Rating */}
                    {[1, 2, 3, 4, 5].map((index) => (
                    <svg
                        key={index}
                        onClick={() => handleRating(index)}
                        className={`w-8 h-8 cursor-pointer ${index <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.813l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.537 1.118l-2.8-2.034a1 1 0 0 0-1.176 0l-2.8 2.034c-.782.57-1.837-.197-1.537-1.118l1.07-3.292a1 1 0 0 0-.364-1.118l-2.8-2.034c-.783-.573-.381-1.813.588-1.813h3.462a1 1 0 0 0 .95-.69l1.07-3.292z"></path>
                    </svg>
                    ))}
                </div>
                <div>
                <label className="block text-lg font-medium text-center">
                    Tell Us Your Experience
                </label>
                </div>
            </div> 

              </div> 
           


              <div className="space-y-4 px-10 mt-6">
                <label className="block text-lg font-medium text-gray-700 text-left">
                  Public Review
                </label>
                <textarea
                  className="form-textarea bg-[#F5F5F5] p-2 mt-1 block w-full rounded-md border-black shadow-sm  "
                  rows={4}
                  placeholder="Your public review"
                ></textarea>
                <label className="block text-lg  font-medium text-gray-700 text-left">
                  Private Review (Optional)
                </label>
                <textarea
                  className="form-textarea p-2 bg-[#F5F5F5] mt-1 block w-full rounded-md border-gray-300 shadow-sm "
                  rows={4}
                  placeholder="Your private review"
                ></textarea>
              </div>
              
          
            
          <div className="flex justify-end items-end mt-6 mr-6">
            
            <button
              className="ml-4 text-green-500 hover:text-green-700 font-bold py-2 px-4 rounded"
              type="button"
              onClick={onClose}
              >
              Submit
            </button>
          </div>
      
        </div>
      </div>
    );
  }


export default function Component() {

    const [showReviewModal, setShowReviewModal] = useState(false);

    const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-emerald-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
             {/* Back button */}
          
            <button
              onClick={() => navigate(-1)} // Navigate back to the previous page
              className="flex items-center text-xl font-medium text-[#000]  transition-transform transform hover:scale-110 "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              Back
            </button>
        
          <h1 className="text-xl font-semibold">Consultation Room</h1>
          <span className="text-sm opacity-80">Session ID: 572937</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hover:bg-emerald-700">
            <Camera className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-emerald-700">
            <Mic className="h-5 w-5" />
          </Button>
          <Button variant="destructive" size="icon" onClick={() => setShowReviewModal(true)}>
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <ReviewModal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} />

      {/* Main Content */}
      <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        
        
        {/* Video and Profile Section */}
        
        <div className="md:col-span-2 space-y-4">
          {/* Main Video Feed */}
          <div className="bg-gray-200 rounded-lg overflow-hidden">
    <img 
      src="/placeholder.svg?height=480&width=640" 
      alt="Video feed"
      className="w-full h-[250px] object-cover" /* Explicit height */
    />
  </div>

  <div className="bg-gray-200 rounded-lg overflow-hidden">
    <img 
      src="/placeholder.svg?height=480&width=640" 
      alt="Video feed"
      className="w-full h-[250px] object-cover" /* Explicit height */
    />
  </div>




          {/* Profile Card */}
          <Card className="p-4 border-2 border-emerald-500">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" alt="Doctor" />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">Dr Fahad Tariq Aziz</h2>
                <p className="text-sm text-gray-500">Psychiatrist</p>
              </div>
            </div>
          </Card>
        </div>



        {/* Chat Section */}
        <Card className="h-[600px] flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* Chat Messages */}
            <div className="flex justify-end">
              <div className="bg-emerald-100 rounded-lg p-3 max-w-[80%]">
                <img 
                  src="/placeholder.svg?height=100&width=200" 
                  alt="Prescription"
                  className="rounded-lg mb-2"
                />
                <p className="text-sm text-gray-600">Me</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <p className="text-sm">Dr Fahad Tariq Aziz</p>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          {/* Chat Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <FileText className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Image className="h-5 w-5" />
              </Button>
              <Input placeholder="Write here" className="flex-1 bg-white text-gray-800" />
              <Button size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
