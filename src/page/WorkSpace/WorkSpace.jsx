import React, { useRef } from "react";
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
import useTaskStore from "../../store/taskStore";

const WorkSpace = () => {
  const navigate = useNavigate();
  const idRef = useRef(1);

  const {
    tasks,
    setTasks,
    modalOpen,
    setModalOpen,
    isDetailOpen,
    setIsDetailOpen,
    selectedTaskId,
    setSelectedTaskId,
    activeId,
    setActiveId,
  } = useTaskStore();

  // 기존 localStorage 관련 useEffect 제거
  // Zustand persist가 localStorage를 자동으로 관리하므로 필요 없음

  // Add Task
  const handleAddTaskClick = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleAddTask = (task) => {
    setTasks([...tasks, { ...task, id: idRef.current++ }]);
    setModalOpen(false);
  };

  // Drag and Drop
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

  // Delete Task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // DetailPanel
  const handleCardClick = (id) => {
    if (selectedTaskId === id) {
      setIsDetailOpen(!isDetailOpen);
    } else {
      setSelectedTaskId(id);
      setIsDetailOpen(true);
    }
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
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
            <TaskFilters />
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
            <DetailPanel onClose={closeDetail} />
          )}
        </div>
      </div>

      {modalOpen && <AddTaskModal />}
    </div>
  );
};

export default WorkSpace;
