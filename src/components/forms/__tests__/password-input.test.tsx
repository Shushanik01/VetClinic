import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '~/__tests__';
import { PasswordInput } from '~/components/forms/password-input';

describe('PasswordInput', () => {
  it('shows toggle only with value and toggles password visibility', () => {
    const onChange = vi.fn();

    render(
      <PasswordInput placeholder="Enter your Password" onChange={onChange} />
    );

    const input = screen.getByPlaceholderText('Enter your Password');

    expect(input).toHaveAttribute('type', 'password');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'TestPass123!' } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button'));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('applies input-error class when error prop is true', () => {
    render(<PasswordInput placeholder="Enter your Password" error />);

    const input = screen.getByPlaceholderText('Enter your Password');
    expect(input).toHaveClass('input-error');
  });

  it('does not show toggle when input is empty', () => {
    render(<PasswordInput placeholder="Enter your Password" />);

    const input = screen.getByPlaceholderText('Enter your Password');
    expect(input).toHaveValue('');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
