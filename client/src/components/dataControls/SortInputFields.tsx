import classNames from "classnames";
import Button from "designSystem/Button";
import {
  PlantSortField,
  PlantSortInput,
  SearchRecordSortField,
  SearchRecordSortInput,
} from "generated/graphql/graphql";
import { useMemo } from "react";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import { TbLineDashed } from "react-icons/tb";

type SortField = PlantSortField | SearchRecordSortField;

const SortInputFields = <
  SortInput extends PlantSortInput | SearchRecordSortInput,
>({
  sortFields,
  currentSort,
  className,
  applySort,
}: {
  sortFields: {
    field: SortField;
    label: string;
  }[];
  currentSort?: SortInput[];
  className?: string;
  applySort: (newSort?: SortInput[]) => void;
}) => {
  const sortParamDict = useMemo(
    () =>
      currentSort
        ? currentSort.reduce<{
            [key in SortField]?: {
              value: number;
              index: number;
            };
          }>((prev, { field, value }, index) => {
            prev[field] = { value, index };
            return prev;
          }, {})
        : {},
    [currentSort],
  );

  const updateSort = ({ field, value }: SortInput) => {
    const sortParams = currentSort ?? [];

    const updateIndex = sortParamDict[field]?.index;

    const nextValue = value === 1 ? -1 : value === -1 ? 0 : 1;
    const nextSortInput = nextValue
      ? ({ field, value: nextValue } as SortInput)
      : undefined;

    let nextParams: SortInput[] | undefined;

    if (nextSortInput && updateIndex !== undefined) {
      nextParams = sortParams.map((item, index) =>
        index === updateIndex ? nextSortInput : item,
      );
    } else if (nextSortInput) {
      nextParams = sortParams.concat(nextSortInput);
    } else {
      nextParams = sortParams.filter((_, index) => index !== updateIndex);
    }

    applySort(nextParams?.length ? nextParams : undefined);
  };

  return (
    <>
      {sortFields.map(({ field, label }) => {
        const value = sortParamDict?.[field]?.value ?? 0;

        return (
          <div key={field} className={classNames("form-item", className)}>
            <label className="label" htmlFor={field}>
              {label}
            </label>
            <Button
              id={field}
              variant={value ? "icon-primary" : "icon-white"}
              size="small"
              icon={
                value === 1 ? (
                  <MdArrowUpward />
                ) : value === -1 ? (
                  <MdArrowDownward />
                ) : (
                  <TbLineDashed />
                )
              }
              onClick={() => updateSort({ field, value } as SortInput)}
            />
          </div>
        );
      })}
    </>
  );
};

export default SortInputFields;
