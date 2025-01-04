import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Calendar, Apple } from "lucide-react";
import styles from "./TaskCard.module.css";

const TaskCard = ({ task }) => {
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
    <Card className={`border-2 ${borderClass} ${styles.taskCard}`}>
      <CardHeader className={styles.cardHeader}>
        <Checkbox />
        <CardTitle className={styles.cardTitle}>{task.title}</CardTitle>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <p className={styles.priority}>{priorityClass(task.priority)}</p>
        <p className={styles.dueDate}>
          <Calendar className={styles.calendarIcon} />
          <strong>마감일 :</strong>
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
        </p>
        <p className={styles.duration}>
          <Apple className={styles.appleIcon} />
          <strong>진행 시간 :</strong> {task.duration} hours
        </p>
        <p className={styles.progress}>
          <Apple className={styles.appleIcon} />
          <strong>진행률 :</strong> <Apple />
          <Apple />
          ⭕⭕
        </p>
        {/* {task.progress && (
          <p className={styles.progress}>
            <strong>Progress:</strong> {`${task.progress}%`}
          </p>
        )} */}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
