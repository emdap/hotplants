import classNames from "classnames";
import FilterInputField from "components/plantSearch/plantFilters/FilterInputField";
import PlantSearchFormFooter from "components/plantSearch/PlantSearchFormFooter";
import {
  DEFAULT_PLANT_NAME_FIELDS,
  PLANT_FORM_TITLES,
  PLANT_NAME_FIELDS,
  PlantSearchFormProps,
} from "components/plantSearch/plantSearchFormUtil";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Card from "designSystem/Card";
import Form from "designSystem/Form";
import Modal from "designSystem/Modal";
import { isEqual } from "lodash";
import { Fragment, useEffect, useState } from "react";
import { OptionalSearchParamKey, PlantNameParam } from "util/customSchemaTypes";

const PlantNameForm = ({ renderMode, ...modalProps }: PlantSearchFormProps) => {
  const {
    searchParams: { plantName },
    updateSearchParamsDraft,
    applySearchParams,
  } = usePlantSearchContext();

  const { commonName, scientificName } = {
    scientificName: undefined,
    commonName: undefined,
    ...plantName,
  };

  const [plantNameSearch, setPlantNameSearch] = useState({
    scientificName,
    commonName,
  });

  useEffect(() => {
    setPlantNameSearch({ scientificName, commonName });
  }, [scientificName, commonName]);

  const updatePlantNameSearch = (
    key: OptionalSearchParamKey,
    value?: string | null,
  ) => {
    if (value) {
      const newParam = { [key]: value } as PlantNameParam;
      setPlantNameSearch({ ...DEFAULT_PLANT_NAME_FIELDS, ...newParam });
      updateSearchParamsDraft({ plantName: newParam });
    } else {
      setPlantNameSearch(DEFAULT_PLANT_NAME_FIELDS);
      updateSearchParamsDraft({ plantName: undefined });
    }
  };

  const clearPlantNameSearch = () => {
    setPlantNameSearch(DEFAULT_PLANT_NAME_FIELDS);
    applySearchParams({ plantName: undefined });
  };

  const plantNameFooter = (
    <PlantSearchFormFooter
      submitButtonProps={{
        disabled: isEqual({ commonName, scientificName }, plantNameSearch),
        onClick: () => applySearchParams(),
      }}
      clearButtonProps={{
        disabled: isEqual(
          { scientificName, commonName },
          DEFAULT_PLANT_NAME_FIELDS,
        ),
        onClick: clearPlantNameSearch,
      }}
    />
  );

  const plantNameFields = (
    <div
      className={classNames("flex flex-col items-center", {
        "px-4 overflow-auto": renderMode === "modal",
      })}
    >
      {renderMode === "card" && <h2>{PLANT_FORM_TITLES["plant-name"]}</h2>}

      <div className="my-4 min-h-min w-full max-w-[400px]">
        {PLANT_NAME_FIELDS.map((field, index) => (
          <Fragment key={index}>
            <FilterInputField<"text">
              filterInput={field}
              value={plantNameSearch[field.plantDataKey] ?? ""}
              onChange={(value) =>
                updatePlantNameSearch(field.plantDataKey, String(value ?? ""))
              }
            />
            {index === 0 && (
              <p className="text-center mt-2 opacity-50">
                {"\u2013"} or {"\u2013"}
              </p>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );

  return renderMode === "card" ? (
    // TODO: Repeat form/styling/pattern with other 'Plant...Form' components
    <Form
      className="flex flex-col overflow-hidden gap-4"
      onSubmit={() => applySearchParams()}
    >
      <Card className="overflow-auto">{plantNameFields}</Card>
      {plantNameFooter}
    </Form>
  ) : (
    <Modal title={PLANT_FORM_TITLES["plant-name"]} {...modalProps}>
      <Form
        className="flex flex-col overflow-hidden gap-4"
        onSubmit={() => applySearchParams()}
      >
        {plantNameFields}
        {plantNameFooter}
      </Form>
    </Modal>
  );
};

export default PlantNameForm;
