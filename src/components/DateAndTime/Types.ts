import type React from 'react';

export interface BookingTimeProps {
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  availableSlots?: string[];
}

export interface BookingDateProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  availableDates?: string[]; // 'YYYY-MM-DD' — if provided, only these dates are selectable
  minDate?: Date; // if provided, dates before this are disabled
  maxDate?: Date; // if provided, dates after this are disabled
}

export interface DatePickerProps {
  children?: React.ReactNode;
  placeholder?: string;
  value?: string;
  name?: string;
}
export interface RescheduleAppointmentProps {
  onClose: () => void;
  selectedDate?: string;
  selectedTime?: string;
  veterinarianId?: string;
  veterinarianSpecialty?: string;
  onReschedule: (date: string, time: string) => Promise<void> | void;
}

export type OptionItem = { label: string; value: string };

export interface SelectOptionProps {
  name: string;
  options: string[] | OptionItem[];
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
}
