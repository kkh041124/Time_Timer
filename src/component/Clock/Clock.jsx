import styles from "./Clock.module.css";

const Clock = () => {
  return (
    <div className={styles.Clock}>
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
            />
          ))}
        </div>
        <div className={styles.timer_slider}>
          <div className={styles.Clicker}>
            <div className={styles.Clicker_box}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
