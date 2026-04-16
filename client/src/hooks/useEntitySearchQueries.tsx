import { EntitySearchParams, hotplantsClient } from "config/hotplantsConfig";
import { QueryPlantSearchArgs } from "generated/graphql/graphql";
import { SEARCH_ENTITIES } from "graphqlHelpers/entityQueries";
import { useApolloQuery, useReactQuery } from "hooks/useQuery";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AnimalDataFilter, PlantDataFilter } from "util/graphqlTypes";
import { PaginationParams } from "util/routeParamsUtil";

export type SearchQueryStatus =
  | "READY"
  | "CHECKING_STATUS"
  | "SCRAPING_AND_POLLING";

export const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_POLL_INTERVAL = 3000;
const MAX_POLLS = 10;

const DEFAULT_SEARCH_ARGS: Omit<QueryPlantSearchArgs, "entityType"> = {
  offset: 0,
  limit: DEFAULT_PAGE_SIZE,
  sort: [
    { field: "updatedTimestamp", value: 1 },
    { field: "scientificName", value: 1 },
  ],
};

const useEntitySearchQueries = (
  { location, entityName, entityType }: EntitySearchParams,
  filter: PlantDataFilter | AnimalDataFilter | undefined,
  {
    paginationEnabled,
    page,
    pageSize,
  }: Required<PaginationParams> & { paginationEnabled: boolean },
) => {
  const [searchStatus, setSearchStatus] =
    useState<SearchQueryStatus>("CHECKING_STATUS");

  const stopPollingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pollInterval, setPollInterval] = useState(0);

  // #region Queries
  const paginationVars = useMemo(
    () =>
      paginationEnabled
        ? {
            paginated: paginationEnabled,
            limit: pageSize,
            offset: (page - 1) * pageSize,
          }
        : null,
    [paginationEnabled, pageSize, page],
  );

  const entitySearchQuery = useApolloQuery(SEARCH_ENTITIES, {
    pollInterval,

    variables: {
      ...DEFAULT_SEARCH_ARGS,
      ...paginationVars,

      entityType,
      where: {
        boundingPolyCoords: location?.boundingPolyCoords,
        ...entityName,
        ...filter,
      },
    },
  });

  const setStatusFromRunningQuery = () =>
    setSearchStatus((prev) =>
      prev === "SCRAPING_AND_POLLING" ? prev : "CHECKING_STATUS",
    );

  const searchRecordQuery = useReactQuery({
    queryKey: ["search-record", location, entityName],
    refetchInterval: pollInterval,
    enabled: Boolean(location || entityName),

    queryFn: async () => {
      setStatusFromRunningQuery();

      const { data } = await hotplantsClient.POST("/searchRecord", {
        body: { location, entityName, entityType },
      });

      if (data?.status !== "SCRAPING" && pollInterval) {
        stopPolling();
        entitySearchQuery.refetch();
      }

      return data;
    },
  });
  const searchRecordData = searchRecordQuery.data;

  const { refetch: scrapeMoreData, ...scrapeOccurrencesQuery } = useReactQuery({
    queryKey: ["scrape-occurrences", searchRecordData?.id],
    enabled: Boolean(
      searchRecordData?.id && !searchRecordData.lastRanTimestamp,
    ),

    queryFn: async ({ meta }: { meta?: { searchRecordId?: string } }) => {
      const id = meta?.searchRecordId ?? searchRecordData?.id;
      if (!id) {
        return {};
      }
      setStatusFromRunningQuery();

      const { data } = await hotplantsClient.GET(
        "/runSearch/{searchRecordId}",
        { params: { path: { searchRecordId: searchRecordData!.id } } },
      );

      if (data?.status === "SCRAPING" && !pollInterval) {
        setSearchStatus("SCRAPING_AND_POLLING");
        startPolling();
      }

      return data;
    },
  });

  /**
   * Each query only sets the status to a non-READY state
   * Status is only set to READY once the poll interval is empty,
   * and no query is loading or fetching.
   */
  const someQueryInProgress =
    pollInterval ||
    entitySearchQuery.loading ||
    searchRecordQuery.fetchStatus !== "idle" ||
    scrapeOccurrencesQuery.fetchStatus !== "idle";

  useEffect(() => {
    if (!someQueryInProgress) {
      setSearchStatus("READY");
    }
  }, [someQueryInProgress]);
  // #endregion

  const stopPolling = () => {
    stopPollingTimeout.current && clearTimeout(stopPollingTimeout.current);
    setPollInterval(0);
  };

  const startPolling = () => {
    entitySearchQuery.refetch();
    searchRecordQuery.refetch();

    setPollInterval(DEFAULT_POLL_INTERVAL);

    stopPollingTimeout.current && clearTimeout(stopPollingTimeout.current);
    stopPollingTimeout.current = setTimeout(
      stopPolling,
      DEFAULT_POLL_INTERVAL * MAX_POLLS,
    );
  };

  useEffect(() => {
    if (
      searchRecordQuery.error ||
      entitySearchQuery.error ||
      scrapeOccurrencesQuery.error
    ) {
      stopPolling();
      const errors = [
        searchRecordQuery.error,
        entitySearchQuery.error,
        scrapeOccurrencesQuery.error,
      ];
      console.error(errors);

      toast.error(
        <>
          Error(s) occurred while scraping: <br />
          {errors.flatMap((error, index) =>
            error?.message ? <div key={index}>{error.message}</div> : [],
          )}
        </>,
      );
    }
  }, [
    searchRecordQuery.error,
    entitySearchQuery.error,
    scrapeOccurrencesQuery.error,
  ]);

  return {
    searchStatus,
    entitySearchQuery,
    searchRecordQuery,
    scrapeMoreData,
  };
};

export type EntitySearchQueriesReturnType = ReturnType<
  typeof useEntitySearchQueries
>;

export default useEntitySearchQueries;
