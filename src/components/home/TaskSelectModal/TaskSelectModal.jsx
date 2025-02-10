import useTaskStore from "../../../store/taskStore";

const TaskSelectModal = () => {
  const { taskSelectModalOpen, setTaskSelectModalOpen } = useTaskStore();

  return <div onClick={() => setTaskSelectModalOpen(false)}>test</div>;
};

export default TaskSelectModal;
