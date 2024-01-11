import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

type AccountDropdownProps = {
  setSignedIn: React.Dispatch<boolean>;
  checkAndWarnForUnsavedChanges: (e: React.MouseEvent) => boolean;
};

const AccountDropdown = ({
  setSignedIn,
  checkAndWarnForUnsavedChanges,
}: AccountDropdownProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userPagesMap = new Map([
    ["/dashboard", "Dashboard"],
    ["/settings", "Settings"],
    ["/tasks", "View all tasks"],
    ["/tasks/create", "Create task"],
  ]);
  const userPages = Array.from(userPagesMap);

  const isOnUserPage = () => {
    return Array.from(userPagesMap.keys()).includes(location.pathname);
  };

  const [onUserPage, setOnUserPage] = useState(isOnUserPage());

  useEffect(() => {
    setOnUserPage(isOnUserPage());
  }, [location.pathname]);

  const logOut = (event: React.MouseEvent) => {
    if (checkAndWarnForUnsavedChanges(event)) {
      sessionStorage.removeItem("userId");
      axios.get("/logout");
      setSignedIn(false);
      navigate("/");
    }
  };

  const handleNavLinkClick = (e: React.MouseEvent, to: string) => {
    if (location.pathname === to) return;
    checkAndWarnForUnsavedChanges(e);
  };

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
        {userPages.map((page, index) => {
          return (
            <li className="nav-item" key={index}>
              <NavLink
                className="dropdown-item"
                to={page[0]}
                end
                onClick={(e) => handleNavLinkClick(e, page[0])}
              >
                {page[1]}
              </NavLink>
            </li>
          );
        })}
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li className="nav-item">
          <div className="dropdown-item log-out" onClick={(e) => logOut(e)}>
            Log out
          </div>
        </li>
      </ul>
    </li>
  );
};

export default AccountDropdown;
