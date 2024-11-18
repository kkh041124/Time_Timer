import { useState, useRef } from "react";
import pallet from "./asset/palette.svg";
import styles from "./ColorPicker.module.css";

const ColorPicker = ({ color, updateColorChange }) => {
  const colorInputRef = useRef(null);

  const handleColorChange = (e) => {
    updateColorChange(e.target.value);
  };
  const handleClick = () => {
    colorInputRef.current.click();
  };

  return (
    <div className={styles.ColorPicker}>
      <img
        src={pallet}
        alt="Palette"
        className={styles.PaletteIcon}
        onClick={handleClick}
      />
      <input
        type="color"
        ref={colorInputRef}
        className={styles.ColorInput}
        value={color}
        onChange={handleColorChange}
      />
    </div>
  );
};

export default ColorPicker;
