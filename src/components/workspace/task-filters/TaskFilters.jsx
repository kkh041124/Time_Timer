import styles from "./TaskFilters.module.css";
import { Smile, Clock, Calendar, Flag, CheckSquare } from "lucide-react";

import { useState } from "react";

const TaskFilters = ({ tasks }) => {
  const [activeFilter, setActiveFilter] = useState(null);
  const formatDate = (date) => {
    if (!date) return "미정";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  const filters = [
    { id: "today", icon: <Smile />, title: "오늘" },
    { id: "tomorrow", icon: <Clock />, title: "내일" },
    { id: "week", icon: <Calendar />, title: "이번주" },
    { id: "plan", icon: <Flag />, title: "계획됨" },
    { id: "finished", icon: <CheckSquare />, title: "완료됨" },
    { id: "current_folder1", icon: <Flag />, title: "필터 1" },
    { id: "current_folder2", icon: <Flag />, title: "필터 2" },
  ];

  return (
    <div className={styles.TaskFilters}>
      {filters.map((filter) => (
        <div
          key={filter.id}
          className={`${styles.Filter} ${
            activeFilter === filter.id ? styles.active : ""
          }`}
          onClick={() => setActiveFilter(filter.id)}
          tabIndex="0"
        >
          {filter.icon}
          <h2>{filter.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default TaskFilters;
