import { useEffect } from "react";

export const useDocumentListener = <T extends keyof DocumentEventMap>(
  eventKey: T,
  onEventCallback: (e: DocumentEventMap[T]) => void,
  enabled = true,
  onCapture?: boolean
) => {
  useEffect(() => {
    if (enabled) {
      document.addEventListener(eventKey, onEventCallback, onCapture);
    }
    return () => document.removeEventListener(eventKey, onEventCallback);
  }, [onEventCallback, eventKey, enabled, onCapture]);
};
