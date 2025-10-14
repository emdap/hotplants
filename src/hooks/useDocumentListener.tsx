import { useEffect } from "react";

export const useDocumentListener = <T extends keyof DocumentEventMap>(
  eventKey: T,
  onEventCallback: (e: DocumentEventMap[T]) => void,
  enabled = true
) => {
  useEffect(() => {
    if (enabled) {
      document.addEventListener(eventKey, onEventCallback);
    }
    return () => document.removeEventListener(eventKey, onEventCallback);
  }, [onEventCallback, eventKey, enabled]);
};
