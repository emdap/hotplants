import classNames from "classnames";
import FilterInput from "components/dataControls/FilterInputField";
import EntityFormFooter from "components/entityForms/EntityFormFooter";
import {
  DEFAULT_ENTITY_NAME_FIELDS,
  ENTITY_NAME_FIELDS,
  EntityFormProps,
  getFormTitle,
} from "components/entityForms/entityFormUtil";
import { OptionalSearchParamKey, PlantNameParam } from "config/hotplantsConfig";
import { useSearchParamsContext } from "contexts/searchParams/SearchParamsContext";
import Card from "designSystem/Card";
import { isEqual } from "lodash";
import { Fragment, useEffect, useState } from "react";
import StyledEntityForm from "../StyledEntityForm";

const EntityNameForm = ({
  renderMode,
  hideFooter,
  onClose,
  onSubmit,
}: EntityFormProps) => {
  const {
    searchParams: { entityName: appliedPlantName, entityType },
    searchParamsDraft,
    updateSearchParamsDraft,
    applySearchParams,
  } = useSearchParamsContext();

  const { commonName, scientificName } = {
    scientificName: undefined,
    commonName: undefined,
    ...searchParamsDraft?.entityName,
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
      setPlantNameSearch({ ...DEFAULT_ENTITY_NAME_FIELDS, ...newParam });
      updateSearchParamsDraft({ entityName: newParam });
    } else {
      setPlantNameSearch(DEFAULT_ENTITY_NAME_FIELDS);
      updateSearchParamsDraft({ entityName: undefined });
    }
  };

  const submitName = () => {
    if (onSubmit) {
      onSubmit();
      return;
    }

    applySearchParams({ entityName: searchParamsDraft?.entityName });
    renderMode === "modal" && onClose();
  };

  const formFooter = hideFooter ? null : (
    <EntityFormFooter
      submitButtonProps={{
        disabled:
          (!commonName && !scientificName && !appliedPlantName) ||
          isEqual({ commonName }, appliedPlantName) ||
          isEqual({ scientificName }, appliedPlantName),
        onClick: submitName,
      }}
      clearButtonProps={{
        disabled: isEqual(
          { scientificName, commonName },
          DEFAULT_ENTITY_NAME_FIELDS,
        ),
        onClick: () => {
          updateSearchParamsDraft({ entityName: undefined });
          setPlantNameSearch(DEFAULT_ENTITY_NAME_FIELDS);
        },
      }}
    />
  );

  const formBody = (
    <div
      className={classNames("flex flex-col items-center", {
        "px-4 overflow-auto": renderMode === "modal",
      })}
    >
      {renderMode === "card" && (
        <h2>{getFormTitle("entity-name", entityType)}</h2>
      )}

      <div className="my-4 min-h-min w-full max-w-[400px]">
        {ENTITY_NAME_FIELDS.map((field, index) => (
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
    <StyledEntityForm onSubmit={submitName}>
      {renderMode === "card" ? (
        <>
          <Card className="overflow-auto">{formBody}</Card>
          {formFooter}
        </>
      ) : (
        <>
          {formBody}
          {formFooter}
        </>
      )}
    </StyledEntityForm>
  );
};

export default EntityNameForm;
