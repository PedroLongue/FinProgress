import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useSnackbarStore } from "../../stores/snackbar.store";

export const SnackbarHost = () => {
  const { open, message, severity, duration, close } = useSnackbarStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={close}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={close} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};
