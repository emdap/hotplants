import { useNavigate, useSearch } from "@tanstack/react-router";
import { PlantSearchParams } from "config/hotplantsConfig";
import { ReactNode, useEffect, useState } from "react";
import {
  SearchParamsContext,
  SearchParamsContextType,
} from "./SearchParamsContext";

const SearchParamsProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { location, plantName } = useSearch({ strict: false });

  const searchParams = { location, plantName };
  const [isPrefilledSearch, setIsPrefilledSearch] = useState(
    Boolean(location || plantName),
  );

  const [searchParamsDraft, setSearchParamsDraft] =
    useState<Partial<PlantSearchParams> | null>(searchParams);

  const updateSearchParamsDraft: SearchParamsContextType["updateSearchParamsDraft"] =
    (partialParams) =>
      setSearchParamsDraft((prev) => ({ ...prev, ...partialParams }));

  useEffect(() => {
    updateSearchParamsDraft({ plantName: searchParams.plantName });
  }, [searchParams.plantName]);

  useEffect(() => {
    updateSearchParamsDraft({ location: searchParams.location });
  }, [searchParams.location]);

  const applySearchParams = (params: Partial<PlantSearchParams>) => {
    setIsPrefilledSearch(false);

    navigate({
      to: "/browse-plants",
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
