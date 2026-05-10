import { useEffect, useRef, useState } from 'react';
import SuccessIcon from '~/assets/svg/notification-success-icon.svg?react';

export type NotifyProps = {
  id: number; // Unique ID for the notification
  title: string; // Notification title
  description?: string; // Optional description text
  duration?: number; // Duration before auto-close (in ms)
  type?: 'success' | 'error'; // Notification type
  onClose: () => void; // Callback when notification should be removed
};

export const NotifyItem = ({
  id: _id,
  title,
  description,
  duration = 3500,
  type = 'success',
  onClose,
}: NotifyProps) => {
  const [visible, setVisible] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const startTimer = (time: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      closeTimerRef.current = setTimeout(() => onCloseRef.current(), 300);
    }, time);
  };

  useEffect(() => {
    setVisible(true);
    startTimer(duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, [duration]);

  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    hoverTimerRef.current = setTimeout(() => {
      setVisible(false);
      closeTimerRef.current = setTimeout(() => onCloseRef.current(), 300);
    }, 1000);
  };

  const isSuccess = type === 'success';

  return (
    <div
      role="alert"
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      className={`
        w-full sm:max-w-[496px]
        mx-auto sm:mx-0 sm:ml-auto
        rounded-md
        border
        shadow-md
        p-3                 /* padding 12px */
        flex
        gap-2                /* gap between icon and text: 8px (gap-2 = 0.5rem = 8px) */
        transition-all
        duration-300
        ease-in-out
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}
        ${isSuccess
          ? 'border-green-400 bg-[#ebf9f9]'
          : 'border-[#e30404] bg-[#fce9ed]'
        }
      `}
    >
      {/* Left Icon */}
      {isSuccess && <SuccessIcon />}

      {/* Text Content */}
      <div className="flex flex-col gap-[4px]">
        {' '}
        {/* vertical gap between title and description 4px */}
        <div className="text-body-m-bold text-[#101828]">{title}</div>
        {description && (
          <div className="text-body-m-regular text-[#1f2937]">
            {description}
          </div>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onCloseRef.current(), 300);
        }}
        className="ml-auto text-[#101828] hover:opacity-70 cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};
