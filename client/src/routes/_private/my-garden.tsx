import { createFileRoute } from "@tanstack/react-router";
import Card from "components/designSystem/Card";
import PageTitle from "components/designSystem/PageTitle";

const MyGarden = () => {
  return (
    <>
      <PageTitle>My Garden</PageTitle>
      <Card>Coming soon :)</Card>
    </>
  );
};

export const Route = createFileRoute("/_private/my-garden")({
  component: MyGarden,
});
