import { useLazyQuery } from "@apollo/client/react";
import { EntityType, PlantDataInput } from "generated/graphql/graphql";
import { GET_PLANT } from "graphqlHelpers/plantQueries";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { getLastPage } from "util/generalUtil";
import {
  PaginationData,
  PlantResult,
  PlantSelectionContext,
  PlantSelectionContextType,
} from "./PlantSelectionContext";

// TODO: Pass down a plant card menu as child, custom actions depending on where plantCards are rendered
// OR: garden context?
// current use case -- add plants to garden if 'not' in garden; remove plants from garden if 'in' garden, and then refresh plants
const PlantSelectionProvider = ({
  entityType,
  plantList: originalPlantList,
  plantListLoading,
  plantActions,
  boundingPolygon,

  page,
  pageSize,
  totalItems,

  children,
}: {
  entityType: EntityType;
  plantList: PlantResult[];
  plantListLoading?: boolean;
  boundingPolygon?: PlantDataInput["boundingPolyCoords"];

  activeGardenId?: string;
  children: ReactNode;
} & Omit<PaginationData, "lastPage"> &
  Pick<PlantSelectionContextType, "plantActions">) => {
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
        entityType,
        plantList,
        plantListLoading,
        plantActions,

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
