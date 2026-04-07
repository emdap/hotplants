import classNames from "classnames";
import { OpenPlantFormProps } from "components/plantDataControls/plantSearchFormUtil";
import IconButton, {
  IconButtonProps,
  IconButtonVariantProps,
} from "designSystem/iconButtons/IconButton";
import { FunctionComponent } from "react";

const PlantFormOpenButton = ({
  isOpen,
  hasChanges,
  CustomIconButton,
  ...props
}: OpenPlantFormProps & {
  CustomIconButton?: FunctionComponent<IconButtonVariantProps>;
} & Omit<IconButtonProps, "className" | "size">) => {
  const Component = CustomIconButton ?? IconButton;

  return (
    <Component
      size="small"
      className={classNames({
        "bg-accent/30": hasChanges,
        "outline-primary! dark:outline-primary-dark! outline-2 outline-offset-2":
          isOpen,
      })}
      {...props}
    />
  );
};

export default PlantFormOpenButton;
