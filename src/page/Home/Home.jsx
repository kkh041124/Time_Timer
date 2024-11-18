import { useState } from "react";
import Clock from "../../component/Clock/Clock";
import Icon from "../../component/Icon/Icon";
import styles from "./Home.module.css";

const Home = () => {
  const [isCheck, setIsCheck] = useState(false);
  const [color, setColor] = useState("#b33b3f");

  const handleCheck = () => {
    setIsCheck(!isCheck);
  };

  const updateColorChange = (newColor) => {
    setColor(newColor);
  };
  console.log(isCheck);
  return (
    <div className={styles.Home}>
      <div className={styles.Icon}>
        <Icon color={color} updateColorChange={updateColorChange} />
      </div>
      <div className={styles.Main}>
        <div className={styles.Clock}>
          <Clock isCheck={isCheck} color={color} />
        </div>
        <button
          className={`${styles.focusBtn} ${
            isCheck ? styles.focusBtnActive : ""
          }`}
          onClick={handleCheck}
        >
          {isCheck ? "집중 중" : "집중 시작하기"}
        </button>
      </div>
    </div>
  );
};

export default Home;
