// components/LottieLoader.jsx
"use client";

import Lottie from "lottie-react";
import loadingAnimation from "../../../public/loading/Loading Dots Blue.json";

export default function LottieLoader() {
  return (
    <div className="fixed inset-0 z-9999 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="w-40 h-40">
        <Lottie
          animationData={loadingAnimation}
          loop
          autoplay
        />
      </div>
    </div>
  );
}
