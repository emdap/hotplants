import StyledEntityForm from "components/entityForms/StyledEntityForm";
import { useSearchParamsContext } from "contexts/searchParams/SearchParamsContext";
import Card from "designSystem/Card";
import { ComplexListboxOption } from "designSystem/listbox/listboxUtil";
import StyledListbox from "designSystem/listbox/StyledListbox";
import { EntityType } from "generated/graphql/graphql";

const ENTITY_TYPE_OPTIONS: ComplexListboxOption<EntityType>[] = [
  { label: "Plants", value: "plant" },
  { label: "Animals (beta)", value: "animal" },
];

const EntityTypeForm = () => {
  const { searchParamsDraft, updateSearchParamsDraft } =
    useSearchParamsContext();

  return (
    <StyledEntityForm onSubmit={() => null}>
      <Card className="space-y-4">
        <h2 className="text-center">Search type</h2>

        <div className="form-item">
          <label htmlFor="entity-type">Search for</label>
          <StyledListbox
            name="entity-type"
            className="w-full"
            defaultOptions={ENTITY_TYPE_OPTIONS}
            value={searchParamsDraft.entityType}
            onChange={(newEntityType) =>
              updateSearchParamsDraft({
                entityType: newEntityType as EntityType,
              })
            }
          />
        </div>
      </Card>
    </StyledEntityForm>
  );
};

export default EntityTypeForm;
