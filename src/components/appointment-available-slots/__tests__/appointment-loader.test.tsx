import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AppointmentLoader } from '../appointment-loader';

describe('AppointmentLoader', () => {
  it('should render loading container', () => {
    const { container } = render(<AppointmentLoader />);

    const loaderContainer = container.querySelector(
      String.raw`.w-full.min-h-\[396px\]`
    );
    expect(loaderContainer).toBeInTheDocument();
  });

  it('should render animated spinner element', () => {
    const { container } = render(<AppointmentLoader />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    const { container } = render(<AppointmentLoader />);

    const spinner = container.querySelector('.w-12.h-12');
    expect(spinner).toHaveClass('border-4');
    expect(spinner).toHaveClass('border-neutral-200');
    expect(spinner).toHaveClass('border-t-green-400');
    expect(spinner).toHaveClass('rounded-full');
  });

  it('should render flex container for spinner', () => {
    const { container } = render(<AppointmentLoader />);

    const flexContainer = container.querySelector(
      '.flex.flex-col.items-center.gap-4'
    );
    expect(flexContainer).toBeInTheDocument();
  });
});
