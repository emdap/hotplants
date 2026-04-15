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

export type EntityType =
  | 'animal'
  | 'plant';

export type GardenPlantData = PlantDataInterface & {
  _id: Scalars['ObjectId']['output'];
  addedTimestamp: Scalars['Float']['output'];
  addedToGardenTimestamp: Scalars['Float']['output'];
  bloomColors?: Maybe<Array<Scalars['String']['output']>>;
  bloomTimes?: Maybe<Array<Scalars['String']['output']>>;
  commonNames?: Maybe<Array<Scalars['String']['output']>>;
  customThumbnailUrl?: Maybe<Scalars['String']['output']>;
  fullOccurrencesCount?: Maybe<Scalars['Int']['output']>;
  habitats?: Maybe<Array<Scalars['String']['output']>>;
  hardiness?: Maybe<Array<Scalars['Int']['output']>>;
  height?: Maybe<PlantSize>;
  isPerennial?: Maybe<Scalars['Boolean']['output']>;
  lightLevels?: Maybe<Array<Scalars['String']['output']>>;
  maturityTime?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
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

export type GardenPlantRef = {
  _id: Scalars['ObjectId']['output'];
  addedToGardenTimestamp: Scalars['Float']['output'];
  customThumbnailUrl?: Maybe<Scalars['String']['output']>;
};

export type LocationSource =
  | 'custom'
  | 'search';

export type Mutation = {
  addToGarden?: Maybe<UserGarden>;
  createGarden?: Maybe<UserGarden>;
  deleteGarden: Scalars['Boolean']['output'];
  removeFromGarden?: Maybe<UserGarden>;
  replaceWithProxyUrl?: Maybe<Scalars['String']['output']>;
  updateGardenPlant?: Maybe<UserGarden>;
};


export type MutationAddToGardenArgs = {
  gardenId?: InputMaybe<Scalars['String']['input']>;
  plantId: Scalars['String']['input'];
};


export type MutationCreateGardenArgs = {
  gardenName?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteGardenArgs = {
  gardenId: Scalars['String']['input'];
};


export type MutationRemoveFromGardenArgs = {
  gardenId: Scalars['String']['input'];
  plantId: Scalars['String']['input'];
};


export type MutationReplaceWithProxyUrlArgs = {
  occurrenceId: Scalars['Float']['input'];
  plantId: Scalars['String']['input'];
  replaceUrl: Scalars['String']['input'];
};


export type MutationUpdateGardenPlantArgs = {
  customThumbnailUrl?: InputMaybe<Scalars['String']['input']>;
  gardenId: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  plantId: Scalars['String']['input'];
};

export type PlantArrayFilterIntInput = {
  matchAll?: InputMaybe<Scalars['Boolean']['input']>;
  value?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type PlantArrayFilterStringInput = {
  matchAll?: InputMaybe<Scalars['Boolean']['input']>;
  value?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type PlantData = PlantDataInterface & {
  _id: Scalars['ObjectId']['output'];
  addedTimestamp: Scalars['Float']['output'];
  bloomColors?: Maybe<Array<Scalars['String']['output']>>;
  bloomTimes?: Maybe<Array<Scalars['String']['output']>>;
  commonNames?: Maybe<Array<Scalars['String']['output']>>;
  fullOccurrencesCount?: Maybe<Scalars['Int']['output']>;
  habitats?: Maybe<Array<Scalars['String']['output']>>;
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

export type PlantDataExcerpt = {
  _id: Scalars['String']['output'];
  isProxyUrl?: Maybe<Scalars['Boolean']['output']>;
  occurrenceId: Scalars['Float']['output'];
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type PlantDataInput = {
  addedTimestamp?: InputMaybe<Scalars['Float']['input']>;
  bloomColors?: InputMaybe<PlantArrayFilterStringInput>;
  bloomTimes?: InputMaybe<PlantArrayFilterStringInput>;
  boundingPolyCoords?: InputMaybe<Array<Array<Array<Scalars['Float']['input']>>>>;
  commonName?: InputMaybe<Scalars['String']['input']>;
  commonNameIncludes?: InputMaybe<Scalars['String']['input']>;
  habitats?: InputMaybe<PlantArrayFilterStringInput>;
  hardiness?: InputMaybe<PlantArrayFilterIntInput>;
  hasScrapedData?: InputMaybe<Scalars['Boolean']['input']>;
  height?: InputMaybe<PlantSizeRangeInput>;
  isPerennial?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  lightLevels?: InputMaybe<PlantArrayFilterStringInput>;
  maturityTime?: InputMaybe<Scalars['String']['input']>;
  physicalCharactersticsDump?: InputMaybe<Scalars['String']['input']>;
  scientificName?: InputMaybe<Scalars['String']['input']>;
  scientificNameIncludes?: InputMaybe<Scalars['String']['input']>;
  scrapeSources?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  soilTypes?: InputMaybe<PlantArrayFilterStringInput>;
  spread?: InputMaybe<PlantSizeRangeInput>;
  updatedTimestamp?: InputMaybe<Scalars['Float']['input']>;
  uses?: InputMaybe<PlantArrayFilterStringInput>;
};

export type PlantDataInterface = {
  addedTimestamp: Scalars['Float']['output'];
  bloomColors?: Maybe<Array<Scalars['String']['output']>>;
  bloomTimes?: Maybe<Array<Scalars['String']['output']>>;
  commonNames?: Maybe<Array<Scalars['String']['output']>>;
  fullOccurrencesCount?: Maybe<Scalars['Int']['output']>;
  habitats?: Maybe<Array<Scalars['String']['output']>>;
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

export type PlantSearchQueryResults = {
  count: Scalars['Float']['output'];
  results: Array<PlantData>;
};

export type PlantSize = {
  amount: Scalars['Float']['output'];
  unit: PlantSizeUnit;
};

export type PlantSizeRangeInput = {
  maxAmount?: InputMaybe<Scalars['Float']['input']>;
  minAmount?: InputMaybe<Scalars['Float']['input']>;
  unit: PlantSizeUnit;
};

export type PlantSizeUnit =
  | 'centimeters'
  | 'feet'
  | 'inches'
  | 'meters';

export type PlantSortField =
  | 'addedTimestamp'
  | 'scientificName'
  | 'updatedTimestamp';

export type PlantSortInput = {
  field: PlantSortField;
  value: Scalars['Int']['input'];
};

export type Query = {
  allSearchRecords: SearchRecordQueryResults;
  allUserGardens: Array<UserGarden>;
  plant?: Maybe<PlantData>;
  plantOccurrences?: Maybe<PlantOccurrencesResults>;
  plantSearch: PlantSearchQueryResults;
  searchRecord?: Maybe<SearchRecord>;
  searchRecordDataCounts: SearchRecordPlantCountResults;
  userGarden?: Maybe<UserGarden>;
  userGardenPlants?: Maybe<UserGardenPlants>;
};


export type QueryAllSearchRecordsArgs = {
  booleanFilter?: InputMaybe<Array<SearchRecordBooleanFilterInput>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<SearchRecordSortInput>>;
  stringFilter?: InputMaybe<Array<SearchRecordStringFilterInput>>;
};


export type QueryAllUserGardensArgs = {
  gardenId?: InputMaybe<Scalars['String']['input']>;
  gardenName?: InputMaybe<Scalars['String']['input']>;
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
  entityType: EntityType;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PlantSortInput>>;
  where?: InputMaybe<PlantDataInput>;
};


export type QuerySearchRecordArgs = {
  id: Scalars['String']['input'];
};


export type QuerySearchRecordDataCountsArgs = {
  id: Scalars['String']['input'];
};


export type QueryUserGardenArgs = {
  gardenId?: InputMaybe<Scalars['String']['input']>;
  gardenName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserGardenPlantsArgs = {
  gardenId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PlantSortInput>>;
  where?: InputMaybe<PlantDataInput>;
};

export type SearchRecord = {
  _id: Scalars['ObjectId']['output'];
  boundingPolyCoords?: Maybe<Array<Array<Array<Scalars['Float']['output']>>>>;
  commonName?: Maybe<Scalars['String']['output']>;
  createdTimestamp: Scalars['Float']['output'];
  entityType: EntityType;
  lastRanTimestamp?: Maybe<Scalars['Float']['output']>;
  locationName?: Maybe<Scalars['String']['output']>;
  locationSource?: Maybe<LocationSource>;
  occurrencesOffset: Scalars['Int']['output'];
  scientificName?: Maybe<Scalars['String']['output']>;
  status: SearchRecordStatus;
  taxonKeys?: Maybe<Array<Scalars['Int']['output']>>;
  totalOccurrences: Scalars['Int']['output'];
  userIds?: Maybe<Array<Scalars['ObjectId']['output']>>;
};

export type SearchRecordBooleanFilterField =
  | 'commonName'
  | 'scientificName'
  | 'userSearch';

export type SearchRecordBooleanFilterInput = {
  field: SearchRecordBooleanFilterField;
  value: Scalars['Boolean']['input'];
};

export type SearchRecordPlantCountResults = {
  firstPlant?: Maybe<PlantDataExcerpt>;
  occurrenceCount: Scalars['Float']['output'];
  plantCount: Scalars['Float']['output'];
};

export type SearchRecordQueryResults = {
  count: Scalars['Float']['output'];
  results: Array<SearchRecord>;
};

export type SearchRecordSortField =
  | 'createdTimestamp'
  | 'lastRanTimestamp'
  | 'locationName'
  | 'totalOccurrences';

export type SearchRecordSortInput = {
  field: SearchRecordSortField;
  value: Scalars['Int']['input'];
};

export type SearchRecordStatus =
  | 'COMPLETE'
  | 'READY'
  | 'SCRAPING';

export type SearchRecordStringFilterField =
  | 'entityType'
  | 'locationSource'
  | 'status';

export type SearchRecordStringFilterInput = {
  field: SearchRecordStringFilterField;
  value: Array<Scalars['String']['input']>;
};

export type UserGarden = {
  _id: Scalars['ObjectId']['output'];
  gardenName: Scalars['String']['output'];
  gardenThumbnailUrl?: Maybe<Scalars['String']['output']>;
  plantCount: Scalars['Float']['output'];
  plantRefs: Array<GardenPlantRef>;
  userId: Scalars['String']['output'];
};

export type UserGardenPlants = {
  count: Scalars['Float']['output'];
  results: Array<GardenPlantData>;
};

type PlantFields_GardenPlantData_Fragment = { addedTimestamp: number, updatedTimestamp: number, scientificName: string, commonNames?: Array<string> | null, bloomColors?: Array<string> | null, bloomTimes?: Array<string> | null, isPerennial?: boolean | null, thumbnailUrl?: string | null, physicalCharactersticsDump?: string | null, scrapeSources: Array<string>, hardiness?: Array<number> | null, fullOccurrencesCount?: number | null, height?: { amount: number, unit: PlantSizeUnit } | null, spread?: { amount: number, unit: PlantSizeUnit } | null, occurrences: Array<{ occurrenceId: number, occurrenceCoords: Array<number>, media: Array<{ url: string, isProxyUrl?: boolean | null }> }> };

type PlantFields_PlantData_Fragment = { addedTimestamp: number, updatedTimestamp: number, scientificName: string, commonNames?: Array<string> | null, bloomColors?: Array<string> | null, bloomTimes?: Array<string> | null, isPerennial?: boolean | null, thumbnailUrl?: string | null, physicalCharactersticsDump?: string | null, scrapeSources: Array<string>, hardiness?: Array<number> | null, fullOccurrencesCount?: number | null, height?: { amount: number, unit: PlantSizeUnit } | null, spread?: { amount: number, unit: PlantSizeUnit } | null, occurrences: Array<{ occurrenceId: number, occurrenceCoords: Array<number>, media: Array<{ url: string, isProxyUrl?: boolean | null }> }> };

export type PlantFieldsFragment = PlantFields_GardenPlantData_Fragment | PlantFields_PlantData_Fragment;

export type GetPlantQueryVariables = Exact<{
  id: Scalars['String']['input'];
  boundingPolyCoords?: InputMaybe<Array<Array<Array<Scalars['Float']['input']> | Scalars['Float']['input']> | Array<Scalars['Float']['input']> | Scalars['Float']['input']> | Array<Array<Scalars['Float']['input']> | Scalars['Float']['input']> | Array<Scalars['Float']['input']> | Scalars['Float']['input']>;
}>;


export type GetPlantQuery = { plant?: { _id: any, addedTimestamp: number, updatedTimestamp: number, scientificName: string, commonNames?: Array<string> | null, bloomColors?: Array<string> | null, bloomTimes?: Array<string> | null, isPerennial?: boolean | null, thumbnailUrl?: string | null, physicalCharactersticsDump?: string | null, scrapeSources: Array<string>, hardiness?: Array<number> | null, fullOccurrencesCount?: number | null, height?: { amount: number, unit: PlantSizeUnit } | null, spread?: { amount: number, unit: PlantSizeUnit } | null, occurrences: Array<{ occurrenceId: number, occurrenceCoords: Array<number>, media: Array<{ url: string, isProxyUrl?: boolean | null }> }> } | null };

export type SearchPlantsQueryVariables = Exact<{
  entityType: EntityType;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PlantSortInput> | PlantSortInput>;
  where?: InputMaybe<PlantDataInput>;
}>;


export type SearchPlantsQuery = { plantSearch: { count: number, results: Array<{ _id: any, addedTimestamp: number, updatedTimestamp: number, scientificName: string, commonNames?: Array<string> | null, bloomColors?: Array<string> | null, bloomTimes?: Array<string> | null, isPerennial?: boolean | null, thumbnailUrl?: string | null, physicalCharactersticsDump?: string | null, scrapeSources: Array<string>, hardiness?: Array<number> | null, fullOccurrencesCount?: number | null, height?: { amount: number, unit: PlantSizeUnit } | null, spread?: { amount: number, unit: PlantSizeUnit } | null, occurrences: Array<{ occurrenceId: number, occurrenceCoords: Array<number>, media: Array<{ url: string, isProxyUrl?: boolean | null }> }> }> } };

export type ReplaceWithProxyUrlMutationVariables = Exact<{
  entityId: Scalars['String']['input'];
  occurrenceId: Scalars['Float']['input'];
  replaceUrl: Scalars['String']['input'];
}>;


export type ReplaceWithProxyUrlMutation = { replaceWithProxyUrl?: string | null };

export type GardenPlantFieldsFragment = { _id: any, notes?: string | null, addedTimestamp: number, updatedTimestamp: number, scientificName: string, commonNames?: Array<string> | null, bloomColors?: Array<string> | null, bloomTimes?: Array<string> | null, isPerennial?: boolean | null, thumbnailUrl?: string | null, physicalCharactersticsDump?: string | null, scrapeSources: Array<string>, hardiness?: Array<number> | null, fullOccurrencesCount?: number | null, height?: { amount: number, unit: PlantSizeUnit } | null, spread?: { amount: number, unit: PlantSizeUnit } | null, occurrences: Array<{ occurrenceId: number, occurrenceCoords: Array<number>, media: Array<{ url: string, isProxyUrl?: boolean | null }> }> };

export type GardenFieldsFragment = { gardenName: string, gardenThumbnailUrl?: string | null, plantCount: number };

export type GetAllGardensQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllGardensQuery = { allUserGardens: Array<{ _id: any, gardenName: string, plantCount: number, gardenThumbnailUrl?: string | null }> };

export type GetGardenQueryVariables = Exact<{
  gardenId?: InputMaybe<Scalars['String']['input']>;
  gardenName?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetGardenQuery = { userGarden?: { _id: any, gardenName: string, plantCount: number, gardenThumbnailUrl?: string | null, plantRefs: Array<{ _id: any }> } | null };

export type GetGardenPlantsQueryVariables = Exact<{
  gardenId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<PlantSortInput> | PlantSortInput>;
  where?: InputMaybe<PlantDataInput>;
}>;


export type GetGardenPlantsQuery = { userGardenPlants?: { count: number, results: Array<{ _id: any, notes?: string | null, addedTimestamp: number, updatedTimestamp: number, scientificName: string, commonNames?: Array<string> | null, bloomColors?: Array<string> | null, bloomTimes?: Array<string> | null, isPerennial?: boolean | null, thumbnailUrl?: string | null, physicalCharactersticsDump?: string | null, scrapeSources: Array<string>, hardiness?: Array<number> | null, fullOccurrencesCount?: number | null, height?: { amount: number, unit: PlantSizeUnit } | null, spread?: { amount: number, unit: PlantSizeUnit } | null, occurrences: Array<{ occurrenceId: number, occurrenceCoords: Array<number>, media: Array<{ url: string, isProxyUrl?: boolean | null }> }> }> } | null };

export type CreateGardenMutationVariables = Exact<{
  gardenName?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateGardenMutation = { createGarden?: { gardenName: string } | null };

export type DeleteGardenMutationVariables = Exact<{
  gardenId: Scalars['String']['input'];
}>;


export type DeleteGardenMutation = { deleteGarden: boolean };

export type AddPlantMutationVariables = Exact<{
  plantId: Scalars['String']['input'];
  gardenId?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddPlantMutation = { addToGarden?: { gardenName: string, gardenThumbnailUrl?: string | null, plantCount: number } | null };

export type UpdateGardenPlantMutationVariables = Exact<{
  gardenId: Scalars['String']['input'];
  plantId: Scalars['String']['input'];
  customThumbnailUrl?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateGardenPlantMutation = { updateGardenPlant?: { _id: any } | null };

export type RemovePlantMutationVariables = Exact<{
  gardenId: Scalars['String']['input'];
  plantId: Scalars['String']['input'];
}>;


export type RemovePlantMutation = { removeFromGarden?: { gardenName: string, gardenThumbnailUrl?: string | null, plantCount: number } | null };

export type GetAllSearchRecordsQueryVariables = Exact<{
  sort?: InputMaybe<Array<SearchRecordSortInput> | SearchRecordSortInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  booleanFilter?: InputMaybe<Array<SearchRecordBooleanFilterInput> | SearchRecordBooleanFilterInput>;
  stringFilter?: InputMaybe<Array<SearchRecordStringFilterInput> | SearchRecordStringFilterInput>;
}>;


export type GetAllSearchRecordsQuery = { allSearchRecords: { count: number, results: Array<{ _id: any, createdTimestamp: number, status: SearchRecordStatus, lastRanTimestamp?: number | null, entityType: EntityType, locationName?: string | null, locationSource?: LocationSource | null, boundingPolyCoords?: Array<Array<Array<number>>> | null, scientificName?: string | null, commonName?: string | null, totalOccurrences: number, occurrencesOffset: number }> } };

export type GetSearchRecordDataCountsQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetSearchRecordDataCountsQuery = { searchRecordDataCounts: { plantCount: number, occurrenceCount: number, firstPlant?: { _id: string, occurrenceId: number, thumbnailUrl?: string | null, url: string, isProxyUrl?: boolean | null } | null } };

export const PlantFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlantDataInterface"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addedTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"updatedTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"commonNames"}},{"kind":"Field","name":{"kind":"Name","value":"bloomColors"}},{"kind":"Field","name":{"kind":"Name","value":"bloomTimes"}},{"kind":"Field","name":{"kind":"Name","value":"isPerennial"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"physicalCharactersticsDump"}},{"kind":"Field","name":{"kind":"Name","value":"scrapeSources"}},{"kind":"Field","name":{"kind":"Name","value":"hardiness"}},{"kind":"Field","name":{"kind":"Name","value":"height"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullOccurrencesCount"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceId"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCoords"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isProxyUrl"}}]}}]}}]}}]} as unknown as DocumentNode<PlantFieldsFragment, unknown>;
export const GardenPlantFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GardenPlantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GardenPlantData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlantFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlantDataInterface"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addedTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"updatedTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"commonNames"}},{"kind":"Field","name":{"kind":"Name","value":"bloomColors"}},{"kind":"Field","name":{"kind":"Name","value":"bloomTimes"}},{"kind":"Field","name":{"kind":"Name","value":"isPerennial"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"physicalCharactersticsDump"}},{"kind":"Field","name":{"kind":"Name","value":"scrapeSources"}},{"kind":"Field","name":{"kind":"Name","value":"hardiness"}},{"kind":"Field","name":{"kind":"Name","value":"height"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullOccurrencesCount"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceId"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCoords"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isProxyUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GardenPlantFieldsFragment, unknown>;
export const GardenFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GardenFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserGarden"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gardenName"}},{"kind":"Field","name":{"kind":"Name","value":"gardenThumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"plantCount"}}]}}]} as unknown as DocumentNode<GardenFieldsFragment, unknown>;
export const GetPlantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPlant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boundingPolyCoords"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"boundingPolyCoords"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boundingPolyCoords"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlantFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlantDataInterface"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addedTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"updatedTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"commonNames"}},{"kind":"Field","name":{"kind":"Name","value":"bloomColors"}},{"kind":"Field","name":{"kind":"Name","value":"bloomTimes"}},{"kind":"Field","name":{"kind":"Name","value":"isPerennial"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"physicalCharactersticsDump"}},{"kind":"Field","name":{"kind":"Name","value":"scrapeSources"}},{"kind":"Field","name":{"kind":"Name","value":"hardiness"}},{"kind":"Field","name":{"kind":"Name","value":"height"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullOccurrencesCount"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceId"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCoords"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isProxyUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetPlantQuery, GetPlantQueryVariables>;
export const SearchPlantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchPlants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EntityType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PlantSortInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PlantDataInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plantSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entityType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlantFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlantDataInterface"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addedTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"updatedTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"commonNames"}},{"kind":"Field","name":{"kind":"Name","value":"bloomColors"}},{"kind":"Field","name":{"kind":"Name","value":"bloomTimes"}},{"kind":"Field","name":{"kind":"Name","value":"isPerennial"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"physicalCharactersticsDump"}},{"kind":"Field","name":{"kind":"Name","value":"scrapeSources"}},{"kind":"Field","name":{"kind":"Name","value":"hardiness"}},{"kind":"Field","name":{"kind":"Name","value":"height"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullOccurrencesCount"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceId"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCoords"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isProxyUrl"}}]}}]}}]}}]} as unknown as DocumentNode<SearchPlantsQuery, SearchPlantsQueryVariables>;
export const ReplaceWithProxyUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"replaceWithProxyUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"occurrenceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"replaceUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"replaceWithProxyUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"plantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}},{"kind":"Argument","name":{"kind":"Name","value":"occurrenceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"occurrenceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"replaceUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"replaceUrl"}}}]}]}}]} as unknown as DocumentNode<ReplaceWithProxyUrlMutation, ReplaceWithProxyUrlMutationVariables>;
export const GetAllGardensDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllGardens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allUserGardens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"gardenName"}},{"kind":"Field","name":{"kind":"Name","value":"plantCount"}},{"kind":"Field","name":{"kind":"Name","value":"gardenThumbnailUrl"}}]}}]}}]} as unknown as DocumentNode<GetAllGardensQuery, GetAllGardensQueryVariables>;
export const GetGardenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getGarden"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gardenId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gardenName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userGarden"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gardenId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gardenId"}}},{"kind":"Argument","name":{"kind":"Name","value":"gardenName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gardenName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"gardenName"}},{"kind":"Field","name":{"kind":"Name","value":"plantCount"}},{"kind":"Field","name":{"kind":"Name","value":"gardenThumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"plantRefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]}}]} as unknown as DocumentNode<GetGardenQuery, GetGardenQueryVariables>;
export const GetGardenPlantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getGardenPlants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gardenId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PlantSortInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PlantDataInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userGardenPlants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gardenId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gardenId"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"GardenPlantFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlantDataInterface"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addedTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"updatedTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"commonNames"}},{"kind":"Field","name":{"kind":"Name","value":"bloomColors"}},{"kind":"Field","name":{"kind":"Name","value":"bloomTimes"}},{"kind":"Field","name":{"kind":"Name","value":"isPerennial"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"physicalCharactersticsDump"}},{"kind":"Field","name":{"kind":"Name","value":"scrapeSources"}},{"kind":"Field","name":{"kind":"Name","value":"hardiness"}},{"kind":"Field","name":{"kind":"Name","value":"height"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"spread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullOccurrencesCount"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occurrenceId"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCoords"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isProxyUrl"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GardenPlantFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GardenPlantData"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlantFields"}}]}}]} as unknown as DocumentNode<GetGardenPlantsQuery, GetGardenPlantsQueryVariables>;
export const CreateGardenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createGarden"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gardenName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGarden"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gardenName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gardenName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gardenName"}}]}}]}}]} as unknown as DocumentNode<CreateGardenMutation, CreateGardenMutationVariables>;
export const DeleteGardenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteGarden"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gardenId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGarden"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gardenId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gardenId"}}}]}]}}]} as unknown as DocumentNode<DeleteGardenMutation, DeleteGardenMutationVariables>;
export const AddPlantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addPlant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"plantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gardenId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addToGarden"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"plantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"plantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"gardenId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gardenId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GardenFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GardenFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserGarden"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gardenName"}},{"kind":"Field","name":{"kind":"Name","value":"gardenThumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"plantCount"}}]}}]} as unknown as DocumentNode<AddPlantMutation, AddPlantMutationVariables>;
export const UpdateGardenPlantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateGardenPlant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gardenId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"plantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customThumbnailUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGardenPlant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gardenId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gardenId"}}},{"kind":"Argument","name":{"kind":"Name","value":"plantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"plantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"customThumbnailUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customThumbnailUrl"}}},{"kind":"Argument","name":{"kind":"Name","value":"notes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}}]}}]}}]} as unknown as DocumentNode<UpdateGardenPlantMutation, UpdateGardenPlantMutationVariables>;
export const RemovePlantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removePlant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gardenId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"plantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeFromGarden"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gardenId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gardenId"}}},{"kind":"Argument","name":{"kind":"Name","value":"plantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"plantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GardenFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GardenFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserGarden"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gardenName"}},{"kind":"Field","name":{"kind":"Name","value":"gardenThumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"plantCount"}}]}}]} as unknown as DocumentNode<RemovePlantMutation, RemovePlantMutationVariables>;
export const GetAllSearchRecordsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllSearchRecords"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchRecordSortInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"booleanFilter"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchRecordBooleanFilterInput"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilter"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchRecordStringFilterInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allSearchRecords"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"booleanFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"booleanFilter"}}},{"kind":"Argument","name":{"kind":"Name","value":"stringFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"createdTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastRanTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}},{"kind":"Field","name":{"kind":"Name","value":"locationSource"}},{"kind":"Field","name":{"kind":"Name","value":"boundingPolyCoords"}},{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"commonName"}},{"kind":"Field","name":{"kind":"Name","value":"totalOccurrences"}},{"kind":"Field","name":{"kind":"Name","value":"occurrencesOffset"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllSearchRecordsQuery, GetAllSearchRecordsQueryVariables>;
export const GetSearchRecordDataCountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSearchRecordDataCounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchRecordDataCounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plantCount"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCount"}},{"kind":"Field","name":{"kind":"Name","value":"firstPlant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceId"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isProxyUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetSearchRecordDataCountsQuery, GetSearchRecordDataCountsQueryVariables>;