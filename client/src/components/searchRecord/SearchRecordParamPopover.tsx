import Button from "designSystem/Button";
import FilterButton from "designSystem/iconButtons/FilterButton";
import { IconButtonVariantProps } from "designSystem/iconButtons/IconButton";
import SortButton from "designSystem/iconButtons/SortButton";
import StyledPopover from "designSystem/StyledPopover";
import { isEqual } from "lodash";
import { useEffect, useMemo, useState } from "react";
import SearchArchiveParamControl from "./SearchRecordParamControl";
import {
  ParamType,
  SEARCH_RECORD_ORDERED_QUERY_KEYS,
  SearchRecordQueryInput,
} from "./searchRecordQueryUtil";

type SearchArchiveQueryPopoverProps<T extends SearchRecordQueryInput> = {
  paramType: ParamType;
  currentParams?: T[];
  applyParams: (params?: T[]) => void;
  clearParams: () => void;
};

const SearchArchiveParamPopover = <T extends SearchRecordQueryInput>(
  props: SearchArchiveQueryPopoverProps<T>,
) => {
  const buttonProps: IconButtonVariantProps = {
    active: Boolean(props.currentParams?.length),
    size: "small",
  };

  return (
    <StyledPopover
      anchor="bottom start"
      button={
        props.paramType === "sort" ? (
          <SortButton {...buttonProps} />
        ) : (
          <FilterButton {...buttonProps} />
        )
      }
    >
      {({ close }) => <PopoverContent close={close} {...props} />}
    </StyledPopover>
  );
};

const PopoverContent = <T extends SearchRecordQueryInput>({
  paramType,
  currentParams,
  applyParams,
  clearParams,
  close,
}: SearchArchiveQueryPopoverProps<T> & {
  close: () => void;
}) => {
  const [localParams, setLocalParams] = useState<T[] | undefined>(
    currentParams,
  );

  const localParamDict = useMemo(
    (): {
      [key in SearchRecordQueryInput["field"]]?: {
        value: SearchRecordQueryInput["value"];
        index: number;
      };
    } =>
      localParams
        ? Object.fromEntries(
            localParams.map(({ field, value }, index) => [
              field,
              { value, index },
            ]),
          )
        : {},
    [localParams],
  );

  useEffect(() => {
    setLocalParams(currentParams);
  }, [currentParams]);

  const updateParam = (
    field: T["field"],
    nextValue?: SearchRecordQueryInput["value"],
  ) => {
    const index = localParamDict[field]?.index;
    let nextParams = localParams ? [...localParams] : [];

    if (index !== undefined && localParams) {
      nextParams = localParams
        .slice(0, index)
        .concat(localParams.slice(index + 1));
    }

    if (Array.isArray(nextValue) ? nextValue.length : nextValue !== undefined) {
      nextParams.push({ field, value: nextValue } as T);
    }

    setLocalParams(nextParams.length ? nextParams : undefined);
  };

  return (
    <>
      <h4 className="font-semibold">
        {paramType === "sort" ? "Sort results" : "Filter results"}
      </h4>
      <div className="gap-x-2 gap-y-1 items-center mt-2 mb-4">
        {SEARCH_RECORD_ORDERED_QUERY_KEYS[paramType].map((key) => (
          <SearchArchiveParamControl
            key={key}
            field={key}
            paramType={paramType}
            value={localParamDict[key]?.value}
            onChange={(nextValue) => updateParam(key, nextValue)}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          className="grow"
          size="small"
          disabled={isEqual(localParams, currentParams)}
          onClick={() => {
            applyParams(localParams);
            close();
          }}
        >
          Apply
        </Button>
        <Button
          className="grow"
          disabled={!localParams?.length}
          variant="secondary"
          size="small"
          onClick={() => {
            clearParams();
            close();
          }}
        >
          Clear
        </Button>
      </div>
    </>
  );
};

export default SearchArchiveParamPopover;
