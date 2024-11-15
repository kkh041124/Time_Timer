import Clock from "../../component/Clock/Clock";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.Home}>
      <Clock />
    </div>
  );
};

export default Home;
