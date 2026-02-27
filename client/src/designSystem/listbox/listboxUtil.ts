export type ListboxValueType = string | boolean | number | null;

export type ComplexListboxOption<T = ListboxValueType> = {
  label: string;
  value: T;
};

export const getOptionValuesArray = (
  options: (string | ComplexListboxOption)[],
) => options.map((value) => (typeof value === "string" ? value : value.value));

export const getComplexOptionArray = (
  options: (string | ComplexListboxOption)[],
) =>
  options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt,
  );
