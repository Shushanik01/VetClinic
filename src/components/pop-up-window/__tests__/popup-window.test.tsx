import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '~/__tests__';
import { PopupWindow } from '~/components/pop-up-window/popup-window';

describe('PopupWindow', () => {
  let popupRoot: HTMLDivElement;

  beforeEach(() => {
    popupRoot = document.createElement('div');
    popupRoot.id = 'pop-up';
    document.body.appendChild(popupRoot);
  });

  afterEach(() => {
    popupRoot.remove();
  });

  it('renders children inside the portal', () => {
    render(
      <PopupWindow>
        <div>Popup Content</div>
      </PopupWindow>
    );
    expect(screen.getByText('Popup Content')).toBeInTheDocument();
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <PopupWindow onClose={onClose}>
        <div>Content</div>
      </PopupWindow>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not throw when onClose is not provided and Escape is pressed', () => {
    render(
      <PopupWindow>
        <div>Content</div>
      </PopupWindow>
    );
    // Should not throw
    fireEvent.keyDown(window, { key: 'Escape' });
  });

  it('calls onClose when backdrop is clicked (mousedown + mouseup on same target)', () => {
    const onClose = vi.fn();
    render(
      <PopupWindow onClose={onClose}>
        <div>Content</div>
      </PopupWindow>
    );

    // The backdrop is the outermost div rendered in the portal
    const backdrop = popupRoot.firstChild as HTMLElement;
    fireEvent.mouseDown(backdrop, { target: backdrop });
    fireEvent.mouseUp(backdrop, { target: backdrop });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when click starts on backdrop but ends on child', () => {
    const onClose = vi.fn();
    render(
      <PopupWindow onClose={onClose}>
        <div data-testid="child">Content</div>
      </PopupWindow>
    );

    const backdrop = popupRoot.firstChild as HTMLElement;
    const child = screen.getByTestId('child');

    fireEvent.mouseDown(backdrop, { target: backdrop });
    fireEvent.mouseUp(child, { target: child });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when click starts on child and ends on backdrop', () => {
    const onClose = vi.fn();
    render(
      <PopupWindow onClose={onClose}>
        <div data-testid="child">Content</div>
      </PopupWindow>
    );

    const backdrop = popupRoot.firstChild as HTMLElement;
    const child = screen.getByTestId('child');

    fireEvent.mouseDown(child, { target: child });
    fireEvent.mouseUp(backdrop, { target: backdrop });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('returns null when portal root element does not exist', () => {
    popupRoot.remove();

    const { container } = render(
      <PopupWindow>
        <div>Content</div>
      </PopupWindow>
    );

    // Nothing rendered inside the React root
    expect(container.firstChild).toBeNull();

    // Re-add for afterEach cleanup
    document.body.appendChild(popupRoot);
  });
});
