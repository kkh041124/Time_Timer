import ColorPicker from "./ColorPicker/ColorPicker";
import DashBoard from "./DashBoard/DashBoard";
import GitHub from "./GitHub/GitHub";
import Notification from "./Notification/Notification";
import Pip from "./PIP/Pip";
import WorkSpaceIcon from "./WorkSpace/WorkSpaceIcon";
import styles from "./Icon.module.css";

const Icon = ({ color, updateColorChange }) => {
  return (
    <div className={styles.Icon}>
      <Pip />
      <DashBoard />
      <WorkSpaceIcon />
      <Notification />
      <ColorPicker color={color} updateColorChange={updateColorChange} />
      <GitHub />
    </div>
  );
};

export default Icon;
