import styles from "./DetailPanel.module.css";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Flag, Bell, Plus } from "lucide-react";

const DetailPanel = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className={styles.detailPanel}>
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
      <div className={styles.content}>
        <div className={styles.tagContent}>
          <p>
            <strong>{task.tags}</strong>
          </p>
          <div className={styles.tagAddButton}>
            <button>
              <Plus />
            </button>
            <h2>태그</h2>
          </div>
        </div>
        <div>
          <h2>🍅</h2>
          <h3>뽀모도로 수</h3>
          <p>{task.pomodoro}</p>
        </div>
        <div className={styles.dueDate}>
          <h2>📅</h2>
          <h3>마감일</h3>
          <p>{task.dueDate}</p>
        </div>
        <div className={styles.folder}>
          <h2>📁</h2>
          <h3>프로젝트</h3>
          <p>작업</p>
        </div>
        <div className={styles.alarm}>
          <Bell />
          <h3>미리 알람</h3>
          <p>없음</p>
        </div>
      </div>
      <div className={styles.description}>
        <p>
          <strong>설명: </strong>
          {task.description}
        </p>
      </div>
    </div>
  );
};

export default DetailPanel;
