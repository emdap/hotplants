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
      className={classNames(
        "max-w-fit whitespace-nowrap outline-none",
        isOpen && {
          "bg-accent/80!": hasChanges,
          "bg-primary-dark! dark:bg-primary!": props.active && !hasChanges,
          "bg-white/20": !props.active && !hasChanges,
        },

        {
          "shadow-sm": isOpen,
          "bg-accent/50! enabled:hover:bg-accent/80!": hasChanges,
        },
      )}
      {...props}
    />
  );
};

export default EntityFormOpenButton;
