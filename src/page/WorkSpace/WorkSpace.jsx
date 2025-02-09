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
    addTask,
    removeTask,
    updateTask,
    modalOpen,
    setModalOpen,
    isDetailOpen,
    setIsDetailOpen,
    selectedTaskId,
    setSelectedTaskId,
    activeId,
    setActiveId,
    filter,
  } = useTaskStore();

  // 작업 추가 핸들러
  const handleAddTaskClick = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleAddTask = (task) => {
    addTask({ ...task, id: idRef.current++ });
    setModalOpen(false);
  };

  // Drag & Drop 핸들러
  const handleDragStart = (event) => setActiveId(event.active.id);
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const updatedTasks = [...tasks];
    const [moved] = updatedTasks.splice(oldIndex, 1);
    updatedTasks.splice(newIndex, 0, moved);

    updateTask(active.id, { order: newIndex }); // 순서 정보 업데이트
  };

  // 작업 삭제 핸들러
  const handleDeleteTask = (id) => removeTask(id);

  // 작업 상세 패널 핸들러
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

  // 필터링된 작업 목록 반환
  const getFilteredTasks = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // 현재 시간을 00:00:00으로 설정하여 비교

    return tasks.filter((task) => {
      if (!task.dueDate) return false; // 마감일 없는 작업 제외

      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0); // 마감일의 시간도 00:00:00으로 맞추기
      const dayDiff = Math.floor((taskDate - now) / (1000 * 60 * 60 * 24)); // 날짜 차이 계산

      switch (filter) {
        case "today":
          return dayDiff === 0;
        case "tomorrow":
          return dayDiff === 1;
        case "week":
          return dayDiff >= 0 && dayDiff <= 6;
        case "finished":
          return task.status === "done";
        case "all":
        default:
          return true; // 전체 보기
      }
    });
  };

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
                tasks={getFilteredTasks()} // 필터링된 작업 전달
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
