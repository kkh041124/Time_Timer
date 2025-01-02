import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import styles from "./TaskCard.module.css";

const TaskCard = ({ task }) => {
  if (!task) {
    return null;
  }

  return (
    <Card className={styles.taskCard}>
      <CardHeader>
        <Checkbox />
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Status: {task.status}</p>
        <p>
          Due Date: {task.dueDate ? task.dueDate.toLocaleDateString() : "N/A"}
        </p>
        <p>Priority: {task.priority}</p>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
