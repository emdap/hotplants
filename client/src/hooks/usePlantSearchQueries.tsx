import { NetworkStatus } from "@apollo/client";
import { QueryPlantSearchArgs } from "generated/graphql/graphql";
import { paths } from "generated/schemas/hotplants";
import { SEARCH_PLANTS } from "graphqlHelpers/plantQueries";
import { useApolloQuery, useReactQuery } from "hooks/useQuery";
import createClient from "openapi-fetch";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { PlantSearchFilter, PlantSearchParams } from "util/customSchemaTypes";
import { PaginationParams } from "util/routeParamsUtil";

export type PlantSearchQueryStatus =
  | "READY"
  | "CHECKING_STATUS"
  | "SCRAPING_AND_POLLING";

export const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_POLL_INTERVAL = 3000;
const MAX_POLLS = 10;
const MAX_AUTO_SCRAPES = 3;

const DEFAULT_PLANT_SEARCH_GQL_VARS: QueryPlantSearchArgs = {
  offset: 0,
  limit: DEFAULT_PAGE_SIZE,
  sort: [
    { field: "updatedTimestamp", value: 1 },
    { field: "scientificName", value: 1 },
  ],
};

export const hotplantsClient = createClient<paths>({
  baseUrl: `${import.meta.env.VITE_SERVER_URL}/api`,
});

const usePlantSearchQueries = (
  searchParams: PlantSearchParams | null = null,
  plantFilters: PlantSearchFilter,
  {
    paginationEnabled,
    page,
    pageSize,
  }: Required<PaginationParams> & { paginationEnabled: boolean },
) => {
  const [searchStatus, setSearchStatus] =
    useState<PlantSearchQueryStatus>("READY");

  const stopPollingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [autoScrapesRemaining, setAutoScrapesRemaining] = useState(0);
  const [pollInterval, setPollInterval] = useState(0);

  // #region Queries
  const paginationVars = useMemo(
    () =>
      paginationEnabled
        ? {
            paginated: paginationEnabled,
            limit: pageSize,
            offset: (page - 1) * pageSize,
          }
        : null,
    [paginationEnabled, pageSize, page],
  );

  const plantSearchQuery = useApolloQuery(SEARCH_PLANTS, {
    pollInterval,
    skip: !searchParams,

    variables: {
      ...DEFAULT_PLANT_SEARCH_GQL_VARS,
      ...paginationVars,
      where: {
        boundingPolyCoords: searchParams?.boundingPolyCoords,
        commonName: searchParams?.commonName,
        scientificName: searchParams?.scientificName,

        ...plantFilters,
      },
    },
  });

  const setStatusFromRunningQuery = () =>
    setSearchStatus((prev) =>
      prev === "SCRAPING_AND_POLLING" ? prev : "CHECKING_STATUS",
    );

  useEffect(() => {
    plantSearchQuery.loading &&
      plantSearchQuery.networkStatus !== NetworkStatus.fetchMore &&
      setStatusFromRunningQuery();
  }, [plantSearchQuery.loading, plantSearchQuery.networkStatus]);

  const searchRecordQuery = useReactQuery({
    queryKey: ["search-record", searchParams],
    refetchInterval: pollInterval,
    enabled: Boolean(searchParams),

    queryFn: async () => {
      setStatusFromRunningQuery();

      const { data } = await hotplantsClient.POST("/plants/getSearchRecord", {
        body: searchParams!,
      });

      if (data?.status !== "SCRAPING" && pollInterval) {
        stopPolling();
        plantSearchQuery.refetch();
      }

      return data;
    },
  });
  const searchRecordData = searchRecordQuery.data;

  useEffect(() => {
    if (searchRecordData?.id && !searchRecordData.lastRanTimestamp) {
      setAutoScrapesRemaining(MAX_AUTO_SCRAPES);
    } else {
      setAutoScrapesRemaining(0);
    }
  }, [searchRecordData?.id, searchRecordData?.lastRanTimestamp]);

  const scrapeOccurrencesQuery = useReactQuery({
    queryKey: [
      "scrape-occurrences",
      searchRecordData?.id,
      autoScrapesRemaining,
    ],
    enabled: Boolean(
      searchRecordData?.id &&
      searchRecordData.status === "READY" &&
      autoScrapesRemaining > 0,
    ),

    queryFn: async () => {
      setStatusFromRunningQuery();

      const { data } = await hotplantsClient.GET(
        "/plants/runSearch/{searchRecordId}",
        { params: { path: { searchRecordId: searchRecordData!.id } } },
      );

      if (data?.status === "SCRAPING" && !pollInterval) {
        setSearchStatus("SCRAPING_AND_POLLING");
        startPolling();
      }

      return data;
    },
  });

  /**
   * Each query only sets the status to a non-READY state
   * Status is only set to READY once the poll interval is empty,
   * and no query is loading or fetching.
   */
  const someQueryInProgress =
    pollInterval ||
    plantSearchQuery.loading ||
    searchRecordQuery.fetchStatus !== "idle" ||
    scrapeOccurrencesQuery.fetchStatus !== "idle";

  useEffect(() => {
    if (!someQueryInProgress) {
      setSearchStatus("READY");
    }
  }, [someQueryInProgress]);
  // #endregion

  const stopPolling = () => {
    stopPollingTimeout.current && clearTimeout(stopPollingTimeout.current);

    setPollInterval(0);
    setAutoScrapesRemaining((prev) => Math.max(0, prev - 1));
  };

  const startPolling = () => {
    plantSearchQuery.refetch();
    searchRecordQuery.refetch();

    setPollInterval(DEFAULT_POLL_INTERVAL);

    stopPollingTimeout.current && clearTimeout(stopPollingTimeout.current);
    stopPollingTimeout.current = setTimeout(
      stopPolling,
      DEFAULT_POLL_INTERVAL * MAX_POLLS,
    );
  };

  useEffect(() => {
    if (
      searchRecordQuery.error ||
      plantSearchQuery.error ||
      scrapeOccurrencesQuery.error
    ) {
      stopPolling();
      const errors = [
        searchRecordQuery.error,
        plantSearchQuery.error,
        scrapeOccurrencesQuery.error,
      ];
      console.error(errors);

      toast.error(
        <>
          Error(s) occurred while scraping: <br />
          {errors.flatMap((error, index) =>
            error?.message ? <div key={index}>{error.message}</div> : [],
          )}
        </>,
      );
    }
  }, [
    searchRecordQuery.error,
    plantSearchQuery.error,
    scrapeOccurrencesQuery.error,
  ]);

  return {
    searchStatus,
    plantSearchQuery,
    searchRecordQuery,
    scrapeMoreData: scrapeOccurrencesQuery.refetch,
  };
};

export type PlantSearchQueriesReturnType = ReturnType<
  typeof usePlantSearchQueries
>;

export default usePlantSearchQueries;
