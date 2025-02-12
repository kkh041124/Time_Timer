import { useEffect, useRef, useState } from "react";
import styles from "./Clock.module.css";
import useTaskStore from "../../../store/taskStore";
import { Button } from "@/components/ui/button";

const Clock = () => {
  // store에서 clock 상태와 관련 액션, 색상(color) 등을 불러옵니다.
  const clock = useTaskStore((state) => state.clock);
  const setClockAngle = useTaskStore((state) => state.setClockAngle);
  const lockClockAngle = useTaskStore((state) => state.lockClockAngle);
  const startClock = useTaskStore((state) => state.startClock);
  const pauseClock = useTaskStore((state) => state.pauseClock);
  const color = useTaskStore((state) => state.color);

  const ClockRef = useRef(null);
  const ClickerRef = useRef(null);
  const [tick, setTick] = useState(0); // re-render용
  const [currentTime, setCurrentTime] = useState(new Date());

  // 집중 세션의 누적 경과 시간(초)을 계산합니다.
  let effectiveElapsed = clock.pausedElapsed;
  if (clock.isRunning && clock.startTimestamp) {
    effectiveElapsed += (Date.now() - clock.startTimestamp) / 1000;
  }
  // 타이머는 1시간(3600초) 동안 360도 회전하므로 1초당 0.1도씩 증가합니다.
  const effectiveAngle = (clock.angle + effectiveElapsed * 0.1) % 360;

  // 남은 시간(초)은 360도 중 진행된 비율에 따라 계산합니다.
  // (예를 들어, 초기 angle이 0이면 60분에서 시작하여 시간이 흐르면 남은 시간이 줄어듭니다.)
  let minutes = (60 - Math.ceil(effectiveAngle / 6)) % 60;
  let seconds = (60 - Math.ceil((effectiveAngle % 6) * 10)) % 60;

  // 시간 형식 함수 (MM:SS)
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const formattedCurrentTime = currentTime.toLocaleTimeString("ko-KR", {
    hour12: false,
  });

  // 1초마다 re-render하여 시간, 경과 시간, 시계 각도가 업데이트되도록 함
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTick((t) => t + 1);
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // 집중 시작 전(아직 시작하지 않았으면) 마우스 이동으로 초기 각도를 조정할 수 있도록 합니다.
  useEffect(() => {
    if (!clock.isAngleAdjustable || clock.hasStarted) return;

    let centerX = 0;
    let centerY = 0;

    const updateCenter = () => {
      if (ClickerRef.current) {
        const rect = ClickerRef.current.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
      }
    };

    updateCenter();
    window.addEventListener("resize", updateCenter);

    const handleMouseMove = (e) => {
      const mouseX = e.pageX;
      const mouseY = e.pageY;
      let newAngle =
        Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
      newAngle = newAngle < 0 ? newAngle + 360 : newAngle;
      // 원래 코드에서처럼 90도 보정 후 모듈러 연산
      const adjustedAngle = (newAngle + 90) % 360;
      setClockAngle(adjustedAngle);
    };

    if (ClockRef.current) {
      ClockRef.current.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (ClockRef.current) {
        ClockRef.current.removeEventListener("mousemove", handleMouseMove);
      }
      window.removeEventListener("resize", updateCenter);
    };
  }, [clock.isAngleAdjustable, clock.hasStarted, setClockAngle]);

  // 시계 클릭 시, 집중 시작 전이면 각도 조정을 잠급니다.
  const handleClockClick = () => {
    if (!clock.hasStarted && clock.isAngleAdjustable) {
      lockClockAngle();
    }
  };

  // "집중 시작하기"/"멈추기" 버튼 클릭 핸들러
  const handleStartPause = () => {
    if (clock.isRunning) {
      pauseClock();
      // 여기서 집중 시간 기록(예, addFocusTime) 등 추가 가능
    } else {
      startClock();
    }
  };

  return (
    <div className={styles.Clock_wrapper}>
      {/* 중앙 오버레이에 남은 시간, 현재 시간, 경과 시간 표시 */}
      <div className={styles.timeOverlay}>
        <div className={styles.remainingTime}>
          {formatTime(minutes * 60 + seconds)}
        </div>
        <div className={styles.currentTime}>{formattedCurrentTime}</div>
        <div className={styles.elapsedTime}>
          {formatTime(effectiveElapsed)} 경과
        </div>
        <Button
          onClick={handleStartPause}
          className={`${styles.focusButton} ${
            clock.isRunning ? styles.focusButtonActive : ""
          }`}
        >
          {clock.isRunning ? "멈추기" : "집중 시작하기"}
        </Button>
      </div>

      <div className={styles.Clock} ref={ClockRef} onClick={handleClockClick}>
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
              background: `conic-gradient(#111827 ${effectiveAngle}deg, ${color} ${effectiveAngle}deg 360deg)`,
            }}
          >
            <div className={styles.Clicker} ref={ClickerRef}>
              <div
                className={styles.Clicker_box}
                style={{ transform: `rotate(${effectiveAngle - 90}deg)` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
