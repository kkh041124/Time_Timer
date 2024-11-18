import { useState } from "react";
import Clock from "../../component/Clock/Clock";
import Icon from "../../component/Icon/Icon";
import styles from "./Home.module.css";

const Home = () => {
  const [isCheck, setIsCheck] = useState(false);
  const handleChcek = () => {
    setIsCheck(!isCheck);
    console.log(isCheck);
  };
  return (
    <div className={styles.Home}>
      <div className={styles.Clock}>
        <Clock isCheck={isCheck} />
        <button onClick={handleChcek}>
          {isCheck ? "집중 중" : "집중 시작하기"}
        </button>
      </div>
      <div className={styles.Icon}>
        <Icon />
      </div>
    </div>
  );
};

export default Home;
