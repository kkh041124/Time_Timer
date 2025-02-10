"use client";

import React, { useState } from "react";
import { Palette } from "lucide-react";
import useTaskStore from "../../../../store/taskStore";

const ColorPicker = () => {
  const { color, setColor } = useTaskStore();
  const [isOpen, setIsOpen] = useState(false);

  // 팝업 열림/닫힘 토글
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // 컬러 변경 시 store에 바로 업데이트
  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  return (
    <div className="relative inline-block">
      {/* 팔레트 아이콘 버튼 */}
      <button
        type="button"
        onClick={handleToggle}
        className="text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-md p-2"
      >
        <Palette className="h-6 w-6" />
      </button>

      {/* 팝업 (아이콘 옆에 절대 위치) */}
      {isOpen && (
        <div
          className="
            absolute 
            top-1/2 
            left-full 
            ml-2 
            -translate-y-1/2
            bg-white 
            text-black 
            rounded-md 
            shadow-lg 
            p-2
          "
        >
          {/* 컬러 인풋 */}
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="w-16 h-10 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
