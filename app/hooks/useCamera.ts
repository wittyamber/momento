import { useState, useEffect, useRef } from 'react';

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null); // We expose this now
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "NotAllowedError") {
          setPermissionDenied(true);
          setError("Camera access denied.");
        }
      }
    };
    initCamera();
    return () => {
      // We do NOT stop the tracks here to allow quick retakes, 
      // but in a real app you might want to stop them on unmount.
    };
  }, []);

  return { videoRef, stream, error, permissionDenied };
};