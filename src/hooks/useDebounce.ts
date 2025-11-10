import { useEffect, useRef } from "react";

// useDebounce - Returns a debounced version of a callback function
export function useDebounce<T extends (...args: Parameters<T>) => void>(callback: T, delay: number) {
  // Store the timeout ID between renders
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Debounced function: resets timer if called again before delay
  const debouncedCallback = (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  // Return the debounced function
  return debouncedCallback;
}
