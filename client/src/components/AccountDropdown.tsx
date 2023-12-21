import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

type AccountDropdownProps = {
  setSignedIn: (signedIn: boolean) => void;
};

const AccountDropdown = ({ setSignedIn }: AccountDropdownProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userPages = ["/dashboard"]
  const isOnUserPage = () => {
    return userPages.includes(location.pathname)
  }

  const [onUserPage, setOnUserPage] = useState(isOnUserPage())

  useEffect(() => {
    setOnUserPage(isOnUserPage())
  }, [location.pathname]);

  const logOut = () => {
    localStorage.removeItem("token");
    setSignedIn(false);
    navigate("/");
  }

  return (
    <li className="nav-item dropdown" data-bs-theme="light">
      <button
        className={`nav-link dropdown-toggle ${onUserPage ? "active" : ""}`}
        id="navbarDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Account
      </button>
      <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
        <li className="nav-item">
          <NavLink className="dropdown-item" to="/dashboard">
            Dashboard
          </NavLink>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li className="nav-item">
          <div className="dropdown-item log-out" onClick={() => logOut()}>
            Log out
          </div>
        </li>
      </ul>
    </li>
  );
};

export default AccountDropdown;
