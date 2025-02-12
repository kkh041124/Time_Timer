import { useState, useEffect, useRef } from "react";
import styles from "./Clock.module.css";
import useTaskStore from "../../../store/taskStore";
import { Button } from "@/components/ui/button";

const Clock = () => {
  const [angle, setAngle] = useState(0);
  const [click, setClick] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // 🛠 한 번 시작했는지 여부
  const elapsedTimeRef = useRef(0); // 🛠 경과 시간 유지
  const ClockRef = useRef(null);
  const ClickerRef = useRef(null);
  const { color } = useTaskStore();

  let centerX = 0;
  let centerY = 0;

  const handleMouseMove = (e) => {
    if (!click || isActive || hasStarted) return; // 🛠 한 번 시작 후 회전 불가

    const mouseX = e.pageX;
    const mouseY = e.pageY;

    let newAngle =
      Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
    newAngle = newAngle < 0 ? newAngle + 360 : newAngle;

    setAngle((newAngle + 90) % 360);
  };

  const toggleClick = () => {
    if (!isActive && !hasStarted) setClick((prev) => !prev);
  };

  useEffect(() => {
    const updateCenter = () => {
      if (ClickerRef.current) {
        const rect = ClickerRef.current.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
      }
    };

    updateCenter();
    window.addEventListener("resize", updateCenter);

    if (ClockRef.current && !isActive && click && !hasStarted) {
      ClockRef.current.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (ClockRef.current) {
        ClockRef.current.removeEventListener("mousemove", handleMouseMove);
      }
      window.removeEventListener("resize", updateCenter);
    };
  }, [click, isActive, hasStarted]);

  useEffect(() => {
    if (!isActive) return;

    const handleTick = () => {
      setAngle((prevAngle) => (prevAngle + 0.1) % 360);
      setElapsedTime((prevTime) => prevTime + 1);
      elapsedTimeRef.current += 1; // 🛠 경과 시간 유지
    };

    const intervalId = setInterval(handleTick, 1000);
    return () => clearInterval(intervalId);
  }, [isActive]);

  // 🛠 현재 시간을 초 단위로 업데이트
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
    };

    const timeInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  const handleStart = () => {
    setIsActive((prev) => !prev);

    if (!isActive) {
      setHasStarted(true); // 🛠 한 번 시작하면 다시 회전 불가
    }

    if (!isActive) {
      setElapsedTime(elapsedTimeRef.current); // 🛠 중단 후 다시 시작 시 경과 시간 유지
    }
  };

  // 🛠 0에서 시작하도록 `Math.ceil(angle / 6)`로 수정
  let minutes = (60 - Math.ceil(angle / 6)) % 60;
  let seconds = (60 - Math.ceil((angle % 6) * 10)) % 60;

  // 현재 시간 표시 (HH:MM:SS)
  const formattedCurrentTime = currentTime.toLocaleTimeString("ko-KR", {
    hour12: false,
  });

  // 시간 포맷 함수
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className={styles.Clock_wrapper}>
      {/* 중앙 남은 시간 표시 */}
      <div className={styles.timeOverlay}>
        <div className={styles.remainingTime}>
          {formatTime(minutes * 60 + seconds)}
        </div>
        <div className={styles.currentTime}>{formattedCurrentTime}</div>
        <div className={styles.elapsedTime}>
          {formatTime(elapsedTimeRef.current)} 경과
        </div>
        <Button
          onClick={handleStart}
          className={`${styles.focusButton} ${
            isActive ? styles.focusButtonActive : ""
          }`}
        >
          {isActive ? "멈추기" : "집중 시작하기"}
        </Button>
      </div>

      <div className={styles.Clock} ref={ClockRef} onClick={toggleClick}>
        <div className={styles.tick_mark_wrapper}>
          <div className={styles.Clock}>
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className={styles.tick_mark}
                style={{
                  transform: `rotate(${i * 6}deg)`,
                  height: i % 5 === 0 ? "28px" : "18px",
                  backgroundColor: i % 5 === 0 ? "white" : "gray",
                }}
              >
                {i % 5 === 0 && (
                  <div
                    className={styles.tick_number}
                    style={{
                      transform: `translate(-50%, -50%) rotate(${-i * 6}deg)`,
                    }}
                  >
                    {i === 0 ? "60" : 60 - i}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.timer_slider_wrapper}>
          <div
            className={styles.timer_slider}
            style={{
              background: `conic-gradient(#111827 ${angle}deg, ${color} ${angle}deg 360deg)`,
            }}
          >
            <div className={styles.Clicker} ref={ClickerRef}>
              <div
                className={styles.Clicker_box}
                style={{ transform: `rotate(${angle - 90}deg)` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
