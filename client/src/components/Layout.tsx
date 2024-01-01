import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import NavBar from "./NavBar";
import { ToastContainer } from "react-toastify";
import { isSignedIn } from "../utils";

const Layout = () => {
  const navBarRef = useRef<HTMLDivElement>(null);
  const [minContentHeight, setMinContentHeight] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // On initial render, determine whether the user is signed in
  useEffect(() => {
    const checkSignedIn = async () => {
      setSignedIn(await isSignedIn());
      setLoading(false);
    };

    checkSignedIn();
  }, []);

  // Executed after all DOM changes have finished whenever the loading state
  // variable changes (i.e., after establishing whether there is a user so the
  // correct nav bar content will be displayed)
  useLayoutEffect(() => {
    if (navBarRef.current) {
      const navBarHeight = navBarRef.current.getBoundingClientRect().height;
      setMinContentHeight("calc(100vh - " + navBarHeight + "px)");
    }
  }, [loading]);

  // Do not render the page content until we have established whether the
  // user is signed in
  if (loading) {
    return <></>;
  }

  return (
    <>
      <NavBar ref={navBarRef} signedIn={signedIn} setSignedIn={setSignedIn} />
      <ToastContainer />
      <div className="content" style={{ minHeight: minContentHeight }}>
        <Outlet context={[setSignedIn]} />
      </div>
    </>
  );
};

export default Layout;

export function useSetSignedIn() {
  return useOutletContext<[React.Dispatch<boolean>]>();
}
