import { useNavigate, useSearch } from "@tanstack/react-router";
import { EntitySearchParams } from "config/hotplantsConfig";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { SearchParamsContext } from "./SearchParamsContext";

const SearchParamsProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const {
    location,
    entityName,
    entityType = "plant",
  } = useSearch({ strict: false });

  const [isPrefilledSearch, setIsPrefilledSearch] = useState(
    Boolean(location || entityName),
  );

  const [searchParamsDraft, setSearchParamsDraft] =
    useState<EntitySearchParams>({ location, entityName, entityType });

  const updateSearchParamsDraft = (
    partialParams: Partial<EntitySearchParams>,
  ) => setSearchParamsDraft((prev) => ({ ...prev, ...partialParams }));

  const resetSearchParamsDraft = useCallback(
    () => setSearchParamsDraft({ location, entityName, entityType }),
    [location, entityName, entityType],
  );

  useEffect(() => {
    updateSearchParamsDraft({ entityName });
  }, [entityName]);

  useEffect(() => {
    updateSearchParamsDraft({ location });
  }, [location]);

  useEffect(() => {
    updateSearchParamsDraft({ entityType });
  }, [entityType]);

  const applySearchParams = ({
    entityType,
    ...params
  }: Partial<EntitySearchParams>) => {
    setIsPrefilledSearch(false);

    navigate({
      to: !entityType
        ? "."
        : entityType === "plant"
          ? "/browse-plants"
          : "/browse-animals",
      search: ({ page: _page, ...rest }) => ({
        ...rest,
        ...params,
      }),
    });
  };

  return (
    <SearchParamsContext.Provider
      value={{
        location,
        entityName,
        entityType,

        searchParamsDraft,
        updateSearchParamsDraft,
        applySearchParams,
        resetSearchParamsDraft,

        isPrefilledSearch,
        setIsPrefilledSearch,
      }}
    >
      {children}
    </SearchParamsContext.Provider>
  );
};

export default SearchParamsProvider;
