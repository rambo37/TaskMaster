import { useRef, useState, useEffect } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import NavBar from "./NavBar";
import { ToastContainer } from 'react-toastify';
import { isSignedIn } from "../utils";

const Layout = () => {
  const navBarRef = useRef<HTMLDivElement>(null);
  const [minContentHeight, setMinContentHeight] = useState("");
  const [signedIn, setSignedIn] = useState(isSignedIn())

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
      <NavBar ref={navBarRef} signedIn={signedIn} setSignedIn={setSignedIn} />
      <ToastContainer />
      <div className="content" style={{minHeight: minContentHeight}}>
        <Outlet context={[setSignedIn]} />
      </div>
    </>
  );
};

export default Layout;

export function useSetSignedIn() {
  return useOutletContext<[React.Dispatch<boolean>]>();
}