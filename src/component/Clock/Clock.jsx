import { useState, useEffect, useRef } from "react";
import styles from "./Clock.module.css";

const Clock = ({ isCheck }) => {
  const [angle, setAngle] = useState(0);
  const [minute, setMinute] = useState(0);
  const ClockRef = useRef(null); // Clock 전체를 참조하는 Ref
  const ClickerRef = useRef(null);

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

  const transformTime = () => {
    const newTime = 60 - Math.floor(angle / 6);
    setMinute(newTime);
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

    if (ClockRef.current && !isCheck) {
      ClockRef.current.addEventListener("mousemove", handleMouseMove);
      ClockRef.current.addEventListener("mousemove", transformTime);
    }

    window.addEventListener("resize", updateCenter);

    return () => {
      if (ClockRef.current) {
        ClockRef.current.removeEventListener("mousemove", handleMouseMove);
        ClockRef.current.removeEventListener("mousemove", transformTime);
      }
      window.removeEventListener("resize", updateCenter);
    };
  }, [isCheck, angle]);

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
                    transform: `rotate(${i * -6}deg)`,
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
      {/* <h2 className={styles.test}>
        anlge :{angle}, Time : {minute}
      </h2> */}
    </div>
  );
};

export default Clock;
