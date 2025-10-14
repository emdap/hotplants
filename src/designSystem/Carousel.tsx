import classNames from "classnames";
import { ReactNode, useEffect, useState } from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import Button from "./Button";

const Carousel = ({
  carouselIndex = 0,
  maxRenderedChildren = 5,
  bigButtons,
  children,
}: {
  carouselIndex?: number;
  maxRenderedChildren?: number;
  bigButtons?: boolean;
  children: ReactNode[];
}) => {
  const [activeIndex, setActiveIndex] = useState(carouselIndex);
  const childrenInDom = Math.ceil(maxRenderedChildren / 2);

  const getChildStyle = (childIndex: number) => {
    const renderChild = Math.abs(activeIndex - childIndex) < childrenInDom;
    return {
      renderChild,
      translate:
        childIndex === activeIndex
          ? "0"
          : childIndex < activeIndex
          ? "-100%"
          : "100%",
    };
  };

  useEffect(() => {
    setActiveIndex(carouselIndex);
  }, [carouselIndex]);

  return (
    <div className="flex flex-col gap-2 justify-center h-full w-full overflow-hidden py-2 relative">
      <div className="flex-grow overflow-hidden relative">
        {children.map((child, index) => {
          const { renderChild, translate } = getChildStyle(index);
          return (
            renderChild && (
              <div
                key={index}
                className="transition-all duration-300 absolute top-0 w-full h-full [&_*]:max-h-full flex justify-center items-center rounded-sm"
                style={{
                  translate,
                }}
              >
                {child}
              </div>
            )
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
                className={classNames({ "text-xl p-4": bigButtons })}
                disabled={
                  isNextButton
                    ? activeIndex === children.length - 1
                    : activeIndex === 0
                }
                onClick={() => setActiveIndex(activeIndex + incremenet)}
              >
                {isNextButton ? <MdArrowForward /> : <MdArrowBack />}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Carousel;
