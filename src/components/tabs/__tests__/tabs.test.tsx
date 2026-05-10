import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '~/__tests__';
import { Tabs } from '~/components/tabs/tabs';

describe('Tabs', () => {
  const options = [
    { label: 'General', value: 'general' },
    { label: 'Pets', value: 'pets' },
  ];

  it('renders all tab options', () => {
    render(<Tabs options={options} value="general" onChange={vi.fn()} />);

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Pets')).toBeInTheDocument();
  });

  it('calls onChange with clicked tab value', () => {
    const onChange = vi.fn();
    render(<Tabs options={options} value="general" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Pets' }));

    expect(onChange).toHaveBeenCalledWith('pets');
  });

  it('applies active styling to selected tab', () => {
    render(<Tabs options={options} value="general" onChange={vi.fn()} />);

    const activeButton = screen.getByRole('button', { name: 'General' });
    const inactiveButton = screen.getByRole('button', { name: 'Pets' });

    expect(activeButton.className).toContain('text-green-400');
    expect(inactiveButton.className).toContain('text-black-800');
  });
});
