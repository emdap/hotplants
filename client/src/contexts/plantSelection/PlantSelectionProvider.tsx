import { useLazyQuery } from "@apollo/client/react";
import { PlantDataInput } from "generated/graphql/graphql";
import { GET_PLANT, PlantQueryResults } from "graphqlHelpers/plantQueries";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { getLastPage } from "util/generalUtil";
import { PaginationData, PlantSelectionContext } from "./PlantSelectionContext";

const PlantSelectionProvider = ({
  plantList: originalPlantList,
  boundingPolygon,

  page,
  pageSize,
  totalItems,

  children,
}: {
  plantList: PlantQueryResults;
  boundingPolygon?: PlantDataInput["boundingPolyCoords"];
  children: ReactNode;
} & Omit<PaginationData, "lastPage">) => {
  const [plantList, setPlantList] = useState(originalPlantList);
  const [activePlantId, setActivePlantId] = useState<string | null>(null);
  const [activeMediaUrl, setActiveMediaUrl] = useState<string | null>(null);

  useEffect(() => {
    setPlantList(originalPlantList);
  }, [originalPlantList]);

  const { activePlant, activePlantMedia } = useMemo(() => {
    const activePlant = plantList.find(({ _id }) => _id === activePlantId);
    return {
      activePlant,
      activePlantMedia: activePlant
        ? activePlant.occurrences.flatMap(({ media, ...rest }) =>
            media.map((mediaObject) => ({ ...rest, ...mediaObject })),
          )
        : [],
    };
  }, [plantList, activePlantId]);

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
            : plantResult,
        ),
      );
    }
  };

  const lastPage = getLastPage(pageSize, totalItems);

  return (
    <PlantSelectionContext.Provider
      value={{
        plantList,

        page,
        lastPage,
        pageSize,
        totalItems,

        activePlantId,
        activePlant,
        activePlantMedia,
        activeMediaUrl,

        setActivePlantId,
        setActiveMediaUrl,

        syncPlant,
      }}
    >
      {children}
    </PlantSelectionContext.Provider>
  );
};

export default PlantSelectionProvider;
