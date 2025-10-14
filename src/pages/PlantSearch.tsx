import { useQuery } from "@tanstack/react-query";
import LocationMap from "components/LocationMap";
import LocationSearch from "components/plantFilters/LocationSearch";
import PlantCharacteristicsFilter from "components/plantFilters/PlantCharacteristicsFilter";
import PlantSearchResults from "components/plantSearchResults/PlantSearchResults";
import ScrapeStatusBar from "components/ScrapeStatusBar";
import Card from "designSystem/Card";
import { useApolloQuery } from "generated/graphql/useApollo";
import { paths } from "generated/schemas/hotplants";
import { BBox } from "geojson";
import { SEARCH_PLANTS } from "graphqlQueries/plantQueries";
import createClient from "openapi-fetch";
import { useState } from "react";

const hotplantsClient = createClient<paths>({
  baseUrl: import.meta.env.VITE_HOTPLANTS_SERVER,
});

const PlantSearch = () => {
  const [boundingBox, setBoundingBox] = useState<BBox | null>(null);

  console.log("location:", boundingBox);

  const plantSearchResult = useApolloQuery(SEARCH_PLANTS, {
    variables: {
      limit: 10,
      where: { boundingBox },
    },
  });

  const scrapeSearch = useQuery({
    queryKey: ["plant-search", boundingBox],
    queryFn: async () => {
      // TODO: Sync types with server -- nulls/undefineds
      const { data } = await hotplantsClient.POST("/plants/scrapeOccurrences", {
        body: { boundingBox: boundingBox ?? undefined },
      });
      return data;
    },
  });

  return (
    <main className="h-full relative overflow-hidden flex flex-col">
      <div className="flex flex-col gap-2 p-4">
        <div className="flex gap-4">
          <Card>
            <LocationSearch setBoundingBox={setBoundingBox} />
            <PlantCharacteristicsFilter />
          </Card>
          <LocationMap />
        </div>

        <ScrapeStatusBar />
      </div>

      {plantSearchResult.data && (
        <PlantSearchResults searchResults={plantSearchResult.data} />
      )}
    </main>
  );
};

export default PlantSearch;
