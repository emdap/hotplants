import { HTMLProps } from "react";

const Form = ({ onSubmit, ...props }: HTMLProps<HTMLFormElement>) => (
  <form
    onSubmit={
      onSubmit &&
      ((e) => {
        e.preventDefault();
        onSubmit(e);
      })
    }
    {...props}
  />
);

export default Form;
