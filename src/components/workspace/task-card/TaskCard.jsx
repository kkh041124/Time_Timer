import { useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { GripHorizontal, Trash2 } from "lucide-react";
import styles from "./TaskCard.module.css";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import useTaskStore from "../../../store/taskStore";

const TaskCard = ({ task, isOverlay = false, onCardClick, onDelete }) => {
  const { activeId } = useTaskStore();

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

  // 두 ref를 결합하여 동일한 DOM 요소에 할당 (useCallback으로 안정적으로 생성)
  const combinedRef = useCallback(
    (node) => {
      setDraggableRef(node);
      setDroppableRef(node);
    },
    [setDraggableRef, setDroppableRef]
  );

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
        <div
          className={styles.trashIconContainer}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
        >
          <Trash2 className={styles.trashIcon} />
        </div>
      </div>
      <div className={styles.cardContent} onClick={() => onCardClick(task.id)}>
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
