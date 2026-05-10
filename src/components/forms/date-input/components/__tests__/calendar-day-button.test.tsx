import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '~/__tests__';
import { CalendarDayButton } from '~/components/forms/date-input/components/calendar-day-button';

describe('CalendarDayButton', () => {
  it('renders the day number', () => {
    render(
      <CalendarDayButton
        day={15}
        isSelected={false}
        isDisabled={false}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: '15' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(
      <CalendarDayButton
        day={10}
        isSelected={false}
        isDisabled={false}
        onClick={onClick}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when isDisabled is true', () => {
    render(
      <CalendarDayButton
        day={5}
        isSelected={false}
        isDisabled={true}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is not disabled when isDisabled is false', () => {
    render(
      <CalendarDayButton
        day={5}
        isSelected={false}
        isDisabled={false}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('applies selected styles when isSelected is true', () => {
    const { container } = render(
      <CalendarDayButton
        day={5}
        isSelected={true}
        isDisabled={false}
        onClick={vi.fn()}
      />
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-green-400');
  });

  it('applies range boundary styles when isRangeStart is true', () => {
    const { container } = render(
      <CalendarDayButton
        day={1}
        isSelected={false}
        isRangeStart={true}
        isDisabled={false}
        onClick={vi.fn()}
      />
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-green-400');
  });

  it('applies range boundary styles when isRangeEnd is true', () => {
    const { container } = render(
      <CalendarDayButton
        day={31}
        isSelected={false}
        isRangeEnd={true}
        isDisabled={false}
        onClick={vi.fn()}
      />
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-green-400');
  });

  it('applies in-range styles when isInRange is true and not boundary', () => {
    const { container } = render(
      <CalendarDayButton
        day={15}
        isSelected={false}
        isInRange={true}
        isDisabled={false}
        onClick={vi.fn()}
      />
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-green-300');
  });

  it('applies disabled text color when isDisabled', () => {
    const { container } = render(
      <CalendarDayButton
        day={5}
        isSelected={false}
        isDisabled={true}
        onClick={vi.fn()}
      />
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('text-neutral-400');
  });
});
