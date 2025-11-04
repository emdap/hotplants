import classNames from "classnames";
import { useDocumentListener } from "hooks/useDocumentListener";
import { AnimatePresence, motion } from "motion/react";
import { HTMLProps } from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";
import Button from "./Button";
import Card, { CardProps } from "./Card";
import { CUSTOM_MOTION_FADE_IN, MOTION_FADE_IN } from "./motionTransitions";

export type ModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
  headerProps?: HTMLProps<HTMLDivElement>;
} & CardProps;

const MODAL_BODY_FADE_IN = CUSTOM_MOTION_FADE_IN({
  initial: { top: "55%" },
  animate: { top: "50%" },
  exit: { top: "55%" },
});

const Modal = ({
  isOpen,
  onClose,
  headerProps: { className: headerClassName, ...headerProps } = {},
  children,
  className,
  ...bodyProps
}: ModalProps) => {
  const closeOnEscape = (e: KeyboardEvent) => {
    if (onClose && e.code === "Escape") {
      e.stopPropagation();
      onClose();
    }
  };

  useDocumentListener("keydown", closeOnEscape, isOpen, true);

  // Using a portal for safety
  // First usecase - modal ancestor had backdrop effects, causing
  // the fixed positioning to be relative to that parent
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="mask"
            className="fixed top-0 left-0 h-dvh w-dvw bg-default-text/50"
            onClick={onClose}
            {...MOTION_FADE_IN}
          />
          <Card
            key="body"
            disableBlurEffect
            className={classNames(
              "fixed left-1/2 -translate-1/2 w-5/6 sm:w-3/4 h-5/6 flex flex-col gap-2 overflow-auto",
              className
            )}
            {...MODAL_BODY_FADE_IN}
            {...bodyProps}
          >
            <div
              className={classNames(
                "sticky bg-inherit -top-6 pt-6 -mt-6",
                headerClassName
              )}
              {...headerProps}
            >
              <Button>
                <MdClose onClick={onClose} />
              </Button>
            </div>
            {children}
          </Card>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
