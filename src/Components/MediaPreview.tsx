import React, { useEffect, useRef, useState } from 'react';

const MediaPreview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.error('Error accessing media devices:', err);
        setError('Permission denied or device not available.');
      }
    };

    getMediaStream();

    return () => {
      // Clean up the media stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Media Preview</h2>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '500px',
            maxWidth: '100%',
            borderRadius: '8px',
            border: '2px solid #ccc',
          }}
        />
      )}
    </div>
  );
};

export default MediaPreview;
