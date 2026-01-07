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

const CARD_FADE_IN = mergeMotionProps(MOTION_FADE_IN, {
  initial: { right: "-100%" },
  animate: { right: 0 },
  exit: { right: "-100%" },
});

const ActivePlantPane = () => {
  const { searchLocation, setSearchLocation } = usePlantSearchContext();
  const {
    plantList,
    activePlantIndex,
    setActivePlantIndex,
    setActiveMediaIndex,
  } = usePlantSelectionContext();

  const [imageModalOpen, setImageModalOpen] = useState(false);

  const { activePlant, typesafeActiveIndex } = useMemo(
    () => ({
      activePlant:
        (activePlantIndex !== null && plantList[activePlantIndex]) ?? null,
      typesafeActiveIndex: activePlantIndex ?? 0,
    }),
    [plantList, activePlantIndex]
  );

  const resetActivePlant = () => {
    setActivePlantIndex(null);
    setActiveMediaIndex(0);
  };

  const swipeHandlers = useSwipeable({
    onSwipedRight: resetActivePlant,
  });
  useCloseOnEscape(resetActivePlant, !!activePlant && !imageModalOpen);
  useDisableHtmlScroll(Boolean(activePlant));

  const paneRef = useRef<HTMLDivElement>(null);
  useClickAway(paneRef, () => !imageModalOpen && resetActivePlant(), [
    "mouseup",
  ]);

  const disableIterate = useMemo(
    () => ({
      next: typesafeActiveIndex === plantList.length - 1,
      prev: !typesafeActiveIndex,
    }),
    [typesafeActiveIndex, plantList.length]
  );

  const iteratePlant = (direction: "prev" | "next") => {
    setActiveMediaIndex(0);
    setActivePlantIndex(
      typesafeActiveIndex + (direction === "prev" ? -1 : 1) * 1
    );
  };

  return (
    <AnimatePresence>
      {activePlant && (
        <div {...swipeHandlers}>
          <Card
            key="plant-pane"
            ref={paneRef}
            className="backdrop-blur-2xl max-md:rounded-l-none rounded-r-none h-full w-full fixed top-0 md:w-4/7 md:max-w-5xl flex flex-col z-30 p-0 overflow-hidden"
            {...CARD_FADE_IN}
          >
            <header className="flex flex-wrap pt-2 pl-2 items-center">
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
              className="flex flex-col overflow-auto lg:overflow-hidden gap-4 py-6 px-safe-6"
            >
              <div className="flex max-lg:flex-col-reverse gap-4 justify-between">
                <PlantImageViewer
                  plant={activePlant}
                  isModalOpen={imageModalOpen}
                  setIsModalOpen={setImageModalOpen}
                />
                <MapProvider
                  className="min-h-60 w-full"
                  showMarkers
                  {...{ searchLocation, setSearchLocation }}
                />
              </div>
              <PlantInfoCard plant={activePlant} />
            </div>
          </Card>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ActivePlantPane;
