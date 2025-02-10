"use client";

import React, { useRef } from "react";
import { Palette } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@radix-ui/react-tooltip";

const ColorPicker = ({ color, updateColorChange }) => {
  const colorInputRef = useRef(null);

  const handleColorChange = (e) => {
    updateColorChange(e.target.value);
  };

  const handleClick = () => {
    colorInputRef.current.click();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-md p-2"
            onClick={handleClick}
          >
            <Palette className="h-6 w-6" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          sideOffset={8}
          className="bg-white text-black rounded-md p-2 shadow-lg"
        >
          <p>색상 변경</p>
        </TooltipContent>
      </Tooltip>
      <input
        type="color"
        ref={colorInputRef}
        className="hidden"
        value={color}
        onChange={handleColorChange}
      />
    </TooltipProvider>
  );
};

export default ColorPicker;
