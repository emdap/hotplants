import { useNavigate, useSearch } from "@tanstack/react-router";
import Button, { ButtonVariant } from "designSystem/Button";

const ClearPlantFiltersButton = ({
  suffix,
  ...props
}: {
  className?: string;
  variant?: ButtonVariant;
  suffix?: string;
}) => {
  const navigate = useNavigate();
  const { plantFilter } = useSearch({ strict: false });

  const clearFilter = () =>
    navigate({
      to: ".",
      search: ({ plantFilter: _prevFilter, ...prev }) => prev,
      replace: true,
    });

  const filterActive = Boolean(plantFilter);

  return (
    <Button onClick={clearFilter} disabled={!filterActive} {...props}>
      Clear{suffix && ` ${suffix}`}
    </Button>
  );
};

export default ClearPlantFiltersButton;
