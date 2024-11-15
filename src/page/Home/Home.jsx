import Clock from "../../component/Clock/Clock";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.Home}>
      <div className={styles.Clock}>
        <Clock />
      </div>
    </div>
  );
};

export default Home;
