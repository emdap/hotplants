import { MenuItemData } from "designSystem/StyledMenu";
import {
  EntityType,
  GardenPlantData,
  PlantData,
  PlantMedia,
  PlantOccurrence,
} from "generated/graphql/graphql";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { VOID_FUNCTION } from "util/generalUtil";

export type EntityResult = Omit<
  GardenPlantData,
  "addedToGardenTimestamp" | "_id"
> &
  Omit<PlantData, "_id"> & { _id: string; addedToGardenTimestamp?: number };

export type FlattenedMedia = (Omit<PlantOccurrence, "media"> & PlantMedia)[];

export type PaginationData = {
  page: number;
  lastPage: number;
  pageSize: number;
  totalItems: number;
};

export type EntityAction<R = unknown> = MenuItemData<
  EntityResult,
  Promise<R> | R
>;

export type EntityContextInit = {
  entityType: EntityType;
  entityList: EntityResult[];
  entityListLoading?: boolean;
  entityActions?: EntityAction[];
};

export type EntitySelectionContextType = EntityContextInit & {
  activeEntityId: string | null;
  activeEntity?: EntityResult;
  activeEntityMedia: FlattenedMedia | [];
  activeMediaUrl: string | null;

  setActiveEntityId: Dispatch<SetStateAction<string | null>>;
  setActiveMediaUrl: Dispatch<SetStateAction<string | null>>;

  syncEntity: (plantId: string) => void;
} & PaginationData;

const DEFAULT_ENTITY_SELECTION_CONTEXT: EntitySelectionContextType = {
  entityType: "plant",
  entityList: [],

  page: 0,
  lastPage: 0,
  pageSize: 0,
  totalItems: 0,

  activeEntityId: null,
  activeEntityMedia: [],
  activeMediaUrl: null,

  setActiveEntityId: VOID_FUNCTION,
  setActiveMediaUrl: VOID_FUNCTION,

  syncEntity: VOID_FUNCTION,
};

export const EntitySelectionContext = createContext<EntitySelectionContextType>(
  DEFAULT_ENTITY_SELECTION_CONTEXT,
);

export const useEntitySelectionContext = () =>
  useContext(EntitySelectionContext);
