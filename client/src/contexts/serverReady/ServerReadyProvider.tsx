import { useReactiveVar } from "@apollo/client/react";
import { useQueryClient } from "@tanstack/react-query";
import { apolloReady, setApolloReady } from "config/apolloConfig";
import { useReactQuery } from "hooks/useQuery";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useMount } from "react-use";
import { ServerReadyContext, ServerReadyStatus } from "./ServerReadyContext";

type ServerKey = "proxyServer" | "hotplants";
const BASE_URLS: Record<ServerKey, string> = {
  proxyServer: import.meta.env.VITE_PROXY_SERVER_URL,
  hotplants: import.meta.env.VITE_HOTPLANTS_URL,
};
const WAKE_UP_INTERVAL_MS = 1000;
const KEEP_ALIVE_INTERVAL_MS = 180 * 2000; // 2 minutes
const MAX_CHECKS = 20;

export const ServerReadyProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const isApolloReady = useReactiveVar(apolloReady);

  const [serverReady, setServerReady] = useState<ServerReadyStatus>(false);
  const serverReadyRef = useRef(serverReady);

  const [checkHealthCount, setCheckHealthCount] = useState(0);
  const [serverReadyStatus, setServerReadyStatus] = useState({
    proxyServer: false,
    hotplants: false,
  });

  const checkHealth = async (serverKey: ServerKey) => {
    try {
      const response = await fetch(`${BASE_URLS[serverKey]}/health`, {
        cache: "no-store",
      });
      return response.ok;
    } catch {
      console.warn(`${serverKey} not ready.`);
      return false;
    }
  };

  const serverReadyQuery = useReactQuery({
    queryKey: ["check-health"],
    ignoreServerReady: true,
    initialData: false,
    refetchOnWindowFocus: "always",
    enabled: serverReady !== null || checkHealthCount < MAX_CHECKS,
    refetchInterval: serverReady ? KEEP_ALIVE_INTERVAL_MS : WAKE_UP_INTERVAL_MS,

    queryFn: async () => {
      let readyStatus: ServerReadyStatus = false;

      if (serverReady) {
        console.info("Keeping servers awake");
        const [proxyServer, hotplants] = await Promise.all([
          checkHealth("proxyServer"),
          checkHealth("hotplants"),
        ]);

        readyStatus = proxyServer && hotplants;
        setServerReadyStatus({ proxyServer, hotplants });
      } else {
        console.info(
          "Pinging services, check:",
          `${checkHealthCount + 1}/${MAX_CHECKS}`,
        );

        setCheckHealthCount((prev) => prev + 1);

        const [proxyServer, hotplants] = await Promise.all([
          serverReadyStatus.proxyServer || checkHealth("proxyServer"),
          serverReadyStatus.hotplants || checkHealth("hotplants"),
        ]);

        setServerReadyStatus({ proxyServer, hotplants });

        if (proxyServer && hotplants) {
          setCheckHealthCount(0);
          readyStatus = true;
        } else if (checkHealthCount >= MAX_CHECKS) {
          readyStatus = null;
        }
      }

      setApolloReady(Boolean(readyStatus));
      setServerReady(readyStatus);

      return readyStatus;
    },
  });

  useEffect(() => {
    serverReadyQuery.isError && setServerReady(null);
  }, [serverReadyQuery.isError]);

  useEffect(() => {
    serverReadyRef.current = serverReady;
  }, [serverReady]);

  useEffect(() => {
    if (serverReadyRef.current && !isApolloReady) {
      serverReadyRef.current = true;
      serverReadyQuery.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApolloReady]);

  useMount(() => {
    queryCache.subscribe((event) => {
      if (
        serverReadyRef.current &&
        event.query.state.error?.message === "Failed to fetch"
      ) {
        serverReadyRef.current = false;
        serverReadyQuery.refetch();
      }
    });
  });

  return (
    <ServerReadyContext.Provider value={{ serverReady }}>
      {children}
    </ServerReadyContext.Provider>
  );
};
