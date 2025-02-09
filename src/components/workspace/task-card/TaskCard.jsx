import { Checkbox } from "@/components/ui/checkbox";
import { GripHorizontal, Trash2 } from "lucide-react";
import styles from "./TaskCard.module.css";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import useTaskStore from "../../../store/taskStore";

const TaskCard = ({ task, isOverlay = false }) => {
  const { activeId, setSelectedTaskId, setIsDetailOpen, removeTask } =
    useTaskStore();

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    transition,
  } = useDraggable({
    id: task?.id,
    disabled: isOverlay,
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: task?.id,
  });

  const combinedRef = (node) => {
    setDraggableRef(node);
    setDroppableRef(node);
  };

  if (!task) return null;

  const borderClass =
    task.status === "todo"
      ? "border-gray-300"
      : task.status === "inProgress"
      ? "border-blue-500"
      : task.status === "done"
      ? "border-green-500"
      : "border-gray-300";

  const isDragging = activeId === task.id && !isOverlay;

  const style = isOverlay
    ? {
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        transition: transition || undefined,
      }
    : {
        opacity: isDragging ? 0 : 1,
      };

  // 카드 클릭 시 DetailPanel 열기/닫기
  const handleCardClick = () => {
    if (task.id === useTaskStore.getState().selectedTaskId) {
      setIsDetailOpen(!useTaskStore.getState().isDetailOpen);
    } else {
      setSelectedTaskId(task.id);
      setIsDetailOpen(true);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    removeTask(task.id);
  };

  return (
    <div
      ref={combinedRef}
      {...attributes}
      className={`border-2 ${styles.taskCard} ${borderClass}`}
      style={style}
    >
      <div className={styles.cardHeader}>
        <div className={styles.checkboxContainer}>
          <Checkbox />
          <span className={styles.cardTitle}>{task.title}</span>
        </div>
        <div className={styles.trashIconContainer} onClick={handleDelete}>
          <Trash2 className={styles.trashIcon} />
        </div>
      </div>
      <div className={styles.cardContent} onClick={handleCardClick}>
        <div className={styles.priorityContainer}>
          {Array.from({ length: task.priority }, (_, index) => (
            <span key={index} className={styles.starIcon}>
              ⭐
            </span>
          ))}
        </div>
        {task.dueDate && (
          <div className={styles.dueDate}>
            <span className={styles.calendarIcon}>📅</span>
            <strong>마감일 :</strong>{" "}
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
        {task.duration && (
          <div className={styles.duration}>
            <span className={styles.appleIcon}>🍎</span>
            <strong>진행시간 :</strong> {task.duration}
          </div>
        )}
        <div className={styles.progressContainer}>
          <div className={styles.progress}>
            <span className={styles.appleIcon}>🍎</span>
            <strong>진행률 :</strong> 🍎🍎⭕⭕ (2/4 완료)
          </div>
          <div className={styles.gripHorizontal} {...listeners}>
            <GripHorizontal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
