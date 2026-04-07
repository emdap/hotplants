import classNames from "classnames";
import Button from "designSystem/Button";
import {
  PlantSortInput,
  SearchRecordSortInput,
} from "generated/graphql/graphql";
import { motion } from "motion/react";
import { useMemo } from "react";
import { HiArrowSmDown, HiArrowSmUp } from "react-icons/hi";
import { TbLineDashed } from "react-icons/tb";

type SortInputType = PlantSortInput | SearchRecordSortInput;

type SortFieldConfig<S extends SortInputType = SortInputType> = {
  field: S["field"];
  label: string;
};

type SortInputsProps<S extends SortInputType> = {
  sortFields: SortFieldConfig<S>[];
  currentSort?: S[];
  multiSort?: boolean;
  className?: string;
  applySort: (newSort?: S[]) => void;
};

type OrderedSortField<S extends SortInputType> = SortFieldConfig<S> & {
  appliedIndex?: number;
  order: number;
  value?: number;
};

const SortInputs = <SortInputConfig extends SortInputType>({
  sortFields,
  currentSort,
  multiSort,
  className,
  applySort,
}: SortInputsProps<SortInputConfig>) => {
  const completeSortFields = useMemo(
    () =>
      sortFields.map((sortConfig, index) => {
        const appliedIndex =
          currentSort?.findIndex(
            (currentConfig) => currentConfig.field === sortConfig.field,
          ) ?? -1;
        const currentValue =
          !currentSort || appliedIndex === -1
            ? undefined
            : currentSort[appliedIndex].value;

        return {
          ...sortConfig,
          appliedIndex: appliedIndex === -1 ? undefined : appliedIndex,
          order: appliedIndex === -1 ? index + sortFields.length : appliedIndex,
          value: currentValue,
        };
      }),
    [sortFields, currentSort],
  );

  const updateSort = ({
    field,
    value,
    appliedIndex,
  }: OrderedSortField<SortInputConfig>) => {
    const nextValue = !value ? -1 : value === -1 ? 1 : 0;
    const nextSortInput = nextValue
      ? ({ field, value: nextValue } as SortInputConfig)
      : undefined;

    if (!multiSort) {
      applySort([nextSortInput] as SortInputConfig[]);
      return;
    }

    const sortParams = currentSort ?? [];
    let nextParams: SortInputConfig[] | undefined;

    if (nextSortInput && appliedIndex !== undefined) {
      nextParams = sortParams.map((item, index) =>
        index === appliedIndex ? nextSortInput : item,
      );
    } else if (nextSortInput) {
      nextParams = [nextSortInput, ...sortParams];
    } else {
      nextParams = sortParams.filter((_, index) => index !== appliedIndex);
    }

    applySort(nextParams?.length ? nextParams : undefined);
  };

  return (
    <div className={classNames("flex flex-col", className)}>
      {completeSortFields.map((sortConfig) => (
        <motion.div
          layout
          layoutDependency={completeSortFields}
          key={sortConfig.field}
          className="form-item grid grid-cols-[1fr_auto] items-center"
          style={{ order: sortConfig.order }}
        >
          <label className="label" htmlFor={sortConfig.field}>
            {sortConfig.label}
          </label>
          <Button
            id={sortConfig.field}
            variant={sortConfig.value ? "icon-primary" : "icon-white"}
            size="small"
            icon={
              sortConfig.value === 1 ? (
                <HiArrowSmUp />
              ) : sortConfig.value === -1 ? (
                <HiArrowSmDown />
              ) : (
                <TbLineDashed />
              )
            }
            onClick={() => updateSort(sortConfig)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default SortInputs;
