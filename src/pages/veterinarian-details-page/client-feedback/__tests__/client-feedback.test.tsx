import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ClientFeedback from '../client-feedback';
import type { FeedbackPageResponse, VeterinarianFeedback } from '~/store/api/vets/vets-types';

const mockQueryResult = {
  data: undefined as FeedbackPageResponse | undefined,
  isFetching: false,
  isError: false,
};

vi.mock('~/store/api/vets/vets-api', () => ({
  useGetVeterinarianFeedbackQuery: () => mockQueryResult,
}));

const makeFeedback = (overrides: Partial<VeterinarianFeedback> = {}): VeterinarianFeedback => ({
  id: '1',
  clientName: 'John Doe',
  petLabel: 'Buddy (Dog)',
  rating: 5,
  comment: 'Excellent service!',
  date: '2024-01-15',
  ...overrides,
});

const makePage = (
  content: VeterinarianFeedback[],
  totalPages = 1
): FeedbackPageResponse => ({
  content,
  page: 1,
  size: 4,
  totalElements: content.length,
  totalPages,
});

describe('ClientFeedback', () => {
  beforeEach(() => {
    mockQueryResult.data = undefined;
    mockQueryResult.isFetching = false;
    mockQueryResult.isError = false;
  });

  it('shows loading message when fetching', () => {
    mockQueryResult.isFetching = true;
    render(<ClientFeedback veterinarianId="v1" />);
    expect(screen.getByText('Loading feedback...')).toBeInTheDocument();
  });

  it('shows error message when fetch fails', () => {
    mockQueryResult.isError = true;
    render(<ClientFeedback veterinarianId="v1" />);
    expect(
      screen.getByText('Failed to load feedback. Please refresh and try again.')
    ).toBeInTheDocument();
  });

  it('shows empty message when no reviews are available', () => {
    mockQueryResult.data = makePage([]);
    render(<ClientFeedback veterinarianId="v1" />);
    expect(screen.getByText('No feedback available yet.')).toBeInTheDocument();
  });

  it('renders review card with client name', () => {
    mockQueryResult.data = makePage([makeFeedback()]);
    render(<ClientFeedback veterinarianId="v1" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders pet label in the review card', () => {
    mockQueryResult.data = makePage([makeFeedback()]);
    render(<ClientFeedback veterinarianId="v1" />);
    expect(screen.getByText('Buddy (Dog)')).toBeInTheDocument();
  });

  it('renders the rating value', () => {
    mockQueryResult.data = makePage([makeFeedback({ rating: 4 })]);
    render(<ClientFeedback veterinarianId="v1" />);
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('renders the review comment', () => {
    mockQueryResult.data = makePage([makeFeedback()]);
    render(<ClientFeedback veterinarianId="v1" />);
    expect(screen.getByText('Excellent service!')).toBeInTheDocument();
  });

  it('renders "No comment provided." when comment is empty', () => {
    mockQueryResult.data = makePage([makeFeedback({ comment: '' })]);
    render(<ClientFeedback veterinarianId="v1" />);
    expect(screen.getByText('No comment provided.')).toBeInTheDocument();
  });

  it('renders a formatted date string', () => {
    mockQueryResult.data = makePage([makeFeedback({ date: '2024-01-15' })]);
    render(<ClientFeedback veterinarianId="v1" />);
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
  });

  it('renders "Date not available" when date is an empty string', () => {
    mockQueryResult.data = makePage([makeFeedback({ date: '' })]);
    render(<ClientFeedback veterinarianId="v1" />);
    expect(screen.getByText('Date not available')).toBeInTheDocument();
  });

  it('renders initials from a two-word client name', () => {
    mockQueryResult.data = makePage([makeFeedback({ clientName: 'John Doe' })]);
    render(<ClientFeedback veterinarianId="v1" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders first two characters as initials for a single-word name', () => {
    mockQueryResult.data = makePage([makeFeedback({ clientName: 'Alice' })]);
    render(<ClientFeedback veterinarianId="v1" />);
    expect(screen.getByText('AL')).toBeInTheDocument();
  });

  it('renders multiple review cards when data contains multiple reviews', () => {
    mockQueryResult.data = makePage([
      makeFeedback({ id: '1', clientName: 'Alice Smith' }),
      makeFeedback({ id: '2', clientName: 'Bob Jones' }),
    ]);
    render(<ClientFeedback veterinarianId="v1" />);
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
  });

  it('renders sort dropdown with default value "Rating"', () => {
    render(<ClientFeedback veterinarianId="v1" />);
    expect(screen.getByRole('combobox')).toHaveValue('Rating');
  });

  it('updates sort dropdown value when a different option is selected', () => {
    render(<ClientFeedback veterinarianId="v1" />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Date' } });
    expect(select).toHaveValue('Date');
  });

  it('renders "Previous" button disabled on the first page', () => {
    mockQueryResult.data = makePage([makeFeedback()], 3);
    render(<ClientFeedback veterinarianId="v1" />);
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
  });

  it('renders "Next" button enabled when there are multiple pages', () => {
    mockQueryResult.data = makePage([makeFeedback()], 3);
    render(<ClientFeedback veterinarianId="v1" />);
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
  });

  it('advances to page 2 when Next is clicked', () => {
    mockQueryResult.data = makePage([makeFeedback()], 3);
    render(<ClientFeedback veterinarianId="v1" />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByRole('button', { name: '2' })).toHaveClass('bg-black-900');
  });

  it('disables "Next" button on the last page', () => {
    mockQueryResult.data = makePage([makeFeedback()], 3);
    render(<ClientFeedback veterinarianId="v1" />);
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('disables "Previous" button after navigating back to the first page', () => {
    mockQueryResult.data = makePage([makeFeedback()], 3);
    render(<ClientFeedback veterinarianId="v1" />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /previous/i }));
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
  });

  it('resets to page 1 when the sort option changes', () => {
    mockQueryResult.data = makePage([makeFeedback()], 3);
    render(<ClientFeedback veterinarianId="v1" />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Date' } });
    expect(screen.getByRole('button', { name: '1' })).toHaveClass('bg-black-900');
  });

  it('navigates directly to a page when a numbered page button is clicked', () => {
    mockQueryResult.data = makePage([makeFeedback()], 3);
    render(<ClientFeedback veterinarianId="v1" />);
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByRole('button', { name: '2' })).toHaveClass('bg-black-900');
  });
});
