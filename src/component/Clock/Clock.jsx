import { useState, useEffect, useRef } from "react";
import styles from "./Clock.module.css";

const Clock = ({ isCheck, color }) => {
  const [angle, setAngle] = useState(0); // 현재 각도 상태
  const [minutes, setMinutes] = useState(0); // 분 상태
  const [click, setClick] = useState(true); // 클릭 상태
  const ClockRef = useRef(null);
  const ClickerRef = useRef(null);

  // 이 상태는 useRef를 사용해 컴포넌트 리렌더링 시 값을 유지
  const prevColorRef = useRef(color);

  let centerX = 0;
  let centerY = 0;

  const handleMouseMove = (e) => {
    const mouseX = e.pageX;
    const mouseY = e.pageY;

    let newAngle =
      Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
    newAngle = newAngle < 0 ? newAngle + 360 : newAngle;

    setAngle((newAngle + 90) % 360);
  };

  const updateTime = () => {
    const calculatedMinutes = Math.floor((angle / 6) % 60); // 각도를 6도당 1분으로 변환
    setMinutes(calculatedMinutes);
  };

  const toggleClick = () => {
    setClick((prev) => !prev); // 클릭 상태 토글
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

    if (ClockRef.current && !isCheck && click) {
      ClockRef.current.addEventListener("mousemove", handleMouseMove);
      ClockRef.current.addEventListener("mousemove", updateTime);
    } else if (ClockRef.current) {
      ClockRef.current.removeEventListener("mousemove", handleMouseMove);
      ClockRef.current.removeEventListener("mousemove", updateTime);
    }

    window.addEventListener("resize", updateCenter);

    return () => {
      if (ClockRef.current) {
        ClockRef.current.removeEventListener("mousemove", handleMouseMove);
        ClockRef.current.removeEventListener("mousemove", updateTime);
      }
      window.removeEventListener("resize", updateCenter);
    };
  }, [isCheck, click]);

  useEffect(() => {
    if (!isCheck) return;

    const handleTick = () => {
      setAngle((prevAngle) => (prevAngle + 0.1) % 360);
    };

    const intervalId = setInterval(handleTick, 1000);

    return () => clearInterval(intervalId);
  }, [isCheck, click]);

  // color 값이 변경될 때 상태를 초기화하지 않도록 설정
  useEffect(() => {
    if (prevColorRef.current !== color) {
      prevColorRef.current = color;
    }
  }, [color]);

  return (
    <div
      className={styles.Clock}
      ref={ClockRef}
      onClick={toggleClick} // 클릭 시 상태 토글
    >
      <div className={styles.Clock_wrapper}>
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
