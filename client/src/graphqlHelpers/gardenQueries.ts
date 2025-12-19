import { graphql } from "generated/graphql";

const _GARDEN_PLANT_FIELDS = graphql(
  `
    fragment GardenPlantFields on GardenPlantData {
      addedTimestamp
      customThumbnailUrl
      ...PlantFields
    }
  `
);

export const GET_ALL_GARDENS = graphql(`
  query getAllGardens {
    allUserGardens {
      gardenName
      plants {
        ...GardenPlantFields
      }
    }
  }
`);

export const GET_GARDEN = graphql(`
  query getGarden($gardenName: String!) {
    userGarden(gardenName: $gardenName) {
      gardenName
      plants {
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
  mutation addPlant($plantId: String!, $gardenName: String) {
    addToGarden(plantId: $plantId, gardenName: $gardenName)
  }
`);
