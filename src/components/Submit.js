import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { green } from "@mui/material/colors";

const Submit = ({ result, error, submitting }) => {
  const [buttonState, setButtonState] = useState({
    color: "primary",
    text: "Submit"
  });
  useEffect(() => {
    if (submitting) {
      setButtonState({ color: "warning", text: "Sending..." });
    } else if (!result || error) {
      setButtonState({ color: "primary", text: "Send" });
    } else if (result) {
      setButtonState({ color: "success", text: "Send" });
    }
  }, [result, error, submitting]);
  return (
    <div className="content-block">
      <Box sx={{ m: 1, position: "relative" }}>
        <Button
          color={buttonState.color}
          variant="contained"
          disabled={submitting}
          type="submit"
          id="submit-button"
        >
          {buttonState.text}
        </Button>
        {submitting && (
          <CircularProgress
            size={24}
            sx={{
              color: green[500],
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px"
            }}
          />
        )}
      </Box>
    </div>
  );
};

export default Submit;
