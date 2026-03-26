import { useEffect, useRef, useState } from "react";

type ServerKey = "proxyServer" | "hotplants";
const BASE_URLS: Record<ServerKey, string> = {
  proxyServer: import.meta.env.VITE_PROXY_SERVER_URL,
  hotplants: import.meta.env.VITE_HOTPLANTS_URL,
};
const WAKE_UP_INTERVAL_MS = 1000;
const KEEP_ALIVE_INTERVAL_MS = 180 * 1000; // 3 minutes
const MAX_CHECKS = 20;

export const useWakeUpServers = () => {
  const [serverReady, setServerReady] = useState<boolean | "error">(false);

  const serverReadyRef = useRef<Record<ServerKey, boolean>>({
    proxyServer: false,
    hotplants: false,
  });
  const healthCheckCount = useRef(MAX_CHECKS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearPingInterval = () =>
    intervalRef.current && clearInterval(intervalRef.current);

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

  useEffect(() => {
    const pingServers = async () => {
      console.info(
        "Pinging services, check:",
        `${MAX_CHECKS + 1 - healthCheckCount.current}/${MAX_CHECKS + 1}`,
      );
      healthCheckCount.current = healthCheckCount.current - 1;

      const [proxyServer, hotplants] = await Promise.all([
        serverReadyRef.current.proxyServer || checkHealth("proxyServer"),
        serverReadyRef.current.hotplants || checkHealth("hotplants"),
      ]);

      serverReadyRef.current = { proxyServer, hotplants };

      if (proxyServer && hotplants) {
        clearPingInterval();
        setServerReady(true);
      } else if (healthCheckCount.current <= 0) {
        clearPingInterval();
        setServerReady("error");
      }
    };

    pingServers();
    intervalRef.current = setInterval(pingServers, WAKE_UP_INTERVAL_MS);

    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    const keepServersAwake = async () => {
      try {
        console.info("Keeping services awake ...");
        await Promise.all(
          (["proxyServer", "hotplants"] as const).map((serverKey) =>
            checkHealth(serverKey),
          ),
        );
        console.info("Success");
      } catch (error) {
        console.error("Service offline:", error);
      }
    };

    if (serverReady && !import.meta.env.DEV) {
      intervalRef.current = setInterval(
        keepServersAwake,
        KEEP_ALIVE_INTERVAL_MS,
      );
    }

    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [serverReady]);

  return serverReady;
};
