import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { CalendarInput } from '~/components/forms/date-input';
import { TimeSelect } from '~/components/forms/time-input';
import { SelectInput } from '~/components/forms/select-input/select-input';
import {
  availableSlotsSearchSchema,
  type AvailableSlotsSearchFormValues,
} from '~/components/appointment-available-slots/available-slots-search-schema';
import { TIME_SLOTS } from '~/constants/time-slots';
import { SPECIALISATION_OPTIONS } from '~/constants/specialisations';
import { CLINIC_LOCATION_OPTIONS } from '~/constants/clinics-location';

const pad = (value: number) => (value < 10 ? `0${value}` : `${value}`);

type AvailableSlotsSearchProps = {
  onSearch?: (data: AvailableSlotsSearchFormValues) => void;
  onResetRef?: (resetFn: () => void) => void;
};

export const AvailableSlotsSearch = ({
  onSearch,
  onResetRef,
}: AvailableSlotsSearchProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
    trigger,
  } = useForm<AvailableSlotsSearchFormValues>({
    resolver: zodResolver(availableSlotsSearchSchema),
    mode: 'onChange',
    defaultValues: {
      specialty: '',
      date: '',
      time: '',
      location: '',
    },
  });

  // Ensure specialty and location exist in the form state
  useEffect(() => {
    register('specialty');
    register('location');
  }, [register]);

  const selectedDateStr = watch('date') ?? '';
  const selectedTimeStr = watch('time') ?? '';
  const selectedSpecialty = watch('specialty') ?? '';
  const selectedLocation = watch('location') ?? '';

  // If time is selected first and then date, adjust time to the
  // earliest available (non-disabled) slot only when today's date makes
  // the currently selected time invalid.
  useEffect(() => {
    const currentDate = selectedDateStr;
    const currentTime = selectedTimeStr;

    if (!currentDate || !currentTime) return;

    const now = new Date();
    const todayIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}`;

    if (currentDate !== todayIso) return;

    const isSlotDisabled = (slot: string): boolean => {
      const [hourStr, minuteStr] = slot.split(':');
      const hour = Number(hourStr);
      const minute = Number(minuteStr);

      if (Number.isNaN(hour) || Number.isNaN(minute)) return true;

      const slotDate = new Date(`${currentDate}T${slot}:00`);
      return slotDate.getTime() < now.getTime();
    };

    if (!isSlotDisabled(currentTime)) return;

    const earliestAvailableSlot = TIME_SLOTS.find(
      (slot) => !isSlotDisabled(slot)
    );

    if (earliestAvailableSlot && earliestAvailableSlot !== currentTime) {
      setValue('time', earliestAvailableSlot, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [selectedDateStr, selectedTimeStr, setValue]);

  const specialtyOptions = SPECIALISATION_OPTIONS;

  const locationOptions = CLINIC_LOCATION_OPTIONS;

  useEffect(() => {
    if (onResetRef) {
      onResetRef(() => reset());
    }
  }, [onResetRef, reset]);

  const handleSpecialtyChange = (value: string) => {
    setValue('specialty', value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    void trigger(['date', 'time', 'location']);
  };

  const handleDateChange = (dateString: string) => {
    setValue('date', dateString, {
      shouldDirty: true,
      shouldValidate: true,
    });

    void trigger(['time', 'location']);
  };

  const handleTimeChange = (timeString: string) => {
    setValue('time', timeString, {
      shouldDirty: true,
      shouldValidate: true,
    });

    void trigger('location');
  };

  const onSubmit = (data: AvailableSlotsSearchFormValues) => {
    console.log('Search Data:', data);
    if (onSearch) {
      onSearch(data);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto p-6 rounded-lg bg-white shadow-md"
      style={{ overflow: 'visible' }}
    >
      {/* Top Filter Section */}
      <div className="flex gap-x-2 flex-wrap">
        {/* Specialty */}
        <div className="flex flex-col flex-1 min-w-[160px]">
          <SelectInput
            label="Specialty"
            required
            value={selectedSpecialty}
            onChange={handleSpecialtyChange}
            options={specialtyOptions}
            placeholder="Select Specialty"
            clearable
            error={errors.specialty?.message}
          />
        </div>

        {/* Calendar Input */}
        <div
          className="flex flex-col flex-1 min-w-[160px]"
          style={{ overflow: 'visible' }}
        >
          <CalendarInput
            value={selectedDateStr}
            onChange={handleDateChange}
            error={errors.date?.message}
            label="Date"
            clearable={true}
          />
        </div>

        {/* Time Select */}
        <div
          className="flex flex-col flex-1 min-w-[160px]"
          style={{ overflow: 'visible' }}
        >
          <TimeSelect
            value={selectedTimeStr}
            onChange={handleTimeChange}
            error={errors.time?.message}
            label="Time"
            selectedDate={selectedDateStr}
            allowPastTimes={false}
            allowFutureTimes={true}
            clearable={true}
          />
        </div>

        {/* Location */}
        <div className="flex flex-col flex-1 min-w-[160px]">
          <SelectInput
            label="Location"
            value={selectedLocation}
            onChange={(val: string) =>
              setValue('location', val, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            options={locationOptions}
            placeholder="Select Location"
            clearable
            error={errors.location?.message}
          />
        </div>
        <div className="flex flex-col min-w-fit">
          <label className="input-label text-body-s-bold opacity-0 pointer-events-none">
            Search
          </label>

          <button
            id="available-slots-search-submit"
            type="submit"
            className="btn-regular-l"
            disabled={!isValid}
          >
            Search
          </button>

          <span className="text-xs mt-1 min-h-[16px]" />
        </div>
      </div>
    </form>
  );
};
