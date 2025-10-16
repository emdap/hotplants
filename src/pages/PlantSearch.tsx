import { useQuery } from "@tanstack/react-query";
import LocationMap from "components/LocationMap";
import LocationSearch from "components/plantFilters/LocationSearch";
import PlantCharacteristicsFilter from "components/plantFilters/PlantCharacteristicsFilter";
import PlantQueryResults from "components/plantSearchResults/PlantSearchResults";
import ScrapeStatusBar from "components/ScrapeStatusBar";
import Card from "designSystem/Card";
import { PlantDataInput } from "generated/graphql/graphql";
import { paths } from "generated/schemas/hotplants";
import { GET_SEARCH_RECORD, SEARCH_PLANTS } from "graphqlQueries/plantQueries";
import { useApolloQuery } from "hooks/useQuery";
import createClient from "openapi-fetch";
import { useEffect, useRef, useState } from "react";

const DEFAULT_POLL_INTERVAL = 3000;
const MAX_POLLS = 10;
const MIN_RESULTS = 50;

const hotplantsClient = createClient<paths>({
  baseUrl: import.meta.env.VITE_HOTPLANTS_SERVER,
});

const PlantSearch = () => {
  const stopPollingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [plantFilters, setPlantFilters] = useState<PlantDataInput | null>(null);

  const { data: { plantSearch } = {}, ...plantSearchQuery } = useApolloQuery(
    SEARCH_PLANTS,
    {
      skip: !plantFilters?.boundingBox,
      variables: {
        limit: 10,
        sort: { addedTimestamp: "desc" },
        where: plantFilters,
      },
    }
  );

  const enableScraping = Boolean(
    plantSearch && plantSearch.count < MIN_RESULTS
  );

  const { data: searchRecordId, ..._scrapeSearchQuery } = useQuery({
    queryKey: ["plant-search", plantFilters],
    queryFn: async () => {
      // TODO: Sync types with server -- nulls/undefineds
      const { data } = await hotplantsClient.POST("/plants/scrapeOccurrences", {
        body: plantFilters ?? {},
      });
      return data;
    },
    enabled: enableScraping,
  });

  const { data: { searchRecord } = {}, ...searchRecordQuery } = useApolloQuery(
    GET_SEARCH_RECORD,
    {
      skip: !searchRecordId,
      variables: {
        searchId: searchRecordId!,
      },
    }
  );

  useEffect(() => {
    const startPolling = (interval: number) => {
      searchRecordQuery.startPolling(interval);
      plantSearchQuery.startPolling(interval);

      stopPollingTimeout.current && clearTimeout(stopPollingTimeout.current);
      stopPollingTimeout.current = setTimeout(
        () => stopPolling(),
        DEFAULT_POLL_INTERVAL * MAX_POLLS
      );
    };

    const stopPolling = () => {
      searchRecordQuery.stopPolling();
      plantSearchQuery.stopPolling();
    };

    if (
      plantSearchQuery.error ||
      !searchRecordId ||
      searchRecord?.status === "DONE"
    ) {
      stopPolling();
    } else {
      startPolling(DEFAULT_POLL_INTERVAL);
    }
  }, [searchRecordId, searchRecord, searchRecordQuery, plantSearchQuery]);

  return (
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

        <ScrapeStatusBar status={searchRecord?.status} />
      </div>

      {plantSearch && <PlantQueryResults searchResults={plantSearch.results} />}
    </main>
  );
};

export default PlantSearch;
