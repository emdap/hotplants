export const elementInViewport = (
  element: HTMLElement,
  { xBuffer = 1, yBuffer = 1 }: { xBuffer?: number; yBuffer?: number } = {}
) => {
  const rect = element.getBoundingClientRect();

  const buffedWidth = rect.width * xBuffer;
  const buffedHeight = rect.height * yBuffer;

  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return (
    rect.left + buffedWidth >= 0 &&
    rect.right - buffedWidth <= windowWidth &&
    rect.top + buffedHeight + 1000 >= 0 &&
    rect.bottom - buffedHeight - 1000 <= windowHeight
  );
};
