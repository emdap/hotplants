import classNames from "classnames";
import { useDocumentListener } from "hooks/useDocumentListener";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useSwipeable } from "react-swipeable";
import { ITERATE_DIRECTION, IterateDirection } from "util/generalUtil";
import Button from "./Button";

export type CarouselProps = {
  carouselIndex?: number;
  setCarouselIndex?: React.Dispatch<React.SetStateAction<number>>;
  maxRenderedChildren?: number;
  enableKeyboardEvents?: boolean;
  bigButtons?: boolean;
  children: ReactNode[];
};

const Carousel = ({
  carouselIndex = 0,
  setCarouselIndex = () => null,
  maxRenderedChildren = 5,
  enableKeyboardEvents,
  bigButtons,
  children,
}: CarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(carouselIndex);
  const childrenInDom = Math.ceil(maxRenderedChildren / 2);

  useEffect(() => {
    setActiveIndex(carouselIndex);
  }, [carouselIndex]);

  const disableButtons = useMemo(
    () => ({
      next: activeIndex === children.length - 1,
      prev: activeIndex === 0,
    }),
    [children.length, activeIndex],
  );

  const iterateCarousel = useCallback(
    (direction: IterateDirection) => {
      let setFn: undefined | ((index: number) => number) = undefined;

      if (direction === "prev" && !disableButtons.prev) {
        setFn = (index) => index - 1;
      } else if (direction === "next" && !disableButtons.next) {
        setFn = (index) => index + 1;
      }

      if (setFn) {
        setActiveIndex(setFn);
        setCarouselIndex && setCarouselIndex(setFn);
      }
    },
    [disableButtons.next, disableButtons.prev, setCarouselIndex],
  );

  useDocumentListener(
    "keydown",
    (e: KeyboardEvent) =>
      ["ArrowLeft", "ArrowRight"].includes(e.key) &&
      iterateCarousel(e.key === "ArrowLeft" ? "prev" : "next"),
    enableKeyboardEvents,
  );

  const swipeHandlers = useSwipeable({
    onSwipedRight: ({ event }) => {
      !disableButtons.prev && event.stopPropagation();
      iterateCarousel("prev");
    },
    onSwipedLeft: () => iterateCarousel("next"),
  });

  const getChildStyle = (childIndex: number) => {
    const renderChild = Math.abs(activeIndex - childIndex) < childrenInDom;
    return {
      renderChild,
      translate:
        childIndex === activeIndex
          ? "0"
          : childIndex < activeIndex
            ? "-200%"
            : "200%",
    };
  };

  return (
    <div
      {...swipeHandlers}
      className="flex flex-col gap-2 justify-center h-full w-full overflow-hidden relative"
    >
      <div className="grow overflow-hidden relative">
        {children.map((child, index) => {
          const { renderChild, translate } = getChildStyle(index);
          return (
            <div
              key={index}
              className={classNames(
                "transition-all duration-300 absolute top-0 w-full h-full [&_*]:max-h-full flex justify-center items-center rounded-sm",
                renderChild ? "opacity-100" : "opacity-0",
              )}
              style={{
                translate,
              }}
            >
              {renderChild && child}
            </div>
          );
        })}
      </div>

      {children.length > 1 && (
        <div className={"flex gap-8 justify-center"}>
          {ITERATE_DIRECTION.map((direction) => (
            <Button
              key={direction}
              variant="text-primary"
              className={classNames({ "text-xl p-4": bigButtons })}
              disabled={disableButtons[direction]}
              onClick={() => iterateCarousel(direction)}
              icon={direction === "prev" ? <FaArrowLeft /> : <FaArrowRight />}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
