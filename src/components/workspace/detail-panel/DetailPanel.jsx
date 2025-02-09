import { useState } from "react";
import styles from "./DetailPanel.module.css";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Flag, Bell, Plus } from "lucide-react";
import useTaskStore from "../../../store/taskStore";

const DetailPanel = () => {
  const { selectedTaskId, tasks, isDetailOpen, setIsDetailOpen, updateTask } =
    useTaskStore();

  if (!isDetailOpen || !selectedTaskId) return null; // 선택된 Task가 없거나, 패널이 닫혀 있으면 렌더링하지 않음

  const task = tasks.find((t) => t.id === selectedTaskId);
  if (!task) return null; // Task가 없으면 리턴

  const [description, setDescription] = useState(task.description || "");

  const pomodoroText = task.pomodoro || "0/0 = 0분";

  const formatDate = (date) => {
    if (!date) return "미정";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  const newDate = task.dueDate ? formatDate(new Date(task.dueDate)) : "미정";

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

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    updateTask(selectedTaskId, { description: newDescription }); // Zustand 상태 업데이트
  };

  return (
    <div className={styles.detailPanel}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <Checkbox />
          <span className={styles.title}>{task.title}</span>
        </div>
        <div className={styles.actions}>
          <Flag />
          <button onClick={() => setIsDetailOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className={styles.tagContent}>
        <p>{task.tags?.join(", ") || "태그 없음"}</p>
        <div className={styles.tagAddButton}>
          <button>
            <Plus />
          </button>
          <h2>태그</h2>
        </div>
      </div>

      <div className={styles.statusContent}>
        <h3>상태</h3>
        <div className={styles.statusContainer}>
          <div className={`${circleClass} h-3 w-3 rounded-full mr-2`}></div>
          <p>{newStatus}</p>
        </div>
        <hr className={styles.divider} />
      </div>

      <div className={styles.content}>
        <div className={styles.rowItem}>
          <div className={styles.iconAndLabel}>
            <span className={styles.emoji}>🍅</span>
            <span className={styles.label}>뽀모도로수</span>
          </div>
          <span className={styles.value}>{pomodoroText}</span>
        </div>
        <hr className={styles.divider} />

        <div className={styles.rowItem}>
          <div className={styles.iconAndLabel}>
            <span className={styles.emoji}>📅</span>
            <span className={styles.label}>마감일</span>
          </div>
          <span className={styles.value}>{newDate}</span>
        </div>
        <hr className={styles.divider} />

        <div className={styles.rowItem}>
          <div className={styles.iconAndLabel}>
            <span className={styles.emoji}>📁</span>
            <span className={styles.label}>프로젝트</span>
          </div>
          <span className={styles.value}>작업</span>
        </div>
        <hr className={styles.divider} />

        <div className={styles.rowItem}>
          <div className={styles.iconAndLabel}>
            <Bell className="mr-2" />
            <span className={styles.label}>미리 알림</span>
          </div>
          <span className={styles.value}>없음</span>
        </div>
        <hr className={styles.divider} />

        <div className={styles.noteSection}>
          <input
            className={styles.noteInput}
            value={description}
            placeholder="노트 추가..."
            onChange={handleDescriptionChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
