import React from 'react';
import type { VeterinarianProfile } from '~/store/api/vets/vets-types';

import star from '~/assets/svg/star.svg';
import icon from '~/assets/svg/Icon.svg';
import location from '~/assets/svg/location.svg';
import language from '~/assets/svg/language.svg';

type DoctorsInfoProps = {
  veterinarian: VeterinarianProfile;
};

const DoctorsInfo: React.FC<DoctorsInfoProps> = ({ veterinarian }) => {
  const specializationsText =
    veterinarian.specializations.length > 0
      ? veterinarian.specializations.join(', ')
      : veterinarian.specialty || 'Not specified';

  const languagesText =
    veterinarian.languages.length > 0
      ? veterinarian.languages.join(', ')
      : 'Not specified';

  return (
    <div className="bg-neutral-0 rounded-[32px] p-8 w-full max-w-[320px] aspect-square overflow-y-auto">
      {/* Rating */}
      <div className="flex items-center gap-2 mb-5">
        <span>
          <img src={star} alt="Star" />
        </span>
        <span className="text-body-m-bold text-black-900">
          {veterinarian.rating.toFixed(1)} ({veterinarian.reviewsCount} reviews)
        </span>
      </div>

      {/* Location */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span>
            <img src={location} alt="Loc" />
          </span>
          <span className="text-body-s-bold text-black-900">Location</span>
        </div>
        <div className="pl-8 text-body-s-regular text-black-700">
          {veterinarian.clinicAddress || 'Not specified'}
        </div>
      </div>

      {/* Specializations */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span>
            <img src={icon} alt="Icon" />
          </span>
          <span className="text-body-s-bold text-black-900">
            Specializations
          </span>
        </div>
        <div className="pl-8 text-body-s-regular text-black-700">
          {specializationsText}
        </div>
      </div>

      {/* Languages */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span>
            <img src={language} alt="Language" />
          </span>
          <span className="text-body-s-bold text-black-900">Languages</span>
        </div>
        <div className="pl-8 text-body-s-regular text-black-700">
          {languagesText}
        </div>
      </div>
    </div>
  );
};

export default DoctorsInfo;
