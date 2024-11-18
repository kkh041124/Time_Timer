import { useEffect, useRef, useState } from "react";
import pallet from "./asset/palette.svg";
import styles from "./ColorPicker.module.css";

const ColoerPicker = () => {
  const [color, setColor] = useState(null);
  const colorPallet = useRef(null);

  const handle = () => {
    const newInput = document.createElement("input");
    newInput.setAttribute("type", "color");
    newInput.style.display = "none";

    newInput.addEventListener("input", (e) => {
      setColor(e.target.value);
    });

    document.body.appendChild(newInput);
    newInput.click();

    newInput.addEventListener("change", () => {
      document.body.removeChild(newInput);
    });
  };
  return (
    <div className={styles.ColorPicker}>
      <img src={pallet} ref={colorPallet} onClick={handle} alt="Palette" />
    </div>
  );
};

export default ColoerPicker;
