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
  const [pollInterval, setPollInterval] = useState(0);
  const stopPollingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [autoScrapesRemaining, setAutoScrapesRemaining] = useState(0);

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

      if (data?.status === "READY" && !data.occurrencesOffset) {
        setAutoScrapesRemaining(MAX_AUTO_SCRAPES);
      } else {
        setAutoScrapesRemaining(0);
      }

      return data;
    },
    refetchInterval: pollInterval,
    enabled: plantSearchCriteria !== null,
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

  const startPolling = () => {
    const completePollingCycle = () => {
      setPollInterval(0);
      setAutoScrapesRemaining((prev) => prev - 1);
    };

    setPollInterval(DEFAULT_POLL_INTERVAL);

    stopPollingTimeout.current && clearTimeout(stopPollingTimeout.current);
    stopPollingTimeout.current = setTimeout(
      completePollingCycle,
      DEFAULT_POLL_INTERVAL * MAX_POLLS
    );
  };

  const shouldAutoScrapePlants =
    autoScrapesRemaining !== 0 &&
    !plantSearchQuery.loading &&
    plantSearchData !== undefined &&
    plantSearchData.count < MIN_RESULTS &&
    searchRecordData?.status === "READY";

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

      if (data?.status === "SCRAPING") {
        startPolling();
      }

      return data;
    },
  });

  useEffect(() => {
    if (
      searchRecordData?.status === "COMPLETE" ||
      searchRecordQuery.error ||
      plantSearchQuery.error
    ) {
      setPollInterval(0);
    }
  }, [searchRecordData, searchRecordQuery.error, plantSearchQuery.error]);

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
    plantSearchQuery,
    searchRecordQuery,
    scrapeQueryLoading: scrapeOccurrencesQuery.isLoading,
    getPlantQuery,
    fetchNextPlantsPage,
    scrapeMoreData: scrapeOccurrencesQuery.refetch,
  };
};

export default usePlantSearchQueries;
