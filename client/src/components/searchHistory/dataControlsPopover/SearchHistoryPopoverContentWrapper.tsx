import Button from "designSystem/Button";
import { ReactNode } from "react";
import {
  POPOVER_LABELS,
  SearchHistoryParamType,
  SearchHistoryPopoverProps,
} from "../searchHistoryDataUtil";

export type SearchHistoryPopoverContentWrapperProps = {
  paramType: SearchHistoryParamType;
  children: ReactNode;
  hasData: boolean;
  close: () => void;
} & Pick<SearchHistoryPopoverProps, "applyParams">;

const SearchHistoryPopoverContentWrapper = ({
  paramType,
  children,
  hasData,
  applyParams,
  close,
}: SearchHistoryPopoverContentWrapperProps) => (
  <div className="flex flex-col gap-4 max-h-[50vh] max-w-[85vw] -mr-4 pr-4 overflow-hidden">
    <h4 className="font-semibold">{POPOVER_LABELS[paramType]} results</h4>
    <div className="space-y-2 overflow-auto pr-3 -mr-3">{children}</div>
    <div className="flex gap-2 [&_button]:grow">
      <Button
        variant="accent"
        size="small"
        disabled={!hasData}
        onClick={() => applyParams({ [paramType]: undefined })}
      >
        Clear
      </Button>
      <Button variant="secondary" size="small" onClick={close}>
        Close
      </Button>
    </div>
  </div>
);

export default SearchHistoryPopoverContentWrapper;
