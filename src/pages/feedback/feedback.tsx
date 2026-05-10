import { useState } from 'react';
import '../../assets/styles/fonts.css';
import styles from './feedback.module.css';
import redstar from '~/assets/svg/redstar.svg';
import FeedbackStar from '~/assets/svg/feedbackStar.svg?react';
import {
  useAddFeedbackMutation,
  useUpdateFeedbackMutation,
} from '~/store/api/feedback/feedback-api';
import { notify } from '~/app/providers/notifications/notifications';

interface FeedbackProps {
  onClose: () => void;
  appointmentId: string;
  feedbackId?: string;
  onSuccess?: (feedbackId?: string) => void;
}

export const Feedback: React.FC<FeedbackProps> = ({
  onSuccess,
  onClose,
  appointmentId,
  feedbackId,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [addFeedback] = useAddFeedbackMutation();
  const [updateFeedback] = useUpdateFeedbackMutation();

  const commentRequired = rating > 0 && rating <= 2;
  const ratingError = submitted && rating === 0;
  const commentError = submitted && commentRequired && comment.trim() === '';

  const handleSubmit = async () => {
    setSubmitted(true);
    if (rating === 0) return;
    if (commentRequired && comment.trim() === '') return;

    if (feedbackId) {
      const result = await updateFeedback({ feedbackId, comment, rating });
      if ('error' in result) {
        notify({
          title: 'Submission failed',
          description: 'Could not submit feedback. Please try again.',
          type: 'error',
        });
        return;
      }
      notify({
        title: 'Feedback updated',
        description: 'Your feedback has been updated successfully.',
        type: 'success',
      });
      onSuccess?.();
    } else {
      const result = await addFeedback({ appointmentId, comment, rating });
      if ('error' in result) {
        if ((result.error as { status?: number })?.status === 409) {
          notify({
            title: 'Already submitted',
            description: 'You have already submitted feedback for this appointment.',
            type: 'error',
          });
          onClose();
        } else {
          notify({
            title: 'Submission failed',
            description: 'Could not submit feedback. Please try again.',
            type: 'error',
          });
        }
        return;
      }
      notify({
        title: 'Feedback submitted',
        description: 'Your feedback has been added successfully.',
        type: 'success',
      });
      onSuccess?.(result.data.feedbackId);
    }
    onClose();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Feedback</h2>
      <div className={styles.rating_row}>
        <p className={styles.feedbackText}>Please rate your experience</p>{' '}
        <img src={redstar} />
      </div>
      <div className={styles.star_wrapper}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FeedbackStar
            key={star}
            className={`${styles.star} ${star <= rating ? styles.star_active : ''}`}
            onClick={() => setRating(star)}
          />
        ))}
        <p> {rating}/5 stars </p>
      </div>
      {ratingError && <p className={styles.error}>Please select a rating.</p>}
      <div className={styles.comment_label}>
        <p className={styles.feedbackText}>Comments</p>
        {commentRequired && <img src={redstar} />}
      </div>
      <textarea
        placeholder={
          commentRequired ? 'Please explain your low rating' : 'Add comments'
        }
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className={`${styles.feedbackTextarea} ${commentError ? styles.feedbackTextarea_error : ''}`}
      />
      {commentError && (
        <p className={styles.error}>
          Please review and edit your feedback to meet our guidlines so we can
          publish it
        </p>
      )}
      <div className={styles.buttons}>
        <button className="btn-white-l" onClick={onClose}>
          Cancel
        </button>
        <button className="btn-regular-l" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};
