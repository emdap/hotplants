/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ObjectId: { input: any; output: any; }
};

export type GardenPlantData = PlantDataInterface & {
  _id: Scalars['ObjectId']['output'];
  addedTimestamp: Scalars['Float']['output'];
  addedToGardenTimestamp: Scalars['Float']['output'];
  bloomColors?: Maybe<Array<Scalars['String']['output']>>;
  bloomTimes?: Maybe<Array<Scalars['String']['output']>>;
  commonNames?: Maybe<Array<Scalars['String']['output']>>;
  customThumbnailUrl?: Maybe<Scalars['String']['output']>;
  fullOccurrencesCount?: Maybe<Scalars['Int']['output']>;
  habitat?: Maybe<Scalars['String']['output']>;
  hardiness?: Maybe<Array<Scalars['Int']['output']>>;
  height?: Maybe<PlantSize>;
  isPerennial?: Maybe<Scalars['Boolean']['output']>;
  lightLevels?: Maybe<Array<Scalars['String']['output']>>;
  maturityTime?: Maybe<Scalars['String']['output']>;
  occurrences: Array<PlantOccurrence>;
  physicalCharactersticsDump?: Maybe<Scalars['String']['output']>;
  scientificName: Scalars['String']['output'];
  scrapeSources: Array<Scalars['String']['output']>;
  soilTypes?: Maybe<Array<Scalars['String']['output']>>;
  spread?: Maybe<PlantSize>;
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  updatedTimestamp: Scalars['Float']['output'];
  uses?: Maybe<Array<Scalars['String']['output']>>;
};

export type Mutation = {
  addToGarden: Scalars['ObjectId']['output'];
  newGarden: Scalars['ObjectId']['output'];
  replaceWithProxyUrl?: Maybe<Scalars['String']['output']>;
};


export type MutationAddToGardenArgs = {
  gardenName?: InputMaybe<Scalars['String']['input']>;
  plantId: Scalars['String']['input'];
};


export type MutationNewGardenArgs = {
  gardenName?: InputMaybe<Scalars['String']['input']>;
};


export type MutationReplaceWithProxyUrlArgs = {
  occurrenceId: Scalars['Float']['input'];
  plantId: Scalars['String']['input'];
  replaceUrl: Scalars['String']['input'];
};

export type PlantData = PlantDataInterface & {
  _id: Scalars['ObjectId']['output'];
  addedTimestamp: Scalars['Float']['output'];
  bloomColors?: Maybe<Array<Scalars['String']['output']>>;
  bloomTimes?: Maybe<Array<Scalars['String']['output']>>;
  commonNames?: Maybe<Array<Scalars['String']['output']>>;
  fullOccurrencesCount?: Maybe<Scalars['Int']['output']>;
  habitat?: Maybe<Scalars['String']['output']>;
  hardiness?: Maybe<Array<Scalars['Int']['output']>>;
  height?: Maybe<PlantSize>;
  isPerennial?: Maybe<Scalars['Boolean']['output']>;
  lightLevels?: Maybe<Array<Scalars['String']['output']>>;
  maturityTime?: Maybe<Scalars['String']['output']>;
  occurrences: Array<PlantOccurrence>;
  physicalCharactersticsDump?: Maybe<Scalars['String']['output']>;
  scientificName: Scalars['String']['output'];
  scrapeSources: Array<Scalars['String']['output']>;
  soilTypes?: Maybe<Array<Scalars['String']['output']>>;
  spread?: Maybe<PlantSize>;
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  updatedTimestamp: Scalars['Float']['output'];
  uses?: Maybe<Array<Scalars['String']['output']>>;
};

export type PlantDataInput = {
  _id?: InputMaybe<Scalars['ObjectId']['input']>;
  addedTimestamp?: InputMaybe<Scalars['Float']['input']>;
  bloomColors?: InputMaybe<Array<Scalars['String']['input']>>;
  bloomTimes?: InputMaybe<Array<Scalars['String']['input']>>;
  boundingPolyCoords?: InputMaybe<Array<Array<Array<Scalars['Float']['input']>>>>;
  commonName?: InputMaybe<Scalars['String']['input']>;
  habitat?: InputMaybe<Scalars['String']['input']>;
  hardiness?: InputMaybe<Array<Scalars['Int']['input']>>;
  height?: InputMaybe<PlantSizeInput>;
  isPerennial?: InputMaybe<Scalars['Boolean']['input']>;
  lightLevels?: InputMaybe<Array<Scalars['String']['input']>>;
  maturityTime?: InputMaybe<Scalars['String']['input']>;
  physicalCharactersticsDump?: InputMaybe<Scalars['String']['input']>;
  scientificName?: InputMaybe<Scalars['String']['input']>;
  scrapeSources?: InputMaybe<Array<Scalars['String']['input']>>;
  soilTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  spread?: InputMaybe<PlantSizeInput>;
  updatedTimestamp?: InputMaybe<Scalars['Float']['input']>;
  uses?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type PlantDataInterface = {
  _id: Scalars['ObjectId']['output'];
  addedTimestamp: Scalars['Float']['output'];
  bloomColors?: Maybe<Array<Scalars['String']['output']>>;
  bloomTimes?: Maybe<Array<Scalars['String']['output']>>;
  commonNames?: Maybe<Array<Scalars['String']['output']>>;
  fullOccurrencesCount?: Maybe<Scalars['Int']['output']>;
  habitat?: Maybe<Scalars['String']['output']>;
  hardiness?: Maybe<Array<Scalars['Int']['output']>>;
  height?: Maybe<PlantSize>;
  isPerennial?: Maybe<Scalars['Boolean']['output']>;
  lightLevels?: Maybe<Array<Scalars['String']['output']>>;
  maturityTime?: Maybe<Scalars['String']['output']>;
  occurrences: Array<PlantOccurrence>;
  physicalCharactersticsDump?: Maybe<Scalars['String']['output']>;
  scientificName: Scalars['String']['output'];
  scrapeSources: Array<Scalars['String']['output']>;
  soilTypes?: Maybe<Array<Scalars['String']['output']>>;
  spread?: Maybe<PlantSize>;
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  updatedTimestamp: Scalars['Float']['output'];
  uses?: Maybe<Array<Scalars['String']['output']>>;
};

export type PlantMedia = {
  isProxyUrl?: Maybe<Scalars['Boolean']['output']>;
  url: Scalars['String']['output'];
};

export type PlantOccurrence = {
  media: Array<PlantMedia>;
  occurrenceCoords: Array<Scalars['Float']['output']>;
  occurrenceId: Scalars['Float']['output'];
};

export type PlantOccurrencesResults = {
  count: Scalars['Float']['output'];
  results: Array<PlantOccurrence>;
};

export type PlantSearchResults = {
  count: Scalars['Float']['output'];
  results: Array<PlantData>;
};

export type PlantSize = {
  amount?: Maybe<Scalars['Int']['output']>;
  unit?: Maybe<PlantSizeUnit>;
};

export type PlantSizeInput = {
  amount?: InputMaybe<Scalars['Int']['input']>;
  unit?: InputMaybe<PlantSizeUnit>;
};

export type PlantSizeUnit =
  | 'cm'
  | 'ft'
  | 'in'
  | 'm';

export type Query = {
  allUserGardens: Array<UserGarden>;
  plant?: Maybe<PlantData>;
  plantOccurrences?: Maybe<PlantOccurrencesResults>;
  plantSearch: PlantSearchResults;
  searchRecord?: Maybe<SearchRecord>;
  userGarden?: Maybe<UserGarden>;
};


export type QueryPlantArgs = {
  boundingPolyCoords?: InputMaybe<Array<Array<Array<Scalars['Float']['input']>>>>;
  id: Scalars['String']['input'];
};


export type QueryPlantOccurrencesArgs = {
  id: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPlantSearchArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput>>;
  where?: InputMaybe<PlantDataInput>;
};


export type QuerySearchRecordArgs = {
  id: Scalars['String']['input'];
};


export type QueryUserGardenArgs = {
  gardenName: Scalars['String']['input'];
};

export type SearchRecord = {
  _id: Scalars['ObjectId']['output'];
  jsonStringSearch: Scalars['String']['output'];
  occurrencesOffset: Scalars['Int']['output'];
  status: SearchRecordStatus;
  statusUpdated: Scalars['Float']['output'];
};

export type SearchRecordStatus =
  | 'COMPLETE'
  | 'READY'
  | 'SCRAPING';

export type SortField =
  | 'addedTimestamp'
  | 'scientificName'
  | 'updatedTimestamp';

export type SortInput = {
  direction: Scalars['Int']['input'];
  field: SortField;
};

export type UserGarden = {
  gardenName: Scalars['String']['output'];
  plants: Array<GardenPlantData>;
  userId: Scalars['String']['output'];
};

export type GardenPlantFieldsFragment = { addedTimestamp: number, customThumbnailUrl?: string | null, _id: any, scientificName: string, commonNames?: Array<string> | null, bloomColors?: Array<string> | null, bloomTimes?: Array<string> | null, isPerennial?: boolean | null, thumbnailUrl?: string | null, physicalCharactersticsDump?: string | null, scrapeSources: Array<string>, fullOccurrencesCount?: number | null, occurrences: Array<{ occurrenceId: number, occurrenceCoords: Array<number>, media: Array<{ url: string, isProxyUrl?: boolean | null }> }> };

export type GetAllGardensQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllGardensQuery = { allUserGardens: Array<{ gardenName: string, plants: Array<{ addedTimestamp: number, customThumbnailUrl?: string | null, _id: any, scientificName: string, commonNames?: Array<string> | null, bloomColors?: Array<string> | null, bloomTimes?: Array<string> | null, isPerennial?: boolean | null, thumbnailUrl?: string | null, physicalCharactersticsDump?: string | null, scrapeSources: Array<string>, fullOccurrencesCount?: number | null, occurrences: Array<{ occurrenceId: number, occurrenceCoords: Array<number>, media: Array<{ url: string, isProxyUrl?: boolean | null }> }> }> }> };

export type GetGardenQueryVariables = Exact<{
  gardenName: Scalars['String']['input'];
}>;


export type GetGardenQuery = { userGarden?: { gardenName: string, plants: Array<{ addedTimestamp: number, customThumbnailUrl?: string | null, _id: any, scientificName: string, commonNames?: Array<string> | null, bloomColors?: Array<string> | null, bloomTimes?: Array<string> | null, isPerennial?: boolean | null, thumbnailUrl?: string | null, physicalCharactersticsDump?: string | null, scrapeSources: Array<string>, fullOccurrencesCount?: number | null, occurrences: Array<{ occurrenceId: number, occurrenceCoords: Array<number>, media: Array<{ url: string, isProxyUrl?: boolean | null }> }> }> } | null };

export type CreateGardenMutationVariables = Exact<{
  gardenName?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateGardenMutation = { newGarden: any };

export type AddPlantMutationVariables = Exact<{
  plantId: Scalars['String']['input'];
  gardenName?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddPlantMutation = { addToGarden: any };

type PlantFields_GardenPlantData_Fragment = { _id: any, scientificName: string, commonNames?: Array<string> | null, bloomColors?: Array<string> | null, bloomTimes?: Array<string> | null, isPerennial?: boolean | null, thumbnailUrl?: string | null, physicalCharactersticsDump?: string | null, scrapeSources: Array<string>, fullOccurrencesCount?: number | null, occurrences: Array<{ occurrenceId: number, occurrenceCoords: Array<number>, media: Array<{ url: string, isProxyUrl?: boolean | null }> }> };

type PlantFields_PlantData_Fragment = { _id: any, scientificName: string, commonNames?: Array<string> | null, bloomColors?: Array<string> | null, bloomTimes?: Array<string> | null, isPerennial?: boolean | null, thumbnailUrl?: string | null, physicalCharactersticsDump?: string | null, scrapeSources: Array<string>, fullOccurrencesCount?: number | null, occurrences: Array<{ occurrenceId: number, occurrenceCoords: Array<number>, media: Array<{ url: string, isProxyUrl?: boolean | null }> }> };

export type PlantFieldsFragment = PlantFields_GardenPlantData_Fragment | PlantFields_PlantData_Fragment;

export type GetPlantQueryVariables = Exact<{
  id: Scalars['String']['input'];
  boundingPolyCoords?: InputMaybe<Array<Array<Array<Scalars['Float']['input']> | Scalars['Float']['input']> | Array<Scalars['Float']['input']> | Scalars['Float']['input']> | Array<Array<Scalars['Float']['input']> | Scalars['Float']['input']> | Array<Scalars['Float']['input']> | Scalars['Float']['input']>;
}>;


export type GetPlantQuery = { plant?: { _id: any, scientificName: string, commonNames?: Array<string> | null, bloomColors?: Array<string> | null, bloomTimes?: Array<string> | null, isPerennial?: boolean | null, thumbnailUrl?: string | null, physicalCharactersticsDump?: string | null, scrapeSources: Array<string>, fullOccurrencesCount?: number | null, occurrences: Array<{ occurrenceId: number, occurrenceCoords: Array<number>, media: Array<{ url: string, isProxyUrl?: boolean | null }> }> } | null };

export type SearchPlantsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SortInput> | SortInput>;
  where?: InputMaybe<PlantDataInput>;
}>;


export type SearchPlantsQuery = { plantSearch: { count: number, results: Array<{ _id: any, scientificName: string, commonNames?: Array<string> | null, bloomColors?: Array<string> | null, bloomTimes?: Array<string> | null, isPerennial?: boolean | null, thumbnailUrl?: string | null, physicalCharactersticsDump?: string | null, scrapeSources: Array<string>, fullOccurrencesCount?: number | null, occurrences: Array<{ occurrenceId: number, occurrenceCoords: Array<number>, media: Array<{ url: string, isProxyUrl?: boolean | null }> }> }> } };

export type ReplaceWithProxyUrlMutationVariables = Exact<{
  plantId: Scalars['String']['input'];
  occurrenceId: Scalars['Float']['input'];
  replaceUrl: Scalars['String']['input'];
}>;


export type ReplaceWithProxyUrlMutation = { replaceWithProxyUrl?: string | null };

export const PlantFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlantDataInterface"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"commonNames"}},{"kind":"Field","name":{"kind":"Name","value":"bloomColors"}},{"kind":"Field","name":{"kind":"Name","value":"bloomTimes"}},{"kind":"Field","name":{"kind":"Name","value":"isPerennial"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"physicalCharactersticsDump"}},{"kind":"Field","name":{"kind":"Name","value":"scrapeSources"}},{"kind":"Field","name":{"kind":"Name","value":"fullOccurrencesCount"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceId"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCoords"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isProxyUrl"}}]}}]}}]}}]} as unknown as DocumentNode<PlantFieldsFragment, unknown>;
export const GardenPlantFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GardenPlantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GardenPlantData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addedTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"customThumbnailUrl"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlantFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlantDataInterface"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"commonNames"}},{"kind":"Field","name":{"kind":"Name","value":"bloomColors"}},{"kind":"Field","name":{"kind":"Name","value":"bloomTimes"}},{"kind":"Field","name":{"kind":"Name","value":"isPerennial"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"physicalCharactersticsDump"}},{"kind":"Field","name":{"kind":"Name","value":"scrapeSources"}},{"kind":"Field","name":{"kind":"Name","value":"fullOccurrencesCount"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceId"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCoords"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isProxyUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GardenPlantFieldsFragment, unknown>;
export const GetAllGardensDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllGardens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allUserGardens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gardenName"}},{"kind":"Field","name":{"kind":"Name","value":"plants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GardenPlantFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlantDataInterface"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"commonNames"}},{"kind":"Field","name":{"kind":"Name","value":"bloomColors"}},{"kind":"Field","name":{"kind":"Name","value":"bloomTimes"}},{"kind":"Field","name":{"kind":"Name","value":"isPerennial"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"physicalCharactersticsDump"}},{"kind":"Field","name":{"kind":"Name","value":"scrapeSources"}},{"kind":"Field","name":{"kind":"Name","value":"fullOccurrencesCount"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceId"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCoords"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isProxyUrl"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GardenPlantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GardenPlantData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addedTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"customThumbnailUrl"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlantFields"}}]}}]} as unknown as DocumentNode<GetAllGardensQuery, GetAllGardensQueryVariables>;
export const GetGardenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getGarden"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gardenName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userGarden"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gardenName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gardenName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gardenName"}},{"kind":"Field","name":{"kind":"Name","value":"plants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GardenPlantFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlantDataInterface"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"commonNames"}},{"kind":"Field","name":{"kind":"Name","value":"bloomColors"}},{"kind":"Field","name":{"kind":"Name","value":"bloomTimes"}},{"kind":"Field","name":{"kind":"Name","value":"isPerennial"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"physicalCharactersticsDump"}},{"kind":"Field","name":{"kind":"Name","value":"scrapeSources"}},{"kind":"Field","name":{"kind":"Name","value":"fullOccurrencesCount"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceId"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCoords"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isProxyUrl"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GardenPlantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GardenPlantData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addedTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"customThumbnailUrl"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlantFields"}}]}}]} as unknown as DocumentNode<GetGardenQuery, GetGardenQueryVariables>;
export const CreateGardenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createGarden"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gardenName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newGarden"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gardenName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gardenName"}}}]}]}}]} as unknown as DocumentNode<CreateGardenMutation, CreateGardenMutationVariables>;
export const AddPlantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addPlant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"plantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gardenName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addToGarden"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"plantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"plantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"gardenName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gardenName"}}}]}]}}]} as unknown as DocumentNode<AddPlantMutation, AddPlantMutationVariables>;
export const GetPlantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPlant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boundingPolyCoords"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"boundingPolyCoords"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boundingPolyCoords"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlantFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlantDataInterface"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"commonNames"}},{"kind":"Field","name":{"kind":"Name","value":"bloomColors"}},{"kind":"Field","name":{"kind":"Name","value":"bloomTimes"}},{"kind":"Field","name":{"kind":"Name","value":"isPerennial"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"physicalCharactersticsDump"}},{"kind":"Field","name":{"kind":"Name","value":"scrapeSources"}},{"kind":"Field","name":{"kind":"Name","value":"fullOccurrencesCount"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceId"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCoords"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isProxyUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetPlantQuery, GetPlantQueryVariables>;
export const SearchPlantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchPlants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PlantDataInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plantSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlantFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlantDataInterface"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"commonNames"}},{"kind":"Field","name":{"kind":"Name","value":"bloomColors"}},{"kind":"Field","name":{"kind":"Name","value":"bloomTimes"}},{"kind":"Field","name":{"kind":"Name","value":"isPerennial"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"physicalCharactersticsDump"}},{"kind":"Field","name":{"kind":"Name","value":"scrapeSources"}},{"kind":"Field","name":{"kind":"Name","value":"fullOccurrencesCount"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceId"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCoords"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isProxyUrl"}}]}}]}}]}}]} as unknown as DocumentNode<SearchPlantsQuery, SearchPlantsQueryVariables>;
export const ReplaceWithProxyUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"replaceWithProxyUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"plantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"occurrenceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"replaceUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"replaceWithProxyUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"plantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"plantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"occurrenceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"occurrenceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"replaceUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"replaceUrl"}}}]}]}}]} as unknown as DocumentNode<ReplaceWithProxyUrlMutation, ReplaceWithProxyUrlMutationVariables>;