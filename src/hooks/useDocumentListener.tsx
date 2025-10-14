import { useEffect } from "react";

export const useDocumentListener = <T extends keyof DocumentEventMap>(
  onEvent: (e: DocumentEventMap[T]) => void,
  eventKey: T,
  enabled = true
) => {
  useEffect(() => {
    if (enabled) {
      document.addEventListener(eventKey, onEvent);
    }
    return () => document.removeEventListener(eventKey, onEvent);
  }, [onEvent, eventKey, enabled]);
};
