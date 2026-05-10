type CalendarDayButtonProps = {
  day: number;
  isSelected: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  isInRange?: boolean;
  isDisabled: boolean;
  onClick: () => void;
};

export const CalendarDayButton = ({
  day,
  isSelected,
  isRangeStart = false,
  isRangeEnd = false,
  isInRange = false,
  isDisabled,
  onClick,
}: CalendarDayButtonProps) => {
  const isBoundary = isRangeStart || isRangeEnd || isSelected;

  const getStateClass = () => {
    if (isDisabled) return 'text-neutral-400';
    if (isBoundary) return 'bg-green-400 text-neutral-0 cursor-pointer';
    if (isInRange) return 'bg-green-300 text-black-900 cursor-pointer';
    return 'text-black-900 hover:bg-green-300 cursor-pointer';
  };

  const stateClass = getStateClass();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-body-m-regular font-lato h-8 w-8 rounded-full transition-colors ${stateClass}`}
      disabled={isDisabled}
    >
      {day}
    </button>
  );
};
