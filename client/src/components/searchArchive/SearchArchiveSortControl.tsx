import Button from "designSystem/Button";
import { SearchRecordSortField } from "generated/graphql/graphql";
import { MdArrowDownward, MdArrowUpward, MdDragHandle } from "react-icons/md";
import { SEARCH_RECORD_SORT_LABELS } from "./searchRecordSortFixtures";

const SearchArchiveSortControl = ({
  field,
  value,
  onChange,
}: {
  field: SearchRecordSortField;
  value?: number;
  onChange: (value?: 1 | -1) => void;
}) => {
  const controlId = `sort-${field}`;

  const iterateSortValue = (value?: number) => {
    const nextValue = value === 1 ? -1 : value === -1 ? undefined : 1;
    onChange(nextValue);
  };

  return (
    <div className="form-item flex-row justify-between items-center">
      <label className="label" htmlFor={controlId}>
        {SEARCH_RECORD_SORT_LABELS[field]}
      </label>
      <Button
        id={controlId}
        variant={value ? "icon-primary" : "icon-white"}
        size="small"
        icon={
          value === 1 ? (
            <MdArrowUpward />
          ) : value === -1 ? (
            <MdArrowDownward />
          ) : (
            <MdDragHandle />
          )
        }
        onClick={() => iterateSortValue(value)}
      />
    </div>
  );
};

export default SearchArchiveSortControl;
