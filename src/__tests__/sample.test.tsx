import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Example component
const TestComponent = () => <div>Hello Vitest</div>;

describe('TestComponent', () => {
  it('renders successfully', () => {
    render(<TestComponent />);
    expect(screen.getByText('Hello Vitest')).toBeInTheDocument();
  });

  it('demonstrates path alias usage', () => {
    // You can import from anywhere using path aliases
    // Example: import { SomeUtil } from '~/utils/something';
    expect(true).toBe(true);
  });
});
