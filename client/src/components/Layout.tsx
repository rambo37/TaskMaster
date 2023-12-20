import { useRef, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { ToastContainer } from 'react-toastify';

const Layout = () => {
  const navBarRef = useRef<HTMLDivElement>(null);
  const [minContentHeight, setMinContentHeight] = useState("");

  useEffect(() => {
    if (navBarRef.current) {
      const navBarHeight = navBarRef.current.getBoundingClientRect().height;
      // Make the content div have a minimum size of the viewport size minus
      // the size of the nav bar
      setMinContentHeight("calc(100vh - " + navBarHeight + "px)");
    }
  }, []);

  return (
    <>
      <NavBar ref={navBarRef} />
      <ToastContainer />
      <div className="content" style={{minHeight: minContentHeight}}>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
