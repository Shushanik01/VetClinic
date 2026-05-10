import { act } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Notifications, notify } from '~/app/providers/notifications';

vi.mock('~/app/providers/notifications/notify-item', () => ({
  NotifyItem: ({
    id,
    title,
    description,
    onClose,
  }: {
    id: number;
    title: string;
    description?: string;
    onClose: () => void;
  }) => (
    <div data-testid="notify-item">
      <span data-testid={`notify-title-${id}`}>{title}</span>
      {description ? <span>{description}</span> : null}
      <button onClick={onClose}>close</button>
    </div>
  ),
}));

describe('Notifications', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('warns when notify is called before component is mounted', () => {
    const warnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    notify({ description: 'not mounted yet' });

    expect(warnSpy).toHaveBeenCalledWith(
      'Notifications component is not mounted yet!'
    );
  });

  it('uses default titles and limits queue to 3 notifications', () => {
    render(<Notifications />);

    act(() => {
      notify({ title: '   ', type: 'error', description: 'first' });
      notify({ description: 'second' });
      notify({ title: 'Third custom title' });
      notify({ title: 'Fourth custom title' });
    });

    const items = screen.getAllByTestId('notify-item');
    expect(items).toHaveLength(3);
    expect(screen.queryByText('Error!')).not.toBeInTheDocument();
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Third custom title')).toBeInTheDocument();
    expect(screen.getByText('Fourth custom title')).toBeInTheDocument();
  });

  it('removes notification when close is clicked', () => {
    render(<Notifications />);

    act(() => {
      notify({ title: 'Closable notification' });
    });

    fireEvent.click(screen.getByRole('button', { name: 'close' }));

    expect(screen.queryByText('Closable notification')).not.toBeInTheDocument();
  });
});
