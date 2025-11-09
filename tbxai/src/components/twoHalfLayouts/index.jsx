import React from "react";
import Assistant from "./Assistant";

const TwoHalfLayout = ({ chatHistory, children }) => {
  return (
    <div className="h-screen w-full flex">
      {/* Sidebar */}
      {/* <div className="w-1/4 h-full border bg-black text-white flex items-center justify-center">
        chatHistory
      </div> */}

      {/* Assistant area */}
      <div className="flex-1 relative">
        <Assistant />
      </div>
    </div>
  );
};

export default TwoHalfLayout;
