import { ExternalToast, toast } from "sonner";

const DEFAULT_ERROR_MESSAGE = "Something went wrong, please try again.";

export const defaultWarningToast = (props?: ExternalToast) =>
  toast.warning(DEFAULT_ERROR_MESSAGE, props);

export const defaultErrorToast = (props?: ExternalToast) =>
  toast.error(DEFAULT_ERROR_MESSAGE, props);
