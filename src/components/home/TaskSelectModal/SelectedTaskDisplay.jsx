import React from "react";
import styles from "./SelectedTaskDisplay.module.css";
import { Edit } from "lucide-react";

/**
 * 선택된 작업을 보여주는 UI 컴포넌트
 * @param {Object} props
 * @param {Object} props.task - { id, title, dueDate, priority, progress, status }
 * @param {Function} props.onClick - 작업 변경을 위해 클릭 시 호출되는 함수
 */
const SelectedTaskDisplay = ({ task, onClick }) => {
  if (!task) return null;

  // 마감일 포맷 (한국어)
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
    : "날짜 미정";

  return (
    <div
      className={styles.selectedTaskContainer}
      onClick={onClick}
      title="작업 변경"
    >
      <div className={styles.taskHeader}>
        <h2 className={styles.taskTitle}>{task.title}</h2>
        <button className={styles.changeTaskBtn} aria-label="작업 변경">
          <Edit />
        </button>
      </div>
      <div className={styles.taskDetails}>
        <p>
          <strong>마감일:</strong> {formattedDueDate}
        </p>
        <p>
          <strong>우선순위:</strong> {task.priority}
        </p>
        <p>
          <strong>진행도:</strong> {task.progress}
        </p>
        <p>
          <strong>상태:</strong> {task.status}
        </p>
      </div>
    </div>
  );
};

export default SelectedTaskDisplay;
