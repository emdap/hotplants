import { useNavigate, useSearch } from "@tanstack/react-router";
import { EntitySearchParams } from "config/hotplantsConfig";
import { ReactNode, useEffect, useState } from "react";
import {
  SearchParamsContext,
  SearchParamsContextType,
} from "./SearchParamsContext";

const SearchParamsProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const {
    location,
    entityName,
    entityType = "plant",
  } = useSearch({ strict: false });
  const searchParams = { location, entityName, entityType };

  const [isPrefilledSearch, setIsPrefilledSearch] = useState(
    Boolean(searchParams.location || searchParams.entityName),
  );

  const [searchParamsDraft, setSearchParamsDraft] =
    useState<Partial<EntitySearchParams>>(searchParams);

  const updateSearchParamsDraft: SearchParamsContextType["updateSearchParamsDraft"] =
    (partialParams) =>
      setSearchParamsDraft((prev) => ({ ...prev, ...partialParams }));

  useEffect(() => {
    updateSearchParamsDraft({ entityName: searchParams.entityName });
  }, [searchParams.entityName]);

  useEffect(() => {
    updateSearchParamsDraft({ location: searchParams.location });
  }, [searchParams.location]);

  const applySearchParams = (params: Partial<EntitySearchParams>) => {
    setIsPrefilledSearch(false);

    navigate({
      to: ".",
      search: ({ page: _page, ...rest }) => ({
        ...rest,
        ...params,
      }),
    });
  };

  return (
    <SearchParamsContext.Provider
      value={{
        searchParams,
        searchParamsDraft,
        updateSearchParamsDraft,
        applySearchParams,

        isPrefilledSearch,
        setIsPrefilledSearch,
      }}
    >
      {children}
    </SearchParamsContext.Provider>
  );
};

export default SearchParamsProvider;
