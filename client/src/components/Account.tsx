import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { Task } from "../taskUtils";
import { getUserIdFromToken, isSignedIn } from "../utils";
import { useSetSignedIn } from "./Layout";

export interface User {
  name: string;
  email: string;
  tasks: Task[];
  _id: string;
}

const Account = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [setSignedIn] = useSetSignedIn();

  const navigate = useNavigate();
  useEffect(() => {
    if (isSignedIn()) {
      const id = getUserIdFromToken();
      axios
        .get(`/users/${id}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    } else {
      setSignedIn(false);
      navigate("/");
      toast.error("You must log in to access this page.");
    }
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return (
      <>
        <Outlet context={[user, setUser, setSignedIn]} />
      </>
    );
  }

  return <div>Something went wrong. Please try again later.</div>;
};

export default Account;

export function useAccountContext() {
  return useOutletContext<
    [User, React.Dispatch<User>, React.Dispatch<boolean>]
  >();
}
