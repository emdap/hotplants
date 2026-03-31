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
  <div className="flex flex-col gap-4 max-h-[50vh] overflow-hidden">
    <h4 className="font-semibold">{POPOVER_LABELS[paramType]} results</h4>
    <div className="space-y-2 overflow-auto">{children}</div>
    <Button
      variant="accent"
      size="small"
      disabled={!hasData}
      onClick={() => {
        applyParams({ [paramType]: undefined });
        close();
      }}
    >
      Reset
    </Button>
  </div>
);

export default SearchHistoryPopoverContentWrapper;
