import { useEffect, useMemo, useRef, useState } from 'react';
import chevronDownIcon from '~/assets/svg/icons/chevron-down-solid-full.svg';
import chevronUpIcon from '~/assets/svg/icons/chevron-up-solid-full.svg';

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectInputProps = {
  id?: string;
  label?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  /** When true, show a clear button that resets value to empty */
  clearable?: boolean;
};

export const SelectInput = ({
  id,
  label,
  required = false,
  value,
  onChange,
  options,
  placeholder = 'Select option',
  error,
  disabled = false,
  clearable = false,
}: SelectInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  );

  const displayValue = selectedOption?.label ?? '';

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const isEffectivelyDisabled = disabled;

  const handleSelect = (option: SelectOption) => {
    if (isEffectivelyDisabled) return;
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col" ref={wrapperRef}>
      {label && (
        <label className="input-label flex items-center">
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative w-full group">
        <input
          id={id}
          type="text"
          readOnly
          value={displayValue}
          title={displayValue}
          placeholder={placeholder}
          onClick={() => {
            if (isEffectivelyDisabled) return;
            setIsOpen((prev) => !prev);
          }}
          aria-disabled={isEffectivelyDisabled}
          className={`cursor-pointer input-field w-full pr-13 group-hover:shadow-[0_4px_4px_0_#0446450D] ${
            error ? 'input-error' : ''
          } ${
            isEffectivelyDisabled
              ? 'bg-neutral-50 text-neutral-400 cursor-not-allowed'
              : ''
          }`}
        />

        <button
          type="button"
          onClick={() => {
            if (isEffectivelyDisabled) return;
            setIsOpen((prev) => !prev);
          }}
          disabled={isEffectivelyDisabled}
          className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center pr-4 pl-2"
          aria-label="Toggle select options"
        >
          <img
            src={isOpen ? chevronUpIcon : chevronDownIcon}
            alt={isOpen ? 'Close options' : 'Open options'}
            className="h-3 w-3 text-black-800"
          />
        </button>

        {clearable && !isEffectivelyDisabled && value && (
          <button
            type="button"
            onClick={() => {
              onChange?.('');
            }}
            className="absolute cursor-pointer right-8 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center text-neutral-400 hover:text-neutral-800"
            aria-label="Clear selection"
          >
            ×
          </button>
        )}

        {isOpen && !isEffectivelyDisabled && (
          <div className="absolute left-0 top-full z-20 mt-0.5 max-h-60 w-full overflow-y-auto rounded-[10px] border border-green-400 bg-neutral-0 shadow-md">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`select-item w-full text-left flex items-center justify-between ${
                    isSelected ? 'select-item-selected' : ''
                  }`}
                >
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <span
        className={`input-caption min-h-[20px] ${error ? 'text-red-400' : 'invisible'}`}
      >
        {error || 'placeholder'}
      </span>
    </div>
  );
};
