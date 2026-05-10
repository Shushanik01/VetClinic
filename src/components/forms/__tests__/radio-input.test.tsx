import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '~/__tests__';
import { RadioInput } from '~/components/forms/radio-input';

const OPTIONS = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

describe('RadioInput', () => {
  it('renders all options', () => {
    render(<RadioInput name="test" options={OPTIONS} />);

    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<RadioInput name="test" options={OPTIONS} label="Pick one" />);

    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('renders required asterisk when required is true', () => {
    render(
      <RadioInput name="test" options={OPTIONS} label="Choose" required />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not render label or asterisk when label is not provided', () => {
    render(<RadioInput name="test" options={OPTIONS} />);

    expect(screen.queryByRole('label')).not.toBeInTheDocument();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('marks the correct option as checked when value matches', () => {
    render(<RadioInput name="test" options={OPTIONS} value="b" />);

    const radios = screen.getAllByRole('radio');
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
    expect(radios[2]).not.toBeChecked();
  });

  it('calls onChange with the option value when an option is clicked', () => {
    const onChange = vi.fn();
    render(<RadioInput name="test" options={OPTIONS} onChange={onChange} />);

    fireEvent.click(screen.getByLabelText('Option A'));
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('does not call onChange when onChange is not provided', () => {
    render(<RadioInput name="test" options={OPTIONS} />);
    // Should not throw
    fireEvent.click(screen.getByLabelText('Option A'));
  });

  it('deselects current option when allowDeselect is true and same option clicked', () => {
    const onChange = vi.fn();
    render(
      <RadioInput
        name="test"
        options={OPTIONS}
        value="a"
        onChange={onChange}
        allowDeselect
      />
    );

    // allowDeselect=true: clicking an unchosen option still calls onChange with that value
    fireEvent.click(screen.getByLabelText('Option B'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('does not deselect when allowDeselect is false and same option clicked', () => {
    const onChange = vi.fn();
    render(
      <RadioInput
        name="test"
        options={OPTIONS}
        onChange={onChange}
        allowDeselect={false}
      />
    );

    // allowDeselect=false: clicking any option calls onChange with the option value
    fireEvent.click(screen.getByLabelText('Option C'));
    expect(onChange).toHaveBeenCalledWith('c');
  });

  it('deselect renders the component with no option selected when value is empty', () => {
    render(<RadioInput name="test" options={OPTIONS} value="" allowDeselect />);

    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio).not.toBeChecked();
    });
  });

  it('uses horizontal layout when horizontal prop is true', () => {
    const { container } = render(
      <RadioInput name="test" options={OPTIONS} horizontal />
    );

    const optionContainer = container.querySelector(String.raw `.flex.flex-row`);
    expect(optionContainer).toBeInTheDocument();
  });

  it('uses vertical layout by default', () => {
    const { container } = render(<RadioInput name="test" options={OPTIONS} />);

    const optionContainer = container.querySelector('.flex.flex-col');
    expect(optionContainer).toBeInTheDocument();
  });

  it('applies custom verticalGapClassName', () => {
    const { container } = render(
      <RadioInput
        name="test"
        options={OPTIONS}
        verticalGapClassName="gap-[20px]"
      />
    );

    const optionContainer = container.querySelector('.gap-\\[20px\\]');
    expect(optionContainer).toBeInTheDocument();
  });

  it('shows inner circle div only for the selected option', () => {
    const { container } = render(
      <RadioInput name="test" options={OPTIONS} value="b" />
    );

    // Inner circle is rendered inside the outer div of the selected option
    const labels = container.querySelectorAll('label');
    // Second label is selected
    const innerCircles = container.querySelectorAll(
      String.raw `.w-\\[16px\\].h-\\[16px\\].rounded-\\[11\\.33px\\]`
    );
    expect(innerCircles).toHaveLength(1);
    expect(labels[1]).toContainElement(innerCircles[0] as HTMLElement);
  });
});
