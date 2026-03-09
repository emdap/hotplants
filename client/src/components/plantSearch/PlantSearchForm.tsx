import classNames from "classnames";
import PlantLocationForm from "components/plantSearch/plantLocation/PlantLocationForm";
import PlantNameForm from "components/plantSearch/plantName/PlantNameForm";
import {
  SearchFormTab,
  usePlantSearchContext,
} from "contexts/plantSearch/PlantSearchContext";
import Sidebar from "designSystem/Sidebar";
import { useGetScrollContainer } from "hooks/useGetScrollContainer";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { useMount } from "react-use";
import { isSmallScreen } from "util/generalUtil";
import PlantFiltersForm from "./plantFilters/PlantFilterForm";
import { PlantSearchFormProps } from "./plantSearchFormUtil";

const formComponents: Record<SearchFormTab, ReactElement> = {
  location: <PlantLocationForm renderMode="card" />,
  "plant-name": <PlantNameForm renderMode="card" />,
  filters: <PlantFiltersForm renderMode="card" />,
};

const PlantSearchForm = () => {
  const {
    hasCurrentResults,
    searchFormState: { tab, isOpen },
    setSearchFormState,
  } = usePlantSearchContext();
  const { scrollContainerElement } = useGetScrollContainer();

  const [sidebarContentHeight, setSidebarContentHeight] = useState<
    number | undefined
  >(undefined);
  const sidebarRef = useRef<HTMLElement>(null);

  const resizeSidbarContent = useCallback(() => {
    if (sidebarRef.current) {
      const { height, top } = sidebarRef.current.getBoundingClientRect();
      const availableHeight = window.innerHeight - top;
      availableHeight !== height && setSidebarContentHeight(availableHeight);
    } else {
      setSidebarContentHeight(undefined);
    }
  }, []);

  useMount(() => resizeSidbarContent());

  useEffect(() => {
    window.addEventListener("resize", resizeSidbarContent);
    scrollContainerElement?.addEventListener("scroll", resizeSidbarContent);

    return () => {
      window.removeEventListener("resize", resizeSidbarContent);
      scrollContainerElement?.removeEventListener(
        "scroll",
        resizeSidbarContent,
      );
    };
  }, [resizeSidbarContent, scrollContainerElement]);

  const toggleIsOpen = (isOpen: boolean) =>
    setSearchFormState((prev) => ({ ...prev, isOpen }));

  const modalProps = (tabName: SearchFormTab): PlantSearchFormProps => ({
    renderMode: "modal",
    isOpen: isOpen && tab === tabName,
    onClose: () => toggleIsOpen(false),
  });

  return isSmallScreen() ? (
    <>
      <PlantLocationForm {...modalProps("location")} />
      <PlantNameForm {...modalProps("plant-name")} />
      <PlantFiltersForm {...modalProps("filters")} />
    </>
  ) : (
    <Sidebar
      ref={sidebarRef}
      isExpanded={isOpen}
      setIsExpanded={toggleIsOpen}
      externalCollapseButton
      className={(isExpanded) =>
        classNames("sticky top-header-2 h-dvh-header-2 border-r", {
          "w-md [&_.sidebar-button]:bg-accent": isExpanded,
          "overflow-hidden": !isExpanded,
        })
      }
      // style={{ height: sidebarHeight }}
    >
      {({ isExpanded }) => (
        <div
          className={classNames(
            "w-md h-full flex flex-col gap-4 p-4 pr-5 transition-[height,_opacity]",
            hasCurrentResults && {
              "opacity-100 delay-150": isExpanded,
              "opacity-0": !isExpanded,
            },
          )}
          style={{ height: sidebarContentHeight }}
        >
          {formComponents[tab]}
        </div>
      )}
    </Sidebar>
  );
};

export default PlantSearchForm;
