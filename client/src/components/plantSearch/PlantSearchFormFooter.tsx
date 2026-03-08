import Button, { ButtonProps } from "designSystem/Button";

const PROP_KEYS = ["submitButtonProps", "clearButtonProps"] as const;

const PlantSearchFormFooter = (props: {
  [key in (typeof PROP_KEYS)[number]]?: ButtonProps;
}) => (
  <footer className="flex gap-2 items-center">
    {PROP_KEYS.map((key) => {
      if (props[key]) {
        const defaultProps: ButtonProps =
          key === "submitButtonProps"
            ? { variant: "primary", children: "Search" }
            : { variant: "accent", children: "Clear", type: "button" };

        return (
          <Button
            className="grow"
            key={key}
            {...defaultProps}
            {...props[key]}
          />
        );
      }
    })}
  </footer>
);

export default PlantSearchFormFooter;
