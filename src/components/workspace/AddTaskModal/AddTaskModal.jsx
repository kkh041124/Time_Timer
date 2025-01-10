import { useRef, useState } from "react";
import { Calendar, Star, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./AddTaskModal.module.css";

const AddTaskModal = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState(null);
  const [pomodoro, setPomodoro] = useState(0);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [priority, setPriority] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (date) => {
    setDueDate(date);
  };

  const togglePriority = (value) => {
    setPriority((prev) => (prev === value ? value - 1 : value));
  };
  const toggleCalendar = () => {
    setIsCalendarOpen((prev) => !prev);
  };
  const handleTagsChange = (e) => {
    setTags(e.target.value.split(",").map((tag) => tag.trim()));
  };

  const handleAddTask = () => {
    const newTask = {
      title,
      status,
      dueDate,
      pomodoro,
      description,
      tags,
      priority,
    };
    onAddTask(newTask);

    onClose();
    setTitle("");
    setStatus("todo");
    setDueDate(null);
    setPomodoro(0);
    setDescription("");
    setTags([]);
    setPriority(0);
    localStorage.setItem("task", JSON.stringify(newTask));
    console.log(localStorage.getItem("task"));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.AddTaskModal}>
        <header className={styles.header}>
          <h2>새 작업 추가</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X className={styles.closeIcon} />
          </button>
        </header>
        <div className={styles.modalBody}>
          <div className={styles.inputGroup}>
            <label htmlFor="title" className={styles.label}>
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="status" className={styles.label}>
              상태
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={styles.select}
            >
              <option value="todo">대기 중</option>
              <option value="inProgress">진행 중</option>
              <option value="done">완료</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="dueDate" className={styles.label}>
              마감일
            </label>
            <div className={styles.dateInputWrapper} onClick={toggleCalendar}>
              <Calendar className={styles.dateIcon} />
              <span className={styles.placeholder}>
                {dueDate ? dueDate.toLocaleDateString("ko-KR") : "마감일 선택"}
              </span>
              <DatePicker
                selected={dueDate}
                onChange={handleDateSelect}
                open={isCalendarOpen}
                onClickOutside={() => setIsCalendarOpen(false)}
                dateFormat="yyyy-MM-dd"
                className={styles.hiddenDateInput}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="pomodoro" className={styles.label}>
              뽀모도로 횟수
            </label>
            <input
              type="number"
              id="pomodoro"
              value={pomodoro}
              onChange={(e) => setPomodoro(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description" className={styles.label}>
              설명
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="tags" className={styles.label}>
              태그
            </label>
            <input
              type="text"
              id="tags"
              value={tags.join(", ")}
              onChange={handleTagsChange}
              className={styles.input}
              placeholder="태그를 쉼표로 구분"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="priority" className={styles.label}>
              우선순위
            </label>
            <div className={styles.starButtonContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => togglePriority(value)}
                  className={`${styles.priorityButton} ${
                    priority >= value ? styles.activeStar : styles.inactiveStar
                  }`}
                >
                  <Star className={styles.starIcon} />
                </button>
              ))}
            </div>
          </div>
          <div className={styles.addButtonContainer}>
            <button className={styles.addButton} onClick={handleAddTask}>
              추가
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
