import { graphql } from "generated/graphql";
import {
  GetAllGardensQuery,
  GetGardenPlantsQuery,
  GetGardenQuery,
} from "generated/graphql/graphql";

const _GARDEN_PLANT_FIELDS = graphql(`
  fragment GardenPlantFields on GardenPlantData {
    _id
    notes
    ...PlantFields
  }
`);

const _GARDEN_FIELDS = graphql(`
  fragment GardenFields on UserGarden {
    gardenName
    gardenThumbnailUrl
    plantCount
  }
`);

export const GET_ALL_GARDENS = graphql(`
  query getAllGardens {
    allUserGardens {
      _id
      gardenName
      plantCount
      gardenThumbnailUrl
    }
  }
`);

export const GET_GARDEN = graphql(`
  query getGarden($gardenId: String, $gardenName: String) {
    userGarden(gardenId: $gardenId, gardenName: $gardenName) {
      _id
      gardenName
      plantCount
      gardenThumbnailUrl
      plantRefs {
        _id
      }
    }
  }
`);

export const GET_GARDEN_PLANTS = graphql(`
  query getGardenPlants(
    $gardenId: String!
    $limit: Int
    $offset: Int
    $sort: [PlantSortInput!]
    $where: PlantDataInput
  ) {
    userGardenPlants(
      gardenId: $gardenId
      limit: $limit
      offset: $offset
      sort: $sort
      where: $where
    ) {
      count
      results {
        _id
        ...GardenPlantFields
      }
    }
  }
`);

export const CREATE_GARDEN = graphql(`
  mutation createGarden($gardenName: String) {
    createGarden(gardenName: $gardenName) {
      gardenName
    }
  }
`);

export const DELETE_GARDEN = graphql(`
  mutation deleteGarden($gardenId: String!) {
    deleteGarden(gardenId: $gardenId)
  }
`);

export const ADD_PLANT_TO_GARDEN = graphql(`
  mutation addPlant($plantId: String!, $gardenId: String) {
    addToGarden(plantId: $plantId, gardenId: $gardenId) {
      ...GardenFields
    }
  }
`);

export const UPDATE_GARDEN_PLANT = graphql(`
  mutation updateGardenPlant(
    $gardenId: String!
    $plantId: String!
    $customThumbnailUrl: String
    $notes: String
  ) {
    updateGardenPlant(
      gardenId: $gardenId
      plantId: $plantId
      customThumbnailUrl: $customThumbnailUrl
      notes: $notes
    ) {
      _id
    }
  }
`);

export const REMOVE_PLANT_FROM_GARDEN = graphql(`
  mutation removePlant($gardenId: String!, $plantId: String!) {
    removeFromGarden(gardenId: $gardenId, plantId: $plantId) {
      ...GardenFields
    }
  }
`);

export type UserGarden = Omit<
  GetAllGardensQuery["allUserGardens"][number] & GetGardenQuery["userGarden"],
  "_id" | "plantRefs"
> & { _id: string; plantRefs?: GetGardenQuery["userGarden"] };

export type GardenPlantResult = Omit<
  NonNullable<GetGardenPlantsQuery["userGardenPlants"]>["results"][number],
  "_id"
> & { _id: string };
