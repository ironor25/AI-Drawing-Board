/**
 * throttle.ts
 * Throttle and debounce utilities
 */

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export const requestAnimationFrameThrottle = <
  T extends (...args: any[]) => any,
>(
  func: T,
): ((...args: Parameters<T>) => void) => {
  let frameId: number | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (frameId === null) {
      frameId = requestAnimationFrame(() => {
        func.apply(this, args);
        frameId = null;
      });
    }
  };
};
