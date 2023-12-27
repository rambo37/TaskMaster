import { useAccountContext } from "../components/Account";
import TaskCard from "../components/TaskCard";

const TaskList = () => {
  const [user] = useAccountContext();

  return (
    <div className="task-list-page">
      <h1>Tasks</h1>
      <div className="task-list">
        {user.tasks.map((task, index) => {
          return <TaskCard task={task} key={index} />;
        })}
      </div>
    </div>
  );
};

export default TaskList;
