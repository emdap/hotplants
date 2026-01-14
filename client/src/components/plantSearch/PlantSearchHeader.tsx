import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "@tanstack/react-router";
import classNames from "classnames";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import LoadingIcon from "designSystem/LoadingIcon";
import OpenSidebarButton from "designSystem/sidebar/OpenSidebarButton";
import { DEFAULT_PAGE_SIZE } from "hooks/usePlantSearchQueries";
import { useLayoutEffect, useRef } from "react";
import { FaGlobe } from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { BACKGROUND_ANIMATION_ID } from "util/generalUtil";

const PlantSearchHeader = ({ openSidebar }: { openSidebar?: () => void }) => {
  const { page, searchStatus, totalResultsCount } = usePlantSearchContext();

  const headerRef = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    const syncAnimation = document
      .getAnimations()
      .find(
        (animation) =>
          animation instanceof CSSAnimation &&
          animation.effect instanceof KeyframeEffect &&
          animation.effect.target?.id === BACKGROUND_ANIMATION_ID
      );

    const headerAnimation = headerRef.current?.getAnimations()[0];

    if (headerAnimation && syncAnimation) {
      headerAnimation.currentTime = syncAnimation.currentTime;
    }
  }, []);

  const LAST_PAGE = Math.ceil(totalResultsCount / DEFAULT_PAGE_SIZE);

  return (
    <header
      ref={headerRef}
      className={classNames(
        "grid-centered gap-4 items-center justify-center sticky top-header z-20",
        "big-screen:text-white big-screen:h-header big-screen:border-header big-screen:bg-header big-screen:px-2 big-screen:py-2",
        "small-screen:card small-screen:card-solid small-screen:mx-2 small-screen:px-8 small-screen:py-1"
      )}
    >
      {openSidebar && (
        <OpenSidebarButton
          openSidebar={openSidebar}
          className="text-accent/80! hover:text-accent big-screen:hidden dark:text-white/80! dark:hover:text-white! mr-auto"
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
  );
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
