import Button from "designSystem/Button";
import SortButton from "designSystem/iconButtons/SortButton";
import StyledPopover from "designSystem/StyledPopover";
import {
  SearchRecordSortField,
  SearchRecordSortInput,
} from "generated/graphql/graphql";
import { Fragment, useEffect, useMemo, useState } from "react";
import { MdArrowDownward, MdArrowUpward, MdDragHandle } from "react-icons/md";
import {
  SEARCH_RECORD_ORDERED_SORT_KEYS,
  SEARCH_RECORD_SORT_LABELS,
} from "./searchRecordSortFixtures";

const SearchArchiveSortPopover = ({
  sort,
  applySort,
  clearSort,
}: {
  sort?: SearchRecordSortInput[];
  applySort: (sort?: SearchRecordSortInput[]) => void;
  clearSort: () => void;
}) => {
  const [localSort, setLocalSort] = useState<
    SearchRecordSortInput[] | undefined
  >(sort);

  const localSortDict = useMemo(
    (): {
      [key in SearchRecordSortField]?: { value: number; index: number };
    } =>
      localSort
        ? Object.fromEntries(
            localSort.map(({ field, value }, index) => [
              field,
              { value, index },
            ]),
          )
        : {},
    [localSort],
  );

  useEffect(() => {
    setLocalSort(sort);
  }, [sort]);

  const sortApplied = Boolean(sort?.length);

  const getNextSortValue = (value?: number) =>
    value === 1 ? -1 : value === -1 ? undefined : 1;

  const iterateSortFilter = (key: SearchRecordSortField) => {
    const index = localSortDict[key]?.index;
    const nextDirection = getNextSortValue(localSortDict[key]?.value);
    let nextSort = localSort ? [...localSort] : [];

    if (index !== undefined && localSort) {
      nextSort = localSort.slice(0, index).concat(localSort.slice(index + 1));
    }

    nextDirection && nextSort.push({ field: key, value: nextDirection });
    setLocalSort(nextSort.length ? nextSort : undefined);
  };

  return (
    <StyledPopover
      anchor="bottom start"
      button={<SortButton active={sortApplied} size="small" />}
    >
      {({ close }) => (
        <>
          <div className="grid grid-cols-[1fr_auto] gap-x-2 gap-y-1 items-center">
            {SEARCH_RECORD_ORDERED_SORT_KEYS.map((key) => {
              const sortValue = localSortDict[key]?.value;
              return (
                <Fragment key={key}>
                  <span>{SEARCH_RECORD_SORT_LABELS[key]}</span>
                  <Button
                    variant={sortValue ? "icon-primary" : "icon-white"}
                    size="small"
                    icon={
                      sortValue === 1 ? (
                        <MdArrowUpward />
                      ) : sortValue === -1 ? (
                        <MdArrowDownward />
                      ) : (
                        <MdDragHandle />
                      )
                    }
                    onClick={() => iterateSortFilter(key)}
                  />
                </Fragment>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Button
              className="grow"
              size="small"
              onClick={() => {
                applySort(localSort);
                close();
              }}
            >
              Apply
            </Button>
            <Button
              className="grow"
              disabled={!localSort?.length}
              variant="secondary"
              size="small"
              onClick={() => {
                setLocalSort(undefined);
                clearSort();
                close();
              }}
            >
              Clear
            </Button>
          </div>
        </>
      )}
    </StyledPopover>
  );
};

export default SearchArchiveSortPopover;
