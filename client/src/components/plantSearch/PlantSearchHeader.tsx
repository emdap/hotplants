import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "@tanstack/react-router";
import classNames from "classnames";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import LoadingIcon from "designSystem/LoadingIcon";
import { DEFAULT_PAGE_SIZE } from "hooks/usePlantSearchQueries";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const PlantSearchHeader = ({ className }: { className?: string }) => {
  const { page, searchStatus, hasCurrentResults, totalResultsCount } =
    usePlantSearchContext();

  const LAST_PAGE = Math.ceil(totalResultsCount / DEFAULT_PAGE_SIZE);

  return hasCurrentResults ? (
    <div
      className={classNames(
        "h-header flex gap-4 items-center sticky top-header z-20",
        className
      )}
    >
      <div className="flex items-center gap-1 mx-auto">
        {searchStatus !== "READY" && <LoadingIcon />}
        {totalResultsCount} Plants
      </div>
      {page !== undefined && <PagePaginator page={page} lastPage={LAST_PAGE} />}
    </div>
  ) : null;
};

const PagePaginator = ({
  page,
  lastPage,
}: {
  page: number;
  lastPage: number;
}) => (
  <div className="flex items-center gap-2">
    <Link to="." disabled={page === 0} search={{ page: page - 1 }}>
      <MdChevronLeft />
    </Link>

    <div>
      Page{" "}
      <Menu>
        <MenuButton>{page}</MenuButton>
        <MenuItems anchor="bottom">
          {new Array(lastPage).fill(0).map((_, index) => (
            <MenuItem key={index}>
              <Link to="." search={{ page: index + 1 }}>
                {index + 1}
              </Link>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    </div>

    <Link to="." disabled={page === lastPage} search={{ page: page + 1 }}>
      <MdChevronRight />
    </Link>
  </div>
);

export default PlantSearchHeader;
