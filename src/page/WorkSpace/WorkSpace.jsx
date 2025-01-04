import { X } from "lucide-react";
import { Plus } from "lucide-react";
import styles from "./WorkSpace.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import FolderPanel from "../../components/workspace/folder-panel/FolderPanel";
import TaskFilters from "../../components/workspace/task-filters/TaskFilters";
import TaskGrid from "../../components/workspace/task-grid/TaskGrid";
import TaskStats from "../../components/workspace/task-stats/TaskStats";
import AddTaskModal from "../../components/workspace/AddTaskModal/AddTaskModal";

const WorkSpace = () => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  console.log(tasks);

  const handleAddTaskClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddTask = (task) => {
    setTasks((prevTasks) =>
      Array.isArray(prevTasks) ? [...prevTasks, task] : [task]
    );
    setModalOpen(false);
  };

  return (
    <div className={styles.WorkSpace}>
      <header className={styles.header}>
        <div className={styles.title}>WorkSpace</div>
        <button className={styles.closeButton} onClick={() => navigate("/")}>
          <X className="h-6 w-6" />
        </button>
      </header>
      <div className={styles.content}>
        <div className={styles.folderPanelContainer}>
          <FolderPanel />
        </div>
        <div className={styles.taskContainer}>
          <div className={styles.taskFiltersContainer}>
            <TaskFilters />
          </div>
          <div className={styles.taskStatsContainer}>
            <TaskStats />
          </div>
          <div className={styles.addTaskModal}>
            <h2>작업</h2>
            <button
              onClick={handleAddTaskClick}
              className={styles.addTaskButton}
            >
              <Plus className="h-6 w-6" />
              작업 추가
            </button>
          </div>
          <div className={styles.taskGridContainer}>
            <TaskGrid tasks={tasks} />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddTask={handleAddTask}
          tasks={tasks}
        />
      )}
    </div>
  );
};

export default WorkSpace;
