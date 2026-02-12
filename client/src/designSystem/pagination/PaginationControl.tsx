import { useNavigate } from "@tanstack/react-router";
import classNames from "classnames";
import { MOTION_FADE_IN } from "designSystem/motionTransitions";
import { motion } from "motion/react";
import { useMemo } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { SMALL_SCREEN_WIDTH } from "util/generalUtil";
import { PaginationParams } from "util/routeParamsUtil";
import Button from "../Button";
import VerticalDivider from "../VerticalDivider";
import InfiniteScrollToggle, {
  InfiniteScrollToggleProps,
} from "./InfiniteScrollToggle";
import PaginationPopover from "./PaginationPopover";
import PaginatorDropdown from "./PaginatorDropdown";

type PaginationControlProps = {
  page: number;
  totalResults: number;
  minPage?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  replaceUrl?: boolean;
  infiniteScroll?: InfiniteScrollToggleProps;
  className?: string;
};

export const PaginationControl = ({
  page,
  totalResults,
  minPage = 1,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  replaceUrl,
  infiniteScroll,
  className,
}: PaginationControlProps) => {
  const navigate = useNavigate();

  const bigScreenWidth = window.innerWidth >= SMALL_SCREEN_WIDTH;

  const lastPage = Math.ceil(totalResults / pageSize);

  const pageList = useMemo(
    () => new Array(lastPage).fill(0).map((_, index) => index + 1),
    [lastPage],
  );

  const navToPage = (params: PaginationParams) =>
    navigate({ to: ".", search: params, replace: replaceUrl });

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
    <div className="h-7.5 text-sm flex">
      <motion.div
        className={classNames("flex items-center gap-2", className)}
        key={infiniteScroll?.enabled ? "infinite" : "paginate"}
        {...MOTION_FADE_IN}
      >
        {infiniteScroll?.enabled ? (
          bigScreenWidth && <InfiniteScrollToggle {...infiniteScroll} />
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
              onChange={(newPage) => navToPage({ page: newPage })}
            />

            <Button
              size="small"
              variant="icon-white"
              disabled={page === lastPage}
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

      {showOptionsMenu && (
        <PaginationPopover>
          {!bigScreenWidth && !infiniteScroll?.enabled && (
            <PaginatorDropdown
              label="Page size"
              selected={pageSize}
              options={pageSizeOptions}
              onChange={recalcPage}
            />
          )}
          {infiniteScroll && <InfiniteScrollToggle {...infiniteScroll} />}
        </PaginationPopover>
      )}
    </div>
  );
};
