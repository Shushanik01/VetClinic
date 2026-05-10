type RadioOption = {
  label: string;
  value: string;
};

type RadioInputProps = {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  /** When true, at least one option must be selected */
  required?: boolean;
  /** When true, user can deselect the current option */
  allowDeselect?: boolean;
  /** When true, display options horizontally instead of vertically */
  horizontal?: boolean;
  /** Custom gap class for vertical layout */
  verticalGapClassName?: string;
};

export const RadioInput = ({
  name,
  options,
  value,
  onChange,
  label,
  required = false,
  allowDeselect = false,
  horizontal = false,
  verticalGapClassName = 'gap-[12px]',
}: RadioInputProps) => {
  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
  };

  const handleDeselect = (optionValue: string) => {
    onChange?.(value === optionValue ? '' : optionValue);
  };

  const handleChange = allowDeselect ? handleDeselect : handleSelect;

  return (
    <div className="flex flex-col gap-[8px]">
      {label && (
        <label className="text-body-s-bold text-black-900">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div
        className={
          horizontal
            ? 'flex flex-row gap-[24px]'
            : `flex flex-col ${verticalGapClassName}`
        }
      >
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              className="flex items-center gap-[12px] cursor-pointer"
            >
              <div className="relative">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => handleChange(option.value)}
                  className="sr-only"
                />
                {/* Outer circle */}
                <div
                  className={`w-[24px] h-[24px] rounded-[17px] border-2 bg-neutral-0 flex items-center justify-center ${
                    isSelected ? 'border-green-400' : 'border-green-400'
                  }`}
                  style={{ borderColor: isSelected ? '#128280' : undefined }}
                >
                  {/* Inner circle (only visible when selected) */}
                  {isSelected && (
                    <div
                      className="w-[16px] h-[16px] rounded-[11.33px] bg-green-400"
                      style={{ backgroundColor: '#128280' }}
                    />
                  )}
                </div>
              </div>
              <span className="text-body-m-regular text-black-900">
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
