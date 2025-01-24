import React from 'react';

const getViewPort = (): { width: number; height: number } => {
  let e: any = window;
  let a: string = 'inner';

  if (!('innerWidth' in window)) {
    a = 'client';
    e = document.documentElement || document.body;
  }

  return {
    width: e[a + 'Width'] as number,
    height: e[a + 'Height'] as number
  };
};

const getHeight = (element: HTMLElement): number => {
  if (!element) return 0;

  const styles = window.getComputedStyle(element);

  const height = element.getBoundingClientRect().height; // Actual height of the element
  const marginTop = parseFloat(styles.marginTop);
  const marginBottom = parseFloat(styles.marginBottom);

  const totalHeight = height + marginTop + marginBottom;

  return totalHeight;
};

// utils.ts
const calculateScrollableHeight = (
  messagesRef: React.RefObject<HTMLDivElement>,
  footerRef: React.RefObject<HTMLDivElement>,
  viewportHeight: number,
  offset: number
) => {
  if (messagesRef.current) {
    let availableHeight: number = viewportHeight - offset;
    if (footerRef.current) availableHeight -= getHeight(footerRef.current);
    return availableHeight;
  }
  return 0;
};

const scrollToBottom = (messagesRef: React.RefObject<HTMLDivElement>) => {
  if (messagesRef.current) {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }
};

export { getHeight, getViewPort, calculateScrollableHeight, scrollToBottom };
