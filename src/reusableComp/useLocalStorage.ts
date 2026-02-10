import { useState } from "react";

const STORAGE_PREFIX = "factorio-planner:";

export const useLocalStorage = <T>(storageKey: string, fallbackState: T) => {
  const prefixedKey = STORAGE_PREFIX + storageKey;
  const stored = localStorage.getItem(prefixedKey);
  const [value, setValue] = useState<T>(
    stored ? JSON.parse(stored) : fallbackState
  );
  const setValueWithLocalStorage = (newValue: React.SetStateAction<T>) => {
    setValue(newValue);
    const valueToStore =
      typeof newValue === "function"
        ? (newValue as (prevState: T) => T)(value)
        : newValue;
    localStorage.setItem(prefixedKey, JSON.stringify(valueToStore));
  };
  return [value, setValueWithLocalStorage] as const;
};
