import { act } from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { NotifyItem } from '~/app/providers/notifications/notify-item';

vi.mock('~/assets/svg/notification-success-icon.svg?react', () => ({
  default: () => <span data-testid="success-icon" />,
}));

describe('NotifyItem', () => {
  const renderNotify = (
    props: Partial<React.ComponentProps<typeof NotifyItem>> = {}
  ) => {
    const onClose = props.onClose ?? vi.fn();
    const finalProps = {
      id: props.id ?? 1,
      title: props.title ?? 'Title',
      onClose,
      ...props,
    };

    let view: ReturnType<typeof render>;
    act(() => {
      view = render(<NotifyItem {...finalProps} />);
    });

    return { view: view!, onClose };
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders success notification with icon and optional description', () => {
    renderNotify({
      id: 1,
      title: 'Saved',
      description: 'Operation finished',
      type: 'success',
    });

    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Operation finished')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
  });

  it('renders error notification without success icon', () => {
    renderNotify({ id: 2, title: 'Failed', type: 'error' });

    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.queryByTestId('success-icon')).not.toBeInTheDocument();
  });

  it('auto closes after duration timeout', () => {
    const { onClose } = renderNotify({ id: 3, title: 'Auto', duration: 1000 });

    act(() => {
      vi.advanceTimersByTime(1000);
      vi.advanceTimersByTime(300);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('pauses on hover and closes after mouse leave delay', () => {
    const { onClose } = renderNotify({ id: 4, title: 'Hover', duration: 1000 });

    const item = screen.getByText('Hover').closest('div');
    expect(item).toBeTruthy();

    fireEvent.mouseEnter(item!);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onClose).not.toHaveBeenCalled();

    fireEvent.mouseLeave(item!);

    act(() => {
      vi.advanceTimersByTime(1000);
      vi.advanceTimersByTime(300);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clears pending hover close timer when user re-enters quickly', () => {
    const { onClose } = renderNotify({ id: 7, title: 'Re-enter hover' });

    const item = screen.getByText('Re-enter hover').closest('div');
    expect(item).toBeTruthy();

    fireEvent.mouseLeave(item!);
    fireEvent.mouseEnter(item!);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes when close button is clicked', () => {
    const { onClose } = renderNotify({ id: 5, title: 'Closable' });

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: '✕' }));
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('updates latest onClose callback between renders', () => {
    const firstOnClose = vi.fn();
    const secondOnClose = vi.fn();

    const { view } = renderNotify({
      id: 6,
      title: 'Update callback',
      onClose: firstOnClose,
    });

    act(() => {
      view.rerender(
        <NotifyItem id={6} title="Update callback" onClose={secondOnClose} />
      );
    });

    act(() => {
      vi.advanceTimersByTime(3500);
      vi.advanceTimersByTime(300);
    });

    expect(firstOnClose).not.toHaveBeenCalled();
    expect(secondOnClose).toHaveBeenCalledTimes(1);
  });

  it('resets running timer when duration changes', () => {
    const onClose = vi.fn();
    const { view } = renderNotify({
      id: 8,
      title: 'Duration swap',
      duration: 5000,
      onClose,
    });

    act(() => {
      view.rerender(
        <NotifyItem
          id={8}
          title="Duration swap"
          duration={1000}
          onClose={onClose}
        />
      );
    });

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
      vi.advanceTimersByTime(300);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
