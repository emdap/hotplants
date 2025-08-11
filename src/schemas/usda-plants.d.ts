export interface paths {
  "/plants-search-results": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Plant search
     * @description Full search across all plants.
     */
    get: operations["searchOccurrence"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}

export interface operations {
  searchOccurrence: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      Text: string;
      Field: "Scientific Name" | "Common Name" | "Symbol" | "Family";
      Locations: null;
      Groups: null;
      Durations: null;
      GrowthHabits: null;
      WetlandRegions: null;
      NoxiousLocations: null;
      InvasiveLocations: null;
      Countries: null;
      Provinces: null;
      Counties: null;
      Cities: null;
      Localities: null;
      ArtistFirstLetters: null;
      ImageLocations: null;
      Artists: null;
      CopyrightStatuses: null;
      ImageReferences: null;
      ImageTypes: null;
      SortBy: "sortSciName";
      Offset: -1;
      FilterOptions: null;
      UnfilteredPlantIds: null;
      Type: "Basic";
      TaxonSearchCriteria: null;
      MasterId: -1;
      pageNumber: 1;
      allData: 0;
    };
    responses: {
      /** @description Occurrence search is valid */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["SearchResponseOccurrenceOccurrenceSearchParameter"];
          "application/x-javascript": components["schemas"]["SearchResponseOccurrenceOccurrenceSearchParameter"];
        };
      };
      /** @description Invalid query, e.g. invalid vocabulary values */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
}
