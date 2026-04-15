import { useLazyQuery } from "@apollo/client/react";
import { PlantDataInput } from "generated/graphql/graphql";
import { GET_PLANT } from "graphqlHelpers/entityQueries";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { getLastPage } from "util/generalUtil";
import {
  EntityContextInit,
  EntitySelectionContext,
  PaginationData,
} from "./EntitySelectionContext";

type EntitySelectionProviderProps = EntityContextInit & {
  boundingPolygon?: PlantDataInput["boundingPolyCoords"];
  activeGardenId?: string;
  children: ReactNode;
} & Omit<PaginationData, "lastPage">;

const EntitySelectionProvider = ({
  entityType,
  entityList: originalEntityList,
  entityListLoading,
  entityActions,
  boundingPolygon,

  page,
  pageSize,
  totalItems,

  children,
}: EntitySelectionProviderProps) => {
  const [entityList, setEntityList] = useState(originalEntityList);
  const [activeEntityId, setActiveEntityId] = useState<string | null>(null);
  const [activeMediaUrl, setActiveMediaUrl] = useState<string | null>(null);

  useEffect(() => {
    setEntityList(originalEntityList);
  }, [originalEntityList]);

  const { activeEntity, activeEntityMedia } = useMemo(() => {
    const activeEntity = entityList.find(({ _id }) => _id === activeEntityId);
    return {
      activeEntity,
      activeEntityMedia: activeEntity
        ? activeEntity.occurrences.flatMap(({ media, ...rest }) =>
            media.map((mediaObject) => ({ ...rest, ...mediaObject })),
          )
        : [],
    };
  }, [entityList, activeEntityId]);

  const [getPlantQuery] = useLazyQuery(GET_PLANT, { fetchPolicy: "no-cache" });

  const syncEntity = async (entityId: string) => {
    const { data } = await getPlantQuery({
      variables: {
        id: entityId,
        boundingPolyCoords: boundingPolygon,
      },
    });

    if (data?.plant) {
      setEntityList((prev) =>
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
    <EntitySelectionContext.Provider
      value={{
        entityType,
        entityList,
        entityListLoading,
        entityActions,

        page,
        lastPage,
        pageSize,
        totalItems,

        activeEntityId,
        activeEntity,
        activeEntityMedia,
        activeMediaUrl,

        setActiveEntityId,
        setActiveMediaUrl,

        syncEntity,
      }}
    >
      {children}
    </EntitySelectionContext.Provider>
  );
};

export default EntitySelectionProvider;
