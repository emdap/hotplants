import EntityNameForm from "components/entityForms/entityName/EntityNameForm";
import EntityLocationForm from "components/entityForms/location/LocationForm";
import EntityTypeForm from "components/newSearch/EntityTypeForm";
import NewSearchAnimatedButton from "components/newSearch/NewSearchAnimatedButton";
import PageTitle from "designSystem/PageTitle";
import { useRef } from "react";

const NewSearch = () => {
  const paramsContainerRef = useRef<HTMLDivElement>(null);

  return (
    <main className="page-buffer page-container md:max-w-page">
      <PageTitle>New Search</PageTitle>
      <div
        ref={paramsContainerRef}
        className="space-y-4 md:w-[450px] lg:w-[500px]"
      >
        <EntityLocationForm renderMode="card" hideFooter />
        <EntityTypeForm />
        <EntityNameForm renderMode="card" hideFooter />
      </div>
      <NewSearchAnimatedButton paramsContainerRef={paramsContainerRef} />
    </main>
  );
};

export default NewSearch;
