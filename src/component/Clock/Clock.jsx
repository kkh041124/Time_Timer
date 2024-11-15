import { useState, useEffect, useRef } from "react";
import styles from "./Clock.module.css";

const Clock = () => {
  const [angle, setAngle] = useState(0);
  const ClockRef = useRef(null); // Clock 전체를 참조하는 Ref
  const ClickerRef = useRef(null);

  useEffect(() => {
    const updateCenter = () => {
      if (ClickerRef.current) {
        const rect = ClickerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const handleMouseMove = (e) => {
          const mouseX = e.pageX;
          const mouseY = e.pageY;

          // Clicker의 중심을 기준으로 마우스 위치에 따른 각도 계산
          let newAngle =
            Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
          newAngle = newAngle < 0 ? newAngle + 360 : newAngle;

          // 90도를 더해 시작점을 12시 방향으로 조정
          setAngle((newAngle + 90) % 360);
        };

        if (ClockRef.current) {
          ClockRef.current.addEventListener("mousemove", handleMouseMove);
          return () =>
            ClockRef.current.removeEventListener("mousemove", handleMouseMove);
        }
      }
    };

    updateCenter();
    window.addEventListener("resize", updateCenter);
    return () => window.removeEventListener("resize", updateCenter);
  }, []);

  return (
    <div className={styles.Clock} ref={ClockRef}>
      <div className={styles.Clock_wrapper}>
        <div className={styles.tick_mark_wrapper}>
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
              {i % 5 === 0 ? (
                <h2
                  className={styles.tick_number}
                  style={{
                    transform: `rotate(${-i * 6}deg)`,
                  }}
                >
                  {i === 0 ? "0" : 60 - i}
                </h2>
              ) : null}
            </div>
          ))}
        </div>
        <div className={styles.timer_slider_wrapper}>
          <div
            className={styles.timer_slider}
            style={{
              background: `conic-gradient(#1e1e1e ${angle}deg, #b33b3f ${angle}deg 360deg)`,
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
