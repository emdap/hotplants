import { createContext, use } from "react";

// Using 'null' for error/indeterminate state, easy non-truthy value
export type ServerReadyStatus = boolean | null;

export const ServerReadyContext = createContext({
  serverReady: false as ServerReadyStatus,
});

export const useServerReadyContext = () => use(ServerReadyContext);
