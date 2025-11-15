import { useLazyQuery } from "@apollo/client/react";
import {
  PlantDataInput,
  QueryPlantSearchArgs,
} from "generated/graphql/graphql";
import { paths } from "generated/schemas/hotplants";
import { GET_PLANT, SEARCH_PLANTS } from "graphqlHelpers/plantQueries";
import { useApolloQuery, useReactQuery } from "hooks/useQuery";
import createClient from "openapi-fetch";
import { useEffect, useRef, useState } from "react";

export type PlantSearchQueryStatus =
  | "READY"
  | "CHECKING_STATUS"
  | "SCRAPING_AND_POLLING";

const DEFAULT_POLL_INTERVAL = 3000;
const MAX_POLLS = 10;
const MAX_AUTO_SCRAPES = 3;
const MIN_RESULTS = 50;
const DEFAULT_PAGE_SIZE = 20;

const DEFAULT_PLANT_SEARCH_GQL_VARS: QueryPlantSearchArgs = {
  limit: DEFAULT_PAGE_SIZE,
  sort: [
    { field: "addedTimestamp", direction: 1 },
    { field: "scientificName", direction: 1 },
  ],
};

const hotplantsClient = createClient<paths>({
  baseUrl: `${import.meta.env.VITE_SERVER_URL}/api`,
});

const usePlantSearchQueries = (plantSearchCriteria: PlantDataInput | null) => {
  const [status, setStatus] = useState<PlantSearchQueryStatus>("READY");

  const stopPollingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [autoScrapesRemaining, setAutoScrapesRemaining] = useState(0);
  const [pollInterval, setPollInterval] = useState(0);

  // #region Queries
  const [getPlantQuery] = useLazyQuery(GET_PLANT, { fetchPolicy: "no-cache" });

  const hasSearchCriteria = Boolean(
    plantSearchCriteria && Object.keys(plantSearchCriteria).length
  );

  const plantSearchQuery = useApolloQuery(SEARCH_PLANTS, {
    pollInterval,
    skip: !hasSearchCriteria,
    variables: {
      ...DEFAULT_PLANT_SEARCH_GQL_VARS,
      where: plantSearchCriteria,
    },
  });
  const plantSearchData = plantSearchQuery.data?.plantSearch;

  const setStatusFromRunningQuery = () =>
    setStatus((prev) =>
      prev === "SCRAPING_AND_POLLING" ? prev : "CHECKING_STATUS"
    );

  useEffect(() => {
    plantSearchQuery.loading && setStatusFromRunningQuery();
  }, [plantSearchQuery.loading]);

  const searchRecordQuery = useReactQuery({
    queryKey: ["search-record", plantSearchCriteria],
    refetchInterval: pollInterval,
    enabled: hasSearchCriteria,

    queryFn: async () => {
      setStatusFromRunningQuery();

      const { data } = await hotplantsClient.POST("/plants/getSearchRecord", {
        body: plantSearchCriteria!,
      });

      if (data?.status !== "SCRAPING" && pollInterval) {
        stopPolling();
      }

      return data;
    },
  });
  const searchRecordData = searchRecordQuery.data;

  useEffect(() => {
    if (
      searchRecordData?.id &&
      searchRecordData.status === "READY" &&
      !searchRecordData.occurrencesOffset &&
      plantSearchData?.count !== undefined &&
      plantSearchData?.count < MIN_RESULTS
    ) {
      setAutoScrapesRemaining(MAX_AUTO_SCRAPES);
    } else {
      setAutoScrapesRemaining(0);
    }
    // Only want to run this effect when the searchRecord id, or plantSearchData count updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchRecordData?.id, plantSearchData?.count]);

  const scrapeOccurrencesQuery = useReactQuery({
    queryKey: [
      "scrape-occurrences",
      searchRecordData?.id,
      autoScrapesRemaining,
    ],
    enabled: Boolean(
      searchRecordData?.id &&
        searchRecordData.status === "READY" &&
        autoScrapesRemaining > 0
    ),

    queryFn: async () => {
      setStatusFromRunningQuery();

      const { data } = await hotplantsClient.GET(
        "/plants/scrapeOccurrences/{searchRecordId}",
        { params: { path: { searchRecordId: searchRecordData!.id } } }
      );

      if (data?.status === "SCRAPING" && !pollInterval) {
        setStatus("SCRAPING_AND_POLLING");
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
      setStatus("READY");
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
      DEFAULT_POLL_INTERVAL * MAX_POLLS
    );
  };

  useEffect(() => {
    if (
      searchRecordQuery.error ||
      plantSearchQuery.error ||
      scrapeOccurrencesQuery.error
    ) {
      stopPolling();
      console.error("TODO: Tell user there was an error :)");
    }
  }, [
    searchRecordQuery.error,
    plantSearchQuery.error,
    scrapeOccurrencesQuery.error,
  ]);

  const fetchNextPlantsPage = async () => {
    if (!plantSearchData?.results) {
      return;
    }

    const { results, count } = plantSearchData;
    const unfetchedPlants = count - results.length;

    if (
      (status === "READY" && unfetchedPlants) ||
      unfetchedPlants >= DEFAULT_PAGE_SIZE
    ) {
      plantSearchQuery.fetchMore({
        variables: { offset: plantSearchData.results.length },
      });
    }
  };

  return {
    status,
    plantSearchData,
    plantSearchQuery,
    searchRecordQuery,
    getPlantQuery,
    fetchNextPlantsPage,
    scrapeMoreData: scrapeOccurrencesQuery.refetch,
  };
};

export default usePlantSearchQueries;
