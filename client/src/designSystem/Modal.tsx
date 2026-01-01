import classNames from "classnames";
import { useCloseOnEscape } from "hooks/useCloseOnEscape";
import { AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";
import Button from "./Button";
import Card, { CardProps } from "./Card";
import { mergeMotionProps, MOTION_FADE_IN } from "./motionTransitions";
import OverlayMask from "./OverlayMask";

export type ModalProps = {
  title?: string;
  isOpen?: boolean;
  onClose?: () => void;
} & CardProps;

const MODAL_BODY_FADE_IN = mergeMotionProps(MOTION_FADE_IN, {
  initial: { top: "55%" },
  animate: { top: "50%" },
  exit: { top: "55%" },
});

const Modal = ({
  title,
  isOpen,
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
    true
  );

  // Using a portal for safety
  // First usecase - modal ancestor had backdrop effects, causing
  // the fixed positioning to be relative to that parent
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <OverlayMask key="mask" onClick={onClose} />
          <Card
            key="card"
            solid
            className={classNames(
              "fixed left-1/2 -translate-1/2 w-5/6 sm:w-3/4 h-5/6 flex flex-col gap-2 overflow-auto z-50 p-4",
              className
            )}
            {...MODAL_BODY_FADE_IN}
            {...bodyProps}
          >
            <h2 className="text-default-text flex items-center gap-4">
              <Button
                variant="icon-white"
                onClick={onClose}
                icon={<MdClose size={24} />}
              />
              {title}
            </h2>
            {children}
          </Card>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
