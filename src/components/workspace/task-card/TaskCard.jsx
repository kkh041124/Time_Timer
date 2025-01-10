import { Checkbox } from "@/components/ui/checkbox";
import { GripHorizontal } from "lucide-react";
import styles from "./TaskCard.module.css";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const TaskCard = ({ task, isOverlay = false, activeId }) => {
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

  // 드래그 중인 원본 카드(오버레이 X) → 투명
  const isDragging = activeId === task.id && !isOverlay;

  // 오버레이로 렌더링 시 transform/transition 적용
  const style = isOverlay
    ? {
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        transition: transition || undefined,
      }
    : {
        opacity: isDragging ? 0 : 1,
      };

  console.log("TaskCard Render - id:", task.id);

  return (
    <div
      ref={combinedRef}
      {...attributes}
      className={`border-2 ${styles.taskCard} ${borderClass}`}
      style={style}
    >
      <div className={styles.cardHeader}>
        <Checkbox />
        <span className={styles.cardTitle}>{task.title}</span>
      </div>
      <div className={styles.cardContent}>
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
