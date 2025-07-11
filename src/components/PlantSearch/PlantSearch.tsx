import { useQuery } from "@tanstack/react-query";
import Card from "designSystem/Card";
import createClient from "openapi-fetch";
import { useState } from "react";
import type { paths } from "schemas/gbif";
import type { PlantSearchFiltersNormalized } from "schemas/gbif-custom-types";
import PlantSearchFilterBar from "./PlantSearchFilterBar";

const PlantSearch = () => {
  const plantClient = createClient<paths>({
    baseUrl: "https://api.gbif.org/v1/",
  });
  const [searchFilters, setSearchFilters] = useState<
    PlantSearchFiltersNormalized | undefined
  >();

  const plantSearchResult = useQuery({
    queryKey: ["plant-search", searchFilters],
    queryFn: async () => {
      const { data: result } = await plantClient.GET("/occurrence/search", {
        params: {
          query: {
            kingdomKey: [6],
            basisOfRecord: [
              "HUMAN_OBSERVATION",
              "OBSERVATION",
              "MACHINE_OBSERVATION",
            ],
            // @ts-expect-error TODO: Passing string rather than serializing nested object into string -- default serialization not accepted by API
            mediaType: "StillImage",
            limit: 10,
            ...searchFilters,
          },
        },
      });
      return result;
    },
  });

  return (
    <div className="p-8 flex flex-col gap-2 max-w-lg min-h-0">
      <PlantSearchFilterBar applyFilters={setSearchFilters} />
      {plantSearchResult.isLoading && "Loading"}
      {plantSearchResult.isError && "Error"}
      <div className="space-y-4 flex-grow min-h-0 overflow-auto p-4 -mx-4">
        {plantSearchResult.data?.results?.map(
          ({ key, media, genericName, ...rest }) => (
            <Card key={key} className="flex flex-col gap-1 !p-4">
              <span>{genericName}</span>
              <span>{rest.establishmentMeans}</span>
              {media?.length && media[0].type === "StillImage" && (
                <img src={media[0].identifier} />
              )}
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default PlantSearch;
