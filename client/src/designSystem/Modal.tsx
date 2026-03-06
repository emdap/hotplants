import classNames from "classnames";
import { useCloseOnEscape } from "hooks/useCloseOnEscape";
import { AnimatePresence } from "motion/react";
import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";
import Button from "./Button";
import Card, { CardProps } from "./Card";
import { mergeMotionProps, MOTION_FADE_IN } from "./motionTransitions";
import OverlayMask from "./OverlayMask";

export type ModalProps = {
  title?: ReactNode;
  subTitle?: ReactNode;
  isOpen?: boolean;
  stickyHeader?: boolean;
  onClose?: () => void;
} & CardProps;

const MODAL_BODY_FADE_IN = mergeMotionProps(MOTION_FADE_IN, {
  initial: { top: "55%" },
  animate: { top: "50%" },
  exit: { top: "55%" },
});

const Modal = ({
  title,
  subTitle,
  isOpen,
  stickyHeader,
  onClose,
  children,
  className,
  ...bodyProps
}: ModalProps) => {
  useCloseOnEscape(
    (e) => {
      if (onClose) {
        e.stopPropagation();
        onClose();
      }
    },
    !!isOpen,
    true,
  );

  // Using a portal for safety
  // First usecase - modal ancestor had backdrop effects, causing
  // the fixed positioning to be relative to that parent
  return createPortal(
    <>
      <OverlayMask show={isOpen} key="mask" onClick={onClose} />
      <AnimatePresence>
        {isOpen && (
          <>
            <Card
              key="card"
              solid
              className={classNames(
                "fixed left-1/2 -translate-1/2 w-[90dvw] h-[95dvh] sm:w-3/4 sm:h-5/6 flex flex-col overflow-auto z-50 p-4 [&_>_:last-child]:pt-2",
                { "pt-0": stickyHeader },
                className,
              )}
              {...MODAL_BODY_FADE_IN}
              {...bodyProps}
            >
              <header
                className={classNames(
                  "grid-centered gap-4 border-b pb-2 border-default bg-default-background z-50",
                  subTitle ? "items-start" : "items-center",
                  { "sticky top-0 pt-4": stickyHeader },
                )}
              >
                <Button
                  className="max-w-fit"
                  variant="icon-white"
                  onClick={onClose}
                  icon={<MdClose size={24} />}
                />
                <div className="mx-auto flex flex-col gap-1 sm:gap-2 items-center">
                  <h2 className="text-default-text flex items-center gap-4 max-sm:text-lg">
                    {title}
                  </h2>
                  {subTitle && (
                    <h6 className="italic max-sm:text-base">{subTitle}</h6>
                  )}
                </div>
              </header>
              {children}
            </Card>
          </>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
};

export default Modal;
