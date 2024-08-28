import { useEffect, useRef } from "react";

const useOutsideClick = ({ onOutsideClick }) => {
  const targetElement = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        targetElement?.current &&
        !targetElement?.current?.contains(event.target)
      ) {
        onOutsideClick();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [targetElement, onOutsideClick]);

  return { targetElement };
};

export default useOutsideClick;
