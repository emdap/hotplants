import { Link } from "@tanstack/react-router";
import Button from "designSystem/Button";
import { ExternalToast, toast } from "sonner";

const DEFAULT_ERROR_MESSAGE = "Something went wrong, please try again.";

export const defaultWarningToast = (props?: ExternalToast) =>
  toast.warning(DEFAULT_ERROR_MESSAGE, props);

export const defaultErrorToast = (props?: ExternalToast) =>
  toast.error(DEFAULT_ERROR_MESSAGE, props);

export const needsAuthenticationToast = () =>
  toast.warning(
    <span className="flex gap-2 items-center">
      Account required!{" "}
      <Link to="/login">
        <Button variant="text" size="flush">
          Click here to log in.
        </Button>
      </Link>
    </span>,
  );
