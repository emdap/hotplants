import { useNavigate } from "@tanstack/react-router";
import classNames from "classnames";
import MapProvider from "components/interactiveMap/MapProvider";
import { useEntitySelectionContext } from "contexts/entitySelection/EntitySelectionContext";
import { useSearchParamsContext } from "contexts/searchParams/SearchParamsContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import {
  mergeMotionProps,
  MOTION_FADE_IN,
} from "designSystem/motionTransitions";
import { useCloseOnEscape } from "hooks/useCloseOnEscape";
import { useDisableHtmlScroll } from "hooks/useDisableHtmlScroll";
import { AnimatePresence } from "motion/react";
import {
  Fragment,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";
import { useSwipeable } from "react-swipeable";
import { useClickAway } from "react-use";
import {
  getEntityDisplayNames,
  isLeafletEvent,
  ITERATE_DIRECTION,
} from "util/generalUtil";
import { swapLatLng } from "util/locationUtil";
import EntityActions from "./EntityActions";
import EntityInfo from "./EntityInfo";
import EntityImageViewer from "./images/EntityImageViewer";

const CARD_SLIDE_IN = mergeMotionProps(MOTION_FADE_IN, {
  initial: { right: "-100%" },
  animate: { right: 0 },
  exit: { right: "-100%" },
});

const ActiveEntityPane = ({ children }: { children?: ReactNode }) => {
  const navigate = useNavigate();
  const { searchParams } = useSearchParamsContext();
  const {
    entityType,
    entityList,
    page,
    pageSize,
    totalItems,
    activeEntity,
    activeEntityMedia,
    setActiveEntityId,
    setActiveMediaUrl,
  } = useEntitySelectionContext();

  const [imageModalOpen, setImageModalOpen] = useState(false);

  const [overallIndex, setOverallIndex] = useState(0);
  const pageIndexOffset = (page - 1) * pageSize;

  const mapCenter = useMemo(() => {
    if (searchParams.location || !activeEntityMedia.length) {
      return undefined;
    }

    return swapLatLng([activeEntityMedia[0].occurrenceCoords])[0];
  }, [searchParams, activeEntityMedia]);

  useEffect(() => {
    setOverallIndex(
      Math.max(
        0,
        entityList.findIndex(({ _id }) => _id === activeEntity?._id),
      ) + pageIndexOffset,
    );
  }, [pageIndexOffset, entityList, activeEntity?._id]);

  const resetActivePlant = () => {
    setActiveEntityId(null);
    setActiveMediaUrl(null);
  };

  useCloseOnEscape(resetActivePlant, !!activeEntity && !imageModalOpen);
  useDisableHtmlScroll(Boolean(activeEntity));
  const swipeHandlers = useSwipeable({
    onSwipedRight: ({ event }) => !isLeafletEvent(event) && resetActivePlant(),
  });

  const paneRef = useRef<HTMLDivElement>(null);

  const refPassthrough = (el: HTMLDivElement) => {
    swipeHandlers.ref(el);
    paneRef.current = el;
  };

  useClickAway(paneRef, () => !imageModalOpen && resetActivePlant());

  const disableIterate = useMemo(
    () => ({
      next: overallIndex === totalItems - 1,
      prev: overallIndex === 0,
    }),
    [overallIndex, totalItems],
  );

  const iteratePlant = (direction: "prev" | "next") => {
    const iterateDirection = (direction === "prev" ? -1 : 1) * 1;
    const nextPlantIndex = overallIndex - pageIndexOffset + iterateDirection;

    const nextPlant = entityList[nextPlantIndex];
    setActiveMediaUrl(null);
    if (!nextPlant) {
      setActiveEntityId(null);
      navigate({
        to: ".",
        search: (prev) => ({ ...prev, page: page + iterateDirection }),
      });
    } else {
      setActiveEntityId(nextPlant._id);
    }
  };

  const entityDisplayNames = activeEntity
    ? getEntityDisplayNames(activeEntity)
    : null;

  return (
    <AnimatePresence>
      {activeEntity && (
        <Card
          key="entity-pane"
          className={classNames(
            "rounded-r-none py-2 px-safe-2 h-full fixed top-0 z-40",
            "backdrop-blur-2xl small-screen:rounded-l-none small-screen:w-full",
            "small-screen:w-full big-screen:w-4/7 big-screen:max-w-5xl",
            "flex flex-col overflow-hidden",
          )}
          {...CARD_SLIDE_IN}
          {...swipeHandlers}
          ref={refPassthrough}
        >
          <header className="flex w-full items-center justify-between gap-8">
            <Button
              variant="icon-white"
              className="sticky top-0"
              onClick={resetActivePlant}
              icon={<MdClose />}
            />

            <div className="ml-auto flex items-center gap-1 sticky top-0 text-primary dark:text-default-text">
              {ITERATE_DIRECTION.map((direction) => (
                <Fragment key={direction}>
                  <Button
                    key={direction}
                    size="small"
                    disabled={disableIterate[direction]}
                    variant="icon-white"
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
                      {overallIndex + 1} / {totalItems}
                    </span>
                  )}
                </Fragment>
              ))}
              <EntityActions entity={activeEntity} />
            </div>
          </header>

          <div
            key={activeEntity.scientificName}
            className="flex flex-col small-screen:overflow-auto big-screen:overflow-hidden gap-4 pb-6 px-2"
          >
            <div className="flex flex-col items-center p-2">
              <h2>{entityDisplayNames?.title}</h2>
              {entityDisplayNames?.subTitle && (
                <h6 className="italic"> {entityDisplayNames.subTitle}</h6>
              )}
            </div>

            <div className="flex max-lg:flex-col gap-4 justify-between px-2">
              <EntityImageViewer
                isModalOpen={imageModalOpen}
                setIsModalOpen={setImageModalOpen}
              />
              <MapProvider
                showMarkers
                className="min-h-60 w-full"
                locationParams={searchParams.location}
                {...(mapCenter && { center: mapCenter })}
              />
            </div>

            <div className="big-screen:overflow-auto big-screen:pb-8 flex-grow space-y-4 mt-4">
              {children}

              <EntityInfo
                entity={activeEntity}
                entityType={entityType}
                onTouchEndCapture={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </Card>
      )}
    </AnimatePresence>
  );
};

export default ActiveEntityPane;
