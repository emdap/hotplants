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

const DEFAULT_POLL_INTERVAL = 3000;
const MAX_POLLS = 10;
const MAX_AUTO_SCRAPES = 3;
const MIN_RESULTS = 50;

const DEFAULT_PLANT_SEARCH_GQL_VARS: QueryPlantSearchArgs = {
  limit: 20,
  sort: [
    { field: "addedTimestamp", direction: 1 },
    { field: "scientificName", direction: 1 },
  ],
};

const hotplantsClient = createClient<paths>({
  baseUrl: `${import.meta.env.VITE_SERVER_URL}/api`,
});

const usePlantSearchQueries = (plantSearchCriteria: PlantDataInput | null) => {
  const stopPollingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [autoScrapesRemaining, setAutoScrapesRemaining] = useState(0);
  const [pollInterval, setPollInterval] = useState(0);
  const [isInitialSearch, setIsInitialSearch] = useState(true);

  const [getPlantQuery] = useLazyQuery(GET_PLANT, { fetchPolicy: "no-cache" });

  const plantSearchQuery = useApolloQuery(SEARCH_PLANTS, {
    pollInterval,
    skip: !plantSearchCriteria,
    variables: {
      ...DEFAULT_PLANT_SEARCH_GQL_VARS,
      where: plantSearchCriteria,
    },
  });
  const plantSearchData = plantSearchQuery.data?.plantSearch;

  const searchRecordQuery = useReactQuery({
    queryKey: ["init-search-record", plantSearchCriteria],
    queryFn: async () => {
      const { data } = await hotplantsClient.POST("/plants/getSearchRecord", {
        body: plantSearchCriteria!,
      });

      if (isInitialSearch) {
        setIsInitialSearch(false);
      }

      if (pollInterval && data?.status !== "SCRAPING") {
        stopPolling();
      }

      return data;
    },
    refetchInterval: pollInterval,
    enabled: Boolean(plantSearchCriteria),
  });
  const searchRecordData = searchRecordQuery.data;

  useEffect(() => {
    if (
      searchRecordData?.id &&
      searchRecordData.status === "READY" &&
      !searchRecordData.occurrencesOffset
    ) {
      setAutoScrapesRemaining(MAX_AUTO_SCRAPES);
    } else {
      setAutoScrapesRemaining(0);
    }
    // Only want to run this effect when the searchRecord id updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchRecordData?.id]);

  const stopPolling = () => {
    stopPollingTimeout.current && clearTimeout(stopPollingTimeout.current);

    setPollInterval(0);
    setAutoScrapesRemaining((prev) => Math.max(0, prev - 1));
  };

  const startPolling = () => {
    setPollInterval(DEFAULT_POLL_INTERVAL);

    stopPollingTimeout.current && clearTimeout(stopPollingTimeout.current);
    stopPollingTimeout.current = setTimeout(
      stopPolling,
      DEFAULT_POLL_INTERVAL * MAX_POLLS
    );
  };

  useEffect(() => {
    if (searchRecordQuery.error || plantSearchQuery.error) {
      stopPolling();
    }
  }, [searchRecordQuery.error, plantSearchQuery.error]);

  const shouldAutoScrapePlants =
    autoScrapesRemaining > 0 &&
    searchRecordData?.status === "READY" &&
    !plantSearchQuery.loading &&
    plantSearchData !== undefined &&
    plantSearchData.count < MIN_RESULTS;

  const scrapeOccurrencesQuery = useReactQuery({
    queryKey: [
      "scrape-occurrences",
      searchRecordData?.id,
      autoScrapesRemaining,
    ],
    enabled: shouldAutoScrapePlants,

    queryFn: async () => {
      if (!searchRecordData?.id) {
        return;
      }

      const { data } = await hotplantsClient.GET(
        "/plants/scrapeOccurrences/{searchRecordId}",
        { params: { path: { searchRecordId: searchRecordData.id } } }
      );

      if (data?.status === "SCRAPING" && !pollInterval) {
        searchRecordQuery.refetch();
        plantSearchQuery.refetch();
        startPolling();
      }

      return data;
    },
  });

  const fetchNextPlantsPage = async () => {
    if (pollInterval || plantSearchQuery.loading || !plantSearchData) {
      return;
    }

    if (plantSearchData.results.length < plantSearchData.count) {
      plantSearchQuery.fetchMore({
        variables: { offset: plantSearchData.results.length },
      });
    }
  };

  return {
    isInitialSearch,
    isLoading:
      // Include check on dataState to differentiate between fetching next page,
      // and loading new filter results
      (plantSearchQuery.dataState === "empty" && plantSearchQuery.loading) ||
      searchRecordQuery.isLoading ||
      scrapeOccurrencesQuery.isLoading,
    isScraping: Boolean(pollInterval),
    plantSearchQuery,
    searchRecordQuery,
    scrapeQueryLoading: scrapeOccurrencesQuery.isLoading,
    getPlantQuery,
    fetchNextPlantsPage,
    scrapeMoreData: scrapeOccurrencesQuery.refetch,
  };
};

export default usePlantSearchQueries;
