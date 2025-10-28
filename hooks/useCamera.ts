
import React from 'react';
import { useState, useEffect, useCallback } from 'react';

export const useCamera = (videoRef: React.RefObject<HTMLVideoElement>, isEnabled: boolean) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    if (stream) return; // Already started
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      if (err instanceof Error) {
        setError(`Camera access denied: ${err.message}`);
      } else {
        setError("An unknown error occurred while accessing the camera.");
      }
    }
  }, [videoRef, stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (isEnabled) {
      startCamera();
    } else {
      stopCamera();
    }

    // Cleanup function to stop camera when component unmounts or isEnabled becomes false
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled, startCamera]);

  return { stream, error };
};
