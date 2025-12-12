import Card from "components/designSystem/Card";
import { ReactNode } from "react";

const AuthFormCard = ({ children }: { children: ReactNode }) => (
  <Card className="space-y-10 w-7/8 mt-10 md:w-md">{children}</Card>
);

export default AuthFormCard;
