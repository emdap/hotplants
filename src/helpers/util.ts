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

// TODO: make a hook for this? want to drop images from dom if they're out of view
