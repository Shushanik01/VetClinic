import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '~/__tests__';
import { RegisterPasswordInput } from '~/pages/sign-up-page/sign-up-form/register-password-input';

describe('RegisterPasswordInput', () => {
  it('toggles visibility and applies validation class based on touched state', () => {
    const onChange = vi.fn();

    render(
      <RegisterPasswordInput
        placeholder="Enter your Password"
        onChange={onChange}
      />
    );

    const input = screen.getByPlaceholderText('Enter your Password');

    expect(input).toHaveAttribute('type', 'password');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'abc' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button')).toBeInTheDocument();

    fireEvent.blur(input);
    expect(input).toHaveClass('input-error');

    fireEvent.focus(input);
    expect(input).not.toHaveClass('input-error');

    fireEvent.click(screen.getByRole('button'));
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button'));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('uses error prop to force input-error class', () => {
    render(<RegisterPasswordInput placeholder="Enter your Password" error />);

    const input = screen.getByPlaceholderText('Enter your Password');

    fireEvent.change(input, { target: { value: 'StrongPass1!' } });

    expect(input).toHaveClass('input-error');
  });
});
