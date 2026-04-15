import classNames from "classnames";
import { OpenEntityFormProps } from "components/entityForms/entityFormUtil";
import IconButton, {
  IconButtonProps,
  IconButtonVariantProps,
} from "designSystem/iconButtons/IconButton";
import { FunctionComponent } from "react";

const EntityFormOpenButton = ({
  isOpen,
  hasChanges,
  CustomIconButton,
  ...props
}: OpenEntityFormProps & {
  CustomIconButton?: FunctionComponent<IconButtonVariantProps>;
} & Omit<IconButtonProps, "className" | "size">) => {
  const Component = CustomIconButton ?? IconButton;

  return (
    <Component
      size="small"
      className={classNames("max-w-fit whitespace-nowrap", {
        "outline-2 outline-offset-2": isOpen,
        "bg-accent/50! enabled:hover:bg-accent/80! outline-accent!": hasChanges,
        "outline-white/20!": !props.active && !hasChanges,
      })}
      {...props}
    />
  );
};

export default EntityFormOpenButton;
