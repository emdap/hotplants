/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment GardenPlantFields on GardenPlantData {\n    # _id\n    addedTimestamp\n    customThumbnailUrl\n    ...PlantFields\n    notes\n  }\n": typeof types.GardenPlantFieldsFragmentDoc,
    "\n  fragment GardenFields on UserGarden {\n    gardenName\n    gardenThumbnailUrl\n    plantCount\n  }\n": typeof types.GardenFieldsFragmentDoc,
    "\n  query getAllGardens {\n    allUserGardens {\n      gardenName\n      plantCount\n      gardenThumbnailUrl\n    }\n  }\n": typeof types.GetAllGardensDocument,
    "\n  query getGarden($gardenId: String, $gardenName: String) {\n    userGarden(gardenId: $gardenId, gardenName: $gardenName) {\n      _id\n      gardenName\n      plantCount\n      plantRefs {\n        _id\n      }\n    }\n  }\n": typeof types.GetGardenDocument,
    "\n  query getGardenPlants(\n    $gardenId: String!\n    $limit: Int\n    $offset: Int\n    $sort: [PlantSortInput!]\n  ) {\n    userGardenPlants(\n      gardenId: $gardenId\n      limit: $limit\n      offset: $offset\n      sort: $sort\n    ) {\n      count\n      results {\n        ...GardenPlantFields\n      }\n    }\n  }\n": typeof types.GetGardenPlantsDocument,
    "\n  mutation createGarden($gardenName: String) {\n    newGarden(gardenName: $gardenName)\n  }\n": typeof types.CreateGardenDocument,
    "\n  mutation addPlant($plantId: String!, $gardenId: String) {\n    addToGarden(plantId: $plantId, gardenId: $gardenId) {\n      ...GardenFields\n    }\n  }\n": typeof types.AddPlantDocument,
    "\n  fragment PlantFields on PlantDataInterface {\n    scientificName\n    commonNames\n    bloomColors\n    bloomTimes\n    isPerennial\n    thumbnailUrl\n    physicalCharactersticsDump\n    scrapeSources\n\n    fullOccurrencesCount\n    occurrences {\n      occurrenceId\n      occurrenceCoords\n      media {\n        url\n        isProxyUrl\n      }\n    }\n  }\n": typeof types.PlantFieldsFragmentDoc,
    "\n  query getPlant($id: String!, $boundingPolyCoords: [[[Float!]!]!]) {\n    plant(id: $id, boundingPolyCoords: $boundingPolyCoords) {\n      _id\n      ...PlantFields\n    }\n  }\n": typeof types.GetPlantDocument,
    "\n  query searchPlants(\n    $limit: Int\n    $offset: Int\n    $sort: [PlantSortInput!]\n    $where: PlantDataInput\n  ) {\n    plantSearch(limit: $limit, offset: $offset, sort: $sort, where: $where) {\n      count\n      results {\n        _id\n        ...PlantFields\n      }\n    }\n  }\n": typeof types.SearchPlantsDocument,
    "\n  mutation replaceWithProxyUrl(\n    $plantId: String!\n    $occurrenceId: Float!\n    $replaceUrl: String!\n  ) {\n    replaceWithProxyUrl(\n      plantId: $plantId\n      occurrenceId: $occurrenceId\n      replaceUrl: $replaceUrl\n    )\n  }\n": typeof types.ReplaceWithProxyUrlDocument,
    "\n  query getAllSearchRecords(\n    $sort: [SearchRecordSortInput!]\n    $limit: Int\n    $offset: Int\n    $booleanFilter: [SearchRecordBooleanFilterInput!]\n    $stringFilter: [SearchRecordStringFilterInput!]\n  ) {\n    allSearchRecords(\n      sort: $sort\n      limit: $limit\n      offset: $offset\n      booleanFilter: $booleanFilter\n      stringFilter: $stringFilter\n    ) {\n      count\n      results {\n        _id\n        createdTimestamp\n        status\n        lastRanTimestamp\n\n        locationName\n        locationSource\n        boundingPolyCoords\n        scientificName\n        commonName\n\n        totalOccurrences\n        occurrencesOffset\n      }\n    }\n  }\n": typeof types.GetAllSearchRecordsDocument,
    "\n  query getSearchRecordDataCounts($id: String!) {\n    searchRecordDataCounts(id: $id) {\n      plantCount\n      occurrenceCount\n    }\n  }\n": typeof types.GetSearchRecordDataCountsDocument,
};
const documents: Documents = {
    "\n  fragment GardenPlantFields on GardenPlantData {\n    # _id\n    addedTimestamp\n    customThumbnailUrl\n    ...PlantFields\n    notes\n  }\n": types.GardenPlantFieldsFragmentDoc,
    "\n  fragment GardenFields on UserGarden {\n    gardenName\n    gardenThumbnailUrl\n    plantCount\n  }\n": types.GardenFieldsFragmentDoc,
    "\n  query getAllGardens {\n    allUserGardens {\n      gardenName\n      plantCount\n      gardenThumbnailUrl\n    }\n  }\n": types.GetAllGardensDocument,
    "\n  query getGarden($gardenId: String, $gardenName: String) {\n    userGarden(gardenId: $gardenId, gardenName: $gardenName) {\n      _id\n      gardenName\n      plantCount\n      plantRefs {\n        _id\n      }\n    }\n  }\n": types.GetGardenDocument,
    "\n  query getGardenPlants(\n    $gardenId: String!\n    $limit: Int\n    $offset: Int\n    $sort: [PlantSortInput!]\n  ) {\n    userGardenPlants(\n      gardenId: $gardenId\n      limit: $limit\n      offset: $offset\n      sort: $sort\n    ) {\n      count\n      results {\n        ...GardenPlantFields\n      }\n    }\n  }\n": types.GetGardenPlantsDocument,
    "\n  mutation createGarden($gardenName: String) {\n    newGarden(gardenName: $gardenName)\n  }\n": types.CreateGardenDocument,
    "\n  mutation addPlant($plantId: String!, $gardenId: String) {\n    addToGarden(plantId: $plantId, gardenId: $gardenId) {\n      ...GardenFields\n    }\n  }\n": types.AddPlantDocument,
    "\n  fragment PlantFields on PlantDataInterface {\n    scientificName\n    commonNames\n    bloomColors\n    bloomTimes\n    isPerennial\n    thumbnailUrl\n    physicalCharactersticsDump\n    scrapeSources\n\n    fullOccurrencesCount\n    occurrences {\n      occurrenceId\n      occurrenceCoords\n      media {\n        url\n        isProxyUrl\n      }\n    }\n  }\n": types.PlantFieldsFragmentDoc,
    "\n  query getPlant($id: String!, $boundingPolyCoords: [[[Float!]!]!]) {\n    plant(id: $id, boundingPolyCoords: $boundingPolyCoords) {\n      _id\n      ...PlantFields\n    }\n  }\n": types.GetPlantDocument,
    "\n  query searchPlants(\n    $limit: Int\n    $offset: Int\n    $sort: [PlantSortInput!]\n    $where: PlantDataInput\n  ) {\n    plantSearch(limit: $limit, offset: $offset, sort: $sort, where: $where) {\n      count\n      results {\n        _id\n        ...PlantFields\n      }\n    }\n  }\n": types.SearchPlantsDocument,
    "\n  mutation replaceWithProxyUrl(\n    $plantId: String!\n    $occurrenceId: Float!\n    $replaceUrl: String!\n  ) {\n    replaceWithProxyUrl(\n      plantId: $plantId\n      occurrenceId: $occurrenceId\n      replaceUrl: $replaceUrl\n    )\n  }\n": types.ReplaceWithProxyUrlDocument,
    "\n  query getAllSearchRecords(\n    $sort: [SearchRecordSortInput!]\n    $limit: Int\n    $offset: Int\n    $booleanFilter: [SearchRecordBooleanFilterInput!]\n    $stringFilter: [SearchRecordStringFilterInput!]\n  ) {\n    allSearchRecords(\n      sort: $sort\n      limit: $limit\n      offset: $offset\n      booleanFilter: $booleanFilter\n      stringFilter: $stringFilter\n    ) {\n      count\n      results {\n        _id\n        createdTimestamp\n        status\n        lastRanTimestamp\n\n        locationName\n        locationSource\n        boundingPolyCoords\n        scientificName\n        commonName\n\n        totalOccurrences\n        occurrencesOffset\n      }\n    }\n  }\n": types.GetAllSearchRecordsDocument,
    "\n  query getSearchRecordDataCounts($id: String!) {\n    searchRecordDataCounts(id: $id) {\n      plantCount\n      occurrenceCount\n    }\n  }\n": types.GetSearchRecordDataCountsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment GardenPlantFields on GardenPlantData {\n    # _id\n    addedTimestamp\n    customThumbnailUrl\n    ...PlantFields\n    notes\n  }\n"): (typeof documents)["\n  fragment GardenPlantFields on GardenPlantData {\n    # _id\n    addedTimestamp\n    customThumbnailUrl\n    ...PlantFields\n    notes\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment GardenFields on UserGarden {\n    gardenName\n    gardenThumbnailUrl\n    plantCount\n  }\n"): (typeof documents)["\n  fragment GardenFields on UserGarden {\n    gardenName\n    gardenThumbnailUrl\n    plantCount\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllGardens {\n    allUserGardens {\n      gardenName\n      plantCount\n      gardenThumbnailUrl\n    }\n  }\n"): (typeof documents)["\n  query getAllGardens {\n    allUserGardens {\n      gardenName\n      plantCount\n      gardenThumbnailUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getGarden($gardenId: String, $gardenName: String) {\n    userGarden(gardenId: $gardenId, gardenName: $gardenName) {\n      _id\n      gardenName\n      plantCount\n      plantRefs {\n        _id\n      }\n    }\n  }\n"): (typeof documents)["\n  query getGarden($gardenId: String, $gardenName: String) {\n    userGarden(gardenId: $gardenId, gardenName: $gardenName) {\n      _id\n      gardenName\n      plantCount\n      plantRefs {\n        _id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getGardenPlants(\n    $gardenId: String!\n    $limit: Int\n    $offset: Int\n    $sort: [PlantSortInput!]\n  ) {\n    userGardenPlants(\n      gardenId: $gardenId\n      limit: $limit\n      offset: $offset\n      sort: $sort\n    ) {\n      count\n      results {\n        ...GardenPlantFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query getGardenPlants(\n    $gardenId: String!\n    $limit: Int\n    $offset: Int\n    $sort: [PlantSortInput!]\n  ) {\n    userGardenPlants(\n      gardenId: $gardenId\n      limit: $limit\n      offset: $offset\n      sort: $sort\n    ) {\n      count\n      results {\n        ...GardenPlantFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createGarden($gardenName: String) {\n    newGarden(gardenName: $gardenName)\n  }\n"): (typeof documents)["\n  mutation createGarden($gardenName: String) {\n    newGarden(gardenName: $gardenName)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addPlant($plantId: String!, $gardenId: String) {\n    addToGarden(plantId: $plantId, gardenId: $gardenId) {\n      ...GardenFields\n    }\n  }\n"): (typeof documents)["\n  mutation addPlant($plantId: String!, $gardenId: String) {\n    addToGarden(plantId: $plantId, gardenId: $gardenId) {\n      ...GardenFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PlantFields on PlantDataInterface {\n    scientificName\n    commonNames\n    bloomColors\n    bloomTimes\n    isPerennial\n    thumbnailUrl\n    physicalCharactersticsDump\n    scrapeSources\n\n    fullOccurrencesCount\n    occurrences {\n      occurrenceId\n      occurrenceCoords\n      media {\n        url\n        isProxyUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment PlantFields on PlantDataInterface {\n    scientificName\n    commonNames\n    bloomColors\n    bloomTimes\n    isPerennial\n    thumbnailUrl\n    physicalCharactersticsDump\n    scrapeSources\n\n    fullOccurrencesCount\n    occurrences {\n      occurrenceId\n      occurrenceCoords\n      media {\n        url\n        isProxyUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getPlant($id: String!, $boundingPolyCoords: [[[Float!]!]!]) {\n    plant(id: $id, boundingPolyCoords: $boundingPolyCoords) {\n      _id\n      ...PlantFields\n    }\n  }\n"): (typeof documents)["\n  query getPlant($id: String!, $boundingPolyCoords: [[[Float!]!]!]) {\n    plant(id: $id, boundingPolyCoords: $boundingPolyCoords) {\n      _id\n      ...PlantFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query searchPlants(\n    $limit: Int\n    $offset: Int\n    $sort: [PlantSortInput!]\n    $where: PlantDataInput\n  ) {\n    plantSearch(limit: $limit, offset: $offset, sort: $sort, where: $where) {\n      count\n      results {\n        _id\n        ...PlantFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query searchPlants(\n    $limit: Int\n    $offset: Int\n    $sort: [PlantSortInput!]\n    $where: PlantDataInput\n  ) {\n    plantSearch(limit: $limit, offset: $offset, sort: $sort, where: $where) {\n      count\n      results {\n        _id\n        ...PlantFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation replaceWithProxyUrl(\n    $plantId: String!\n    $occurrenceId: Float!\n    $replaceUrl: String!\n  ) {\n    replaceWithProxyUrl(\n      plantId: $plantId\n      occurrenceId: $occurrenceId\n      replaceUrl: $replaceUrl\n    )\n  }\n"): (typeof documents)["\n  mutation replaceWithProxyUrl(\n    $plantId: String!\n    $occurrenceId: Float!\n    $replaceUrl: String!\n  ) {\n    replaceWithProxyUrl(\n      plantId: $plantId\n      occurrenceId: $occurrenceId\n      replaceUrl: $replaceUrl\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllSearchRecords(\n    $sort: [SearchRecordSortInput!]\n    $limit: Int\n    $offset: Int\n    $booleanFilter: [SearchRecordBooleanFilterInput!]\n    $stringFilter: [SearchRecordStringFilterInput!]\n  ) {\n    allSearchRecords(\n      sort: $sort\n      limit: $limit\n      offset: $offset\n      booleanFilter: $booleanFilter\n      stringFilter: $stringFilter\n    ) {\n      count\n      results {\n        _id\n        createdTimestamp\n        status\n        lastRanTimestamp\n\n        locationName\n        locationSource\n        boundingPolyCoords\n        scientificName\n        commonName\n\n        totalOccurrences\n        occurrencesOffset\n      }\n    }\n  }\n"): (typeof documents)["\n  query getAllSearchRecords(\n    $sort: [SearchRecordSortInput!]\n    $limit: Int\n    $offset: Int\n    $booleanFilter: [SearchRecordBooleanFilterInput!]\n    $stringFilter: [SearchRecordStringFilterInput!]\n  ) {\n    allSearchRecords(\n      sort: $sort\n      limit: $limit\n      offset: $offset\n      booleanFilter: $booleanFilter\n      stringFilter: $stringFilter\n    ) {\n      count\n      results {\n        _id\n        createdTimestamp\n        status\n        lastRanTimestamp\n\n        locationName\n        locationSource\n        boundingPolyCoords\n        scientificName\n        commonName\n\n        totalOccurrences\n        occurrencesOffset\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getSearchRecordDataCounts($id: String!) {\n    searchRecordDataCounts(id: $id) {\n      plantCount\n      occurrenceCount\n    }\n  }\n"): (typeof documents)["\n  query getSearchRecordDataCounts($id: String!) {\n    searchRecordDataCounts(id: $id) {\n      plantCount\n      occurrenceCount\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;