import { useNavigate } from "@tanstack/react-router";
import PlantAnimation from "components/PlantAnimation";
import PlantLocationForm from "components/plantDataControls/plantLocation/PlantLocationForm";
import PlantNameForm from "components/plantDataControls/plantName/PlantNameForm";
import { useSearchParamsContext } from "contexts/searchParams/SearchParamsContext";
import Button from "designSystem/Button";
import PageTitle from "designSystem/PageTitle";
import { motion, useAnimation } from "motion/react";
import { useEffect } from "react";

const NewSearch = () => {
  const navigate = useNavigate();
  const animation = useAnimation();
  const { searchParamsDraft, applySearchParams } = useSearchParamsContext();

  const paramValues = JSON.stringify(searchParamsDraft);

  useEffect(() => {
    paramValues !== "{}" &&
      animation.start({
        x: ["-100%", "200%"],
        opacity: [0, 1, 1, 0],
      });
  }, [animation, paramValues]);

  const submitParams = () => {
    searchParamsDraft
      ? applySearchParams(searchParamsDraft)
      : navigate({ to: "/browse-plants" });
  };

  return (
    <main className="page-buffer page-container md:max-w-page">
      <PageTitle>New Search</PageTitle>
      <div className="md:grid md:grid-cols-[450px_auto] lg:grid-cols-[500px_auto] gap-4">
        <div className="space-y-4">
          <PlantLocationForm renderMode="card" hideFooter />
          <PlantNameForm renderMode="card" hideFooter />
        </div>
        <div className="flex flex-col items-center justify-center max-md:my-8">
          <div className="max-w-fit space-y-6">
            <PlantAnimation
              customMessage="All fields are optional"
              className="max-h-fit"
            />
            <Button
              className="w-full relative overflow-hidden"
              onClick={submitParams}
            >
              <motion.span
                animate={animation}
                initial={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute h-full w-2/5 left-0 pointer-events-none
               bg-linear-115 from-transparent from-20% via-pink-200/60 via-50% to-transparent to-80%"
              />
              Search
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewSearch;
