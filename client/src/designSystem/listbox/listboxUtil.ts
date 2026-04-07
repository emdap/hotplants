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

export const getOptionLabelDict = (
  options: (string | ComplexListboxOption)[],
) =>
  options.reduce<Record<string, string>>((prev, cur) => {
    if (typeof cur === "string") {
      prev[cur] = cur;
    } else {
      prev[String(cur.value)] = cur.label;
    }
    return prev;
  }, {});
