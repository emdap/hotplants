import { useCallback, useEffect, useRef, useState } from "react";

type ServerKey = "proxyServer" | "hotplants";
const BASE_URLS: Record<ServerKey, string> = {
  proxyServer: import.meta.env.VITE_PROXY_SERVER_URL,
  hotplants: import.meta.env.VITE_HOTPLANTS_URL,
};
const HEALTH_PING_INTERVAL_MS = 500;
const MAX_CHECKS = 20;

// TODO: Ping ACTUAL server URL to wake up -- otherwise, is waiting for proxy to be ready -> ping server through proxy -> wait for server ...
// Slower than waking both up at same time, separately
export const useGetServerReadiness = () => {
  const [serverReadiness, setServerReadiness] = useState<
    Record<ServerKey, boolean | "error">
  >({
    proxyServer: false,
    hotplants: false,
  });

  const healthCheckCount = useRef(MAX_CHECKS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkHealth = useCallback(
    async (serverKey: ServerKey) => {
      if (healthCheckCount.current <= 0) {
        intervalRef.current && clearInterval(intervalRef.current);
        return "error";
      }

      if (serverReadiness[serverKey]) {
        return serverReadiness[serverKey];
      }

      try {
        const response = await fetch(`${BASE_URLS[serverKey]}/health`);
        return response.ok;
      } catch {
        console.warn(
          `${serverKey} not ready, checks remaining: ${healthCheckCount.current}`,
        );
      }

      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serverReadiness.hotplants, serverReadiness.proxyServer],
  );

  const pingServers = useCallback(async () => {
    const [proxyServer, hotplants] = await Promise.all([
      checkHealth("proxyServer"),
      checkHealth("hotplants"),
    ]);

    healthCheckCount.current = healthCheckCount.current - 1;
    setServerReadiness({ proxyServer, hotplants });
    if (proxyServer && hotplants) {
      intervalRef.current && clearInterval(intervalRef.current);
    }
  }, [checkHealth]);

  useEffect(() => {
    pingServers();
    intervalRef.current = setInterval(pingServers, HEALTH_PING_INTERVAL_MS);

    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [pingServers]);

  return serverReadiness;
};
