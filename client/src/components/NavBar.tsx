import { forwardRef, Ref } from "react";
import { NavLink } from "react-router-dom";
import AccountDropdown from "./AccountDropdown";

type NavBarProps = {
  signedIn: boolean;
  setSignedIn: (signedIn: boolean) => void;
};

const NavBar = forwardRef((props: NavBarProps, ref: Ref<HTMLDivElement>) => {
  return (
    <nav ref={ref} className="navbar navbar-expand-sm" data-bs-theme="dark">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            {props.signedIn ? (
                <AccountDropdown setSignedIn={props.setSignedIn} />
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/signup">
                    Sign up
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Sign in
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
});

export default NavBar;
