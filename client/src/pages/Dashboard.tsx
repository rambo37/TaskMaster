import { useUser } from "../components/Account";

const Dashboard = () => {
  const [user, setUser] = useUser();
    return (
      <>
        <h1>Welcome {user.name ? user.name : user.email}!</h1>
      </>
    );
};

export default Dashboard;
