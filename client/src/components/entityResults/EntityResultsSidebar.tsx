import classNames from "classnames";
import EntityNameForm from "components/entityForms/entityName/EntityNameForm";
import EntityLocationForm from "components/entityForms/location/LocationForm";
import {
  SearchFormTab,
  useEntitySearchContext,
} from "contexts/entitySearch/EntitySearchContext";
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
import EntityFilterForm from "../entityForms/entityFilters/EntityFilterForm";
import { EntityFormProps, getFormTitle } from "../entityForms/entityFormUtil";

const Entity_FORM_COMPONENTS: Record<
  SearchFormTab,
  FunctionComponent<EntityFormProps>
> = {
  location: EntityLocationForm,
  "entity-name": EntityNameForm,
  filters: EntityFilterForm,
};

const EntityResultsSidebar = () => {
  const { searchParams, updateSearchParamsDraft } = useSearchParamsContext();
  const {
    searchFormState: { tab, isOpen },
    setSearchFormState,
  } = useEntitySearchContext();
  const { scrollContainerElement } = useGetScrollContainer();

  const [sidebarContentHeight, setSidebarContentHeight] = useState<
    number | undefined
  >(undefined);
  const sidebarRef = useRef<HTMLElement>(null);

  const resizeSidebarContent = useCallback(() => {
    if (sidebarRef.current) {
      const { top } = sidebarRef.current.getBoundingClientRect();
      setSidebarContentHeight(window.innerHeight - top);
    } else {
      setSidebarContentHeight(undefined);
    }
  }, []);

  useMount(() => resizeSidebarContent());

  useEffect(() => {
    window.addEventListener("resize", resizeSidebarContent);
    scrollContainerElement?.addEventListener("scroll", resizeSidebarContent);

    return () => {
      window.removeEventListener("resize", resizeSidebarContent);
      scrollContainerElement?.removeEventListener(
        "scroll",
        resizeSidebarContent,
      );
    };
  }, [resizeSidebarContent, scrollContainerElement]);

  const toggleIsOpen = (isOpen: boolean = false) =>
    setSearchFormState((prev) => ({ ...prev, isOpen }));

  const searchFormProps: EntityFormProps = {
    renderMode: isSmallScreen() ? "modal" : "card",
    onClose: () => toggleIsOpen(),
  };

  return searchFormProps.renderMode === "modal" ? (
    (
      Object.entries(Entity_FORM_COMPONENTS) as Entries<
        typeof Entity_FORM_COMPONENTS
      >
    ).map(([tabName, Component]) => {
      const modalIsOpen = isOpen && tab === tabName;

      return (
        <Modal
          key={tabName}
          title={getFormTitle(tabName, searchParams.entityType)}
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
        const Component = Entity_FORM_COMPONENTS[tab];

        return (
          <div
            className={classNames("flex flex-col gap-4 p-4 pr-5", {
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

export default EntityResultsSidebar;
