import { useAccountContext } from "../components/Account";

const Dashboard = () => {
  const { user } = useAccountContext();
  return (
    <>
      <h1>Welcome, {user.name || user.email}!</h1>
    </>
  );
};

export default Dashboard;
