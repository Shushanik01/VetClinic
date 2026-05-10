import { describe, expect, it } from 'vitest';
import { render, screen } from '~/__tests__';
import { FormField } from '~/components/forms/form-field';

describe('FormField', () => {
  it('renders label, required mark and children', () => {
    render(
      <FormField label="Email" required>
        <input aria-label="inner-input" />
      </FormField>
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByLabelText('inner-input')).toBeInTheDocument();
  });

  it('renders error over hint when both are provided', () => {
    render(
      <FormField label="Phone" hint="Enter phone" error="Invalid phone">
        <input aria-label="phone-input" />
      </FormField>
    );

    expect(screen.getByText('Invalid phone')).toBeInTheDocument();
    expect(screen.queryByText('Enter phone')).not.toBeInTheDocument();
  });

  it('renders hint when error is absent and hides both when absent', () => {
    const { rerender } = render(
      <FormField label="Name" hint="Enter full name">
        <input aria-label="name-input" />
      </FormField>
    );

    expect(screen.getByText('Enter full name')).toBeInTheDocument();

    rerender(
      <FormField label="Name">
        <input aria-label="name-input" />
      </FormField>
    );

    expect(screen.queryByText('Enter full name')).not.toBeInTheDocument();
    expect(screen.queryByText('Invalid phone')).not.toBeInTheDocument();
  });
});
