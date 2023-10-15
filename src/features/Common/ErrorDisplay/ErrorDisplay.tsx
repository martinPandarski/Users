import { Alert } from "@mui/material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const ErrorDisplay: React.FC<{ err: FetchBaseQueryError }> = ({ err }) => {
  if (err && err?.status) {
    return (
      <Alert severity="error">{`Something went wrong -  Status code: ${err.status}`}</Alert>
    );
  }
  return null;
};

export default ErrorDisplay;
