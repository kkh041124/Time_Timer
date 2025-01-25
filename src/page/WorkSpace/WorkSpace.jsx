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

  const [tasks, setTasks] = useState([]); // 로컬 스토리지에서 불러와서 state 세팅
  const idRef = useRef(1); // ID 발급용 ref
  const [activeId, setActiveId] = useState(null); // 드래그 중인 카드의 ID
  const [isModalOpen, setModalOpen] = useState(false); // 작업 추가 모달 열림 상태
  const [isDetailOpen, setIsDetailOpen] = useState(false); // 상세 패널 열림 상태
  const [selectedTaskId, setSelectedTaskId] = useState(null); // 선택된 태스크 ID

  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      let tasksArray = JSON.parse(stored);
      let changed = false;

      // 0번 ID → 교정
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

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // 모달 열기/닫기
  const handleAddTaskClick = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  // 새 태스크 추가
  const handleAddTask = (task) => {
    setTasks((prev) => [...prev, { ...task, id: idRef.current++ }]);
    setModalOpen(false);
  };

  // 드래그
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    if (active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const updated = [...tasks];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);
    setTasks(updated);
  };
  const handleDeleteTask = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  // detail panel
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
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  return (
    <div className={styles.WorkSpace}>
      {/* 상단 헤더 영역 */}
      <header className={styles.header}>
        <h1 className={styles.title}>WorkSpace</h1>
        <button className={styles.closeButton} onClick={() => navigate("/")}>
          <X className="h-6 w-6" />
        </button>
      </header>

      {/* 좌우 레이아웃 */}
      <div className={styles.main}>
        {/* 왼쪽 폴더 패널 */}
        <div className={styles.leftPane}>
          <FolderPanel />
        </div>

        {/* 중앙 카드 패널 */}
        <div className={styles.centerPane}>
          {/* 상단 필터 & 통계영역 */}
          <div className={styles.topSection}>
            <TaskFilters />
            <TaskStats />
          </div>

          {/* 작업 섹션 헤더 + 작업 추가 버튼 */}
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

          {/* Drag & Drop 컨텍스트 */}
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

        {/* 오른쪽 상세 패널 */}
        <div className={`${styles.rightPane} ${isDetailOpen ? styles.open : ""}`}>
          {isDetailOpen && selectedTask && (
            <DetailPanel task={selectedTask} onClose={closeDetail} />
          )}
        </div>
      </div>

      {/* 모달 */}
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
