"use client";
import dynamic from "next/dynamic";

const WebXRARComponent = dynamic(() => import("./components/ARComponent"), {
  ssr: false,
  loading: () => <p>Loading AR component...</p>,
});

export default function Home() {
  return (
    <div>
      <h1>AR Logo App</h1>
      <WebXRARComponent />
    </div>
  );
}
