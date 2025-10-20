import { useQuery } from "@tanstack/react-query";
import LocationMap from "components/LocationMap";
import LocationSearch from "components/plantFilters/LocationSearch";
import PlantCharacteristicsFilter from "components/plantFilters/PlantCharacteristicsFilter";
import PlantResultsHolder from "components/plantSearchResults/PlantResultsHolder";
import ScrapeStatusBar from "components/ScrapeStatusBar";
import {
  FullScreenElement,
  PlantSearchContext,
} from "contexts/PlantSearchContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import {
  PlantDataInput,
  QueryPlantSearchArgs,
} from "generated/graphql/graphql";
import { paths } from "generated/schemas/hotplants";
import { GET_SEARCH_RECORD, SEARCH_PLANTS } from "graphqlHelpers/plantQueries";
import { useApolloQuery } from "hooks/useQuery";
import createClient from "openapi-fetch";
import { useEffect, useRef, useState } from "react";

const DEFAULT_POLL_INTERVAL = 3000;
const MAX_POLLS = 20;
const MIN_RESULTS = 50;

const DEFAULT_PLANT_SEARCH_GQL_VARS: QueryPlantSearchArgs = {
  limit: 20,
  sort: { addedTimestamp: "desc" },
};

const hotplantsClient = createClient<paths>({
  baseUrl: import.meta.env.VITE_HOTPLANTS_SERVER,
});

const PlantSearch = () => {
  const stopPollingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pollInterval, setPollInterval] = useState(0);
  const [plantFilters, setPlantFilters] = useState<PlantDataInput | null>(null);
  const fullScreenElementState = useState<FullScreenElement | null>(null);

  const { data: { plantSearch } = {}, ...plantSearchQuery } = useApolloQuery(
    SEARCH_PLANTS,
    {
      pollInterval,
      skip: !plantFilters?.boundingBox && !pollInterval,
      variables: { ...DEFAULT_PLANT_SEARCH_GQL_VARS, where: plantFilters },
    }
  );

  const { data: searchRecordId, ...scrapeQuery } = useQuery({
    queryKey: ["plant-search", plantFilters],
    queryFn: async () => {
      const { data } = await hotplantsClient.POST("/plants/scrapeOccurrences", {
        body: plantFilters ?? {},
      });
      data && startPolling();
      return data;
    },
    enabled: Boolean(
      !plantSearchQuery.loading &&
        plantSearch &&
        plantSearch?.count < MIN_RESULTS
    ),
  });

  const { data: { searchRecord } = {}, ...searchRecordQuery } = useApolloQuery(
    GET_SEARCH_RECORD,
    {
      pollInterval,
      skip: !searchRecordId,
      variables: {
        searchId: searchRecordId!,
      },
    }
  );

  useEffect(() => {
    if (
      pollInterval &&
      (!searchRecordId ||
        searchRecord?.status === "DONE" ||
        searchRecordQuery.error ||
        plantSearchQuery.error)
    ) {
      setPollInterval(0);
    }
  }, [
    pollInterval,
    searchRecordId,
    searchRecord?.status,
    searchRecordQuery.error,
    plantSearchQuery.error,
  ]);

  const startPolling = () => {
    setPollInterval(DEFAULT_POLL_INTERVAL);

    stopPollingTimeout.current && clearTimeout(stopPollingTimeout.current);
    stopPollingTimeout.current = setTimeout(
      () => setPollInterval(0),
      DEFAULT_POLL_INTERVAL * MAX_POLLS
    );
  };

  const fetchMorePlants = () => {
    if (
      !plantSearchQuery.loading &&
      plantSearch &&
      plantSearch.results.length < plantSearch.count
    ) {
      plantSearchQuery.fetchMore({
        variables: { offset: plantSearch.results.length },
      });
    }
  };

  return (
    <PlantSearchContext.Provider
      value={{
        fullScreenElementState,
      }}
    >
      <main className="h-full relative overflow-hidden flex flex-col">
        <div className="flex flex-col gap-2 p-4">
          <div className="flex gap-4">
            <Card>
              <LocationSearch
                setBoundingBox={(boundingBox) =>
                  setPlantFilters({ ...plantFilters, boundingBox })
                }
              />
              <PlantCharacteristicsFilter />
            </Card>
            <LocationMap />
          </div>

          <ScrapeStatusBar searchRecord={searchRecord} />
        </div>
        <Button variant="primary" onClick={fetchMorePlants}>
          fetch more
        </Button>
        <Button variant="primary" onClick={() => scrapeQuery.refetch()}>
          scrape more
        </Button>

        {plantSearch && (
          <PlantResultsHolder
            searchResults={plantSearch.results}
            fetchMorePlants={fetchMorePlants}
          />
        )}
      </main>
    </PlantSearchContext.Provider>
  );
};

export default PlantSearch;
