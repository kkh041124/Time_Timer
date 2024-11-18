import ColorPicker from "./ColorPicker/ColorPicker";
import DashBoard from "./DashBoard/DashBoard";
import Github from "./Github/Github";
import Notification from "./Notification/Notification";
import Pip from "./PIP/Pip";

import styles from "./Icon.module.css";

const Icon = () => {
  return (
    <div className={styles.Icon}>
      <Pip />
      <DashBoard />
      <Notification />
      <ColorPicker />
      <Github />
    </div>
  );
};

export default Icon;
