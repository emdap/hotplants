import classNames from "classnames";
import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MdClose } from "react-icons/md";
import { ListboxValueType } from "./listboxUtil";

const SelectedOptionDisplay = ({ children }: { children: ReactNode }) => (
  <div className="rounded-md text-white bg-primary/80 shadow-sm shadow-black/20 text-xs pl-1.5 pr-1 py-0.5 min-w-max flex gap-1 items-center max-w-3/4 overflow-hidden overflow-ellipsis z-10">
    {children}
  </div>
);

const SelectedOptions = ({
  optionLabelDict,
  listboxValue,
  removeValue,
}: {
  optionLabelDict: Record<string, string>;
  listboxValue: ListboxValueType[];
  removeValue: (value: ListboxValueType) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxVisible, setMaxVisible] = useState<number | undefined>();

  const hiddenValues = maxVisible ? listboxValue.length - maxVisible : 0;

  useEffect(() => {
    if (maxVisible !== undefined && listboxValue.length <= maxVisible) {
      setMaxVisible(undefined);
    }
  }, [listboxValue.length, maxVisible]);

  const checkMaxVisible = useCallback(() => {
    if (listboxValue.length && containerRef.current) {
      const { offsetWidth, scrollWidth } = containerRef.current;

      if (scrollWidth > offsetWidth) {
        setMaxVisible((prev) => Math.max(1, (prev || listboxValue.length) - 2));
      }
    }
  }, [listboxValue.length]);

  const checkMaxTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useLayoutEffect(() => {
    checkMaxVisible();

    const checkOnResize = () => {
      checkMaxTimeout.current && clearTimeout(checkMaxTimeout.current);
      checkMaxTimeout.current = setTimeout(checkMaxVisible, 1000);
    };

    window.addEventListener("resize", checkOnResize);

    return () => window.removeEventListener("resize", checkOnResize);
  }, [listboxValue.length, checkMaxVisible]);

  return (
    <div
      ref={containerRef}
      className="h-full flex items-center gap-2 pr-3 grow overflow-hidden"
    >
      {listboxValue.slice(0, maxVisible).map((value, index) => (
        <SelectedOptionDisplay key={index}>
          {optionLabelDict[String(value)]}
          <MdClose
            className="cursor-pointer"
            onPointerDown={(e) => {
              e.stopPropagation();
              removeValue(value);
            }}
          />
        </SelectedOptionDisplay>
      ))}
      <div
        className={classNames(
          hiddenValues < 1 && "opacity-0 w-0 overflow-hidden",
        )}
      >
        <SelectedOptionDisplay>+{hiddenValues} more</SelectedOptionDisplay>
      </div>
    </div>
  );
};

export default SelectedOptions;
