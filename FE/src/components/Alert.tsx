import React from "react";
import { Alert as MUIAlert, AlertTitle } from "@mui/material";

interface AlertProps {
  severity: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
}

const Alert: React.FC<AlertProps> = ({ severity, title, message }) => {
  return (
    <MUIAlert severity={severity} sx={{ width: "100%", mb: 2 }}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </MUIAlert>
  );
};

export default Alert;
