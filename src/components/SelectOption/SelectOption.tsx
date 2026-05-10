import React, { useRef, useState, useEffect } from 'react';
import styles from './SelectOption.module.css';
import type { OptionItem, SelectOptionProps } from '../DateAndTime/Types';

import VectorUp from '~/assets/svg/VectorUp.svg';
import VectorDown from '~/assets/svg/VectorDown.svg';

const normalizeOptions = (options: string[] | OptionItem[]): OptionItem[] =>
  options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

const SelectOption: React.FC<SelectOptionProps> = ({
  name,
  options,
  placeholder = 'Select an option',
  onChange,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value ?? '');
  const [selectedLabel, setSelectedLabel] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalized = normalizeOptions(options);

  // Sync internal state when a value is provided (e.g. restoring after back navigation)
  // Runs when options load (async) or value changes
  useEffect(() => {
    if (!value) return;
    const match = normalized.find((o) => o.value === value);
    if (match) {
      setSelectedValue(match.value);
      setSelectedLabel(match.label);
    }
  }, [value, options]);

  return (
    <div className={styles.customSelect} ref={dropdownRef}>
      <input type="hidden" name={name} value={selectedValue} />

      <div
        role="button"
        className={styles.selectHeader}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedLabel || placeholder}
        <span className={styles.arrow}>
          {isOpen ? (
            <img src={VectorUp} alt="Up Arrow" />
          ) : (
            <img src={VectorDown} alt="Down Arrow" />
          )}
        </span>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {normalized.map((option) => (
            <div
              role="button"
              key={option.value}
              className={`${styles.option} ${selectedValue === option.value ? styles.selected : ''}`}
              onClick={() => {
                setSelectedValue(option.value);
                setSelectedLabel(option.label);
                onChange?.(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectOption;
