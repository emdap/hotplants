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
  JSON: { input: any; output: any; }
};

export type PlantData = {
  __typename?: 'PlantData';
  bloomColors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  bloomTimes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  commonNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  habitat?: Maybe<Scalars['String']['output']>;
  hardiness?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  height?: Maybe<PlantSize>;
  isPerennial?: Maybe<Scalars['Boolean']['output']>;
  lightLevels?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  maturityTime?: Maybe<Scalars['String']['output']>;
  mediaUrls?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  occurrenceCoords?: Maybe<Array<Maybe<Array<Maybe<Scalars['Int']['output']>>>>>;
  scientificName: Scalars['String']['output'];
  soilTypes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  spread?: Maybe<PlantSize>;
  uses?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type PlantSize = {
  __typename?: 'PlantSize';
  amount?: Maybe<Scalars['Int']['output']>;
  unit?: Maybe<PlantSizeUnit>;
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
};


export type QueryPlantsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Scalars['JSON']['input']>;
};

export type GetPlantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPlantsQuery = { __typename?: 'Query', plants?: Array<{ __typename?: 'PlantData', scientificName: string, commonNames?: Array<string | null> | null, mediaUrls?: Array<string | null> | null } | null> | null };


export const GetPlantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPlants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"3"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scientificName"}},{"kind":"Field","name":{"kind":"Name","value":"commonNames"}},{"kind":"Field","name":{"kind":"Name","value":"mediaUrls"}}]}}]}}]} as unknown as DocumentNode<GetPlantsQuery, GetPlantsQueryVariables>;