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
    "\n    fragment PlantFields on PlantData {\n      _id\n      scientificName\n      commonNames\n      bloomColors\n      bloomTimes\n      physicalCharactersticsDump\n\n      fullOccurrencesCount\n      occurrences {\n        occurrenceId\n        occurrenceCoords\n        media {\n          url\n          isProxyUrl\n        }\n      }\n    }\n  ": typeof types.PlantFieldsFragmentDoc,
    "\n  query getPlant($id: String!, $boundingPolyCoords: [[[Float!]!]!]) {\n    plant(id: $id, boundingPolyCoords: $boundingPolyCoords) {\n      ...PlantFields\n    }\n  }\n": typeof types.GetPlantDocument,
    "\n  query searchPlants(\n    $limit: Int\n    $offset: Int\n    $sort: [SortInput!]\n    $where: PlantDataInput\n  ) {\n    plantSearch(limit: $limit, offset: $offset, sort: $sort, where: $where) {\n      count\n      results {\n        ...PlantFields\n      }\n    }\n  }\n": typeof types.SearchPlantsDocument,
    "\n  mutation replaceWithProxyUrl(\n    $plantId: String!\n    $occurrenceId: Float!\n    $replaceUrl: String!\n  ) {\n    replaceWithProxyUrl(\n      plantId: $plantId\n      occurrenceId: $occurrenceId\n      replaceUrl: $replaceUrl\n    )\n  }\n": typeof types.ReplaceWithProxyUrlDocument,
};
const documents: Documents = {
    "\n    fragment PlantFields on PlantData {\n      _id\n      scientificName\n      commonNames\n      bloomColors\n      bloomTimes\n      physicalCharactersticsDump\n\n      fullOccurrencesCount\n      occurrences {\n        occurrenceId\n        occurrenceCoords\n        media {\n          url\n          isProxyUrl\n        }\n      }\n    }\n  ": types.PlantFieldsFragmentDoc,
    "\n  query getPlant($id: String!, $boundingPolyCoords: [[[Float!]!]!]) {\n    plant(id: $id, boundingPolyCoords: $boundingPolyCoords) {\n      ...PlantFields\n    }\n  }\n": types.GetPlantDocument,
    "\n  query searchPlants(\n    $limit: Int\n    $offset: Int\n    $sort: [SortInput!]\n    $where: PlantDataInput\n  ) {\n    plantSearch(limit: $limit, offset: $offset, sort: $sort, where: $where) {\n      count\n      results {\n        ...PlantFields\n      }\n    }\n  }\n": types.SearchPlantsDocument,
    "\n  mutation replaceWithProxyUrl(\n    $plantId: String!\n    $occurrenceId: Float!\n    $replaceUrl: String!\n  ) {\n    replaceWithProxyUrl(\n      plantId: $plantId\n      occurrenceId: $occurrenceId\n      replaceUrl: $replaceUrl\n    )\n  }\n": types.ReplaceWithProxyUrlDocument,
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
export function graphql(source: "\n    fragment PlantFields on PlantData {\n      _id\n      scientificName\n      commonNames\n      bloomColors\n      bloomTimes\n      physicalCharactersticsDump\n\n      fullOccurrencesCount\n      occurrences {\n        occurrenceId\n        occurrenceCoords\n        media {\n          url\n          isProxyUrl\n        }\n      }\n    }\n  "): (typeof documents)["\n    fragment PlantFields on PlantData {\n      _id\n      scientificName\n      commonNames\n      bloomColors\n      bloomTimes\n      physicalCharactersticsDump\n\n      fullOccurrencesCount\n      occurrences {\n        occurrenceId\n        occurrenceCoords\n        media {\n          url\n          isProxyUrl\n        }\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getPlant($id: String!, $boundingPolyCoords: [[[Float!]!]!]) {\n    plant(id: $id, boundingPolyCoords: $boundingPolyCoords) {\n      ...PlantFields\n    }\n  }\n"): (typeof documents)["\n  query getPlant($id: String!, $boundingPolyCoords: [[[Float!]!]!]) {\n    plant(id: $id, boundingPolyCoords: $boundingPolyCoords) {\n      ...PlantFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query searchPlants(\n    $limit: Int\n    $offset: Int\n    $sort: [SortInput!]\n    $where: PlantDataInput\n  ) {\n    plantSearch(limit: $limit, offset: $offset, sort: $sort, where: $where) {\n      count\n      results {\n        ...PlantFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query searchPlants(\n    $limit: Int\n    $offset: Int\n    $sort: [SortInput!]\n    $where: PlantDataInput\n  ) {\n    plantSearch(limit: $limit, offset: $offset, sort: $sort, where: $where) {\n      count\n      results {\n        ...PlantFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation replaceWithProxyUrl(\n    $plantId: String!\n    $occurrenceId: Float!\n    $replaceUrl: String!\n  ) {\n    replaceWithProxyUrl(\n      plantId: $plantId\n      occurrenceId: $occurrenceId\n      replaceUrl: $replaceUrl\n    )\n  }\n"): (typeof documents)["\n  mutation replaceWithProxyUrl(\n    $plantId: String!\n    $occurrenceId: Float!\n    $replaceUrl: String!\n  ) {\n    replaceWithProxyUrl(\n      plantId: $plantId\n      occurrenceId: $occurrenceId\n      replaceUrl: $replaceUrl\n    )\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;