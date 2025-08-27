import { useQuery as useApolloQuery } from "@apollo/client/react";
import Card from "designSystem/Card";
import { graphql } from "generated/graphql";
import { PlantSearchFiltersNormalized } from "generated/schemas/gbif-custom-types";
import { useState } from "react";
import PlantSearchFilterBar from "./PlantSearchFilterBar";

const GET_PLANTS = graphql(`
  query getPlants {
    plants(limit: 3) {
      scientificName
      commonNames
      mediaUrls
    }
  }
`);

const PlantSearch = () => {
  // const plantClient = createClient<paths>({
  //   baseUrl: import.meta.env.VITE_HOTPLANTS_SERVER,
  // });
  const [_searchFilters, setSearchFilters] = useState<
    PlantSearchFiltersNormalized | undefined
  >();

  const plantSearchResult = useApolloQuery(GET_PLANTS);

  return (
    <div className="p-8 flex flex-col gap-2 max-w-lg min-h-0">
      <PlantSearchFilterBar applyFilters={setSearchFilters} />
      {plantSearchResult.loading && "Loading"}
      {plantSearchResult.error && "Error"}
      <div className="space-y-4 flex-grow min-h-0 overflow-auto p-4 -mx-4">
        {plantSearchResult.data?.plants?.map(
          (plant) =>
            plant?.mediaUrls?.[0] && (
              <Card
                key={plant.scientificName}
                className="flex flex-col gap-1 !p-4"
              >
                <span>{plant.scientificName}</span>
                <span>{plant.commonNames?.join(", ")}</span>
                <img src={plant.mediaUrls?.[0]} />
              </Card>
            )
        )}
      </div>
    </div>
  );
};

export default PlantSearch;
