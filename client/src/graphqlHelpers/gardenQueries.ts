import { graphql } from "generated/graphql";

const _GARDEN_PLANT_FIELDS = graphql(`
  fragment GardenPlantFields on GardenPlantData {
    _id
    addedTimestamp
    customThumbnailUrl
    ...PlantFields
    notes
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
  ) {
    userGardenPlants(
      gardenId: $gardenId
      limit: $limit
      offset: $offset
      sort: $sort
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
    newGarden(gardenName: $gardenName)
  }
`);

export const ADD_PLANT_TO_GARDEN = graphql(`
  mutation addPlant($plantId: String!, $gardenId: String) {
    addToGarden(plantId: $plantId, gardenId: $gardenId) {
      ...GardenFields
    }
  }
`);
