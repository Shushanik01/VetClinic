import { Link } from 'react-router-dom';
import calendarIcon from '~/assets/svg/icons/calendar.svg';
import timeIcon from '~/assets/svg/icons/time.svg';
import locationIcon from '~/assets/svg/icons/location.svg';
import personIcon from '~/assets/svg/icons/person.svg';
import { Tag } from '~/components/ui/tag';

type AvailableSlotDetailsProps = {
  veterinarianSpecialty: string;
  veterinarianName: string;
  veterinarianId: string;
  date: string;
  time: string;
  clinicAddress: string;
};

export const AvailableSlotDetails = ({
  veterinarianSpecialty,
  veterinarianName,
  veterinarianId,
  date,
  time,
  clinicAddress,
}: AvailableSlotDetailsProps) => {
  return (
    <div className="flex flex-col gap-[12px]">
      {/* Specialty */}
      <div>
        <Tag label={veterinarianSpecialty} variant="pink" />
      </div>

      {/* Doctor Name as Link */}
      <div className="flex items-center gap-[8px]">
        <img src={personIcon} alt="Doctor" className="w-5 h-5" />
        <Link
          to={`/veterinarian/${veterinarianId}`}
          className="text-body-m-regular text-blue-600 hover:text-blue-400 underline decoration-solid cursor-pointer transition-colors"
        >
          {veterinarianName}
        </Link>
      </div>

      {/* Date */}
      <div className="flex items-center gap-[8px]">
        <img src={calendarIcon} alt="Date" className="w-5 h-5" />
        <p className="text-body-m-regular text-black-900">{date}</p>
      </div>

      {/* Time */}
      <div className="flex items-center gap-[8px]">
        <img src={timeIcon} alt="Time" className="w-5 h-5" />
        <p className="text-body-m-regular text-black-900">{time}</p>
      </div>

      {/* Location */}
      <div className="flex items-center gap-[8px]">
        <img src={locationIcon} alt="Location" className="w-5 h-5" />
        <p className="text-body-m-regular text-black-900">{clinicAddress}</p>
      </div>
    </div>
  );
};
