import React, { useCallback, useEffect } from 'react';
import MediaPreview from '../../Components/MediaPreview';
import { useSocket } from '@/context/SocketProvider';
import { useRecoilValue } from 'recoil';
import userAtom from '@/atoms/userAtom';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VideoPreview: React.FC = () => {

    const navigate = useNavigate()
    const user = useRecoilValue(userAtom);

     console.log(user);

     const [searchParams] = useSearchParams();
     const roomId = searchParams.get('appointmentId');

    const socket = useSocket();

    const handleJoinCallButton= useCallback(
        (e)=>{
            socket?.emit('room:join',{user,roomId})
        },[user,socket]
    ) ;
  
    const handleJoinRoom = useCallback((data)=>{
        const {roomId}=data;
        navigate(`/patient/video-consultation/${roomId}`)
    },[navigate])
        

    useEffect(() => {
        socket?.on("room:join", handleJoinRoom)
        return()=>{
            socket?.off("room:join",handleJoinRoom)
        }
      }, [socket,handleJoinRoom])
  
  
    return (
    <div className=" bg-secondary flex flex-col items-center px-4 py-12">
      <h1 className="text-xl md:text-xl font-bold text-center mb-10 text-gray-800">
        Camera & Mic Permission
      </h1>

      <div className="w-full max-w-2xl flex flex-col items-center bg-primary shadow-lg p-6 rounded-lg">
        <MediaPreview />

        <button
          className="mt-6 px-8 py-3 text-white text-lg font-semibold bg-green-500 hover:bg-green-600 rounded-lg transition duration-200 shadow-md"
        onClick={handleJoinCallButton}
       
       >
          Join Call
        </button>
      </div>
    </div>
  );
};

export default VideoPreview;
