import { useEffect, useRef } from "react";

const useOutsideClick = ({ onOutsideClick }) => {
  const targetElement = useRef(null);
  const exceptionalReference = useRef(null);

  useEffect(() => {
    if(!targetElement.current) return;
    const handleOutsideClick = (event) => {
      if (
        targetElement?.current &&
        !targetElement?.current?.contains(event.target)
      ) {
        if(exceptionalReference?.current && exceptionalReference?.current?.contains(event.target)) return;
        onOutsideClick();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [targetElement, onOutsideClick]);

  return { targetElement, exceptionalReference };
};

export default useOutsideClick;
