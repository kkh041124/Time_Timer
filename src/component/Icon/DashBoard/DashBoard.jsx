import { useNavigate } from "react-router-dom";
import dashboard from "./asset/dashboard.svg";
import styles from "./DashBoard.module.css";

const DashBoard = () => {
  const navigate = useNavigate();
  const movePage = () => {
    navigate("./dashboard");
  };
  return (
    <div>
      <img src={dashboard} onClick={movePage} />
    </div>
  );
};

export default DashBoard;
