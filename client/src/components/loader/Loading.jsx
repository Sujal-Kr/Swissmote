import { LoaderIcon } from "lucide-react";
import React from "react";
const RouteLoader = () => {
  return (
    <div className="grid min-h-dvh place-content-center">
      <div className="flex gap-3">
        <LoaderIcon size={24} className="animate-spin text-indigo-500" />
        <div className="animate-pulse">Loading...</div>
      </div>
    </div>
  );
};

export { RouteLoader };

