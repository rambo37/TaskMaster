import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { Task } from "../taskUtils";
import { getUserId, isSignedIn } from "../utils";
import { useLayoutContext } from "./Layout";

export interface User {
  name: string;
  email: string;
  tasks: Task[];
  _id: string;
  thresholdHours: number;
  dateFormat: string;
  timeFormat: string;
  showLegend: boolean;
}

const Account = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { setSignedIn, setUnsavedChanges, checkAndWarnForUnsavedChanges } =
    useLayoutContext();

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      if (await isSignedIn()) {
        const id = getUserId();
        try {
          const response = await axios.get(`/users/${id}`);
          setUser(response.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        sessionStorage.removeItem("userId");
        try {
          await axios.get("/logout");
        } catch (error) {
          console.error(error);
        }

        setSignedIn(false);
        navigate("/login");
        toast.error("You must log in to access this page.");
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return (
      <>
        <Outlet
          context={{
            user,
            setUser,
            setSignedIn,
            setUnsavedChanges,
            checkAndWarnForUnsavedChanges,
          }}
        />
      </>
    );
  }

  return <div>Something went wrong. Please try again later.</div>;
};

export default Account;

export function useAccountContext() {
  return useOutletContext<{
    user: User;
    setUser: React.Dispatch<User>;
    setSignedIn: React.Dispatch<boolean>;
    setUnsavedChanges: React.Dispatch<boolean>;
    checkAndWarnForUnsavedChanges: (e: React.MouseEvent) => boolean;
  }>();
}
