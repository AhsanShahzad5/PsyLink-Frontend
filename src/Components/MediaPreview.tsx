import React, { useEffect, useRef, useState } from 'react';
import { Camera, AlertCircle, Mic, RefreshCw, Settings, X } from 'lucide-react';

interface MediaStreamControlsProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onEndStream: () => void;
}

const MediaStreamControls: React.FC<MediaStreamControlsProps> = ({ 
  isMuted, 
  onToggleMute,
  onEndStream 
}) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
      <div className="px-6 py-3 rounded-full flex items-center space-x-6" 
           style={{ backgroundColor: 'rgba(204, 204, 204, 0.85)' }}>
        <button 
          onClick={onToggleMute} 
          className="p-2 rounded-full transition-colors duration-200"
          style={{ 
            backgroundColor: isMuted ? '#999' : '#ccc',
            border: '1px solid rgba(255, 255, 255, 0.5)'
          }}
        >
          <Mic size={20} style={{ color: 'white' }} />
        </button>
        <button 
          className="p-2 rounded-full transition-colors duration-200"
          style={{ 
            backgroundColor: '#ccc',
            border: '1px solid rgba(255, 255, 255, 0.5)'
          }}
        >
          <Settings size={20} style={{ color: 'white' }} />
        </button>
        <button 
          onClick={onEndStream}
          className="p-2 rounded-full transition-colors duration-200"
          style={{ 
            backgroundColor: '#ff6666',
            border: '1px solid rgba(255, 255, 255, 0.5)'
          }}
        >
          <X size={20} style={{ color: 'white' }} />
        </button>
      </div>
    </div>
  );
};

const MediaPreview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [streamActive, setStreamActive] = useState<boolean>(false);

  const startMediaStream = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
      setStreamActive(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error accessing media devices:', err);
      setError('Permission denied or device not available.');
      setIsLoading(false);
    }
  };

  const stopMediaStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setStreamActive(false);
    }
  };

  useEffect(() => {
    startMediaStream();

    return () => {
      // Clean up the media stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleMute = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-lg shadow-md" 
         style={{ 
           textAlign: 'center',
           backgroundColor: '#f9f9f9',
           border: '1px solid #ccc'
         }}>
      <div className="w-full flex items-center justify-between mb-6 border-b pb-4" style={{ borderColor: '#ccc' }}>
        <div className="flex items-center">
          <Camera size={28} style={{ color: '#ccc' }} className="mr-3" />
          <h2 className="text-2xl font-semibold" style={{ color: '#333' }}>Media Preview</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${streamActive ? 'animate-pulse' : ''}`} 
                 style={{ backgroundColor: streamActive ? '#66cc66' : '#ccc' }}></div>
            <span style={{ color: '#999' }}>{streamActive ? 'Active' : 'Inactive'}</span>
          </div>
          <Mic 
            size={22} 
            style={{ color: isMuted ? '#ccc' : '#333' }}
            onClick={toggleMute}
            className="cursor-pointer"
          />
        </div>
      </div>

      <div className="w-full relative">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-80 rounded-lg" 
               style={{ border: '2px solid #ccc', backgroundColor: '#f0f0f0' }}>
            <div className="w-16 h-16 border-4 rounded-full animate-spin" 
                 style={{ borderTopColor: '#ccc', borderColor: '#eee' }}></div>
            <p className="mt-6" style={{ color: '#666' }}>Initializing camera...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center p-8 rounded-lg" 
               style={{ border: '2px solid #ccc', backgroundColor: '#fff5f5' }}>
            <AlertCircle size={56} style={{ color: 'red' }} className="mb-5" />
            <p className="text-lg mb-4" style={{ color: 'red' }}>{error}</p>
            <button 
              className="mt-2 px-6 py-3 rounded-md text-white flex items-center"
              style={{ backgroundColor: '#ccc' }}
              onClick={() => startMediaStream()}
            >
              <RefreshCw size={18} className="mr-2" />
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && streamActive && (
          <div className="relative rounded-lg overflow-hidden"
               style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={isMuted}
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
                backgroundColor: '#000',
                borderRadius: '8px',
                border: '2px solid #ccc',
              }}
            />
            <MediaStreamControls 
              isMuted={isMuted} 
              onToggleMute={toggleMute} 
              onEndStream={stopMediaStream} 
            />
          </div>
        )}
        
        {!isLoading && !error && !streamActive && (
          <div className="flex flex-col items-center justify-center p-12 rounded-lg" 
               style={{ border: '2px solid #ccc', backgroundColor: '#f0f0f0' }}>
            <Camera size={56} style={{ color: '#ccc' }} className="mb-6" />
            <p className="text-lg mb-6" style={{ color: '#666' }}>
              Camera stream has ended
            </p>
            <button 
              className="px-6 py-3 rounded-md text-white flex items-center"
              style={{ backgroundColor: '#ccc' }}
              onClick={() => startMediaStream()}
            >
              Start Camera
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 w-full text-sm px-4 py-3 rounded" 
           style={{ color: '#999', backgroundColor: 'rgba(204, 204, 204, 0.2)' }}>
        <p className="text-center">
          This secure preview uses your device's camera and microphone. 
          Your media stream is processed locally and not stored or transmitted.
        </p>
      </div>
    </div>
  );
};

export default MediaPreview;