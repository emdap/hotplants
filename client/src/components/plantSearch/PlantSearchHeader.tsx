import { useNavigate } from "@tanstack/react-router";
import classNames from "classnames";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import LoadingIcon from "designSystem/LoadingIcon";
import OpenSidebarButton from "designSystem/sidebar/OpenSidebarButton";
import pluralize from "pluralize";
import { useLayoutEffect, useRef } from "react";
import { FaGlobe } from "react-icons/fa";
import { BACKGROUND_ANIMATION_ID, findAnimation } from "util/generalUtil";
import { PaginationControl } from "../../designSystem/PaginationControl";

const PlantSearchHeader = () => {
  const navigate = useNavigate();
  const {
    page,
    pageSize,
    searchStatus,
    totalResultsCount,
    setSidebarExpanded,
  } = usePlantSearchContext();

  const headerRef = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    const syncAnimation = () => {
      const headerAnimation = findAnimation(
        headerRef.current,
        "background-shift",
      );

      if (headerAnimation) {
        const backgroundAnimation = findAnimation(
          document.getElementById(BACKGROUND_ANIMATION_ID),
          "background-shift",
        );

        if (backgroundAnimation) {
          headerAnimation.currentTime = backgroundAnimation.currentTime;
        }
      }
    };

    syncAnimation();

    window.addEventListener("resize", syncAnimation);
    return () => window.removeEventListener("resize", syncAnimation);
  }, []);

  const LAST_PAGE = Math.ceil(totalResultsCount / pageSize);

  return (
    <header
      ref={headerRef}
      className={classNames(
        "grid-centered gap-4 items-center justify-center sticky top-header z-20",
        "big-screen:text-white big-screen:h-header big-screen:border-header big-screen:bg-header big-screen:px-2 big-screen:py-2",
        "small-screen:card small-screen:card-solid small-screen:mx-safe-2 small-screen:px-8 small-screen:py-1",
      )}
    >
      <OpenSidebarButton
        openSidebar={() => setSidebarExpanded(true)}
        className="text-accent/80! hover:text-accent! big-screen:hidden dark:text-white/80! dark:hover:text-white! mr-auto"
        icon={<FaGlobe size={16} />}
      />

      <div className="small-screen:text-default-text flex items-center gap-1 col-start-2">
        {pluralize("Plant", totalResultsCount, true)}
        {searchStatus !== "READY" && <LoadingIcon />}
      </div>

      <PaginationControl
        className="ml-auto"
        page={page}
        pageSize={pageSize}
        lastPage={LAST_PAGE}
        onPageChange={(newPage) =>
          navigate({ to: ".", search: { page: newPage } })
        }
        onPageSizeChange={(newPageSize) =>
          navigate({ to: ".", search: { pageSize: newPageSize } })
        }
      />
    </header>
  );
};

export default PlantSearchHeader;
