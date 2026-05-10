import React from 'react';

import styles from './RadioButtons.module.css';

interface RadioButtonsProps {
  setFormType: (value: string) => void;
  heading?: string;
  firstButtonLabel: string;
  secondButtonLabel: string;
}

const RadioButtons: React.FC<RadioButtonsProps> = ({
  setFormType,
  heading = '',
  firstButtonLabel,
  secondButtonLabel,
}) => {
  return (
    <div className={styles.radioWrapper}>
      <h2>{heading}</h2>
      <div>
        <label>
          <input
            name="radioButton"
            type="radio"
            value="first"
            defaultChecked
            onChange={(e) => setFormType(e.target.value)}
          />
          {firstButtonLabel}
        </label>
        <label>
          <input
            name="radioButton"
            type="radio"
            value="second"
            onChange={(e) => setFormType(e.target.value)}
          />
          {secondButtonLabel}
        </label>
      </div>
    </div>
  );
};

export default RadioButtons;
