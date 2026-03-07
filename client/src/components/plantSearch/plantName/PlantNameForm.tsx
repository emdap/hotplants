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
import Modal from "designSystem/Modal";
import { isEqual } from "lodash";
import { Fragment, useEffect, useState } from "react";
import { OptionalSearchParamKey } from "util/customSchemaTypes";

const PlantNameForm = ({ renderMode, ...modalProps }: PlantSearchFormProps) => {
  const { searchParams, updateSearchParamsDraft, applySearchParams } =
    usePlantSearchContext();
  const { scientificName, commonName } = searchParams ?? {};

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
      const newParams = { ...DEFAULT_PLANT_NAME_FIELDS, [key]: value };
      setPlantNameSearch(newParams);
      updateSearchParamsDraft(newParams);
    } else {
      setPlantNameSearch(DEFAULT_PLANT_NAME_FIELDS);
      updateSearchParamsDraft(DEFAULT_PLANT_NAME_FIELDS);
    }
  };

  const clearPlantNameSearch = () => {
    setPlantNameSearch(DEFAULT_PLANT_NAME_FIELDS);
    applySearchParams(DEFAULT_PLANT_NAME_FIELDS);
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
      className={classNames("flex flex-col", {
        "pr-4 overflow-auto": renderMode === "modal",
      })}
    >
      {renderMode === "card" && <h2>{PLANT_FORM_TITLES["plant-name"]}</h2>}

      <div className="my-4 min-h-min">
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
              <p className="text-center">
                {"\u2013"} or {"\u2013"}
              </p>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );

  return renderMode === "card" ? (
    <>
      <Card className="overflow-auto">{plantNameFields}</Card>
      {plantNameFooter}
    </>
  ) : (
    <Modal title={PLANT_FORM_TITLES["plant-name"]} {...modalProps}>
      {plantNameFields}
      {plantNameFooter}
    </Modal>
  );
};

export default PlantNameForm;
