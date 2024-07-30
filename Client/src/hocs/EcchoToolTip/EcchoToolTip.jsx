import { Tooltip, styled, tooltipClasses } from "@mui/material";
import React from "react";

const EcchoToolTip = ({ title, position, children }) => {
  const StyledToolTip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "var(--extraPrimary)",
      color: "var(--white)",
      boxShadow: "var(--defShadow)",
      fontSize: 11,
    },
  }));
  return (
    <StyledToolTip title={title} placement={position}>
      {children}
    </StyledToolTip>
  );
};

export default EcchoToolTip;
