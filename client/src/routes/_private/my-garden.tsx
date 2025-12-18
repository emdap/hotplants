import { createFileRoute } from "@tanstack/react-router";
import Card from "designSystem/Card";
import PageTitle from "designSystem/PageTitle";

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
