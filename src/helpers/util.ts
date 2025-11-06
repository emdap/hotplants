export const getScrollParent = (
  element: HTMLElement | null
): HTMLElement | null => {
  if (element == null) {
    return null;
  }

  if (element.scrollHeight > element.clientHeight) {
    return element;
  } else {
    return getScrollParent(element.parentElement);
  }
};
