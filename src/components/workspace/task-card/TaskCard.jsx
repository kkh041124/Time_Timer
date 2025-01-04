import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Calendar, Apple } from "lucide-react";
import styles from "./TaskCard.module.css";

const TaskCard = ({ task, className }) => {
  console.log(task); // Debugging: Log the task data

  if (!task) {
    return null;
  }

  // Determine the border class based on the task status
  const borderClass =
    task.status === "todo"
      ? "border-gray-300"
      : task.status === "inProgress"
      ? "border-blue-500"
      : task.status === "done"
      ? "border-green-500"
      : "border-gray-300";
  const priorityClass = (priority) => {
    if (priority === 1) {
      return (
        <div className={styles.priorityContainer}>
          <Star className={styles.starIcon} />
        </div>
      );
    } else if (priority === 2) {
      return (
        <div className={styles.priorityContainer}>
          <Star className={styles.starIcon} />
          <Star className={styles.starIcon} />
        </div>
      );
    } else if (priority === 3) {
      return (
        <div className={styles.priorityContainer}>
          <Star className={styles.starIcon} />
          <Star className={styles.starIcon} />
          <Star className={styles.starIcon} />
        </div>
      );
    } else if (priority === 4) {
      return (
        <div className={styles.priorityContainer}>
          <Star className={styles.starIcon} />
          <Star className={styles.starIcon} />
          <Star className={styles.starIcon} />
          <Star className={styles.starIcon} />
        </div>
      );
    } else if (priority === 5) {
      return (
        <div className={styles.priorityContainer}>
          <Star className={styles.starIcon} />
          <Star className={styles.starIcon} />
          <Star className={styles.starIcon} />
          <Star className={styles.starIcon} />
          <Star className={styles.starIcon} />
        </div>
      );
    }
  };
  return (
    <div className={`border-2 ${styles.taskCard} ${borderClass}`}>
      <div className={styles.cardHeader}>
        <input type="checkbox" />
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
        <div className={styles.dueDate}>
          <span className={styles.calendarIcon}>📅</span>
          <strong>마감일 :</strong>{" "}
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
        </div>
        {task.duration && (
          <div className={styles.duration}>
            <span className={styles.appleIcon}>🍎</span>
            <strong>진행시간 :</strong> {task.duration}
          </div>
        )}
        {/* <div className={styles.progress}>
          <span className={styles.appleIcon}>🍎</span>
          <strong>진행률 :</strong>
          {Array.from({ length: task.progress.total }, (_, index) =>
            index < task.progress.completed ? "🍎" : "⭕"
          ).join(" ")}{" "}
          ({task.progress.completed}/{task.progress.total} 완료)
        </div> */}
        <div className={styles.progress}>
          <span className={styles.appleIcon}>🍎</span>
          <strong>진행률 :</strong> 🍎🍎⭕⭕ (2/4 완료)
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
