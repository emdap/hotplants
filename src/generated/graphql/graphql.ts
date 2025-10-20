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
};

export type PlantData = {
  addedTimestamp: Scalars['Float']['output'];
  bloomColors?: Maybe<Array<Scalars['String']['output']>>;
  bloomTimes?: Maybe<Array<Scalars['String']['output']>>;
  commonNames?: Maybe<Array<Scalars['String']['output']>>;
  habitat?: Maybe<Scalars['String']['output']>;
  hardiness?: Maybe<Array<Scalars['Int']['output']>>;
  height?: Maybe<PlantSize>;
  isPerennial?: Maybe<Scalars['Boolean']['output']>;
  lightLevels?: Maybe<Array<Scalars['String']['output']>>;
  maturityTime?: Maybe<Scalars['String']['output']>;
  mediaUrls: Array<Scalars['String']['output']>;
  occurrenceCoords: Array<Array<Scalars['Float']['output']>>;
  occurrenceIds: Array<Scalars['Float']['output']>;
  physicalCharactersticsDump?: Maybe<Scalars['String']['output']>;
  scientificName: Scalars['String']['output'];
  scrapeSources: Array<Scalars['String']['output']>;
  soilTypes?: Maybe<Array<Scalars['String']['output']>>;
  spread?: Maybe<PlantSize>;
  updatedTimestamp: Scalars['Float']['output'];
  uses?: Maybe<Array<Scalars['String']['output']>>;
};

export type PlantDataInput = {
  addedTimestamp?: InputMaybe<Scalars['Float']['input']>;
  bloomColors?: InputMaybe<Array<Scalars['String']['input']>>;
  bloomTimes?: InputMaybe<Array<Scalars['String']['input']>>;
  boundingBox?: InputMaybe<Array<Scalars['Float']['input']>>;
  commonName?: InputMaybe<Scalars['String']['input']>;
  habitat?: InputMaybe<Scalars['String']['input']>;
  hardiness?: InputMaybe<Array<Scalars['Int']['input']>>;
  height?: InputMaybe<PlantSizeInput>;
  isPerennial?: InputMaybe<Scalars['Boolean']['input']>;
  lightLevels?: InputMaybe<Array<Scalars['String']['input']>>;
  maturityTime?: InputMaybe<Scalars['String']['input']>;
  mediaUrls?: InputMaybe<Array<Scalars['String']['input']>>;
  occurrenceIds?: InputMaybe<Array<Scalars['Float']['input']>>;
  physicalCharactersticsDump?: InputMaybe<Scalars['String']['input']>;
  scientificName?: InputMaybe<Scalars['String']['input']>;
  scrapeSources?: InputMaybe<Array<Scalars['String']['input']>>;
  soilTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  spread?: InputMaybe<PlantSizeInput>;
  updatedTimestamp?: InputMaybe<Scalars['Float']['input']>;
  uses?: InputMaybe<Array<Scalars['String']['input']>>;
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
  plantSearch: PlantSearchResults;
  searchRecord?: Maybe<SearchRecord>;
};


export type QueryPlantSearchArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortInput>;
  where?: InputMaybe<PlantDataInput>;
};


export type QuerySearchRecordArgs = {
  id: Scalars['String']['input'];
};

export type SearchRecord = {
  endOfRecords?: Maybe<Scalars['Boolean']['output']>;
  jsonStringSearch: Scalars['String']['output'];
  status: SearchRecordStatus;
  statusUpdated: Scalars['Float']['output'];
  totalOccurrences: Scalars['Int']['output'];
};

export type SearchRecordStatus =
  | 'DONE'
  | 'SCRAPING';

export type SortDirection =
  | 'asc'
  | 'desc';

export type SortInput = {
  addedTimestamp?: InputMaybe<SortDirection>;
  scientificName?: InputMaybe<SortDirection>;
  updatedTimestamp?: InputMaybe<SortDirection>;
};

export type SearchPlantsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortInput>;
  where?: InputMaybe<PlantDataInput>;
}>;


export type SearchPlantsQuery = { plantSearch: { count: number, results: Array<{ scientificName: string, commonNames?: Array<string> | null, mediaUrls: Array<string>, bloomColors?: Array<string> | null, bloomTimes?: Array<string> | null, physicalCharactersticsDump?: string | null }> } };

export type GetSearchRecordQueryVariables = Exact<{
  searchId: Scalars['String']['input'];
}>;


export type GetSearchRecordQuery = { searchRecord?: { status: SearchRecordStatus, totalOccurrences: number, endOfRecords?: boolean | null } | null };


export const SearchPlantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchPlants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PlantDataInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plantSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"commonNames"}},{"kind":"Field","name":{"kind":"Name","value":"mediaUrls"}},{"kind":"Field","name":{"kind":"Name","value":"bloomColors"}},{"kind":"Field","name":{"kind":"Name","value":"bloomTimes"}},{"kind":"Field","name":{"kind":"Name","value":"physicalCharactersticsDump"}}]}}]}}]}}]} as unknown as DocumentNode<SearchPlantsQuery, SearchPlantsQueryVariables>;
export const GetSearchRecordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSearchRecord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchRecord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"totalOccurrences"}},{"kind":"Field","name":{"kind":"Name","value":"endOfRecords"}}]}}]}}]} as unknown as DocumentNode<GetSearchRecordQuery, GetSearchRecordQueryVariables>;