import { useNavigate } from "@tanstack/react-router";
import PlantAnimation from "components/PlantAnimation";
import PlantLocationForm from "components/plantDataControls/plantLocation/PlantLocationForm";
import PlantNameForm from "components/plantDataControls/plantName/PlantNameForm";
import { useAppContext } from "contexts/AppContext";
import { useSearchParamsContext } from "contexts/searchParams/SearchParamsContext";
import Button from "designSystem/Button";
import PageTitle from "designSystem/PageTitle";
import { motion, useAnimation } from "motion/react";
import {
  HTMLAttributes,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const DEFAULT_ANIMATION_CONTAINER_STYLE: HTMLAttributes<HTMLDivElement>["style"] =
  { position: "static", translate: "unset" };
const ANIMATION_GAP = 30;
const SIDEBAR_WIDTH = 260;

const NewSearch = () => {
  const navigate = useNavigate();
  const animation = useAnimation();

  const { sidebarExpanded } = useAppContext();
  const { searchParamsDraft, applySearchParams } = useSearchParamsContext();

  const paramsContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);
  const [animationContainerStyle, setAnimationContainerStyle] = useState(
    DEFAULT_ANIMATION_CONTAINER_STYLE,
  );

  const paramValues = JSON.stringify(searchParamsDraft);

  useEffect(() => {
    paramValues !== "{}" &&
      animation.start({
        x: ["-100%", "200%"],
        opacity: [0, 1, 1, 0],
      });
  }, [animation, paramValues]);

  useLayoutEffect(() => {
    setAnimationContainerStyle((prev) => {
      if (animationRef.current && prev.left && Number(prev.left)) {
        const leftOffset =
          Number(prev.left) + (sidebarExpanded ? 1 : -1) * SIDEBAR_WIDTH;
        if (
          leftOffset + animationRef.current.clientWidth <
          window.innerWidth - ANIMATION_GAP
        ) {
          return {
            ...prev,
            left:
              Number(prev.left) + (sidebarExpanded ? 1 : -1) * SIDEBAR_WIDTH,
          };
        }
      }

      return DEFAULT_ANIMATION_CONTAINER_STYLE;
    });
  }, [sidebarExpanded]);

  useLayoutEffect(() => {
    const updateContainerStyle = () => {
      if (!animationRef.current || !paramsContainerRef.current) {
        setAnimationContainerStyle(DEFAULT_ANIMATION_CONTAINER_STYLE);
      } else {
        const leftOffset =
          paramsContainerRef.current.offsetLeft +
          paramsContainerRef.current.clientWidth +
          ANIMATION_GAP;

        const availSpace = window.innerWidth - leftOffset;
        const animationWidth = animationRef.current.clientWidth;

        if (availSpace - ANIMATION_GAP < animationWidth) {
          setAnimationContainerStyle(DEFAULT_ANIMATION_CONTAINER_STYLE);
        } else {
          setAnimationContainerStyle({
            right: 10,
            left:
              leftOffset + (Math.min(availSpace, 1000) - animationWidth) / 2,
            transition: "left 300ms ease",
          });
        }
      }
    };

    updateContainerStyle();
    window.addEventListener("resize", updateContainerStyle);

    return () => window.removeEventListener("resize", updateContainerStyle);
  }, []);

  const submitParams = () => {
    searchParamsDraft
      ? applySearchParams(searchParamsDraft)
      : navigate({ to: "/browse-plants" });
  };

  return (
    <main className="page-buffer page-container md:max-w-page">
      <PageTitle>New Search</PageTitle>
      <div
        ref={paramsContainerRef}
        className="space-y-4 md:w-[450px] lg:w-[500px]"
      >
        <PlantLocationForm renderMode="card" hideFooter />
        <PlantNameForm renderMode="card" hideFooter />
      </div>
      <div
        style={animationContainerStyle}
        className="flex flex-col items-center justify-center max-md:w-full! small-screen:w-[450px] small-screen:my-8 big-screen:fixed big-screen:translate-y-1/2"
      >
        <div ref={animationRef} className="max-w-fit space-y-6">
          <PlantAnimation
            customNoDataMessage="All fields are optional"
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
    </main>
  );
};

export default NewSearch;
