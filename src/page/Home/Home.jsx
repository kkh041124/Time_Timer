import { useRef } from "react";
import Clock from "../../components/home/Clock/Clock";
import Icon from "../../components/home/Icon/Icon";
import styles from "./Home.module.css";
import TaskSelectModal from "../../components/home/TaskSelectModal/TaskSelectModal";
import { Plus } from "lucide-react";
import useTaskStore from "../../store/taskStore";
import SelectedTaskDisplay from "../../components/home/TaskSelectModal/SelectedTaskDisplay";

const Home = () => {
  const {
    color,
    setColor,
    tasks,
    selectedTaskId,
    taskSelectModalOpen,
    setTaskSelectModalOpen,
  } = useTaskStore();
  const clockRef = useRef(null);

  const updateColorChange = (newColor) => {
    setColor(newColor);
  };

  // 모달 열기
  const handleSelectTask = () => {
    setTaskSelectModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setTaskSelectModalOpen(false);
  };

  // tasks 배열에서 selectedTaskId에 해당하는 작업 정보를 가져옴
  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

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
        {/* 선택된 작업이 있으면 새로운 UI(SelectedTaskDisplay)로 표시하고, 없으면 '작업 선택하기' 버튼을 표시 */}
        {selectedTask ? (
          <SelectedTaskDisplay task={selectedTask} onClick={handleSelectTask} />
        ) : (
          <button className={styles.selectBtn} onClick={handleSelectTask}>
            <Plus /> 작업 선택하기
          </button>
        )}
        <div className={styles.Clock} ref={clockRef}>
          <Clock color={color} />
        </div>
      </div>
      {taskSelectModalOpen && <TaskSelectModal onClose={handleCloseModal} />}
    </div>
  );
};

export default Home;
