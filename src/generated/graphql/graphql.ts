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
  __typename?: 'PlantData';
  addedTimestamp: Scalars['Int']['output'];
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
  occurrenceIds: Array<Scalars['Int']['output']>;
  scientificName: Scalars['String']['output'];
  scrapeSources: Array<Scalars['String']['output']>;
  soilTypes?: Maybe<Array<Scalars['String']['output']>>;
  spread?: Maybe<PlantSize>;
  updatedTimestamp: Scalars['Int']['output'];
  uses?: Maybe<Array<Scalars['String']['output']>>;
};

export type PlantDataInput = {
  addedTimestamp?: InputMaybe<Scalars['Int']['input']>;
  bloomColors?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  bloomTimes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  boundingBox?: InputMaybe<Array<Scalars['Float']['input']>>;
  commonName?: InputMaybe<Scalars['String']['input']>;
  habitat?: InputMaybe<Scalars['String']['input']>;
  hardiness?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  height?: InputMaybe<PlantSizeInput>;
  isPerennial?: InputMaybe<Scalars['Boolean']['input']>;
  lightLevels?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  maturityTime?: InputMaybe<Scalars['String']['input']>;
  mediaUrls?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  occurrenceIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  scientificName?: InputMaybe<Scalars['String']['input']>;
  scrapeSources?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  soilTypes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  spread?: InputMaybe<PlantSizeInput>;
  updatedTimestamp?: InputMaybe<Scalars['Int']['input']>;
  uses?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type PlantSize = {
  __typename?: 'PlantSize';
  amount?: Maybe<Scalars['Int']['output']>;
  unit?: Maybe<PlantSizeUnit>;
};

export type PlantSizeInput = {
  amount?: InputMaybe<Scalars['Int']['input']>;
  unit?: InputMaybe<PlantSizeUnit>;
};

export enum PlantSizeUnit {
  Cm = 'cm',
  Ft = 'ft',
  In = 'in',
  M = 'm'
}

export type Query = {
  __typename?: 'Query';
  plants?: Maybe<Array<Maybe<PlantData>>>;
  searchRecords?: Maybe<SearchRecord>;
};


export type QueryPlantsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortInput>;
  where?: InputMaybe<PlantDataInput>;
};


export type QuerySearchRecordsArgs = {
  id: Scalars['String']['input'];
};

export type SearchRecord = {
  __typename?: 'SearchRecord';
  endOfRecords?: Maybe<Scalars['Boolean']['output']>;
  jsonStringSearch: Scalars['String']['output'];
  lastAddedCount?: Maybe<Scalars['Int']['output']>;
  status: SearchRecordStatus;
  totalOccurrences: Scalars['Int']['output'];
  uniqueOccurrences: Scalars['Int']['output'];
};

export enum SearchRecordStatus {
  Done = 'DONE',
  Scraping = 'SCRAPING'
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type SortInput = {
  addedTimestamp?: InputMaybe<SortDirection>;
  scientificName?: InputMaybe<SortDirection>;
  updatedTimestamp?: InputMaybe<SortDirection>;
};

export type GetPlantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPlantsQuery = { __typename?: 'Query', plants?: Array<{ __typename?: 'PlantData', scientificName: string, commonNames?: Array<string> | null, mediaUrls: Array<string> } | null> | null };


export const GetPlantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPlants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"3"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"commonNames"}},{"kind":"Field","name":{"kind":"Name","value":"mediaUrls"}}]}}]}}]} as unknown as DocumentNode<GetPlantsQuery, GetPlantsQueryVariables>;