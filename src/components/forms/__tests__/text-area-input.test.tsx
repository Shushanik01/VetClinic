import { describe, expect, it } from 'vitest';
import { render, screen } from '~/__tests__';
import { TextAreaInput } from '~/components/forms/text-area-input';

describe('TextAreaInput', () => {
  it('renders a textarea element', () => {
    render(<TextAreaInput placeholder="Enter text" />);

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text').tagName).toBe('TEXTAREA');
  });

  it('applies input-error class when error prop is true', () => {
    render(<TextAreaInput placeholder="Enter text" error />);

    expect(screen.getByPlaceholderText('Enter text')).toHaveClass(
      'input-error'
    );
  });

  it('does not apply input-error class when error prop is false', () => {
    render(<TextAreaInput placeholder="Enter text" error={false} />);

    expect(screen.getByPlaceholderText('Enter text')).not.toHaveClass(
      'input-error'
    );
  });

  it('does not apply input-error class when error prop is not provided', () => {
    render(<TextAreaInput placeholder="Enter text" />);

    expect(screen.getByPlaceholderText('Enter text')).not.toHaveClass(
      'input-error'
    );
  });

  it('forwards extra textarea props', () => {
    render(
      <TextAreaInput
        placeholder="Enter text"
        rows={5}
        maxLength={200}
        data-testid="my-textarea"
      />
    );

    const textarea = screen.getByTestId('my-textarea');
    expect(textarea).toHaveAttribute('rows', '5');
    expect(textarea).toHaveAttribute('maxLength', '200');
  });

  it('applies additional className', () => {
    render(<TextAreaInput placeholder="Enter text" className="my-class" />);

    expect(screen.getByPlaceholderText('Enter text')).toHaveClass('my-class');
  });
});
