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
    setSelectedTaskId, // 작업 선택 해제를 위한 함수
    taskSelectModalOpen,
    setTaskSelectModalOpen,
  } = useTaskStore();
  const clockRef = useRef(null);

  const updateColorChange = (newColor) => {
    setColor(newColor);
  };

  // 작업 선택 모달 열기
  const handleSelectTask = () => {
    setTaskSelectModalOpen(true);
  };

  // 작업 선택 모달 닫기
  const handleCloseModal = () => {
    setTaskSelectModalOpen(false);
  };

  // 작업 취소 (선택 해제 → '작업 선택하기' 버튼 보이게 함)
  const handleCancelTask = () => {
    setSelectedTaskId(null);
  };

  // 선택된 작업 찾기
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
        {/* 작업이 선택된 경우: 작업 카드 표시 / 선택된 작업이 없으면 버튼 표시 */}
        {selectedTask ? (
          <SelectedTaskDisplay
            task={selectedTask}
            onCancel={handleCancelTask}
          />
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
