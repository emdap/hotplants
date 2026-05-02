import { isSmallScreen } from "util/generalUtil";
import { SearchFormState } from "./EntitySearchContext";

export const DEFAULT_SEARCH_FORM_STATE = (): SearchFormState => ({
  tab: "location",
  isOpen: !isSmallScreen(),
});
