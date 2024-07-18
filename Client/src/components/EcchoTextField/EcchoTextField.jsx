import React from "react";

import TextField from "@mui/material/TextField";
import { Input, InputAdornment, styled } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

const CustomTextField = styled(TextField)({
  "& .css-152mnda-MuiInputBase-input-MuiOutlinedInput-input": {
    color: "var(--white)",
  },
  "& .css-v6c1qj-MuiFormLabel-root-MuiInputLabel-root": {
    color: "var(--primary)",
  },
  "& .css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--primary)",
  },
  "& .css-1o9s3wi-MuiInputBase-input-MuiOutlinedInput-input": {
    color: "var(--white)",
  },
  "& label.Mui-focused": {
    color: "var(--primary)",
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "var(--secondary)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--secondary)",
    },
  },
});
const EcchoTextField = (props) => {
  return (
    <>
      <CustomTextField
        type={props.type}
        label={props.label}
        id="outlined-start-adornment"
        sx={{ ...props.customStyles }}
        InputProps={
          props.isStartAdornment && props.isEndAdornment
            ? {
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      {props.adornmentElement[0]}
                    </InputAdornment>
                  </>
                ),
                endAdornment: (
                  <InputAdornment position="start">
                    {props.adornmentElement[1]}
                  </InputAdornment>
                ),
              }
            : props.isStartAdornment
            ? {
                startAdornment: (
                  <InputAdornment position="start">
                    {props.adornmentElement[0]}
                  </InputAdornment>
                ),
              }
            : {
                endAdornment: (
                  <InputAdornment position="start">
                    {props.adornmentElement[0]}
                  </InputAdornment>
                ),
              }
        }
        helperText={props.helperText}
        required={props.isRequired}
      />
    </>
  );
};

export default EcchoTextField;
