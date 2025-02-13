import React from "react";
import styles from "./SelectedTaskDisplay.module.css";
import useTaskStore from "../../../store/taskStore";

function renderStars(priority = 0) {
  return Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={styles.star}
      style={{ color: i < priority ? "#FFD700" : "#4B5563" }} // ⭐ 노란색 / 회색 적용
    >
      ★
    </span>
  ));
}

const SelectedTaskDisplay = () => {
  const { tasks, selectedTaskId, setSelectedTaskId, setTaskSelectModalOpen } =
    useTaskStore();

  const task = tasks.find((t) => t.id === selectedTaskId);
  if (!task) return null;

  const starElements = renderStars(task.priority || 0); // 기본값 0
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "날짜 없음";

  const handleCancel = () => {
    setSelectedTaskId(null); // 작업 선택 해제 (삭제 X)
  };

  const handleEdit = () => {
    setTaskSelectModalOpen(true); // 수정 모달 열기
  };

  // ✅ 상태별 스타일 매핑
  const statusMap = {
    todo: {
      text: "대기중",
      className: styles.statusTodo,
    },
    inProgress: {
      text: "진행중",
      className: styles.statusInProgress,
    },
    done: {
      text: "완료",
      className: styles.statusDone,
    },
  };

  // ✅ `task.status`가 존재하지 않을 경우 기본값 "대기중" 처리
  const taskStatus = statusMap[task.status] ?? statusMap["todo"];

  return (
    <div className={styles.card}>
      <div className={styles.taskHeader}>
        <h3 className={styles.taskTitle}>{task.title}</h3>
        <div className={styles.buttonGroup}>
          <button className={styles.editButton} onClick={handleEdit}>
            변경
          </button>
          <button className={styles.deleteButton} onClick={handleCancel}>
            취소
          </button>
        </div>
      </div>
      <div className={styles.taskDetails}>
        <div className={styles.stars}>{starElements}</div>
        <span className={styles.dot}>•</span>
        <span className={styles.dueDate}>📅 {formattedDueDate}</span>
        <span className={styles.dot}>•</span>
        <span className={`${styles.statusTag} ${taskStatus.className}`}>
          {taskStatus.text}
        </span>
      </div>
    </div>
  );
};

export default SelectedTaskDisplay;
