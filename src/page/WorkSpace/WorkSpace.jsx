import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import TaskGrid from "../../components/workspace/task-grid/TaskGrid";
import FolderPanel from "../../components/workspace/folder-panel/FolderPanel";
import TaskFilters from "../../components/workspace/task-filters/TaskFilters";
import TaskStats from "../../components/workspace/task-stats/TaskStats";
import AddTaskModal from "../../components/workspace/AddTaskModal/AddTaskModal";
import DetailPanel from "../../components/workspace/detail-panel/DetailPanel";
import TaskCard from "../../components/workspace/task-card/TaskCard";
import styles from "./WorkSpace.module.css";
import { X, Plus } from "lucide-react";

const WorkSpace = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const idRef = useRef(1);
  const [activeId, setActiveId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Load tasks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      let tasksArray = JSON.parse(stored);
      let changed = false;

      tasksArray = tasksArray.map((task) => {
        if (task.id === 0) {
          task.id = idRef.current++;
          changed = true;
        }
        return task;
      });

      if (changed) {
        localStorage.setItem("tasks", JSON.stringify(tasksArray));
      }

      setTasks(tasksArray);
    }
  }, []);

  // Save tasks to localStorage on update
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Add task modal handlers
  const handleAddTaskClick = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleAddTask = (task) => {
    setTasks((prev) => [...prev, { ...task, id: idRef.current++ }]);
    setModalOpen(false);
  };

  // Drag and drop handlers
  const handleDragStart = (event) => setActiveId(event.active.id);
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const updated = [...tasks];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);
    setTasks(updated);
  };

  // Delete task handler
  const handleDeleteTask = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  // DetailPanel handlers
  const handleCardClick = (id) => {
    if (selectedTaskId === id) {
      setIsDetailOpen(!isDetailOpen); // Toggle DetailPanel
    } else {
      setSelectedTaskId(id);
      setIsDetailOpen(true); // Open DetailPanel for a new task
    }
  };

  const closeDetail = () => {
    setIsDetailOpen(false); // Close DetailPanel
    setSelectedTaskId(null);
  };

  const isDragging = activeId !== null;

  return (
    <div className={styles.WorkSpace}>
      <header className={styles.header}>
        <h1 className={styles.title}>WorkSpace</h1>
        <button className={styles.closeButton} onClick={() => navigate("/")}>
          <X className="h-6 w-6" />
        </button>
      </header>

      <div className={styles.main}>
        <div className={styles.leftPane}>
          <FolderPanel />
        </div>

        <div
          className={`${styles.centerPane} ${
            isDetailOpen ? styles.detailOpen : ""
          }`}
        >
          <div className={styles.topSection}>
            <TaskFilters tasks={tasks} />
            <TaskStats />
          </div>

          <div className={styles.tasksHeader}>
            <h2>작업</h2>
            <button
              onClick={handleAddTaskClick}
              className={styles.addTaskButton}
            >
              <Plus className="h-6 w-6" />
              작업 추가
            </button>
          </div>

          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className={styles.taskGridContainer}>
              <TaskGrid
                tasks={tasks}
                activeId={activeId}
                onDelete={handleDeleteTask}
                onCardClick={handleCardClick}
              />
            </div>

            <DragOverlay style={{ zIndex: 9999 }}>
              {activeId != null ? (
                <TaskCard
                  task={tasks.find((t) => t.id === activeId)}
                  isOverlay
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        <div
          className={`${styles.rightPane} ${isDetailOpen ? styles.open : ""}`}
        >
          {isDetailOpen && selectedTaskId && (
            <DetailPanel
              task={tasks.find((t) => t.id === selectedTaskId)}
              onClose={closeDetail}
              onDescriptionChange={(newDescription) =>
                setTasks((prev) =>
                  prev.map((task) =>
                    task.id === selectedTaskId
                      ? { ...task, description: newDescription }
                      : task
                  )
                )
              }
            />
          )}
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
