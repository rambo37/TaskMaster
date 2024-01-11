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
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Warns the user that their changes will be lost if they continue. Returns
  // false if the user does not want to leave and true otherwise.
  const checkAndWarnForUnsavedChanges = (event: React.MouseEvent) => {
    if (unsavedChanges) {
      if (!window.confirm("Are you sure? Unsaved changes will be lost.")) {
        // If the user presses no, prevent the event behaviour so they do not leave
        event.preventDefault();
        return false;
      }
    }
    // If the user proceeds to leave the page or there were no unsaved changes,
    // reset unsavedChanges
    setUnsavedChanges(false);
    return true;
  };

  // Show a warning if the user tries to leave the site when there are unsaved
  // changes
  window.onbeforeunload = () => {
    if (unsavedChanges) return "Are you sure you want to leave?";
  };

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
      <NavBar
        ref={navBarRef}
        signedIn={signedIn}
        setSignedIn={setSignedIn}
        checkAndWarnForUnsavedChanges={checkAndWarnForUnsavedChanges}
      />
      <ToastContainer />
      <div className="content" style={{ minHeight: minContentHeight }}>
        <Outlet context={[setSignedIn, unsavedChanges, setUnsavedChanges]} />
      </div>
    </>
  );
};

export default Layout;

export function useLayoutContext() {
  return useOutletContext<
    [React.Dispatch<boolean>, boolean, React.Dispatch<boolean>]
  >();
}
