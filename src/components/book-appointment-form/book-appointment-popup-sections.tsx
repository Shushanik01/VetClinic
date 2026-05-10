type ErrorAlertProps = {
  message?: string;
};

type PopupActionsProps = {
  isSubmitting: boolean;
  isFormValid: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export const PopupErrorAlert = ({ message }: ErrorAlertProps) => {
  if (!message) {
    return null;
  }

  return (
    <div className="p-3 rounded-md bg-red-50 border border-red-200">
      <p className="text-red-600 text-body-s">{message}</p>
    </div>
  );
};

export const PopupActions = ({
  isSubmitting,
  isFormValid,
  onClose,
  onSubmit,
}: PopupActionsProps) => {
  return (
    <div className="flex gap-[16px] justify-end">
      <button
        id="book-appointment-popup-cancel"
        type="button"
        className="btn-white-l cursor-pointer hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onClose}
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        id="book-appointment-popup-submit"
        type="button"
        className="btn-regular-l cursor-pointer hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!isFormValid || isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? 'Booking...' : 'Book Appointment'}
      </button>
    </div>
  );
};
