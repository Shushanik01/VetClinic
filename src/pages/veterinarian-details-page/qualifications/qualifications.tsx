import React from 'react';
import type { VeterinarianProfile } from '~/store/api/vets/vets-types';

import Education from '~/assets/svg/Education.svg';
import Certificate from '~/assets/svg/Certifications.svg';

type QualificationsProps = {
  veterinarian: VeterinarianProfile;
};

const Qualifications: React.FC<QualificationsProps> = ({ veterinarian }) => {
  const education = veterinarian.education;
  const certifications = veterinarian.certifications;

  return (
    <div className="max-w-full p-8 rounded-2xl border border-neutral-200 bg-neutral-0 flex flex-col box-border">
      {/* Title */}
      <h2 className="text-h2 mb-8 text-black-900">Qualifications</h2>

      {/* Grid with 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Left column - Education */}
        <div>
          <h3 className="flex items-center gap-3 text-h3 text-black-900 mb-4">
            <img src={Education} alt="Education" width="20px" />
            <span> Education</span>
          </h3>
          <div className="flex flex-col gap-4">
            {education.length === 0 && (
              <div>
                <div className="text-body-m-bold text-black-900">
                  No education information available.
                </div>
              </div>
            )}
            {education.map((item, index) => (
              <div key={index} className="pl-4 border-l-2 border-green-400">
                <div className="text-body-m-bold text-black-900">
                  {item.title}
                </div>
                <div className="text-body-s-regular text-black-700">
                  {item.organization}
                </div>
                <div className="text-body-s-regular text-neutral-500">
                  {item.year}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column - Certifications */}
        <div>
          <h3 className="flex items-center gap-3 text-h3 text-black-900 mb-4">
            <img src={Certificate} alt="Certificate" width="20px" />
            Certifications
          </h3>
          <div className="flex flex-col gap-4">
            {certifications.length === 0 && (
              <div>
                <div className="text-body-m-bold text-black-900">
                  No certification information available.
                </div>
              </div>
            )}
            {certifications.map((item, index) => (
              <div key={index} className="pl-4 border-l-2 border-green-400">
                <div className="text-body-m-bold text-black-900">
                  {item.title}
                </div>
                <div className="text-body-s-regular text-black-700">
                  {item.organization}
                </div>
                <div className="text-body-s-regular text-neutral-500">
                  {item.year}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Qualifications;
