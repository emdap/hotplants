import { useLazyQuery } from "@apollo/client/react";
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
import { LocationWithBoundingBox } from "generated/schemas/schema-util";
import {
  GET_PLANT,
  GET_SEARCH_RECORD,
  PlantQueryResults,
  SEARCH_PLANTS,
} from "graphqlHelpers/plantQueries";
import { useApolloQuery } from "hooks/useQuery";
import createClient from "openapi-fetch";
import { useEffect, useRef, useState } from "react";

const DEFAULT_POLL_INTERVAL = 3000;
const MAX_POLLS = 20;
const MIN_RESULTS = 50;

const DEFAULT_PLANT_SEARCH_GQL_VARS: QueryPlantSearchArgs = {
  limit: 20,
  sort: { addedTimestamp: -1 },
};

const hotplantsClient = createClient<paths>({
  baseUrl: import.meta.env.VITE_HOTPLANTS_SERVER,
});

const PlantSearch = () => {
  const [fullScreenElement, setFullScreenElement] =
    useState<FullScreenElement | null>(null);
  const [plantSearchResults, setPlantSearchResults] =
    useState<PlantQueryResults>([]);

  const loadMoreScrape = useRef(false);
  const stopPollingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pollInterval, setPollInterval] = useState(0);

  const [location, setLocation] = useState<LocationWithBoundingBox | null>(
    null
  );
  const [plantFilterInput, setPlantFilterInput] =
    useState<PlantDataInput | null>(null);
  const [appliedPlantFilters, setAppliedPlantFilters] =
    useState<PlantDataInput | null>(null);

  useEffect(() => {
    let boundingBox: number[] | null = null;
    if (location) {
      const bboxNumbers = location.boundingbox.map(Number);
      boundingBox = [
        bboxNumbers[2],
        bboxNumbers[0],
        bboxNumbers[3],
        bboxNumbers[1],
      ];
    }

    setPlantFilterInput((filters) => ({ ...filters, boundingBox }));
  }, [location]);

  const { data: { plantSearch } = {}, ...plantSearchQuery } = useApolloQuery(
    SEARCH_PLANTS,
    {
      pollInterval,
      skip: !appliedPlantFilters,
      variables: {
        ...DEFAULT_PLANT_SEARCH_GQL_VARS,
        where: appliedPlantFilters,
      },
    }
  );

  useEffect(() => {
    setPlantSearchResults(plantSearch?.results ?? []);
  }, [plantSearch]);

  const { data: searchRecordId, ...scrapeQuery } = useQuery({
    queryKey: ["plant-search", appliedPlantFilters],
    queryFn: async () => {
      const { data } = await hotplantsClient.POST("/plants/scrapeOccurrences", {
        body: appliedPlantFilters ?? {},
      });
      return data;
    },
    enabled: Boolean(
      plantSearch?.count !== undefined && plantSearch.count < MIN_RESULTS
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

  const stopPolling = () => {
    setPollInterval(0);
  };

  const startPolling = () => {
    setPollInterval(DEFAULT_POLL_INTERVAL);

    stopPollingTimeout.current && clearTimeout(stopPollingTimeout.current);
    stopPollingTimeout.current = setTimeout(
      () => stopPolling(),
      DEFAULT_POLL_INTERVAL * MAX_POLLS
    );
  };

  useEffect(() => {
    if (
      searchRecord?.status === "DONE" ||
      searchRecordQuery.error ||
      plantSearchQuery.error
    ) {
      stopPolling();
    }
  }, [searchRecord?.status, searchRecordQuery.error, plantSearchQuery.error]);

  const [getPlantQuery] = useLazyQuery(GET_PLANT, { fetchPolicy: "no-cache" });

  const syncPlant = async (plantId: string) => {
    const { data } = await getPlantQuery({ variables: { id: plantId } });
    if (data?.plant) {
      setPlantSearchResults((prev) =>
        prev.map((plantResult) =>
          data.plant && data.plant._id === plantResult._id
            ? data.plant
            : plantResult
        )
      );
    }
  };

  const fetchMorePlants = async () => {
    if (plantSearchQuery.loading) {
      return;
    }

    if (plantSearch && plantSearch.results.length < plantSearch.count) {
      plantSearchQuery.fetchMore({
        variables: { offset: plantSearch.results.length },
      });
    } else if (
      !loadMoreScrape.current &&
      !searchRecord?.endOfRecords &&
      !pollInterval
    ) {
      performScrapeWithPolling();
    }
  };

  const performScrapeWithPolling = async () => {
    loadMoreScrape.current = true;
    if (!scrapeQuery.isLoading) {
      const { data } = await scrapeQuery.refetch();
      data && (await searchRecordQuery.refetch({ searchId: data }));
    }
    startPolling();
    loadMoreScrape.current = false;
  };

  return (
    <PlantSearchContext.Provider
      value={{
        syncPlant,
        fullScreenElement,
        setFullScreenElement,
      }}
    >
      <main className="h-full relative overflow-hidden flex flex-col">
        <div className="flex flex-col gap-2 p-4">
          <div className="flex gap-4">
            <Card className="flex flex-col gap-2 flex-grow">
              <LocationSearch setLocation={setLocation} />
              <PlantCharacteristicsFilter
                {...{ plantFilterInput, setPlantFilterInput }}
              />
              <Button
                variant="primary"
                onClick={() => {
                  setAppliedPlantFilters(plantFilterInput);
                  performScrapeWithPolling();
                }}
              >
                Search
              </Button>
            </Card>
            <LocationMap />
          </div>

          <ScrapeStatusBar searchRecord={searchRecord} />
        </div>

        <PlantResultsHolder
          searchResults={plantSearchResults}
          fetchMorePlants={fetchMorePlants}
        />
      </main>
    </PlantSearchContext.Provider>
  );
};

export default PlantSearch;
