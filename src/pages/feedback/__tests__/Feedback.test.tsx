import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Feedback } from '../feedback';

const { mockAddFeedback, mockUpdateFeedback, mockNotify } = vi.hoisted(() => ({
  mockAddFeedback: vi.fn(),
  mockUpdateFeedback: vi.fn(),
  mockNotify: vi.fn(),
}));

vi.mock('~/store/api/feedback/feedback-api', () => ({
  useAddFeedbackMutation: () => [mockAddFeedback],
  useUpdateFeedbackMutation: () => [mockUpdateFeedback],
}));

vi.mock('~/app/providers/notifications/notifications', () => ({
  notify: mockNotify,
}));

vi.mock('~/assets/svg/redstar.svg', () => ({ default: 'redstar.svg' }));

vi.mock('../feedback.module.css', () => ({ default: {} }));

const defaultProps = {
  onClose: vi.fn(),
  appointmentId: 'appt-123',
};

describe('Feedback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAddFeedback.mockResolvedValue({ data: { feedbackId: 'fb-new' } });
    mockUpdateFeedback.mockResolvedValue({ data: {} });
  });

  // --- Rendering ---

  it('renders the Feedback header', () => {
    render(<Feedback {...defaultProps} />);
    expect(screen.getByText('Feedback')).toBeInTheDocument();
  });

  it('renders the rating prompt text', () => {
    render(<Feedback {...defaultProps} />);
    expect(screen.getByText('Please rate your experience')).toBeInTheDocument();
  });

  it('renders 5 star icons', () => {
    render(<Feedback {...defaultProps} />);
    const stars = screen.getAllByRole('img', { hidden: true });
    // FeedbackStar (x5) + redstar img
    expect(screen.getAllByLabelText('svg-react-mock')).toHaveLength(5);
  });

  it('renders initial rating as 0/5 stars', () => {
    render(<Feedback {...defaultProps} />);
    expect(screen.getByText('0/5 stars')).toBeInTheDocument();
  });

  it('renders Cancel and Submit buttons', () => {
    render(<Feedback {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('renders the comment textarea', () => {
    render(<Feedback {...defaultProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  // --- Star rating interaction ---

  it('updates displayed rating when a star is clicked', () => {
    render(<Feedback {...defaultProps} />);
    const stars = screen.getAllByLabelText('svg-react-mock');

    fireEvent.click(stars[2]); // 3rd star = rating 3

    expect(screen.getByText('3/5 stars')).toBeInTheDocument();
  });

  it('updates rating to 5 when the last star is clicked', () => {
    render(<Feedback {...defaultProps} />);
    const stars = screen.getAllByLabelText('svg-react-mock');

    fireEvent.click(stars[4]);

    expect(screen.getByText('5/5 stars')).toBeInTheDocument();
  });

  it('updates rating to 1 when the first star is clicked', () => {
    render(<Feedback {...defaultProps} />);
    const stars = screen.getAllByLabelText('svg-react-mock');

    fireEvent.click(stars[0]);

    expect(screen.getByText('1/5 stars')).toBeInTheDocument();
  });

  // --- Comment textarea ---

  it('shows default placeholder when rating is 0', () => {
    render(<Feedback {...defaultProps} />);
    expect(screen.getByPlaceholderText('Add comments')).toBeInTheDocument();
  });

  it('shows "Please explain your low rating" placeholder when rating is 1', () => {
    render(<Feedback {...defaultProps} />);
    const stars = screen.getAllByLabelText('svg-react-mock');
    fireEvent.click(stars[0]);

    expect(screen.getByPlaceholderText('Please explain your low rating')).toBeInTheDocument();
  });

  it('shows "Please explain your low rating" placeholder when rating is 2', () => {
    render(<Feedback {...defaultProps} />);
    const stars = screen.getAllByLabelText('svg-react-mock');
    fireEvent.click(stars[1]);

    expect(screen.getByPlaceholderText('Please explain your low rating')).toBeInTheDocument();
  });

  it('shows default placeholder when rating is 3', () => {
    render(<Feedback {...defaultProps} />);
    const stars = screen.getAllByLabelText('svg-react-mock');
    fireEvent.click(stars[2]);

    expect(screen.getByPlaceholderText('Add comments')).toBeInTheDocument();
  });

  it('allows typing in the comment textarea', () => {
    render(<Feedback {...defaultProps} />);
    const textarea = screen.getByRole('textbox');

    fireEvent.change(textarea, { target: { value: 'Great service!' } });

    expect((textarea as HTMLTextAreaElement).value).toBe('Great service!');
  });

  // --- Validation errors ---

  it('shows rating error when submitted without selecting a rating', async () => {
    render(<Feedback {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Please select a rating.')).toBeInTheDocument();
  });

  it('shows comment error when rating is low (<=2) and comment is empty on submit', async () => {
    render(<Feedback {...defaultProps} />);
    const stars = screen.getAllByLabelText('svg-react-mock');
    fireEvent.click(stars[0]); // rating = 1

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      screen.getByText('Please review and edit your feedback to meet our guidlines so we can publish it')
    ).toBeInTheDocument();
  });

  it('does not show comment error when rating is 3 or above and comment is empty', async () => {
    render(<Feedback {...defaultProps} />);
    const stars = screen.getAllByLabelText('svg-react-mock');
    fireEvent.click(stars[2]); // rating = 3

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      screen.queryByText('Please review and edit your feedback to meet our guidlines so we can publish it')
    ).not.toBeInTheDocument();
  });

  it('does not show rating error before submission', () => {
    render(<Feedback {...defaultProps} />);
    expect(screen.queryByText('Please select a rating.')).not.toBeInTheDocument();
  });

  // --- Cancel button ---

  it('calls onClose when Cancel button is clicked', () => {
    const onClose = vi.fn();
    render(<Feedback {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  // --- Successful submission (add) ---

  it('calls addFeedback with correct args when no feedbackId is provided', async () => {
    render(<Feedback {...defaultProps} />);
    const stars = screen.getAllByLabelText('svg-react-mock');
    fireEvent.click(stars[3]); // rating = 4
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Nice!' } });

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockAddFeedback).toHaveBeenCalledWith({
        appointmentId: 'appt-123',
        comment: 'Nice!',
        rating: 4,
      });
    });
  });

  it('calls notify with success message after adding feedback', async () => {
    render(<Feedback {...defaultProps} />);
    const stars = screen.getAllByLabelText('svg-react-mock');
    fireEvent.click(stars[3]);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Feedback submitted', type: 'success' })
      );
    });
  });

  it('calls onClose after successful add', async () => {
    const onClose = vi.fn();
    render(<Feedback {...defaultProps} onClose={onClose} />);
    const stars = screen.getAllByLabelText('svg-react-mock');
    fireEvent.click(stars[3]);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });

  it('calls onSuccess with new feedbackId after successful add', async () => {
    const onSuccess = vi.fn();
    render(<Feedback {...defaultProps} onSuccess={onSuccess} />);
    const stars = screen.getAllByLabelText('svg-react-mock');
    fireEvent.click(stars[3]);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith('fb-new'));
  });

  // --- Successful submission (update) ---

  it('calls updateFeedback with correct args when feedbackId is provided', async () => {
    render(<Feedback {...defaultProps} feedbackId="fb-existing" />);
    const stars = screen.getAllByLabelText('svg-react-mock');
    fireEvent.click(stars[4]); // rating = 5
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated comment' } });

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockUpdateFeedback).toHaveBeenCalledWith({
        feedbackId: 'fb-existing',
        comment: 'Updated comment',
        rating: 5,
      });
    });
  });

  it('calls notify with "Feedback updated" message when feedbackId is provided', async () => {
    render(<Feedback {...defaultProps} feedbackId="fb-existing" />);
    const stars = screen.getAllByLabelText('svg-react-mock');
    fireEvent.click(stars[4]);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Feedback updated', type: 'success' })
      );
    });
  });

  it('does not call addFeedback when feedbackId is provided', async () => {
    render(<Feedback {...defaultProps} feedbackId="fb-existing" />);
    const stars = screen.getAllByLabelText('svg-react-mock');
    fireEvent.click(stars[4]);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(mockUpdateFeedback).toHaveBeenCalled());
    expect(mockAddFeedback).not.toHaveBeenCalled();
  });

  // --- Error handling ---

  it('shows "Already submitted" notification and calls onClose on 409 error', async () => {
    const onClose = vi.fn();
    mockAddFeedback.mockResolvedValue({ error: { status: 409 } });

    render(<Feedback {...defaultProps} onClose={onClose} />);
    const stars = screen.getAllByLabelText('svg-react-mock');
    fireEvent.click(stars[3]);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Already submitted', type: 'error' })
      );
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  it('shows "Submission failed" notification on non-409 error', async () => {
    mockAddFeedback.mockResolvedValue({ error: { status: 500 } });

    render(<Feedback {...defaultProps} />);
    const stars = screen.getAllByLabelText('svg-react-mock');
    fireEvent.click(stars[3]);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Submission failed', type: 'error' })
      );
    });
  });

  it('does not call onClose on non-409 error', async () => {
    const onClose = vi.fn();
    mockAddFeedback.mockResolvedValue({ error: { status: 500 } });

    render(<Feedback {...defaultProps} onClose={onClose} />);
    const stars = screen.getAllByLabelText('svg-react-mock');
    fireEvent.click(stars[3]);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(mockNotify).toHaveBeenCalled());
    expect(onClose).not.toHaveBeenCalled();
  });

  // --- Low rating with comment ---

  it('submits successfully with low rating when comment is provided', async () => {
    render(<Feedback {...defaultProps} />);
    const stars = screen.getAllByLabelText('svg-react-mock');
    fireEvent.click(stars[1]); // rating = 2
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Not great' } });

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockAddFeedback).toHaveBeenCalledWith({
        appointmentId: 'appt-123',
        comment: 'Not great',
        rating: 2,
      });
    });
  });
});
