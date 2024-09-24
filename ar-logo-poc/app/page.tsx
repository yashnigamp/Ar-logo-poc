"use client";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Home() {
  const [isModelPlaced, setIsModelPlaced] = useState(false);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );

    // Renderer setup with WebXR
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Light setup
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // Reticle for surface detection
    const reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial()
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    // Load 3D model
    let model: THREE.Group;
    const loader = new GLTFLoader();
    loader.load(
      "/logo.glb", // Replace with the path to your GLB file
      (gltf) => {
        model = gltf.scene;
        model.scale.set(0.1, 0.1, 0.1); // Adjust scale as needed
        model.visible = false;
        scene.add(model);
      },
      undefined,
      (error) => console.error("An error occurred loading the model:", error)
    );

    // WebXR session and hit test source setup
    let hitTestSource: XRHitTestSource | null = null;
    let hitTestSourceRequested = false;

    // Add WebXR AR button
    document.body.appendChild(
      ARButton.createButton(renderer, {
        requiredFeatures: ["hit-test"],
        optionalFeatures: ["dom-overlay"],
        domOverlay: { root: document.body },
      })
    );

    // Animation loop
    renderer.setAnimationLoop((timestamp, frame) => {
      if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (session && !hitTestSourceRequested) {
          session
            .requestReferenceSpace("viewer")
            .then((viewerReferenceSpace) => {
              if (viewerReferenceSpace) {
                session
                  .requestHitTestSource?.({ space: viewerReferenceSpace })
                  ?.then((source) => {
                    if (source) {
                      hitTestSource = source;
                    }
                  })
                  .catch((error) => {
                    console.error("Error requesting hit test source:", error);
                  });
              }
            });

          hitTestSourceRequested = true;
        }

        if (hitTestSource && referenceSpace) {
          const hitTestResults = frame.getHitTestResults(hitTestSource);
          if (hitTestResults.length) {
            const hit = hitTestResults[0];
            const hitPose = hit.getPose(referenceSpace);
            if (hitPose) {
              reticle.visible = true;
              reticle.matrix.fromArray(hitPose.transform.matrix);

              if (!isModelPlaced && model && session) {
                // Place the model on tap
                const selectHandler = () => {
                  if (!isModelPlaced) {
                    model.position.setFromMatrixPosition(reticle.matrix);
                    model.visible = true;
                    reticle.visible = false;
                    setIsModelPlaced(true);
                    session.removeEventListener("select", selectHandler);
                  }
                };
                session.addEventListener("select", selectHandler);
              }
            }
          } else {
            reticle.visible = false;
          }
        }

        renderer.render(scene, camera);
      }
    });

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.removeChild(renderer.domElement);
    };
  }, [isModelPlaced]);

  return <h1 style={{ textAlign: "center" }}>WebXR AR 3D Logo</h1>;
}
