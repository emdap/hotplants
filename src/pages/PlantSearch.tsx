import LocationMap from "components/LocationMap";
import LocationSearch, {
  LocationFilter,
} from "components/plantFilters/LocationSearch";
import PlantCharacteristicsFilter from "components/plantFilters/PlantCharacteristicsFilter";
import PlantSearchResults from "components/plantSearchResults/PlantSearchResults";
import ScrapeStatusBar from "components/ScrapeStatusBar";
import Card from "designSystem/Card";
import { useApolloQuery } from "generated/graphql/useApollo";
import { SEARCH_PLANTS } from "graphqlQueries/plantQueries";
import { useState } from "react";

const PlantSearch = () => {
  const [_locationState, setLocationState] = useState<LocationFilter>();

  //   console.log("location:", locationState);

  const plantSearchResult = useApolloQuery(SEARCH_PLANTS, {
    variables: {
      limit: 10,
      //   where: { bloomColors: ["red"] },
    },
  });

  return (
    <main className="h-full relative overflow-hidden flex flex-col">
      <div className="flex flex-col gap-2 p-4">
        <div className="flex gap-4">
          <Card>
            <LocationSearch setLocation={setLocationState} />
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
