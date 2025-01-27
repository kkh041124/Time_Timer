import { useState } from "react";
import styles from "./DetailPanel.module.css";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Flag, Bell, Plus } from "lucide-react";

const DetailPanel = ({ task, onClose }) => {
  if (!task) return null;

  const [description, setDescription] = useState(task.description || "");

  // 뽀모도로 표시 예시: "2/4 = 50분" 형태, 없으면 "0/0 = 0분"
  const pomodoroText = task.pomodoro || "0/0 = 0분";

  const formatDate = (date) => {
    if (!date) return "미정";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  const newDate = task.dueDate ? formatDate(new Date(task.dueDate)) : "미정";

  // 상태와 스타일 매핑 객체
  const statusMap = {
    todo: { text: "대기 중", className: "bg-gray-500" },
    inProgress: { text: "진행 중", className: "bg-blue-500" },
    done: { text: "완료", className: "bg-green-500" },
  };

  const { text: newStatus, className: circleClass } = statusMap[
    task.status
  ] || {
    text: "미정",
    className: "bg-gray-500",
  };

  return (
    <div className={styles.detailPanel}>
      {/* 헤더 영역 */}
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <Checkbox />
          <span className={styles.title}>{task.title}</span>
        </div>
        <div className={styles.actions}>
          <Flag />
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* 태그 관련 영역 */}
      <div className={styles.tagContent}>
        <p>{task.tags?.join(", ") || "태그 없음"}</p>
        <div className={styles.tagAddButton}>
          <button>
            <Plus />
          </button>
          <h2>태그</h2>
        </div>
      </div>

      {/* 상태 영역 */}
      <div className={styles.statusContent}>
        <h3>상태</h3>
        <div className={styles.statusContainer}>
          <div className={`${circleClass} h-3 w-3 rounded-full mr-2`}></div>
          <p>{newStatus}</p>
        </div>
        <hr className={styles.divider} />
      </div>

      {/* 본문 영역 */}
      <div className={styles.content}>
        {/* 뽀모도로 */}
        <div className={styles.rowItem}>
          <div className={styles.iconAndLabel}>
            <span className={styles.emoji}>🍅</span>
            <span className={styles.label}>뽀모도로수</span>
          </div>
          <span className={styles.value}>{pomodoroText}</span>
        </div>
        <hr className={styles.divider} />

        {/* 마감일 */}
        <div className={styles.rowItem}>
          <div className={styles.iconAndLabel}>
            <span className={styles.emoji}>📅</span>
            <span className={styles.label}>마감일</span>
          </div>
          <span className={styles.value}>{newDate}</span>
        </div>
        <hr className={styles.divider} />

        {/* 프로젝트 */}
        <div className={styles.rowItem}>
          <div className={styles.iconAndLabel}>
            <span className={styles.emoji}>📁</span>
            <span className={styles.label}>프로젝트</span>
          </div>
          <span className={styles.value}>작업</span>
        </div>
        <hr className={styles.divider} />

        {/* 미리 알림 (벨 아이콘 + 없음) */}
        <div className={styles.rowItem}>
          <div className={styles.iconAndLabel}>
            <Bell className="mr-2" />
            <span className={styles.label}>미리 알림</span>
          </div>
          <span className={styles.value}>없음</span>
        </div>
        <hr className={styles.divider} />

        {/* 노트/설명 */}
        <div className={styles.noteSection}>
          <input
            className={styles.noteInput}
            value={description}
            placeholder="노트 추가..."
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
