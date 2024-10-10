import React from "react";

const Loader = () => {
  return (
    <div className="w-full h-[calc(100vh-15rem)] flex justify-center items-center">
      <svg
        width="70"
        height="70"
        fill="#ff204e"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="1.5" y="1.5" rx="1" width="9" height="9">
          <animate
            id="spinner_M16P"
            begin="0;spinner_wNI2.end+0.15s"
            attributeName="x"
            dur="0.6s"
            values="1.5;.5;1.5"
            keyTimes="0;.2;1"
          ></animate>
          <animate
            begin="0;spinner_wNI2.end+0.15s"
            attributeName="y"
            dur="0.6s"
            values="1.5;.5;1.5"
            keyTimes="0;.2;1"
          ></animate>
          <animate
            begin="0;spinner_wNI2.end+0.15s"
            attributeName="width"
            dur="0.6s"
            values="9;11;9"
            keyTimes="0;.2;1"
          ></animate>
          <animate
            begin="0;spinner_wNI2.end+0.15s"
            attributeName="height"
            dur="0.6s"
            values="9;11;9"
            keyTimes="0;.2;1"
          ></animate>
        </rect>
        <rect x="13.5" y="1.5" rx="1" width="9" height="9">
          <animate
            begin="spinner_M16P.begin+0.15s"
            attributeName="x"
            dur="0.6s"
            values="13.5;12.5;13.5"
            keyTimes="0;.2;1"
          ></animate>
          <animate
            begin="spinner_M16P.begin+0.15s"
            attributeName="y"
            dur="0.6s"
            values="1.5;.5;1.5"
            keyTimes="0;.2;1"
          ></animate>
          <animate
            begin="spinner_M16P.begin+0.15s"
            attributeName="width"
            dur="0.6s"
            values="9;11;9"
            keyTimes="0;.2;1"
          ></animate>
          <animate
            begin="spinner_M16P.begin+0.15s"
            attributeName="height"
            dur="0.6s"
            values="9;11;9"
            keyTimes="0;.2;1"
          ></animate>
        </rect>
        <rect x="13.5" y="13.5" rx="1" width="9" height="9">
          <animate
            begin="spinner_M16P.begin+0.3s"
            attributeName="x"
            dur="0.6s"
            values="13.5;12.5;13.5"
            keyTimes="0;.2;1"
          ></animate>
          <animate
            begin="spinner_M16P.begin+0.3s"
            attributeName="y"
            dur="0.6s"
            values="13.5;12.5;13.5"
            keyTimes="0;.2;1"
          ></animate>
          <animate
            begin="spinner_M16P.begin+0.3s"
            attributeName="width"
            dur="0.6s"
            values="9;11;9"
            keyTimes="0;.2;1"
          ></animate>
          <animate
            begin="spinner_M16P.begin+0.3s"
            attributeName="height"
            dur="0.6s"
            values="9;11;9"
            keyTimes="0;.2;1"
          ></animate>
        </rect>
        <rect x="1.5" y="13.5" rx="1" width="9" height="9">
          <animate
            id="spinner_wNI2"
            begin="spinner_M16P.begin+0.45s"
            attributeName="x"
            dur="0.6s"
            values="1.5;.5;1.5"
            keyTimes="0;.2;1"
          ></animate>
          <animate
            begin="spinner_M16P.begin+0.45s"
            attributeName="y"
            dur="0.6s"
            values="13.5;12.5;13.5"
            keyTimes="0;.2;1"
          ></animate>
          <animate
            begin="spinner_M16P.begin+0.45s"
            attributeName="width"
            dur="0.6s"
            values="9;11;9"
            keyTimes="0;.2;1"
          ></animate>
          <animate
            begin="spinner_M16P.begin+0.45s"
            attributeName="height"
            dur="0.6s"
            values="9;11;9"
            keyTimes="0;.2;1"
          ></animate>
        </rect>
      </svg>
    </div>
  );
};

export default Loader;
