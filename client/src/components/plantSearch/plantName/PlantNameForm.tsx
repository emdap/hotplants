import classNames from "classnames";
import FilterInput from "components/dataControls/FilterInputField";
import PlantSearchFormFooter from "components/plantSearch/PlantSearchFormFooter";
import {
  DEFAULT_PLANT_NAME_FIELDS,
  PLANT_FORM_TITLES,
  PLANT_NAME_FIELDS,
  PlantSearchFormProps,
} from "components/plantSearch/plantSearchFormUtil";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Card from "designSystem/Card";
import { isEqual } from "lodash";
import { Fragment, useEffect, useState } from "react";
import { OptionalSearchParamKey, PlantNameParam } from "util/customSchemaTypes";
import StyledPlantForm from "../StyledPlantForm";

const PlantNameForm = ({ renderMode, onClose }: PlantSearchFormProps) => {
  const {
    searchParams: { plantName: appliedPlantName },
    searchParamsDraft,
    updateSearchParamsDraft,
    applySearchParams,
  } = usePlantSearchContext();

  const { commonName, scientificName } = {
    scientificName: undefined,
    commonName: undefined,
    ...searchParamsDraft?.plantName,
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

  const submitPlantName = () => {
    applySearchParams({ plantName: searchParamsDraft?.plantName });
    renderMode === "modal" && onClose();
  };

  const plantNameFooter = (
    <PlantSearchFormFooter
      submitButtonProps={{
        disabled:
          (!commonName && !scientificName && !appliedPlantName) ||
          isEqual({ commonName }, appliedPlantName) ||
          isEqual({ scientificName }, appliedPlantName),
        onClick: submitPlantName,
      }}
      clearButtonProps={{
        disabled: isEqual(
          { scientificName, commonName },
          DEFAULT_PLANT_NAME_FIELDS,
        ),
        onClick: () => {
          updateSearchParamsDraft({ plantName: undefined });
          setPlantNameSearch(DEFAULT_PLANT_NAME_FIELDS);
        },
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
            <FilterInput<"text">
              filterInput={field}
              value={plantNameSearch[field.dataKey] ?? ""}
              onChange={(value) =>
                updatePlantNameSearch(field.dataKey, String(value ?? ""))
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

  return (
    <StyledPlantForm onSubmit={submitPlantName}>
      {renderMode === "card" ? (
        <>
          <Card className="overflow-auto">{plantNameFields}</Card>
          {plantNameFooter}
        </>
      ) : (
        <>
          {plantNameFields}
          {plantNameFooter}
        </>
      )}
    </StyledPlantForm>
  );
};

export default PlantNameForm;
