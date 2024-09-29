"use client";
import { useEffect } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Utility to detect iOS
// Utility to detect iOS
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export default function Home() {
  useEffect(() => {
    try {
      if (isIOS()) {
        console.log("Platform: iOS detected");
        setupQuickLook();
      } else {
        console.log("Platform: Android or Web detected");
        setupWebXR();
      }
    } catch (error) {
      console.error("Error during platform detection or setup:", error);
      showError("An unexpected error occurred while detecting the platform.");
    }
  }, []);

  // Quick Look setup for iOS
  const setupQuickLook = () => {
    try {
      console.log("Setting up Quick Look for iOS");
      document.body.innerHTML = `
        <a href="logo.usdz" rel="ar" class="quick-look-button">
          <img src="logo.png" alt="View in AR" style="width: 200px; height: auto; margin: 0 auto; display: block;" />
        </a>
      `;
    } catch (error) {
      console.error("Error setting up Quick Look:", error);
      showError("Failed to set up Quick Look for iOS devices.");
    }
  };

  // WebXR setup for Android
  const setupWebXR = () => {
    try {
      console.log("Setting up WebXR for Android");

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
      );
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      document.body.appendChild(renderer.domElement);

      // Adding lighting
      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      // Reticle for surface detection
      const reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      );
      reticle.visible = false;
      scene.add(reticle);

      // Load 3D model
      let model: THREE.Group;
      const loader = new GLTFLoader();

      console.log("Loading 3D model...");
      loader.load(
        "/logo.glb", // Adjust the path to your GLB file
        (gltf) => {
          model = gltf.scene;
          model.scale.set(0.1, 0.1, 0.1);
          model.visible = false;
          scene.add(model);
          console.log("3D model loaded successfully");
        },
        undefined,
        (error) => {
          console.error("Error loading 3D model:", error);
          showError("Failed to load the 3D model.");
        }
      );

      // AR Button for interaction
      document.body.appendChild(
        ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] })
      );

      // Animation loop with error handling
      renderer.setAnimationLoop((timestamp, frame) => {
        try {
          if (frame) {
            const referenceSpace = renderer.xr.getReferenceSpace();
            if (referenceSpace) {
              renderer.render(scene, camera);
            }
          }
        } catch (error) {
          console.error("Error during WebXR rendering loop:", error);
          showError("An error occurred while rendering AR content.");
        }
      });

      // Handle window resize
      const handleResize = () => {
        try {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        } catch (error) {
          console.error("Error during window resize:", error);
        }
      };

      window.addEventListener("resize", handleResize);
    } catch (error) {
      console.error("Error setting up WebXR for Android:", error);
      showError("Failed to set up WebXR on this device.");
    }
  };

  // Function to show user-friendly error messages
  const showError = (message: string) => {
    document.body.innerHTML = `<div style="color: red; text-align: center; margin-top: 20px;">${message}</div>`;
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>
        Cross-Platform AR Demo
      </h1>
      <p style={{ textAlign: "center" }}>
        Please follow instructions to view the AR content on your device.
      </p>
    </div>
  );
}
