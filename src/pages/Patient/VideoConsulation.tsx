'use client'

import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Camera, CameraOff, FileText, Image, Mic, MicOff , PhoneOff, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/context/SocketProvider";
import ReactPlayer from "react-player"
import peer from "@/service/peer";
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
  const doctorImage = "/src/assets/shared/UserPlaceholderDoc.jpg";
  const patientImage = "/src/assets/shared/UserPlaceholder.jpg";
  const prescriptionImage = "/src/assets/shared/perscription.png";
  const navigate = useNavigate();
  const socket = useSocket()
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`===== USER JOINED EVENT =====`);
    console.log(`User ${email} joined with socket id = ${id}`);
    console.log(`My socket id = ${socket?.id}`);
    console.log(`Setting remoteSocketId to ${id}`);
    setRemoteSocketId(id);
    console.log(`===== USER JOINED COMPLETE =====`);
  }, [socket?.id]);

  const getUserMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
    } catch (error) {
      console.error("Failed to get media stream:", error);
    }
  };

  const handleIncommingCall = useCallback(async ({ from, offer }) => {
    setRemoteSocketId(from);
    getUserMediaStream();
    console.log("Incoming Call ", from, offer)
    const ans = await peer.getAnswer(offer);
    socket?.emit("call:accepted", { to: from, ans })
  }, [socket])

  const sendStreams = useCallback(() => {
    if (myStream) {
      for (const track of myStream?.getTracks()) {
        peer.peer?.addTrack(track, myStream)
      }
    }
  }, [myStream])

  const handleCallAccepted = useCallback(({ from, ans }) => {
    peer.setLocalDescription(ans);
    console.log("Accepted call ", from, ans)
    sendStreams();

  }, [sendStreams])

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket?.emit('peer:nego:needed', { offer, to: remoteSocketId })
  }, [remoteSocketId, socket])

  const handleNegoNeedIncomming = useCallback(async ({ from, offer }) => {
    const ans = await peer.getAnswer(offer)
    socket?.emit('peer:nego:done', { to: from, ans })
  }, [socket])

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans)
  }, [])

   // New function to toggle audio
   const toggleAudio = useCallback(() => {
    if (myStream) {
      const audioTracks = myStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
  
      // Recreate stream to trigger re-render
      const newStream = new MediaStream([
        ...myStream.getVideoTracks(),
        ...audioTracks,
      ]);
  
      setMyStream(newStream);
      setIsAudioEnabled(audioTracks[0]?.enabled ?? false);
    }
  }, [myStream]);
  

  // New function to toggle video
  const toggleVideo = useCallback(() => {
    if (myStream) {
      const videoTracks = myStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
  
      // Recreate stream to trigger re-render
      const newStream = new MediaStream([
        ...videoTracks,
        ...myStream.getAudioTracks(),
      ]);
  
      setMyStream(newStream);
      setIsVideoEnabled(videoTracks[0]?.enabled ?? false);
    }
  }, [myStream]);
  
  // New function to end call
  const endCall = useCallback(() => {
    setShowReviewModal(true);
    
    // Stop all tracks
    if (myStream) {
      myStream.getTracks().forEach(track => {
        track.stop();
      });
      setMyStream(null);
    }
    
    // Close peer connection
    if (peer.peer) {
      peer.peer.close();
    }
    
    // Reset remote stream
    setRemoteStream(null);
    setRemoteSocketId(null);
  }, [myStream]);


  useEffect(() => {
    peer.peer?.addEventListener('negotiationneeded', handleNegoNeeded)
    return () => {
      peer.peer?.removeEventListener("negotiationneeded", handleNegoNeeded)
    }
  }, [handleNegoNeeded])

  useEffect(() => {
    peer.peer?.addEventListener('track', async ev => {
      const remoteStream = ev.streams[0];
      setRemoteStream(remoteStream);
    })
  }, [])


  useEffect(() => {
    getUserMediaStream();
    
    socket?.on('room:full', (data) => {
      console.error('Room is full:', data.message);
      alert('This room already has 2 participants. Please try another room.');
      navigate(-1);
    });
    
    // Add this new handler
    socket?.on('room:users', ({ users }) => {
      console.log('RECEIVED ROOM USERS:', users);
      if (users && users.length > 0 && socket?.id) {
        // Find other users (not myself)
        const otherUsers = users.filter(u => u.id !== socket.id);
        if (otherUsers.length > 0) {
          console.log('Setting remoteSocketId to:', otherUsers[0].id);
          setRemoteSocketId(otherUsers[0].id);
        }
      }
    });
    
    socket?.on('user:joined', handleUserJoined);
    socket?.on('incomming:call', handleIncommingCall);
    socket?.on("call:accepted", handleCallAccepted);
    socket?.on('peer:nego:needed', handleNegoNeedIncomming);
    socket?.on('peer:nego:final', handleNegoNeedFinal);
    
    return () => {
      socket?.off('room:full');
      socket?.off('room:users');
      socket?.off('user:joined', handleUserJoined);
      socket?.off('incomming:call', handleIncommingCall);
      socket?.off('call:accepted', handleCallAccepted);
      socket?.off('peer:nego:needed', handleNegoNeedIncomming);
      socket?.off('peer:nego:final', handleNegoNeedFinal);
    }
}, [socket, handleUserJoined, handleIncommingCall, handleCallAccepted, handleNegoNeedIncomming, handleNegoNeedFinal, navigate]);


  const handleCallUser = useCallback(async () => {
    const offer = await peer.getOffer()
    socket?.emit("user:call", { to: remoteSocketId, offer })

  }, [remoteSocketId, socket])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-emerald-600 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-white gap-4 sm:gap-0">
        {/* Left Section: Back Button and Session Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)} // Navigate back to the previous page
            className="flex items-center text-lg sm:text-xl font-medium text-black transition-transform transform hover:scale-110"
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
          <div className="flex flex-col items-start sm:flex sm:items-cente sm:justify-centerr gap-1">
            <h1 className="text-lg sm:text-xl font-semibold">Consultation Room <p>{remoteSocketId ? "Connected" : "Nobody in room"}</p></h1>
            <span className="text-sm opacity-80">Session ID: 572937</span>
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex items-center justify-start sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto">
          {remoteSocketId && <Button
            variant="ghost"
            size="icon"
            onClick={handleCallUser}
            className="hover:bg-emerald-700 bg-black px-24 flex items-center justify-center"
          >
            Ready to Start
          </Button>}
          {/* {myStream && <Button className="hover:bg-emerald-700 bg-black px-5 flex items-center justify-center" onClick={sendStreams}>Start Video</Button>} */}
          <Button
            variant={isVideoEnabled ? "ghost" : "destructive"}
            size="icon"
            onClick={toggleVideo}
            className={`${isVideoEnabled ? 'hover:bg-emerald-700' : ''} flex items-center justify-center`}
          >
            {isVideoEnabled ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
          </Button>
          <Button
             variant={isAudioEnabled ? "ghost" : "destructive"}
            size="icon"
            onClick={toggleAudio}
            className={`${isAudioEnabled ? 'hover:bg-emerald-700' : ''} flex items-center justify-center`}
          >
            {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            // onClick={() => setShowReviewModal(true)}
            onClick={endCall}
            className="flex items-center justify-center"
          >
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
            {myStream ? <ReactPlayer playing muted url={myStream} width="100%" height="250px" />
              :
              <img
                src={patientImage}
                alt="Video feed"
                className="w-[550px] h-[250px] justify-self-center object-cover"
              />
            }

          </div>

          <div className="bg-gray-200 rounded-lg overflow-hidden">
            {remoteStream ? <ReactPlayer playing url={remoteStream} width="100%" height="250px" />
              :
              <img
                src={doctorImage}
                alt="Video feed"
                className="w-[550px] h-[250px] object-cover justify-self-center"
              />
            }
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
                  src={prescriptionImage}
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
