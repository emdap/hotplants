import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "@tanstack/react-router";
import classNames from "classnames";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import LoadingIcon from "designSystem/LoadingIcon";
import OpenSidebarButton from "designSystem/sidebar/OpenSidebarButton";
import { DEFAULT_PAGE_SIZE } from "hooks/usePlantSearchQueries";
import { FaGlobe } from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const PlantSearchHeader = ({
  openSidebar,
  className,
}: {
  openSidebar?: () => void;
  className: string;
}) => {
  const { page, searchStatus, hasCurrentResults, totalResultsCount } =
    usePlantSearchContext();

  const LAST_PAGE = Math.ceil(totalResultsCount / DEFAULT_PAGE_SIZE);

  return hasCurrentResults ? (
    <header
      className={classNames(
        "lg:text-white lg:h-header grid-centered gap-4 items-center justify-center sticky top-header z-20 px-8 py-2 lg:px-2",
        className
      )}
    >
      {openSidebar && (
        <OpenSidebarButton
          openSidebar={openSidebar}
          className="lg:hidden max-lg:text-black! dark:text-white/80! max-lg:hover:text-black/80! dark:hover:text-white/80! mr-auto"
          icon={<FaGlobe size={16} />}
        />
      )}

      <div className="flex items-center gap-1 col-start-2">
        {searchStatus !== "READY" && <LoadingIcon />}
        {totalResultsCount} Plants
      </div>

      {page !== undefined && <PagePaginator page={page} lastPage={LAST_PAGE} />}
      <span className="ml-auto" />
    </header>
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
