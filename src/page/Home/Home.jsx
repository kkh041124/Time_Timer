import { useState, useRef } from "react";
import Clock from "../../components/home/Clock/Clock";
import Icon from "../../components/home/Icon/Icon";
import styles from "./Home.module.css";
import TaskSelectModal from "../../components/home/TaskSelectModal/TaskSelectModal";
import { Plus } from "lucide-react";
import useTaskStore from "../../store/taskStore";

const Home = () => {
  const { color, setColor, taskSelectModalOpen, setTaskSelectModalOpen } =
    useTaskStore();

  const [isCheck, setIsCheck] = useState(false);

  const clockRef = useRef(null);

  const handleCheck = () => {
    setIsCheck(!isCheck);
  };

  const updateColorChange = (newColor) => {
    setColor(newColor);
  };

  const handleSelectTask = () => setTaskSelectModalOpen(true);
  const handleCloseModal = () => setTaskSelectModalOpen(false);
  return (
    <div className={styles.Home}>
      <div className={styles.Icon}>
        <Icon
          color={color}
          updateColorChange={updateColorChange}
          clockRef={clockRef}
        />
      </div>
      <div className={styles.Main}>
        <button className={styles.selectBtn} onClick={handleSelectTask}>
          <Plus /> 작업 선택하기
        </button>
        <div className={styles.Clock} ref={clockRef}>
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
      {taskSelectModalOpen && <TaskSelectModal onClose={handleCloseModal} />}
    </div>
  );
};

export default Home;
