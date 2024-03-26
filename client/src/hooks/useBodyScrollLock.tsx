import { useEffect } from "react";
import { Task } from "../taskUtils";

// Simple hook to prevent scrolling of the page while a task is expanded
const useBodyScrollLock = (expandedTask: Task | null) => {
  useEffect(() => {
    const body = document.querySelector('body');
    if (!body) return;

    if (expandedTask) {
      body.classList.add('no-scroll');
    }
    else {
      body.classList.remove('no-scroll');
    }
    
    return () => {
      // Clean up function to remove the 'no-scroll' class when the component unmounts
      body.classList.remove('no-scroll');
    };
  }, [expandedTask]);
};

export default useBodyScrollLock;