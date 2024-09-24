// File: global.d.ts

declare namespace JSX {
  interface IntrinsicElements {
    "a-scene": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      embedded?: boolean;
      arjs?: string;
    };
    "a-entity": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      camera?: boolean;
      position?: string;
      rotation?: string;
    };
    "a-marker": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      preset?: string;
      type?: string;
      url?: string;
    };
    "a-image": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      src?: string;
      position?: string;
      rotation?: string;
      scale?: string;
    };
    "a-box": JSX;
    "a-sphere": JSX;
    "a-cylinder": JSX;
    "a-plane": JSX;
    "a-sky": JSX;
    "a-marker-camera": JSX;
    // Add :other A-Frame elements as needed
  }
}
interface NavigatorMediaDevices {
  getUserMedia: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
}

declare global {
  interface Navigator {
    mediaDevices: NavigatorMediaDevices;
  }
}
// File: pages/index.tsx
// (No changes needed in this file from the previous version)
