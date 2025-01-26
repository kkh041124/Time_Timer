import styles from "./DetailPanel.module.css";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Flag, Bell, Plus } from "lucide-react";

const DetailPanel = ({ task, onClose }) => {
  if (!task) return null;

  // 뽀모도로 표시 예시: "2/4 = 50분" 형태, 없으면 "0/0 = 0분"
  const pomodoroText = task.pomodoro || "0/0 = 0분";

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
        {/* 태그 텍스트 (혹은 tag 리스트)를 보여주기 위한 p 태그 */}
        <p>{task.tags}</p>
        {/* 태그 추가 버튼 */}
        <div className={styles.tagAddButton}>
          <button>
            <Plus />
          </button>
          <h2>태그</h2>
        </div>
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
          <span className={styles.value}>{task.dueDate || "오늘"}</span>
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
          {task.description ? (
            <p>{task.description}</p>
          ) : (
            <input placeholder="노트 추가..." className={styles.noteInput} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
