import Button from "designSystem/Button";
import SortButton from "designSystem/iconButtons/SortButton";
import StyledPopover from "designSystem/StyledPopover";
import { SearchRecordSortInput } from "generated/graphql/graphql";

const SearchArchiveSortPopover = ({
  sort,
  applySort,
  clearSort,
}: {
  sort?: SearchRecordSortInput[];
  applySort: (sort?: SearchRecordSortInput[]) => void;
  clearSort: () => void;
}) => {
  return (
    <StyledPopover
      anchor="bottom start"
      button={<SortButton active={Boolean(sort?.length)} size="small" />}
    >
      hey there{" "}
      <Button
        size="small"
        onClick={() => applySort([{ field: "locationName", direction: 1 }])}
      >
        Sort
      </Button>
      <Button variant="secondary" size="small" onClick={clearSort}>
        Clear
      </Button>
    </StyledPopover>
  );
};

export default SearchArchiveSortPopover;
