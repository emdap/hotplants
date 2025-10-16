import { useQuery } from "@tanstack/react-query";
import LocationMap from "components/LocationMap";
import LocationSearch from "components/plantFilters/LocationSearch";
import PlantCharacteristicsFilter from "components/plantFilters/PlantCharacteristicsFilter";
import PlantSearchResults from "components/plantSearchResults/PlantSearchResults";
import ScrapeStatusBar from "components/ScrapeStatusBar";
import Card from "designSystem/Card";
import { PlantDataInput } from "generated/graphql/graphql";
import { paths } from "generated/schemas/hotplants";
import { SEARCH_PLANTS } from "graphqlQueries/plantQueries";
import { useApolloQuery } from "hooks/useQuery";
import createClient from "openapi-fetch";
import { useEffect, useState } from "react";

const hotplantsClient = createClient<paths>({
  baseUrl: import.meta.env.VITE_HOTPLANTS_SERVER,
});

const DEFAULT_POLL_INTERVAL = 1000;

const PlantSearch = () => {
  const [searchPollInterval, setSearchPollInterval] = useState(0);
  const [plantFilters, setPlantFilters] = useState<PlantDataInput | null>(null);
  plantFilters?.scientificName;
  const scrapeSearchQuery = useQuery({
    queryKey: ["plant-search", plantFilters],
    queryFn: async () => {
      // TODO: Sync types with server -- nulls/undefineds
      const { data } = await hotplantsClient.POST("/plants/scrapeOccurrences", {
        body: plantFilters!,
      });
      return data;
    },
    enabled: !!plantFilters,
  });

  console.log(plantFilters);

  const { data: { searchRecords, plants } = {}, ...plantSearchQuery } =
    useApolloQuery(SEARCH_PLANTS, {
      skip: !scrapeSearchQuery.data,
      pollInterval: searchPollInterval,
      variables: {
        searchId: scrapeSearchQuery.data!,
        limit: 10,
        sort: { addedTimestamp: "desc" },
        where: plantFilters,
      },
    });

  useEffect(() => {
    if (
      plantSearchQuery.error ||
      !scrapeSearchQuery.data ||
      searchRecords?.status === "DONE"
    ) {
      setSearchPollInterval(0);
    } else {
      setSearchPollInterval(DEFAULT_POLL_INTERVAL);
    }
  }, [scrapeSearchQuery.data, searchRecords?.status, plantSearchQuery.error]);

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

        <ScrapeStatusBar status={searchRecords?.status} />
      </div>

      {plants && <PlantSearchResults searchResults={plants} />}
    </main>
  );
};

export default PlantSearch;
