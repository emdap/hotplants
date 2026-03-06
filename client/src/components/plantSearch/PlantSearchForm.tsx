import classNames from "classnames";
import PlantLocationForm from "components/plantSearch/plantLocation/PlantLocationForm";
import PlantNameForm from "components/plantSearch/plantName/PlantNameForm";
import {
  SearchFormTab,
  usePlantSearchContext,
} from "contexts/plantSearch/PlantSearchContext";
import Sidebar from "designSystem/Sidebar";
import { ReactElement } from "react";
import { isSmallScreen } from "util/generalUtil";
import PlantFiltersForm from "./plantFilters/PlantFilterForm";
import { PlantSearchFormProps } from "./plantSearchFormUtil";

const formComponents: Record<SearchFormTab, ReactElement> = {
  location: <PlantLocationForm renderMode="card" />,
  "plant-name": <PlantNameForm renderMode="card" />,
  filters: <PlantFiltersForm renderMode="card" />,
};

const PlantSearchForm = ({
  asSidebar,
  className,
}: {
  asSidebar?: boolean;
  className?: string;
}) => {
  const {
    hasCurrentResults,
    searchFormState: { tab, isOpen },
    setSearchFormState,
  } = usePlantSearchContext();

  const asModal = asSidebar && isSmallScreen();

  const toggleIsOpen = (isOpen: boolean) =>
    setSearchFormState((prev) => ({ ...prev, isOpen }));

  const modalProps = (tabName: SearchFormTab): PlantSearchFormProps => ({
    renderMode: "modal",
    isOpen: isOpen && tab === tabName,
    onClose: () => toggleIsOpen(false),
  });

  return asModal ? (
    <>
      <PlantLocationForm {...modalProps("location")} />
      <PlantNameForm {...modalProps("plant-name")} />
      <PlantFiltersForm {...modalProps("filters")} />
    </>
  ) : asSidebar ? (
    <Sidebar
      isExpanded={isOpen}
      setIsExpanded={toggleIsOpen}
      externalCollapseButton
      className={(isExpanded) =>
        classNames({
          "sticky top-header-2 h-dvh-header-2 border-r": hasCurrentResults,
          "h-max": !hasCurrentResults,

          "w-md [&_.sidebar-button]:bg-accent": isExpanded,
          "overflow-hidden": !isExpanded,
        })
      }
    >
      {({ isExpanded }) => (
        <div
          className={classNames(
            "w-md h-full flex flex-col gap-4 p-4 pr-5 transition-opacity",
            hasCurrentResults && {
              "opacity-100 delay-150": isExpanded,
              "opacity-0": !isExpanded,
            },
          )}
        >
          {formComponents[tab]}
        </div>
      )}
    </Sidebar>
  ) : (
    <div className={className}>
      <PlantLocationForm renderMode="card" />
    </div>
  );
};

export default PlantSearchForm;
