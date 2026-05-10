import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '~/hooks/use-local-storage';

const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => store[key] ?? null,
    setItem: (key: string, value: string): void => {
      store[key] = value;
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number): string | null => Object.keys(store)[index] ?? null,
  };
};

const localStorageMock = createLocalStorageMock();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true,
  writable: true,
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('getValue returns null when key does not exist', () => {
    const { result } = renderHook(() => useLocalStorage<string>('test-key'));

    expect(result.current.getValue()).toBeNull();
  });

  it('setValue stores the value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage<string>('test-key'));

    act(() => {
      result.current.setValue('hello');
    });

    expect(localStorage.getItem('test-key')).toBe('"hello"');
  });

  it('getValue returns the stored value', () => {
    const { result } = renderHook(() => useLocalStorage<string>('test-key'));

    act(() => {
      result.current.setValue('hello');
    });

    expect(result.current.getValue()).toBe('hello');
  });

  it('stores and retrieves objects', () => {
    const { result } = renderHook(() =>
      useLocalStorage<{ name: string; age: number }>('test-obj')
    );

    const data = { name: 'Alice', age: 30 };

    act(() => {
      result.current.setValue(data);
    });

    expect(result.current.getValue()).toEqual(data);
  });

  it('stores and retrieves arrays', () => {
    const { result } = renderHook(() => useLocalStorage<number[]>('test-arr'));

    act(() => {
      result.current.setValue([1, 2, 3]);
    });

    expect(result.current.getValue()).toEqual([1, 2, 3]);
  });

  it('removeValue removes the key from localStorage', () => {
    const { result } = renderHook(() => useLocalStorage<string>('test-key'));

    act(() => {
      result.current.setValue('to-be-removed');
    });

    expect(result.current.getValue()).toBe('to-be-removed');

    act(() => {
      result.current.removeValue();
    });

    expect(result.current.getValue()).toBeNull();
    expect(localStorage.getItem('test-key')).toBeNull();
  });

  it('getValue returns null when stored value is invalid JSON', () => {
    localStorage.setItem('bad-key', 'not-valid-json{{{');
    const { result } = renderHook(() => useLocalStorage<string>('bad-key'));

    expect(result.current.getValue()).toBeNull();
  });

  it('setValue handles errors gracefully', () => {
    const setItemSpy = vi
      .spyOn(localStorageMock, 'setItem')
      .mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage<string>('test-key'));

    act(() => {
      result.current.setValue('value');
    });

    expect(consoleWarnSpy).toHaveBeenCalled();

    setItemSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('removeValue handles errors gracefully', () => {
    const removeItemSpy = vi
      .spyOn(localStorageMock, 'removeItem')
      .mockImplementation(() => {
        throw new Error('Storage error');
      });

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage<string>('test-key'));

    act(() => {
      result.current.removeValue();
    });

    expect(consoleWarnSpy).toHaveBeenCalled();

    removeItemSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('getValue functions are memoized across re-renders', () => {
    const { result, rerender } = renderHook(() =>
      useLocalStorage<string>('test-key')
    );

    const { getValue, setValue, removeValue } = result.current;
    rerender();

    expect(result.current.getValue).toBe(getValue);
    expect(result.current.setValue).toBe(setValue);
    expect(result.current.removeValue).toBe(removeValue);
  });
});
