import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type PopupWindowProps = {
  children: ReactNode;
  onClose?: () => void;
};

const POPUP_ROOT_ID = 'pop-up';

export const PopupWindow = ({ children, onClose }: PopupWindowProps) => {
  const popupRoot =
    typeof document === 'undefined'
      ? null
      : document.getElementById(POPUP_ROOT_ID);
  const isBackdropClick = useRef(false);

  useEffect(() => {
    if (typeof globalThis.window === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    globalThis.window.addEventListener('keydown', handleKeyDown);

    return () => {
      globalThis.window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!popupRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
      onMouseDown={(event) => {
        isBackdropClick.current = event.target === event.currentTarget;
      }}
      onMouseUp={(event) => {
        const shouldClose =
          isBackdropClick.current && event.target === event.currentTarget;
        isBackdropClick.current = false;
        if (shouldClose) {
          onClose?.();
        }
      }}
    >
      <div
        className="flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    popupRoot
  );
};
