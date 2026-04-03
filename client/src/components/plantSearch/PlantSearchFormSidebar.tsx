import classNames from "classnames";
import PlantLocationForm from "components/plantDataControls/plantLocation/PlantLocationForm";
import PlantNameForm from "components/plantDataControls/plantName/PlantNameForm";
import {
  SearchFormTab,
  usePlantSearchContext,
} from "contexts/plantSearch/PlantSearchContext";
import { useSearchParamsContext } from "contexts/searchParams/SearchParamsContext";
import Modal from "designSystem/Modal";
import Sidebar from "designSystem/Sidebar";
import { useGetScrollContainer } from "hooks/useGetScrollContainer";
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMount } from "react-use";
import { Entries } from "type-fest";
import { isSmallScreen } from "util/generalUtil";
import PlantFilterForm from "../plantDataControls/plantFilters/PlantFilterForm";
import {
  PLANT_FORM_TITLES,
  PlantSearchFormProps,
} from "../plantDataControls/plantSearchFormUtil";

const PLANT_FORM_COMPONENTS: Record<
  SearchFormTab,
  FunctionComponent<PlantSearchFormProps>
> = {
  location: PlantLocationForm,
  "plant-name": PlantNameForm,
  filters: PlantFilterForm,
};

const PlantSearchForm = () => {
  const { searchParams, updateSearchParamsDraft } = useSearchParamsContext();
  const {
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

  const toggleIsOpen = (isOpen: boolean = false) =>
    setSearchFormState((prev) => ({ ...prev, isOpen }));

  const searchFormProps: PlantSearchFormProps = {
    renderMode: isSmallScreen() ? "modal" : "card",
    onClose: () => toggleIsOpen(),
  };

  return searchFormProps.renderMode === "modal" ? (
    (
      Object.entries(PLANT_FORM_COMPONENTS) as Entries<
        typeof PLANT_FORM_COMPONENTS
      >
    ).map(([tabName, Component]) => {
      const modalIsOpen = isOpen && tab === tabName;

      return (
        <Modal
          key={tabName}
          title={PLANT_FORM_TITLES[tabName]}
          isOpen={modalIsOpen}
          onClose={() => {
            updateSearchParamsDraft(searchParams);
            toggleIsOpen();
          }}
        >
          {modalIsOpen && <Component {...searchFormProps} />}
        </Modal>
      );
    })
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
    >
      {({ isExpanded }) => {
        const Component = PLANT_FORM_COMPONENTS[tab];

        return (
          <div
            className={classNames("w-md h-full flex flex-col gap-4 p-4 pr-5", {
              "opacity-100 w-md": isExpanded,
              "opacity-0 w-0! pointer-events-none": !isExpanded,
            })}
            style={{
              height: sidebarContentHeight,
              transition: `height 150ms, opacity 150ms ${isExpanded ? "200ms" : "0ms"}, width 1ms ${isExpanded ? "0ms" : "200ms"}`,
            }}
          >
            <Component {...searchFormProps} />
          </div>
        );
      }}
    </Sidebar>
  );
};

export default PlantSearchForm;
