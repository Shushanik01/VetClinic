import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RadioButtons from '../RadioButtons';

vi.mock('../RadioButtons.module.css', () => ({ default: {} }));

describe('RadioButtons', () => {
  const defaultProps = {
    setFormType: vi.fn(),
    firstButtonLabel: 'Existing Client',
    secondButtonLabel: 'New Client',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Rendering ---

  it('renders both radio button labels', () => {
    render(<RadioButtons {...defaultProps} />);
    expect(screen.getByLabelText('Existing Client')).toBeInTheDocument();
    expect(screen.getByLabelText('New Client')).toBeInTheDocument();
  });

  it('renders with no heading when heading prop is omitted', () => {
    render(<RadioButtons {...defaultProps} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toBe('');
  });

  it('renders the heading when heading prop is provided', () => {
    render(<RadioButtons {...defaultProps} heading="Select Client Type" />);
    expect(screen.getByRole('heading', { name: 'Select Client Type' })).toBeInTheDocument();
  });

  it('first radio button is checked by default', () => {
    render(<RadioButtons {...defaultProps} />);
    const firstRadio = screen.getByLabelText('Existing Client') as HTMLInputElement;
    expect(firstRadio.defaultChecked).toBe(true);
  });

  it('both inputs have the same radio group name', () => {
    render(<RadioButtons {...defaultProps} />);
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios[0].name).toBe('radioButton');
    expect(radios[1].name).toBe('radioButton');
  });

  it('first radio has value "first"', () => {
    render(<RadioButtons {...defaultProps} />);
    const firstRadio = screen.getByLabelText('Existing Client') as HTMLInputElement;
    expect(firstRadio.value).toBe('first');
  });

  it('second radio has value "second"', () => {
    render(<RadioButtons {...defaultProps} />);
    const secondRadio = screen.getByLabelText('New Client') as HTMLInputElement;
    expect(secondRadio.value).toBe('second');
  });

  // --- Interaction ---

  it('calls setFormType with "first" when the first radio is clicked', () => {
    const setFormType = vi.fn();
    render(<RadioButtons {...defaultProps} setFormType={setFormType} />);
    // Click second first to deselect first, then click first to trigger its onChange
    fireEvent.click(screen.getByLabelText('New Client'));
    fireEvent.click(screen.getByLabelText('Existing Client'));

    expect(setFormType).toHaveBeenLastCalledWith('first');
  });

  it('calls setFormType with "second" when the second radio is clicked', () => {
    const setFormType = vi.fn();
    render(<RadioButtons {...defaultProps} setFormType={setFormType} />);
    fireEvent.click(screen.getByLabelText('New Client'));

    expect(setFormType).toHaveBeenCalledWith('second');
  });

  it('renders two radio inputs total', () => {
    render(<RadioButtons {...defaultProps} />);
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });
});
