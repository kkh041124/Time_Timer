import { X, Plus } from "lucide-react";
import styles from "./WorkSpace.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";

import FolderPanel from "../../components/workspace/folder-panel/FolderPanel";
import TaskFilters from "../../components/workspace/task-filters/TaskFilters";
import TaskGrid from "../../components/workspace/task-grid/TaskGrid";
import TaskStats from "../../components/workspace/task-stats/TaskStats";
import AddTaskModal from "../../components/workspace/AddTaskModal/AddTaskModal";
import TaskCard from "../../components/workspace/task-card/TaskCard";

const WorkSpace = () => {
  const navigate = useNavigate();

  // 로컬 스토리지에서 불러와서 state 세팅
  const [tasks, setTasks] = useState([]);

  // ID 발급용 ref
  const idRef = useRef(1);

  // 드래그 중인 카드의 ID
  const [activeId, setActiveId] = useState(null);

  // 작업 추가 모달 열림 상태
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      let tasksArray = JSON.parse(stored);
      let changed = false;

      // 0번 ID → 교정
      tasksArray = tasksArray.map((task) => {
        if (task.id === 0) {
          task.id = idRef.current;
          idRef.current += 1;
          changed = true;
        }
        return task;
      });

      const maxId = Math.max(...tasksArray.map((t) => t.id ?? 1));
      idRef.current = Math.max(idRef.current, maxId + 1);

      if (changed) {
        localStorage.setItem("tasks", JSON.stringify(tasksArray));
      }
      setTasks(tasksArray);
    } else {
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const maxId = Math.max(...tasks.map((t) => t.id ?? 1));
      idRef.current = Math.max(idRef.current, maxId + 1);
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // 모달 열기/닫기
  const handleAddTaskClick = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  // 새 태스크 추가
  const handleAddTask = (task) => {
    setTasks((prev) => {
      const newTask = { ...task, id: idRef.current };
      idRef.current += 1;
      return [...prev, newTask];
    });
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

        {/* 오른쪽 메인 영역 */}
        <div className={styles.rightPane}>
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
              <TaskGrid tasks={tasks} activeId={activeId} />
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
