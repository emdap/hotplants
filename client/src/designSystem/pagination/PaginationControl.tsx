import { useNavigate } from "@tanstack/react-router";
import classNames from "classnames";
import Button from "designSystem/Button";
import { MOTION_FADE_IN } from "designSystem/motionTransitions";
import StyledPopover from "designSystem/StyledPopover";
import StyledSwitch, { StyledSwitchProps } from "designSystem/StyledSwitch";
import VerticalDivider from "designSystem/VerticalDivider";
import { motion } from "motion/react";
import { useMemo } from "react";
import {
  MdChevronLeft,
  MdChevronRight,
  MdOutlineMoreVert,
} from "react-icons/md";
import { getLastPage, SMALL_SCREEN_WIDTH } from "util/generalUtil";
import { PaginationParams } from "util/routeParamsUtil";
import PaginatorDropdown from "./PaginatorDropdown";

type PaginationControlProps = {
  page: number;
  totalItems: number;
  minPage?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  replaceUrl?: boolean;
  infiniteScroll?: Pick<StyledSwitchProps, "enabled" | "setEnabled">;
  className?: string;
};

export const PaginationControl = ({
  page,
  totalItems,
  minPage = 1,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  replaceUrl,
  infiniteScroll,
  className,
}: PaginationControlProps) => {
  const navigate = useNavigate();

  const bigScreenWidth = window.innerWidth >= SMALL_SCREEN_WIDTH;
  const infiniteScrollSwitch = infiniteScroll
    ? { ...infiniteScroll, label: "Infinite scroll" }
    : null;
  const lastPage = getLastPage(pageSize, totalItems);

  const pageList = useMemo(
    () => new Array(lastPage).fill(0).map((_, index) => index + 1),
    [lastPage],
  );

  const navToPage = (params: PaginationParams) =>
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, ...params }),
      replace: replaceUrl,
    });

  const recalcPage = (newPageSize: number) => {
    const currentPageStart = (page - 1) * pageSize;
    const newPage = Math.max(
      minPage,
      Math.floor(currentPageStart / newPageSize),
    );
    navToPage({ page: newPage, pageSize: newPageSize });
  };

  const showOptionsMenu =
    !bigScreenWidth || (infiniteScroll && !infiniteScroll.enabled);

  const PageSizeDropdown = (
    <PaginatorDropdown
      label="Page size"
      selected={pageSize}
      options={pageSizeOptions}
      onChange={recalcPage}
    />
  );

  return (
    <div className="h-7.5 text-sm flex gap-1">
      <motion.div
        className={classNames("flex items-center gap-2", className)}
        key={infiniteScroll?.enabled ? "infinite" : "paginate"}
        {...MOTION_FADE_IN}
      >
        {infiniteScrollSwitch?.enabled ? (
          bigScreenWidth && <StyledSwitch {...infiniteScrollSwitch} />
        ) : (
          <div className="flex gap-1 items-center">
            <Button
              size="small"
              variant="icon-white"
              disabled={page === minPage}
              onClick={() => navToPage({ page: page - 1 })}
              icon={<MdChevronLeft />}
            />

            <PaginatorDropdown
              label="Page"
              selected={page}
              options={pageList}
              disabled={pageList.length <= 1}
              onChange={(newPage) => navToPage({ page: newPage })}
            />

            <Button
              size="small"
              variant="icon-white"
              disabled={page >= lastPage}
              onClick={() => navToPage({ page: page + 1 })}
              icon={<MdChevronRight />}
            />

            {bigScreenWidth && (
              <>
                <VerticalDivider className="mr-3" />

                {PageSizeDropdown}
              </>
            )}
          </div>
        )}
      </motion.div>

      {showOptionsMenu ? (
        <StyledPopover
          className="space-y-2 p-1"
          button={
            <Button
              size="small"
              variant="icon-white"
              icon={<MdOutlineMoreVert />}
            />
          }
        >
          {!bigScreenWidth && !infiniteScroll?.enabled && (
            <PaginatorDropdown
              label="Page size"
              inPopover
              selected={pageSize}
              options={pageSizeOptions}
              onChange={recalcPage}
            />
          )}
          {infiniteScrollSwitch && <StyledSwitch {...infiniteScrollSwitch} />}
        </StyledPopover>
      ) : (
        <span className="w-2" />
      )}
    </div>
  );
};
