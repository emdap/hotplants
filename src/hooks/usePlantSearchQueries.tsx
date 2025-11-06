import { useLazyQuery } from "@apollo/client/react";
import {
  PlantDataInput,
  QueryPlantSearchArgs,
} from "generated/graphql/graphql";
import { paths } from "generated/schemas/hotplants";
import {
  GET_PLANT,
  GET_SEARCH_RECORD,
  SEARCH_PLANTS,
} from "graphqlHelpers/plantQueries";
import { useApolloQuery, useReactQuery } from "hooks/useQuery";
import createClient from "openapi-fetch";
import { useEffect, useRef, useState } from "react";

const DEFAULT_POLL_INTERVAL = 3000;
const MAX_POLLS = 20;
const MIN_RESULTS = 50;

const DEFAULT_PLANT_SEARCH_GQL_VARS: QueryPlantSearchArgs = {
  limit: 20,
};

const hotplantsClient = createClient<paths>({
  baseUrl: `${import.meta.env.VITE_SERVER_URL}/api`,
});

const usePlantSearchQueries = (plantSearchCriteria: PlantDataInput | null) => {
  const [pollInterval, setPollInterval] = useState(0);
  const stopPollingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadMoreScrape = useRef(false);

  const [getPlantQuery] = useLazyQuery(GET_PLANT, { fetchPolicy: "no-cache" });

  const plantSearchQuery = useApolloQuery(SEARCH_PLANTS, {
    pollInterval,
    skip: !plantSearchCriteria,
    variables: {
      ...DEFAULT_PLANT_SEARCH_GQL_VARS,
      where: plantSearchCriteria,
    },
  });

  const scrapeQuery = useReactQuery({
    queryKey: ["scrape-search", plantSearchCriteria],
    queryFn: async () => {
      const { data } = await hotplantsClient.POST("/plants/scrapeOccurrences", {
        body: plantSearchCriteria ?? {},
      });
      return data;
    },
    enabled: false,
  });

  const searchRecordQuery = useApolloQuery(GET_SEARCH_RECORD, {
    pollInterval,
    skip: !scrapeQuery.data,
    variables: {
      searchId: scrapeQuery.data!,
    },
  });

  useEffect(() => {
    if (
      searchRecordQuery.data?.searchRecord?.status === "DONE" ||
      searchRecordQuery.error ||
      plantSearchQuery.error
    ) {
      setPollInterval(0);
    }
  }, [searchRecordQuery, plantSearchQuery]);

  const startPolling = () => {
    setPollInterval(DEFAULT_POLL_INTERVAL);

    stopPollingTimeout.current && clearTimeout(stopPollingTimeout.current);
    stopPollingTimeout.current = setTimeout(
      () => setPollInterval(0),
      DEFAULT_POLL_INTERVAL * MAX_POLLS
    );
  };

  const performScrapeWithPolling = async () => {
    loadMoreScrape.current = true;
    if (!scrapeQuery.isLoading) {
      const { data } = await scrapeQuery.refetch();
      if (data) {
        const searchRecord = await searchRecordQuery.refetch({
          searchId: data,
        });
        if (searchRecord.data?.searchRecord?.endOfRecords) {
          setPollInterval(0);
          return;
        }
      }
    }
    startPolling();
    loadMoreScrape.current = false;
  };

  useEffect(() => {
    if (
      plantSearchQuery.data &&
      plantSearchQuery.data.plantSearch.count < MIN_RESULTS
    ) {
      performScrapeWithPolling();
    }
    // Stale reference of performScrapeWithPolling is ok, query objects update every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plantSearchQuery.data]);

  const fetchMorePlants = async () => {
    if (pollInterval || plantSearchQuery.loading) {
      return;
    }
    const { plantSearch } = plantSearchQuery.data ?? {};

    if (plantSearch && plantSearch.results.length < plantSearch.count) {
      plantSearchQuery.fetchMore({
        variables: { offset: plantSearch.results.length },
      });
    } else if (
      !loadMoreScrape.current &&
      !searchRecordQuery.data?.searchRecord?.endOfRecords &&
      !pollInterval
    ) {
      performScrapeWithPolling();
    }
  };

  return {
    plantSearchQuery,
    searchRecordQuery,
    getPlantQuery,
    fetchMorePlants,
  };
};

export default usePlantSearchQueries;
