import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '~/__tests__';
import { SelectInput } from '~/components/forms/select-input/select-input';

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

describe('SelectInput', () => {
  it('renders with placeholder when no value is selected', () => {
    render(<SelectInput options={OPTIONS} placeholder="Pick a fruit" />);

    expect(screen.getByPlaceholderText('Pick a fruit')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<SelectInput options={OPTIONS} label="Fruit" />);

    expect(screen.getByText('Fruit')).toBeInTheDocument();
  });

  it('renders required asterisk with label', () => {
    render(<SelectInput options={OPTIONS} label="Fruit" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows selected option label in the input', () => {
    render(<SelectInput options={OPTIONS} value="banana" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Banana');
  });

  it('opens dropdown when input is clicked', () => {
    render(<SelectInput options={OPTIONS} />);

    expect(screen.queryByText('Apple')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('textbox'));

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
  });

  it('opens dropdown when toggle button is clicked', () => {
    render(<SelectInput options={OPTIONS} />);

    const toggleButton = screen.getByRole('button', {
      name: /toggle select options/i,
    });
    fireEvent.click(toggleButton);

    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('calls onChange with the selected option value', () => {
    const onChange = vi.fn();
    render(<SelectInput options={OPTIONS} onChange={onChange} />);

    fireEvent.click(screen.getByRole('textbox'));
    fireEvent.click(screen.getByText('Banana'));

    expect(onChange).toHaveBeenCalledWith('banana');
  });

  it('closes dropdown after selecting an option', () => {
    render(<SelectInput options={OPTIONS} />);

    fireEvent.click(screen.getByRole('textbox'));
    expect(screen.getByText('Apple')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Apple'));
    expect(screen.queryByText('Banana')).not.toBeInTheDocument();
  });

  it('does not open dropdown when disabled', () => {
    render(<SelectInput options={OPTIONS} disabled />);

    fireEvent.click(screen.getByRole('textbox'));

    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });

  it('shows error message when error is provided', () => {
    render(<SelectInput options={OPTIONS} error="This field is required" />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('does not show error message when no error is provided', () => {
    render(<SelectInput options={OPTIONS} />);

    expect(
      screen.queryByText('This field is required')
    ).not.toBeInTheDocument();
  });

  it('shows clear button when clearable and value is set', () => {
    render(
      <SelectInput
        options={OPTIONS}
        value="apple"
        clearable
        onChange={vi.fn()}
      />
    );

    expect(
      screen.getByRole('button', { name: /clear selection/i })
    ).toBeInTheDocument();
  });

  it('does not show clear button when clearable but no value', () => {
    render(<SelectInput options={OPTIONS} clearable />);

    expect(
      screen.queryByRole('button', { name: /clear selection/i })
    ).not.toBeInTheDocument();
  });

  it('calls onChange with empty string when clear button is clicked', () => {
    const onChange = vi.fn();
    render(
      <SelectInput
        options={OPTIONS}
        value="apple"
        clearable
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /clear selection/i }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('highlights the selected option in the dropdown', () => {
    render(<SelectInput options={OPTIONS} value="cherry" />);

    fireEvent.click(screen.getByRole('textbox'));

    const cherryButton = screen.getByRole('button', { name: 'Cherry' });
    expect(cherryButton).toHaveClass('select-item-selected');
  });

  it('closes dropdown when clicking outside', () => {
    render(
      <div>
        <SelectInput options={OPTIONS} />
        <div data-testid="outside">outside</div>
      </div>
    );

    fireEvent.click(screen.getByRole('textbox'));
    expect(screen.getByText('Apple')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });
});
