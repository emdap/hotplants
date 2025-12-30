import { useDocumentListener } from "./useDocumentListener";

export const useCloseOnEscape = (
  callback: (e: KeyboardEvent) => void,
  enabled: boolean,
  onCapture?: boolean
) => {
  const closeOnEscape = (e: KeyboardEvent) =>
    e.code === "Escape" && callback(e);
  useDocumentListener("keyup", closeOnEscape, enabled, onCapture);
};
