import Card from "designSystem/Card";
import { SearchPlantsQuery } from "generated/graphql/graphql";
import { PlantResult } from "graphqlQueries/plantQueries";
import { useState } from "react";
import PlantImageViewer from "./PlantImageViewer";
import PlantInfo from "./PlantInfo";
import PlantResultPane from "./PlantResultPane";

const PlantSearchResults = ({
  searchResults,
}: {
  searchResults: SearchPlantsQuery;
}) => {
  const [activePlant, setActivePlant] = useState<null | PlantResult>(null);

  return (
    <>
      <div className="space-y-4 flex-grow overflow-auto p-2">
        {searchResults.plants.map(
          (plant) =>
            plant && (
              <Card
                key={plant.scientificName}
                id={plant.scientificName}
                onClickCapture={() => setActivePlant(plant)}
                className="flex gap-2 cursor-pointer h-40"
              >
                <PlantImageViewer mode="thumbnail" plant={plant} />
                <PlantInfo plant={plant} />
              </Card>
            )
        )}
      </div>

      <PlantResultPane
        plant={activePlant}
        onClose={() => setActivePlant(null)}
      />
    </>
  );
};

export default PlantSearchResults;
