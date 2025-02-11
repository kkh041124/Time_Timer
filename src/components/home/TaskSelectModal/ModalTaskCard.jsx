// components/modals/TaskSelectModal/ModalTaskCard.jsx

import React from "react";
import styles from "./ModalTaskCard.module.css";

/** 우선순위(1~5)에 따라 별(★)을 채워주는 함수 */
function renderStars(priority = 0) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={i <= priority ? styles.starFilled : styles.starEmpty}
      >
        ★
      </span>
    );
  }
  return stars;
}

/**
 * 모달 전용 TaskCard
 * @param {Object} props
 * @param {Object} props.task - { id, title, dueDate, priority, progress, status }
 * @param {Function} [props.onClick] - 카드 클릭 시 실행할 함수 (optional)
 */
const ModalTaskCard = ({ task, onClick }) => {
  if (!task) return null;

  const { id, title, dueDate, priority, progress, status } = task;

  // 날짜 포맷 (한국어)
  const formattedDate = dueDate
    ? new Date(dueDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
    : "날짜 없음";

  // 우선순위 별점
  const starElements = renderStars(priority);

  // 상태별 표시 (todo / inProgress / done)
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

  return (
    <div className={styles.taskCard} onClick={() => onClick?.(id)}>
      <h3 className={styles.title}>{title}</h3>

      {/* 별점 */}
      <div className={styles.stars}>{starElements}</div>

      {/* 날짜 & 진행도 */}
      <div className={styles.infoRow}>
        <div className={styles.infoItem}>
          <span className={styles.calendarIcon}>📅</span>
          {formattedDate}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.timerIcon}>⏱</span>
          {progress}
        </div>
      </div>

      {/* 상태 배지 */}
      <span className={statusMap[status]?.className}>
        {statusMap[status]?.text}
      </span>
    </div>
  );
};

export default ModalTaskCard;
