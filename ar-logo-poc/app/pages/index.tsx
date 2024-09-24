/* eslint-disable @next/next/no-sync-scripts */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [showAR, setShowAR] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCameraClick = () => {
    setShowAR(true);
  };

  return (
    <div>
      <Head>
        <title>AR Logo POC</title>
        <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
        <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
      </Head>

      {!showAR ? (
        <button onClick={handleCameraClick}>Open Camera</button>
      ) : isClient ? (
        <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;">
          <a-marker preset="hiro">
            <a-image
              src="/logo.png"
              position="0 0 0"
              scale="1 1 1"
              rotation="-90 0 0"
            ></a-image>
          </a-marker>
          <a-entity camera></a-entity>
        </a-scene>
      ) : null}
    </div>
  );
}