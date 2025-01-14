import styles from "./DetailPanel.module.css";
import { X } from "lucide-react";

const DetailPanel = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className={styles.detailPanel}>
      <div className={styles.header}>
        <h2>상세 정보</h2>
        <button onClick={onClose}>
          <X />
        </button>
      </div>
      <div className={styles.content}>
        <p>
          <strong>제목: </strong>
          {task.title}
        </p>
        <p>
          <strong>상태: </strong>
          {task.status}
        </p>
        <p>
          <strong>설명: </strong>
          {task.description}
        </p>
        {/* ... 나머지 필요한 필드 표시 ... */}
      </div>
    </div>
  );
};

export default DetailPanel;
