import Button, { ButtonProps } from "components/designSystem/Button";
import { MouseEvent, useState } from "react";
import { useAuthSession } from "util/authClient";

const AuthLoadingSubmitButton = <T extends object | void>({
  onClick,
  ...props
}: ButtonProps & {
  onClick: (e: MouseEvent) => Promise<T>;
}) => {
  // Checking authSession's state isn't actually useful right now, but leaving here
  // just in case?
  const authSession = useAuthSession();
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: MouseEvent) => {
    setLoading(true);
    try {
      await onClick(e);
    } catch (e) {
      console.error(e);
      // TODO: Add error toast :)
    }
    setLoading(false);
  };

  return (
    <Button
      {...props}
      onClick={handleClick}
      isLoading={loading || authSession.isPending || authSession.isRefetching}
    />
  );
};

export default AuthLoadingSubmitButton;
