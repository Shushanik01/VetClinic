import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Table from '../table';
import type { Data } from '../table';

vi.mock('~/assets/svg/filterIcon.svg', () => ({ default: 'filterIcon.svg' }));
vi.mock('~/assets/svg/Editor.svg', () => ({ default: 'Editor.svg' }));
vi.mock('~/assets/svg/delete.svg', () => ({ default: 'delete.svg' }));
vi.mock('~/assets/svg/icons/nosearch.svg', () => ({ default: 'nosearch.svg' }));
vi.mock('../table.module.css', () => ({ default: {} }));

const TODAY = new Date();
const todayStr = `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, '0')}-${String(TODAY.getDate()).padStart(2, '0')}`;

const makeRow = (overrides: Partial<Data> = {}): Data => ({
  id: 1,
  appointmentId: 'appt-1',
  veterinarianId: 'vet-1',
  clientName: 'John Doe',
  petName: 'Buddy',
  petAge: '3 years',
  vetName: 'Dr. Smith',
  address: '123 Main St',
  specialty: 'Surgery',
  date: `${todayStr}T10:00:00Z`,
  status: 'Scheduled',
  ...overrides,
});

const defaultProps = {
  data: [makeRow()],
  onDeleteClick: vi.fn(),
  onEditClick: vi.fn(),
  setComponentType: vi.fn(),
};

describe('Table', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Column headers ---

  it('renders all column headers', () => {
    render(<Table {...defaultProps} />);
    expect(screen.getByText('Client Name')).toBeInTheDocument();
    expect(screen.getByText('Pet Name')).toBeInTheDocument();
    expect(screen.getByText('Pet Age')).toBeInTheDocument();
    expect(screen.getByText('Veterinarian Name')).toBeInTheDocument();
    expect(screen.getByText('Clinic Adress')).toBeInTheDocument();
    expect(screen.getByText('Specialty')).toBeInTheDocument();
    expect(screen.getByText('Date and Time')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  // --- Row data rendering ---

  it('renders row data correctly', () => {
    render(<Table {...defaultProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Buddy')).toBeInTheDocument();
    expect(screen.getByText('3 years')).toBeInTheDocument();
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('Surgery')).toBeInTheDocument();
    expect(screen.getByText('Scheduled')).toBeInTheDocument();
  });

  it('renders multiple rows', () => {
    const data = [
      makeRow({ id: 1, clientName: 'Alice' }),
      makeRow({ id: 2, clientName: 'Bob' }),
    ];
    render(<Table {...defaultProps} data={data} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  // --- Action buttons (Scheduled only) ---

  it('renders edit and delete icons for Scheduled appointments', () => {
    render(<Table {...defaultProps} />);
    expect(screen.getByAltText('edit')).toBeInTheDocument();
    expect(screen.getByAltText('delete')).toBeInTheDocument();
  });

  it('does not render edit/delete icons for non-Scheduled appointments', () => {
    render(<Table {...defaultProps} data={[makeRow({ status: 'Canceled' })]} />);
    expect(screen.queryByAltText('edit')).not.toBeInTheDocument();
    expect(screen.queryByAltText('delete')).not.toBeInTheDocument();
  });

  it('calls onEditClick and setComponentType("Reschedule") when edit is clicked', () => {
    const onEditClick = vi.fn();
    const setComponentType = vi.fn();
    render(<Table {...defaultProps} onEditClick={onEditClick} setComponentType={setComponentType} />);
    fireEvent.click(screen.getByAltText('edit'));

    expect(onEditClick).toHaveBeenCalledWith(1);
    expect(setComponentType).toHaveBeenCalledWith('Reschedule');
  });

  it('calls onDeleteClick and setComponentType("Cancel") when delete is clicked', () => {
    const onDeleteClick = vi.fn();
    const setComponentType = vi.fn();
    render(<Table {...defaultProps} onDeleteClick={onDeleteClick} setComponentType={setComponentType} />);
    fireEvent.click(screen.getByAltText('delete'));

    expect(onDeleteClick).toHaveBeenCalledWith(1);
    expect(setComponentType).toHaveBeenCalledWith('Cancel');
  });

  // --- Empty state ---

  it('shows "No appointments for today" when no rows match today\'s date filter', () => {
    render(<Table {...defaultProps} data={[makeRow({ date: '2020-01-01T10:00:00Z' })]} />);
    expect(screen.getByText('No appointments for today')).toBeInTheDocument();
  });

  it('shows "No appointments found" and clear button when non-date filter yields no results', () => {
    // Two rows: Alice/Surgery and Bob/Dentistry — both dated today so they pass the date filter
    const data = [
      makeRow({ id: 1, clientName: 'Alice', specialty: 'Surgery' }),
      makeRow({ id: 2, clientName: 'Bob', specialty: 'Dentistry' }),
    ];
    render(<Table {...defaultProps} data={data} />);

    const filterIcons = screen.getAllByAltText('filter');

    // Filter clientName = 'Alice'
    fireEvent.click(filterIcons[0]); // open Client Name filter dropdown
    fireEvent.click(screen.getAllByText('Alice')[0]); // first occurrence is the dropdown option

    // Filter specialty = 'Dentistry' — conflicts with Alice (who has Surgery), so 0 results
    fireEvent.click(filterIcons[3]); // open Specialty filter dropdown
    fireEvent.click(screen.getAllByText('Dentistry')[0]);

    expect(screen.getByText('No appointments found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear all filters' })).toBeInTheDocument();
  });

  it('restores rows after clearing all filters', () => {
    const data = [
      makeRow({ id: 1, clientName: 'Alice', specialty: 'Surgery' }),
      makeRow({ id: 2, clientName: 'Bob', specialty: 'Dentistry' }),
    ];
    render(<Table {...defaultProps} data={data} />);

    const filterIcons = screen.getAllByAltText('filter');
    fireEvent.click(filterIcons[0]);
    fireEvent.click(screen.getAllByText('Alice')[0]);
    fireEvent.click(filterIcons[3]);
    fireEvent.click(screen.getAllByText('Dentistry')[0]);

    fireEvent.click(screen.getByRole('button', { name: 'Clear all filters' }));

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  // --- Filtered count callback ---

  it('calls onFilteredCountChange with the number of visible rows', () => {
    const onFilteredCountChange = vi.fn();
    render(<Table {...defaultProps} onFilteredCountChange={onFilteredCountChange} />);
    expect(onFilteredCountChange).toHaveBeenCalledWith(1);
  });

  it('calls onFilteredCountChange with 0 when no rows match today', () => {
    const onFilteredCountChange = vi.fn();
    render(
      <Table
        {...defaultProps}
        data={[makeRow({ date: '2020-01-01T10:00:00Z' })]}
        onFilteredCountChange={onFilteredCountChange}
      />
    );
    expect(onFilteredCountChange).toHaveBeenCalledWith(0);
  });

  // --- activeDate prop ---

  it('shows rows for a specific activeDate when passed', () => {
    const data = [
      makeRow({ id: 1, date: `${todayStr}T09:00:00Z`, clientName: 'Alice' }),
      makeRow({ id: 2, date: '2020-05-10T09:00:00Z', clientName: 'Bob' }),
    ];
    render(<Table {...defaultProps} data={data} activeDate={todayStr} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  // --- Filter toggle ---

  it('opens filter dropdown when filter icon is clicked', () => {
    const data = [makeRow({ clientName: 'Alice' })];
    render(<Table {...defaultProps} data={data} />);
    fireEvent.click(screen.getAllByAltText('filter')[0]);
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(1); // header option + row
  });

  it('closes filter dropdown when the same filter icon is clicked again', () => {
    render(<Table {...defaultProps} />);
    const filterIcons = screen.getAllByAltText('filter');
    fireEvent.click(filterIcons[0]);
    fireEvent.click(filterIcons[0]);
    // dropdown closed — only one "John Doe" in the table cell, not also in a dropdown
    expect(screen.getAllByText('John Doe')).toHaveLength(1);
  });
});
