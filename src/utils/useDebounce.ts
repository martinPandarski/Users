import { useEffect, useState } from "react";
import debounce from "lodash.debounce";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const debounced = debounce(() => {
      setDebouncedValue(value);
    }, delay);

    debounced();

    return () => {
      debounced.cancel();
    };
  }, [value, delay]);

  return debouncedValue;
}
