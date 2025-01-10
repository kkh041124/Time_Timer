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

  // 1) 로컬 스토리지에서 불러와서 state 세팅
  const [tasks, setTasks] = useState([]);

  // 2) ID 발급용 ref: 1부터 시작
  const idRef = useRef(1);

  // 3) 드래그 중인 카드의 ID
  const [activeId, setActiveId] = useState(null);

  // 4) 작업 추가 모달 열림 상태
  const [isModalOpen, setModalOpen] = useState(false);

  /**
   * 첫 마운트 시 로컬 스토리지 데이터 로드 + "0번 ID → 1 이상"으로 마이그레이션
   */
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      let tasksArray = JSON.parse(stored);
      let changed = false;

      // 0번 ID를 가진 태스크를 찾아 교정
      tasksArray = tasksArray.map((task) => {
        if (task.id === 0) {
          task.id = idRef.current; // 1 이상으로 교체
          idRef.current += 1;
          changed = true;
        }
        return task;
      });

      // 최대 ID 확인
      const maxId = Math.max(...tasksArray.map((t) => t.id ?? 1));
      // 만약 기존 데이터 중 maxId가 5라면, 다음 할당 ID는 6
      idRef.current = Math.max(idRef.current, maxId + 1);

      // 교정된 내용 다시 로컬 스토리지에 저장
      if (changed) {
        localStorage.setItem("tasks", JSON.stringify(tasksArray));
      }
      // state 반영
      setTasks(tasksArray);
    } else {
      // 로컬 스토리지에 아무것도 없으면 초기 상태는 빈 배열
      setTasks([]);
    }
  }, []);

  /**
   * tasks 변경 시마다 로컬 스토리지 업데이트
   * + idRef도 최대값+1 로 유지
   */
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

  /**
   * 새 태스크 추가 시
   * - 무조건 ID가 1 이상
   */
  const handleAddTask = (task) => {
    setTasks((prev) => {
      const newTask = { ...task, id: idRef.current };
      idRef.current += 1;
      return [...prev, newTask];
    });
    setModalOpen(false);
  };

  // 드래그 시작
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // 드래그 종료: 순서 변경 + activeId 해제
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    // 명시적으로 over == null 확인 (0일 가능성은 없으나, !over를 피함)
    if (over == null) return;
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
