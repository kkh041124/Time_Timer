import { useState } from "react";
import styles from "./DetailPanel.module.css";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Flag, Bell, Plus, ChevronDown } from "lucide-react";
import useTaskStore from "../../../store/taskStore";

const DetailPanel = () => {
  const { selectedTaskId, tasks, isDetailOpen, setIsDetailOpen, updateTask } =
    useTaskStore();

  if (!isDetailOpen || !selectedTaskId) return null;

  const task = tasks.find((t) => t.id === selectedTaskId);
  if (!task) return null;

  const [description, setDescription] = useState(task.description || "");
  const [newTag, setNewTag] = useState("");
  const [title, setTitle] = useState(task.title);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 상태

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
    todo: { text: "대기 중", className: styles.statusTodo },
    inProgress: { text: "진행 중", className: styles.statusInProgress },
    done: { text: "완료", className: styles.statusDone },
  };

  // 설명 변경
  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    updateTask(selectedTaskId, { description: newDescription });
  };

  // 태그 추가
  const handleAddTag = (e) => {
    if (e.key === "Enter" && newTag.trim() !== "") {
      const updatedTags = [...(task.tags || []), newTag.trim()];
      updateTask(selectedTaskId, { tags: updatedTags });
      setNewTag("");
    }
  };

  // 제목 변경
  const handleTitleBlur = () => {
    if (title.trim() !== task.title) {
      updateTask(selectedTaskId, { title });
    }
  };

  // 상태 변경 핸들러
  const handleStatusChange = (newStatus) => {
    updateTask(selectedTaskId, { status: newStatus });
    setIsDropdownOpen(false); // 드롭다운 닫기
  };

  return (
    <div className={styles.detailPanel}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <Checkbox />
          <span
            className={styles.title}
            contentEditable={true}
            suppressContentEditableWarning={true}
            onBlur={handleTitleBlur}
            onInput={(e) => setTitle(e.currentTarget.textContent)}
          >
            {title}
          </span>
        </div>
        <div className={styles.actions}>
          <Flag />
          <button onClick={() => setIsDetailOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* 태그 관리 */}
      <div className={styles.tagContent}>
        <div className={styles.tagContainer}>
          {task.tags?.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
              <button
                className={styles.removeTag}
                onClick={() =>
                  updateTask(selectedTaskId, {
                    tags: task.tags.filter((t) => t !== tag),
                  })
                }
              >
                ❌
              </button>
            </span>
          ))}
        </div>
        <div className={styles.tagAddButton}>
          <input
            type="text"
            placeholder="태그 추가..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleAddTag}
            className={styles.tagInput}
          />
          <button onClick={() => handleAddTag({ key: "Enter" })}>
            <Plus />
          </button>
        </div>
      </div>

      {/* 상태 변경 드롭다운 */}
      <div className={styles.statusContent}>
        <h3>상태</h3>
        <div
          className={`${styles.statusDropdown} ${
            isDropdownOpen ? styles.open : ""
          }`}
        >
          <button onClick={() => setIsDropdownOpen((prev) => !prev)}>
            <span className={statusMap[task.status]?.className}>
              {statusMap[task.status]?.text}
            </span>
            <ChevronDown />
          </button>
          {isDropdownOpen && (
            <div className={styles.statusOptions}>
              {Object.entries(statusMap).map(([key, { text }]) => (
                <div
                  key={key}
                  className={styles.statusOption}
                  onClick={() => handleStatusChange(key)}
                >
                  {text}
                </div>
              ))}
            </div>
          )}
        </div>
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
