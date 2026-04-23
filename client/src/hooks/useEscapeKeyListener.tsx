import { useDocumentListener } from "./useDocumentListener";

export const useEscapeKeyListener = (
  callback: (e: KeyboardEvent) => void,
  enabled: boolean,
  onCapture?: boolean,
) => {
  const escapeKeyListener = (e: KeyboardEvent) =>
    e.code === "Escape" && callback(e);
  useDocumentListener("keyup", escapeKeyListener, enabled, onCapture);
};
