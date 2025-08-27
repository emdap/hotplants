/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
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

export type TestQueryVariables = Exact<{ [key: string]: never; }>;


export type TestQuery = { __typename?: 'Query', plants?: Array<{ __typename?: 'PlantData', scientificName: string, bloomTimes?: Array<string | null> | null } | null> | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const TestDocument = new TypedDocumentString(`
    query test {
  plants(limit: 3) {
    scientificName
    bloomTimes
  }
}
    `) as unknown as TypedDocumentString<TestQuery, TestQueryVariables>;