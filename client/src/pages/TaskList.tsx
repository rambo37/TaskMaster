import { useAccountContext } from "../components/Account";
import Legend from "../components/Legend";
import TaskCard from "../components/TaskCard";

const TaskList = () => {
  const [user] = useAccountContext();
  const thresholdHours = 6;

  return (
    <div className="task-list-page">
      <h1>Tasks</h1>
      <Legend thresholdHours={thresholdHours} />
      <div className="task-list">
        {user.tasks.map((task, index) => {
          return (
            <TaskCard task={task} key={index} thresholdHours={thresholdHours} />
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;
