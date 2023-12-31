import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import PageNotFound from "./pages/PageNotFound";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Account from "./components/Account";
import AccountRecovery from "./pages/AccountRecovery";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import CreateTask from "./pages/CreateTask";
import TaskList from "./pages/TaskList";
import EditTask from "./pages/EditTask";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/account-recovery" element={<AccountRecovery />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<Account />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/create" element={<CreateTask />} />
          <Route path="/tasks/:taskId" element={<EditTask />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
