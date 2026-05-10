import { describe, expect, it } from 'vitest';
import { render, screen } from '~/__tests__';
import { TextInput } from '~/components/forms/text-input';

describe('TextInput', () => {
  it('applies error class when error is true', () => {
    render(<TextInput placeholder="Name" error />);

    expect(screen.getByPlaceholderText('Name')).toHaveClass('input-error');
  });

  it('does not apply error class when error is false', () => {
    render(<TextInput placeholder="Email" error={false} />);

    expect(screen.getByPlaceholderText('Email')).not.toHaveClass('input-error');
  });
});
