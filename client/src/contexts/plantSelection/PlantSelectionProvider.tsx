import { useLazyQuery } from "@apollo/client/react";
import { PlantDataInput } from "generated/graphql/graphql";
import { GET_PLANT, PlantQueryResults } from "graphqlHelpers/plantQueries";
import { ReactNode, useEffect, useState } from "react";
import { PlantSelectionContext } from "./PlantSelectionContext";

const PlantSelectionProvider = ({
  plantList: originalPlantList,
  boundingPolygon,
  children,
}: {
  plantList: PlantQueryResults;
  boundingPolygon?: PlantDataInput["boundingPolyCoords"];
  children: ReactNode;
}) => {
  const [plantList, setPlantList] = useState(originalPlantList);
  const [activePlantIndex, setActivePlantIndex] = useState<number | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);

  useEffect(() => {
    setPlantList(originalPlantList);
  }, [originalPlantList]);

  const [getPlantQuery] = useLazyQuery(GET_PLANT, { fetchPolicy: "no-cache" });

  const syncPlant = async (plantId: string) => {
    const { data } = await getPlantQuery({
      variables: {
        id: plantId,
        boundingPolyCoords: boundingPolygon,
      },
    });

    if (data?.plant) {
      setPlantList((prev) =>
        prev.map((plantResult) =>
          data.plant && data.plant._id === plantResult._id
            ? data.plant
            : plantResult
        )
      );
    }
  };

  return (
    <PlantSelectionContext.Provider
      value={{
        plantList,

        activePlantIndex,
        activeMediaIndex,
        setActivePlantIndex,
        setActiveMediaIndex,

        syncPlant,
      }}
    >
      {children}
    </PlantSelectionContext.Provider>
  );
};

export default PlantSelectionProvider;
