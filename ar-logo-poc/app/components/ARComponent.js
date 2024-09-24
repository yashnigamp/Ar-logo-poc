import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

const WebXRARComponent = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.xr.enabled = true;

      containerRef.current.appendChild(renderer.domElement);
      document.body.appendChild(ARButton.createButton(renderer));

      const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(0, 0, -0.3);
      scene.add(cube);

      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      scene.add(light);

      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      window.addEventListener('resize', onWindowResize, false);

      return () => {
        window.removeEventListener('resize', onWindowResize);
        containerRef.current?.removeChild(renderer.domElement);
      };
    }
  }, []);

  return <div ref={containerRef} />;
};

export default WebXRARComponent;