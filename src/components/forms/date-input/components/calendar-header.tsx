type CalendarHeaderProps = {
  viewDate: Date;
  onMonthChange: (offset: number) => void;
  canGoPrevious: boolean;
};

export const CalendarHeader = ({
  viewDate,
  onMonthChange,
  canGoPrevious,
}: CalendarHeaderProps) => {
  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const year = viewDate.getFullYear();

  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => {
          if (canGoPrevious) onMonthChange(-1);
        }}
        disabled={!canGoPrevious}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          canGoPrevious
            ? 'text-black-900 hover:bg-green-300 cursor-pointer'
            : 'text-neutral-400 cursor-not-allowed'
        }`}
        aria-label="Previous month"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.5 12L5.5 8L9.5 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <span className="text-body-m-bold font-lato text-black-900">
        {monthName} {year}
      </span>

      <button
        type="button"
        onClick={() => onMonthChange(1)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-black-900 hover:bg-green-300 transition-colors cursor-pointer"
        aria-label="Next month"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.5 12L10.5 8L6.5 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};
