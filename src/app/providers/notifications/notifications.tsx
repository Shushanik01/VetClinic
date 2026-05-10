import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NotifyItem, type NotifyProps } from './notify-item';

// Internal type for notifications with generated ID
type NotifyInternal = Omit<NotifyProps, 'onClose'> & { id: number };

type NotifyInput = {
  title?: string;
  description?: string;
  duration?: number;
  type?: 'success' | 'error';
};

const getDefaultTitle = (type?: NotifyInput['type']) =>
  type === 'error' ? 'Error!' : 'Success!';

const normalizeNotification = (
  props: NotifyInput
): Omit<NotifyInternal, 'id'> => ({
  ...props,
  type: props.type ?? 'success',
  title: props.title?.trim() || getDefaultTitle(props.type),
});

// Global function to trigger notifications from anywhere
let notifyFunc: ((props: NotifyInput) => void) | null = null;

// Simple ID counter for unique notification IDs
let idCounter = 0;

// Function to show a notification from outside the component
export const notify = (props: NotifyInput) => {
  if (!notifyFunc) {
    console.warn('Notifications component is not mounted yet!');
    return;
  }
  notifyFunc(props);
};

export const Notifications = () => {
  const [notifications, setNotifications] = useState<NotifyInternal[]>([]);

  // Add a new notification
  const addNotify = (props: NotifyInput) => {
    const id = idCounter++;
    setNotifications((prev) => {
      const normalized = normalizeNotification(props);
      const newList = [...prev, { ...normalized, id }];
      if (newList.length > 3) newList.shift(); // keep max 3 notifications
      return newList;
    });
  };

  // Set global notify function when component mounts
  useEffect(() => {
    notifyFunc = addNotify;
    return () => {
      notifyFunc = null; // clean up on unmount
    };
  }, []);

  // Remove notification by ID
  const removeNotify = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Render notifications in a portal
  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: '48px',
        right: '80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        zIndex: 9999,
      }}
    >
      {notifications.map((n) => (
        <NotifyItem key={n.id} {...n} onClose={() => removeNotify(n.id)} />
      ))}
    </div>,
    document.body
  );
};
