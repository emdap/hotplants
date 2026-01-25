import MapProvider from "components/interactiveMap/MapProvider";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import {
  mergeMotionProps,
  MOTION_FADE_IN,
} from "designSystem/motionTransitions";
import { useCloseOnEscape } from "hooks/useCloseOnEscape";
import { useDisableHtmlScroll } from "hooks/useDisableHtmlScroll";
import { AnimatePresence } from "motion/react";
import { Fragment, useMemo, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";
import { useSwipeable } from "react-swipeable";
import { useClickAway } from "react-use";
import { getPlantDisplayName, ITERATE_DIRECTION } from "util/generalUtil";
import PlantImageViewer from "../plantImages/PlantImageViewer";
import PlantInfoCard from "../plantResults/PlantInfoCard";

const CARD_SLIDE_IN = mergeMotionProps(MOTION_FADE_IN, {
  initial: { right: "-100%" },
  animate: { right: 0 },
  exit: { right: "-100%" },
});

const ActivePlantPane = () => {
  const { searchParams } = usePlantSearchContext();
  const {
    plantList,
    activePlantIndex,
    setActivePlantIndex,
    setActiveMediaIndex,
  } = usePlantSelectionContext();

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const isTouchingMap = useRef(false);

  const { activePlant, typesafeActiveIndex } = useMemo(
    () => ({
      activePlant:
        (activePlantIndex !== null && plantList[activePlantIndex]) ?? null,
      typesafeActiveIndex: activePlantIndex ?? 0,
    }),
    [plantList, activePlantIndex],
  );

  const resetActivePlant = () => {
    setActivePlantIndex(null);
    setActiveMediaIndex(0);
  };

  useCloseOnEscape(resetActivePlant, !!activePlant && !imageModalOpen);
  useDisableHtmlScroll(Boolean(activePlant));
  const swipeHandlers = useSwipeable({
    onSwipedRight: () => !isTouchingMap.current && resetActivePlant(),
  });

  const paneRef = useRef<HTMLDivElement>(null);

  const refPassthrough = (el: HTMLDivElement) => {
    swipeHandlers.ref(el);
    paneRef.current = el;
  };

  useClickAway(paneRef, () => !imageModalOpen && resetActivePlant(), [
    "mouseup",
  ]);

  const disableIterate = useMemo(
    () => ({
      next: typesafeActiveIndex === plantList.length - 1,
      prev: !typesafeActiveIndex,
    }),
    [typesafeActiveIndex, plantList.length],
  );

  const iteratePlant = (direction: "prev" | "next") => {
    setActiveMediaIndex(0);
    setActivePlantIndex(
      typesafeActiveIndex + (direction === "prev" ? -1 : 1) * 1,
    );
  };

  return (
    <AnimatePresence>
      {activePlant && (
        <Card
          key="plant-pane"
          className="backdrop-blur-2xl small-screen:rounded-l-none rounded-r-none h-full small-screen:w-full fixed top-0 big-screen:w-4/7 big-screen:max-w-5xl flex flex-col z-50 p-0 overflow-hidden"
          {...CARD_SLIDE_IN}
          {...swipeHandlers}
          ref={refPassthrough}
        >
          <header className="flex flex-wrap pt-2 px-safe-2 items-center">
            <h2 className="flex gap-4 items-center">
              <Button
                variant="icon-white"
                onClick={resetActivePlant}
                icon={<MdClose size={24} />}
              />
              {getPlantDisplayName(activePlant)}
            </h2>
            <div className="ml-auto flex items-center gap-1">
              {ITERATE_DIRECTION.map((direction) => (
                <Fragment key={direction}>
                  <Button
                    key={direction}
                    disabled={disableIterate[direction]}
                    variant="text"
                    onClick={() => iteratePlant(direction)}
                    icon={
                      direction === "prev" ? (
                        <MdChevronLeft />
                      ) : (
                        <MdChevronRight />
                      )
                    }
                  />
                  {direction === "prev" && (
                    <span className="font-mono text-xs text-primary-dark dark:text-white/60">
                      {typesafeActiveIndex + 1} / {plantList.length}
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
          </header>
          <div
            key={activePlant.scientificName}
            className="flex flex-col small-screen:overflow-auto big-screen:overflow-hidden gap-4 py-6 px-safe-6"
          >
            <div
              onTouchStart={() => {
                isTouchingMap.current = true;
              }}
              onTouchEnd={() => {
                isTouchingMap.current = false;
              }}
              className="flex max-lg:flex-col-reverse gap-4 justify-between"
            >
              <PlantImageViewer
                plant={activePlant}
                isModalOpen={imageModalOpen}
                setIsModalOpen={setImageModalOpen}
              />
              <MapProvider
                showMarkers
                className="min-h-60 w-full"
                searchParams={searchParams}
              />
            </div>
            <PlantInfoCard plant={activePlant} />
          </div>
        </Card>
      )}
    </AnimatePresence>
  );
};

export default ActivePlantPane;
