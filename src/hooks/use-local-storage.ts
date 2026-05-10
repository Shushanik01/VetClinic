import { useCallback } from 'react';

export function useLocalStorage<T>(key: string) {
  const getValue = useCallback((): T | null => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : null;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return null;
    }
  }, [key]);

  const setValue = useCallback(
    (value: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Error writing localStorage key “${key}”:`, error);
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing localStorage key “${key}”:`, error);
    }
  }, [key]);

  return { getValue, setValue, removeValue };
}
