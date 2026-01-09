import { create } from "zustand";

type Severity = "success" | "error" | "warning" | "info";

type SnackBarState = {
  open: boolean;
  message: string;
  severity: Severity;
  duration: number;
  show: (p: {
    message: string;
    severity?: Severity;
    duration?: number;
  }) => void;
  close: () => void;
};

export const useSnackbarStore = create<SnackBarState>((set) => ({
  open: false,
  message: "",
  severity: "info",
  duration: 3000,
  show: ({ message, severity = "info", duration = 3000 }) =>
    set({ open: true, message, severity, duration }),
  close: () => set({ open: false }),
}));
