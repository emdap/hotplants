import { useQuery } from "@tanstack/react-query";
import type { PlantSearchFiltersNormalized } from "generated/schemas/gbif-custom-types";
import type { paths } from "generated/schemas/nominatim";
import { BBox } from "geojson";
import createClient from "openapi-fetch";
import { useState } from "react";
import { useDebounce } from "react-use";

const locationClient = createClient<paths>({
  baseUrl: "https://nominatim.openstreetmap.org",
});

export type LocationFilter = Pick<
  PlantSearchFiltersNormalized,
  "stateProvince" | "geometry" | "country"
>;

const LocationSearch = ({
  setBoundingBox,
}: {
  setBoundingBox: (bbox: BBox | null) => void;
}) => {
  const [locationInput, setLocationInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  useDebounce(() => setDebouncedInput(locationInput), 2000, [locationInput]);

  const locationResult = useQuery({
    queryKey: ["location-search", debouncedInput],
    queryFn: async () => {
      if (!debouncedInput) {
        setBoundingBox(null);
        return "";
      }

      const { data } = await locationClient.GET("/search", {
        params: {
          query: {
            q: debouncedInput,
            format: "json",
            addressdetails: 1,
            polygon_geojson: 1,
            polygon_threshold: 0.5,
          },
        },
      });

      if (!data?.[0]) {
        return "Cannot find location";
      }
      const result = data[0];

      if (result?.boundingbox) {
        const bboxNumbers = result.boundingbox.map(Number);
        setBoundingBox([
          bboxNumbers[2],
          bboxNumbers[0],
          bboxNumbers[3],
          bboxNumbers[1],
        ]);
      }

      return result.display_name;
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !(e.target instanceof HTMLInputElement)) {
      return;
    }
    setDebouncedInput(e.target.value);
  };

  return (
    <div className="flex flex-col">
      <input
        value={locationInput}
        onBlur={() => setDebouncedInput(locationInput)}
        onKeyDown={handleKeyDown}
        onChange={(e) => setLocationInput(e.target.value)}
        placeholder="Enter a location"
      />
      {locationResult.data && locationResult.data}
      {locationResult.isLoading && "Loading"}
      {locationResult.isError && "Error"}
    </div>
  );
};

export default LocationSearch;
