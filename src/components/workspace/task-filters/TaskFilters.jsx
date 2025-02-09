import styles from "./TaskFilters.module.css";
import { Smile, Clock, Calendar, Flag, CheckSquare } from "lucide-react";
import useTaskStore from "../../../store/taskStore"; // Zustand 추가

const TaskFilters = () => {
  const { filter, setFilter } = useTaskStore(); //  Zustand에서 상태 가져오기

  const filters = [
    { id: "all", icon: <Flag />, title: "전체" },
    { id: "today", icon: <Smile />, title: "오늘" },
    { id: "tomorrow", icon: <Clock />, title: "내일" },
    { id: "week", icon: <Calendar />, title: "이번주" },
    { id: "finished", icon: <CheckSquare />, title: "완료됨" },
  ];

  return (
    <div className={styles.TaskFilters}>
      {filters.map((filterItem) => (
        <div
          key={filterItem.id}
          className={`${styles.Filter} ${
            filter === filterItem.id ? styles.active : ""
          }`}
          onClick={() => setFilter(filterItem.id)} // Zustand 상태 업데이트
          tabIndex="0"
        >
          {filterItem.icon}
          <h2>{filterItem.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default TaskFilters;
