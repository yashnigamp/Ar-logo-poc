/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import Script from "next/script";

const ARSurfaceComponent = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("camera-init", (data) => {
        console.log("AR.js initialized");
      });
    }
  }, []);

  return (
    <>
      <Script
        src="https://aframe.io/releases/1.2.0/aframe.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"
        strategy="beforeInteractive"
      />

      <a-scene
        vr-mode-ui="enabled: false"
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
      >
        <a-box color="red" scale="0.1 0.1 0.1" position="0 0 -1"></a-box>
        <a-camera gps-camera rotation-reader></a-camera>
      </a-scene>
    </>
  );
};

export default ARSurfaceComponent;
