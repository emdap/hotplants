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
  console.log();

  return (
    <Component
      size="small"
      className={classNames({
        "outline-2 outline-offset-2": isOpen,
        "bg-accent/50! enabled:hover:bg-accent/80! outline-accent!": hasChanges,
        "outline-white/20!": !props.active && !hasChanges,
      })}
      {...props}
    />
  );
};

export default PlantFormOpenButton;
