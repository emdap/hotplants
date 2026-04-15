import classNames from "classnames";
import Form from "designSystem/Form";
import { HTMLProps } from "react";

const StyledEntityForm = ({
  className,
  ...props
}: HTMLProps<HTMLFormElement>) => (
  <Form
    className={classNames("flex flex-col gap-4 overflow-hidden", className)}
    {...props}
  />
);

export default StyledEntityForm;
