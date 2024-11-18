import github from "./asset/github-mark-white.svg";
import styles from "./Github.module.css";

const Github = () => {
  const moveGit = () => {
    const url = "https://github.com/kkh041124/Time_Timer";
    return window.open(url);
  };
  return (
    <div>
      <img src={github} onClick={moveGit} />
    </div>
  );
};

export default Github;
