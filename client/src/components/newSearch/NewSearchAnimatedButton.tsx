import PlantAnimation from "components/PlantAnimation";
import { useAppContext } from "contexts/AppContext";
import { useSearchParamsContext } from "contexts/searchParams/SearchParamsContext";
import Button from "designSystem/Button";
import { motion, useAnimation } from "motion/react";
import {
  HTMLAttributes,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const DEFAULT_ANIMATION_CONTAINER_STYLE: HTMLAttributes<HTMLDivElement>["style"] =
  { position: "static", translate: "unset" };
const ANIMATION_GAP = 30;
const SIDEBAR_WIDTH = 260;

const NewSearchAnimatedButton = ({
  paramsContainerRef,
}: {
  paramsContainerRef: RefObject<HTMLDivElement | null>;
}) => {
  const animation = useAnimation();

  const { sidebarExpanded } = useAppContext();
  const { searchParamsDraft, applySearchParams } = useSearchParamsContext();

  const animationRef = useRef<HTMLDivElement>(null);
  const [animationContainerStyle, setAnimationContainerStyle] = useState(
    DEFAULT_ANIMATION_CONTAINER_STYLE,
  );
  const initialSidebarExpanded = useRef(sidebarExpanded);
  const [resizeWithSidebar, setResizeWithSidebar] = useState(false);

  const paramValues = JSON.stringify(searchParamsDraft);

  useEffect(() => {
    paramValues !== "{}" &&
      animation.start({
        x: ["-100%", "200%"],
        opacity: [0, 1, 1, 0],
      });
  }, [animation, paramValues]);

  useEffect(() => {
    if (initialSidebarExpanded.current !== sidebarExpanded) {
      setResizeWithSidebar(true);
    }
  }, [sidebarExpanded]);

  const updateContainerStyle = useCallback(() => {
    if (!animationRef.current || !paramsContainerRef.current) {
      setAnimationContainerStyle(DEFAULT_ANIMATION_CONTAINER_STYLE);
    } else {
      const leftOffset =
        paramsContainerRef.current.offsetLeft +
        paramsContainerRef.current.clientWidth +
        ANIMATION_GAP;

      console.log(leftOffset);

      const availSpace = window.innerWidth - leftOffset;
      const animationWidth = animationRef.current.clientWidth;

      if (availSpace - ANIMATION_GAP < animationWidth) {
        setAnimationContainerStyle(DEFAULT_ANIMATION_CONTAINER_STYLE);
      } else {
        setAnimationContainerStyle({
          left: leftOffset + (Math.min(availSpace, 1000) - animationWidth) / 2,
          transition: "left 300ms ease",
        });
      }
    }
  }, [paramsContainerRef]);

  useLayoutEffect(() => {
    updateContainerStyle();
    window.addEventListener("resize", updateContainerStyle);

    return () => window.removeEventListener("resize", updateContainerStyle);
  }, [updateContainerStyle]);

  useLayoutEffect(() => {
    const calcNewStyle = (prevStyle: React.CSSProperties) => {
      if (animationRef.current && prevStyle.left && Number(prevStyle.left)) {
        const leftOffset =
          Number(prevStyle.left) + (sidebarExpanded ? 1 : -1) * SIDEBAR_WIDTH;

        if (
          leftOffset + animationRef.current.clientWidth <
          window.innerWidth - ANIMATION_GAP
        ) {
          return {
            ...prevStyle,
            left:
              Number(prevStyle.left) +
              (sidebarExpanded ? 1 : -1) * SIDEBAR_WIDTH,
          };
        }
      }

      // Try to reset back to default position after sidebar is finished animating
      setTimeout(() => {
        updateContainerStyle();
      }, 500);

      return DEFAULT_ANIMATION_CONTAINER_STYLE;
    };

    resizeWithSidebar && setAnimationContainerStyle(calcNewStyle);
  }, [sidebarExpanded, resizeWithSidebar, updateContainerStyle]);

  return (
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
          onClick={() => applySearchParams(searchParamsDraft)}
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
  );
};

export default NewSearchAnimatedButton;
