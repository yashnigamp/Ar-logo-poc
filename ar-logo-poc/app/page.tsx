"use client"
/* eslint-disable @next/next/no-sync-scripts */
import { useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => console.error('Error accessing the camera:', err));
    }
  }, []);

  return (
    <div>
      <Head>
        {/* Include AR.js via CDN */}
        <script src="https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/aframe/build/aframe-ar.js"></script>
      </Head>
      <h1>AR Camera Feed</h1>
      <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />

      {/* AR.js A-Frame scene */}
      <a-scene embedded arjs="sourceType: webcam;">
        {/* Use a cube or custom object */}
        <a-box position="0 0.5 0" material="color: red;"></a-box>
        {/* Marker-based AR */}
        <a-marker-camera preset="hiro"></a-marker-camera>
      </a-scene>
    </div>
  );
}
