// components/modals/TaskSelectModal/TaskSelectModal.jsx

import { useState, useMemo } from "react";
import useTaskStore from "../../../store/taskStore";
import styles from "./TaskSelectModal.module.css";
import { Search, X } from "lucide-react";
import ModalTaskCard from "./ModalTaskCard";

/**
 * 날짜 차이를 일 단위로 구하는 함수
 */
function getDayDiff(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));
}

const TaskSelectModal = () => {
  // selectedTaskId 관련 함수를 추가합니다.
  const {
    taskSelectModalOpen,
    setTaskSelectModalOpen,
    tasks,
    setSelectedTaskId,
  } = useTaskStore();

  // 검색어 / 필터 상태
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("전체");

  // 모달 닫힘 시 표시 X
  if (!taskSelectModalOpen) return null;

  const handleCloseModal = () => {
    setTaskSelectModalOpen(false);
  };

  // 필터 버튼 클릭
  const handleFilterClick = (filterName) => {
    setActiveFilter(filterName);
  };

  // 검색어 입력
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // 검색 & 필터 적용
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // 1) 검색어 (title)
    if (searchText.trim()) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 2) 필터
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeFilter) {
      case "오늘": {
        result = result.filter((t) => {
          if (!t.dueDate) return false;
          return getDayDiff(t.dueDate, today) === 0;
        });
        break;
      }
      case "내일": {
        result = result.filter((t) => {
          if (!t.dueDate) return false;
          return getDayDiff(t.dueDate, today) === 1;
        });
        break;
      }
      case "우선순위": {
        result = [...result].sort((a, b) => b.priority - a.priority);
        break;
      }
      case "진행률":
        // 진행률 별 로직이 있다면 여기에...
        break;
      case "전체":
      default:
        // 아무 필터 없음
        break;
    }
    return result;
  }, [tasks, searchText, activeFilter]);

  return (
    <div className={styles.modalOverlay} onClick={handleCloseModal}>
      <div
        className={styles.TaskSelectModal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 검색 바 */}
        <div className={styles.searchBar}>
          <div className={styles.searchWrapper}>
            <Search className="text-gray-400" />
            <input
              type="text"
              placeholder="작업 검색..."
              className="w-full p-2"
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
          <button
            className="text-gray-400 hover:text-gray-100"
            onClick={handleCloseModal}
            aria-label="모달 닫기"
          >
            <X className="text-gray-400" />
          </button>
        </div>

        {/* 필터 버튼 영역 */}
        <div className={styles.filterWrapper}>
          {["전체", "오늘", "내일", "우선순위", "진행률"].map((filter) => (
            <button
              key={filter}
              className={
                filter === activeFilter
                  ? `${styles.filterBtn} ${styles.filterBtnActive}`
                  : styles.filterBtn
              }
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* 카드 2컬럼 목록 */}
        <div className={styles.taskList}>
          {filteredTasks.map((task) => (
            <ModalTaskCard
              key={task.id}
              task={task}
              onClick={(clickedId) => {
                // 작업 선택 시 Zustand 상태 업데이트 및 모달 닫기
                setSelectedTaskId(clickedId);
                setTaskSelectModalOpen(false);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskSelectModal;
