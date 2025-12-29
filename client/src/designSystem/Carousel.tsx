import classNames from "classnames";
import { useDocumentListener } from "hooks/useDocumentListener";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Button from "./Button";

export type CarouselProps = {
  carouselIndex?: number;
  setCarouselIndex?: (newIndex: number) => void;
  maxRenderedChildren?: number;
  enableKeyboardEvents?: boolean;
  bigButtons?: boolean;
  children: ReactNode[];
};

const Carousel = ({
  carouselIndex = 0,
  setCarouselIndex,
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
    [children.length, activeIndex]
  );

  const setIndexes = useCallback(
    (newIndex: number) => {
      setActiveIndex(newIndex);
      setCarouselIndex && setCarouselIndex(newIndex);
    },
    [setActiveIndex, setCarouselIndex]
  );

  const iterateCarousel = useCallback(
    (e: KeyboardEvent) => {
      let newIndex = activeIndex;
      if (e.key === "ArrowRight" && !disableButtons.next) {
        newIndex += 1;
      } else if (e.key === "ArrowLeft" && !disableButtons.prev) {
        newIndex -= 1;
      }
      setIndexes(newIndex);
    },
    [disableButtons.next, disableButtons.prev, activeIndex, setIndexes]
  );

  useDocumentListener("keydown", iterateCarousel, !!enableKeyboardEvents);

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
    <div className="flex flex-col gap-2 justify-center h-full w-full overflow-hidden relative">
      <div className="grow overflow-hidden relative">
        {children.map((child, index) => {
          const { renderChild, translate } = getChildStyle(index);
          return (
            <div
              key={index}
              className={classNames(
                "transition-all duration-300 absolute top-0 w-full h-full [&_*]:max-h-full flex justify-center items-center rounded-sm",
                renderChild ? "opacity-100" : "opacity-0"
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
          {[-1, 1].map((incremenet) => {
            const isNextButton = incremenet === 1;
            return (
              <Button
                key={incremenet}
                variant="text"
                className={classNames({ "text-xl p-4": bigButtons })}
                disabled={
                  isNextButton ? disableButtons.next : disableButtons.prev
                }
                onClick={() => setIndexes(activeIndex + incremenet)}
                icon={isNextButton ? <FaArrowRight /> : <FaArrowLeft />}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Carousel;
