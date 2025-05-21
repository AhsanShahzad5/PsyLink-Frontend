'use client'

import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Camera, CameraOff, FileText, Image, Mic, MicOff, Pen, PhoneOff, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "@/context/SocketProvider";
import ReactPlayer from "react-player"
import peer from "@/service/peer";
import { useRecoilValue } from 'recoil';
import userAtom from '@/atoms/userAtom';
import PrescriptionPopUp from "../../Components/doctor/PrescriptionPopUpDoc";
import ReviewModal from "../../Components/patient/reviewModal"; // Import the new ReviewModal component
import ChatComponent from "../../Components/ChatComponent"; // Import the Chat component

interface AppointmentData {
  appointmentId: string | undefined;
  date: string;
  time: string;
  patientName: string;
  doctorName: string;
  status: string;
  rating?: number;
  review?: string;
  createdAt: string;
}

export default function VideoConsultation() {
  // Extract appointment ID from URL params
  const { roomId } = useParams<{ roomId: string }>();
  const appointmentId = roomId;
  const [appointment, setAppointment] = useState<AppointmentData>({ 
    appointmentId: '',
    date: '',
    time: '',
    patientName: '',
    doctorName: '',
    status: '',
    rating: 0,
    review: '',
    createdAt: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const fetchAppointmentDetails = async () => {

    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/appointments/${appointmentId}`);
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.message || 'Failed to fetch appointment details');
        return;
      }
      
      setAppointment(result.data);
    } catch (error) {
      setError('Error connecting to server. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    
    fetchAppointmentDetails()
   
    
    
  
  }, [])
  
  console.log("this is appointmentDetails: ",appointment)
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPrescriptionPopUp, setShowPrescriptionPopUp] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    doctorId:"",
    doctorName: "",
    doctorSpeciality: "",
    patientId:"",
    patientName: "",
    patientGender: "",
    patientAge: "",
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  });
  
  const doctorImage = "/src/assets/shared/UserPlaceholderDoc.jpg";
  const patientImage = "/src/assets/shared/UserPlaceholder.jpg";
  // const prescriptionImage = "/src/assets/shared/perscription.png";
  const navigate = useNavigate();
  const socket = useSocket()
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);
  const user = useRecoilValue(userAtom);

  const handleWritePrescription = async () => {
    try {
      // Fetch the prescription details from the API
      const response = await fetch(`/api/doctor/${appointmentId}/details`);
      const data = await response.json();
      
      console.log("this is prescription req data :", data);

      // Update prescription data with fetched details
      setPrescriptionData({
        doctorId: data.doctorInfo.doctorId || user?._id || "Unknown DoctorId",
        doctorName: data.doctorInfo.name || user?.name || "Doctor",
        doctorSpeciality: data.doctorInfo.specialisation || "Psychiatrist",
        patientId: data.patientInfo.patientId || "Unknown PatientId",
        patientName: data.patientInfo.name || "User",
        patientGender: data.patientInfo.gender || "Male/Female",
        patientAge: data.patientInfo.age || "Unknown",
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      });

      // Show the prescription popup
      setShowPrescriptionPopUp(true);
    } catch (error) {
      console.error("Failed to fetch prescription details:", error);
      // Show popup with default values in case of error
      setShowPrescriptionPopUp(true);
    }
  };

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

   // Function to toggle audio
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
  

  // Modified function to toggle video with overlay
  const toggleVideo = useCallback(() => {
    setIsVideoEnabled(!isVideoEnabled);
    setShowVideoOverlay(!showVideoOverlay);

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
    }
  }, [myStream, isVideoEnabled, showVideoOverlay]);
  
  // Function to end call - modified to check user role
  const endCall = useCallback(() => {
    
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
    
    
    if (user?.role !== 'doctor') {
      setShowReviewModal(true);
    }

    if (user?.role === 'doctor') {
      window.location.href = '/doctor/appointments';
    } 
    // Reset remote stream
    setRemoteStream(null);
    setRemoteSocketId(null);
  }, [myStream, user?.role]);

  useEffect(() => {
    console.log("RoomId received in VideoConsultation:", appointmentId);
  }, [appointmentId]);

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
      {/* Prescription Popup */}
      {showPrescriptionPopUp && (
        <PrescriptionPopUp 
          isOpen={showPrescriptionPopUp}
          onClose={() => setShowPrescriptionPopUp(false)}
          doctorName={prescriptionData.doctorName}
          doctorId={prescriptionData.doctorId}
          doctorSpeciality={prescriptionData.doctorSpeciality}
          patientId={prescriptionData.patientId}
          patientName={prescriptionData.patientName}
          patientGender={prescriptionData.patientGender}
          patientAge={prescriptionData.patientAge}
          date={prescriptionData.date}
          appointmentId={appointmentId}
        />
      )}
      
      {/* Review Modal - Now using the imported component */}
      <ReviewModal 
        isOpen={showReviewModal} 
        onClose={() => setShowReviewModal(false)} 
        appointmentId={appointmentId}
      />
      
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
            <span className="text-sm opacity-80">Session ID: {appointmentId}</span>
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
            onClick={endCall}
            className="flex items-center justify-center"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Video and Profile Section */}
        <div className="md:col-span-2 space-y-4">
          {/* Main Video Feed with overlay when video is disabled */}
          <div className="bg-gray-200 rounded-lg overflow-hidden relative">
            {myStream ? (
              <>
                <ReactPlayer playing muted url={myStream} width="100%" height="250px" />
                {showVideoOverlay && (
                  <div className="absolute inset-0 bg-black flex items-center justify-center">
                    <p className="text-white">Camera Off</p>
                  </div>
                )}
              </>
            ) : (
              <img
                src={patientImage}
                alt="Video feed"
                className="w-[550px] h-[250px] justify-self-center object-cover"
              />
            )}
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
                <h2 className="text-lg font-semibold">Dr {appointment.doctorName}</h2>
                <p className="text-sm text-gray-500"></p>
              </div>
            </div> 
         
              {/* <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" alt="Doctor" />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">Waiting for Doctor</h2>
                <p className="text-sm text-gray-500">Please be patient. Doctor will join soon...</p>
              </div>
            </div>  */}
           
          </Card>
        </div>

        {/* Chat Section */}
        <Card className="h-[600px] flex flex-col">
          {/* Write Prescription Button - Only shown for doctors */}
          {user?.role === 'doctor' && (
            <div className="p-4 border-b">
              <Button 
                variant="outline" 
                className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300"
                onClick={handleWritePrescription}
              >
                <Pen className="h-4 w-4 mr-2" /> Write Prescription
              </Button>
            </div>
          )}
          
          {/* Chat Component */}
          <ChatComponent roomId={appointmentId} />
        </Card>
      </div>
    </div>
  )
}