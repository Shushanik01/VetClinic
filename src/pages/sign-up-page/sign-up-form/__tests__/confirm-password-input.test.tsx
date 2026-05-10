import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '~/__tests__';
import { ConfirmPasswordInput } from '~/pages/sign-up-page/sign-up-form/confirm-password-input';

describe('ConfirmPasswordInput', () => {
  it('shows toggle only with value and toggles password visibility', () => {
    const onChange = vi.fn();

    render(
      <ConfirmPasswordInput
        placeholder="Confirm your Password"
        onChange={onChange}
      />
    );

    const input = screen.getByPlaceholderText('Confirm your Password');

    expect(input).toHaveAttribute('type', 'password');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'StrongPass1!' } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button'));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('applies input-error class when error prop is true', () => {
    render(<ConfirmPasswordInput placeholder="Confirm your Password" error />);

    const input = screen.getByPlaceholderText('Confirm your Password');
    expect(input).toHaveClass('input-error');
  });
});
