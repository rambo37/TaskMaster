import { useAccountContext } from "../components/Account";
import Legend from "../components/Legend";
import TaskCard from "../components/TaskCard";

const TaskList = () => {
  const [user, setUser] = useAccountContext();
  const thresholdHours = 6;

  return (
    <div className="task-list-page">
      <h1>Tasks</h1>
      <Legend thresholdHours={thresholdHours} />
      <div className="task-list">
        {user.tasks.map((task) => {
          return (
            <TaskCard
              user={user}
              setUser={setUser}
              task={task}
              key={task._id}
              thresholdHours={thresholdHours}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;
