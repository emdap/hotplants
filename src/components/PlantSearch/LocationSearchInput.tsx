import { useQuery } from "@tanstack/react-query";
import createClient from "openapi-fetch";
import { useState } from "react";
import { useDebounce } from "react-use";
import type { PlantSearchFiltersNormalized } from "schemas/gbif-custom-types";
import type { paths } from "schemas/nominatim";

const locationClient = createClient<paths>({
  baseUrl: "https://nominatim.openstreetmap.org",
});

type LocationFilter = Pick<
  PlantSearchFiltersNormalized,
  "stateProvince" | "geometry" | "country"
>;

const LocationSearchInput = ({
  setLocationFilter,
}: {
  setLocationFilter: (data: LocationFilter) => void;
}) => {
  const [locationInput, setLocationInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  useDebounce(() => setDebouncedInput(locationInput), 2000, [locationInput]);

  const locationResult = useQuery({
    queryKey: ["location-search", debouncedInput],
    queryFn: async () => {
      const locationFilter: LocationFilter = {
        country: undefined,
        stateProvince: undefined,
        geometry: undefined,
      };

      if (!debouncedInput) {
        setLocationFilter(locationFilter);
        return "";
      }

      const { data } = await locationClient.GET("/search", {
        params: {
          query: {
            q: debouncedInput,
            format: "json",
            polygon_text: 1,
            addressdetails: 1,
            polygon_threshold: 0.5,
          },
        },
      });

      if (!data?.[0]) {
        return "Cannot find location";
      }
      const result = data[0];

      if (result?.addresstype === "country" && result.address?.country_code) {
        locationFilter.country = [
          result.address.country_code.toUpperCase(),
        ] as PlantSearchFiltersNormalized["country"];
      }
      // TODO: stateProvince filter returns no results. Get bounding box of state instead?
      // if (result?.address?.state || result?.address?.province) {
      //   const { state, province } = result.address;
      //   locationFilter.stateProvince = [(state || province) as string];
      // } else
      if (result?.geotext) {
        locationFilter.geometry = [result.geotext];
      }

      setLocationFilter(locationFilter);
      return result.display_name;
    },
  });

  return (
    <div className="flex flex-col">
      <input
        value={locationInput}
        onBlur={() => setDebouncedInput(locationInput)}
        onChange={(e) => setLocationInput(e.target.value)}
        placeholder="Enter a location"
      />
      {locationResult.data && locationResult.data}
      {locationResult.isLoading && "Loading"}
      {locationResult.isError && "Error"}
    </div>
  );
};

export default LocationSearchInput;
