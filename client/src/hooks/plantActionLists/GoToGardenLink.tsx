import { Link } from "@tanstack/react-router";
import Button from "designSystem/Button";
import { MdArrowRightAlt } from "react-icons/md";

const GoToGardenLink = ({ gardenName }: { gardenName?: string }) =>
  gardenName && (
    <Link
      to="/gardens/$gardenName"
      params={{ gardenName }}
      className="w-fit block mt-3"
    >
      <Button variant="text" size="small" className="border text-xs!">
        Go to garden <MdArrowRightAlt />
      </Button>
    </Link>
  );

export default GoToGardenLink;
