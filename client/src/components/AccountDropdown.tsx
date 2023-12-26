import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

type AccountDropdownProps = {
  setSignedIn: React.Dispatch<boolean>;
};

const AccountDropdown = ({ setSignedIn }: AccountDropdownProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userPagesMap = new Map([
    ["/dashboard", "Dashboard"],
    ["/settings", "Settings"],
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

  const logOut = () => {
    localStorage.removeItem("token");
    setSignedIn(false);
    navigate("/");
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
              <NavLink className="dropdown-item" to={page[0]}>
                {page[1]}
              </NavLink>
            </li>
          );
        })}
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
