import CalendarGreenIcon from '~/assets/svg/main/calendar-green.svg?react';
import StethoscopeIcon from '~/assets/svg/main/stethoscope.svg?react';
import InjectIcon from '~/assets/svg/main/inject.svg?react';
import GreenHeartIcon from '~/assets/svg/main/green-heart.svg?react';
import PinkClockIcon from '~/assets/svg/main/pink-clock.svg?react';

export const OurServicesSection = () => {
  return (
    <section className="w-full mt-4">
      <div className="w-full bg-neutral-0 rounded-4xl p-6 md:p-8 lg:p-12 flex flex-col gap-6">
        <div>
          <h2 className="text-h2 mb-2">Our Services</h2>
          <p className="text-body-m-regular text-black-800">
            From preventive wellness to advanced surgical procedures
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left column: General Practice + Vaccinations & Dental */}
          <div className="flex-1 flex flex-col gap-4">
            {/* General Practice & Wellness */}
            <div className="rounded-4xl bg-green-400 p-6 flex flex-col gap-6 h-[340px]">
              <div className="w-14 h-14 rounded-2xl bg-neutral-0 flex items-center justify-center">
                <CalendarGreenIcon className="w-7 h-7" />
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-h3 text-neutral-0">
                  General Practice &amp; Wellness
                </h3>
                <p className="text-body-m-regular text-neutral-0">
                  Comprehensive health examinations, preventive care,
                  vaccinations, and routine checkups to maintain your pet&apos;s
                  optimal health throughout all life stages.
                </p>
              </div>
            </div>

            {/* Vaccinations & Dental (3rd and 4th) */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Vaccinations */}
              <div className="flex-1 rounded-4xl bg-neutral-0 border border-green-400 p-6 flex flex-col gap-3 min-w-[192px] h-[240px]">
                <div className="w-12 h-12 rounded-[14px] bg-green-50  flex items-center justify-center">
                  <InjectIcon className="w-6 h-6" />
                </div>

                <h3 className="text-h3 text-black-800">Vaccinations</h3>
                <p className="text-body-m-regular text-black-800">
                  Complete vaccination protocols tailored to your pet&apos;s
                  lifestyle and risk factors.
                </p>
              </div>

              {/* Dental Care */}
              <div className="flex-1 rounded-4xl bg-neutral-0 border border-green-400 p-6 flex flex-col gap-3 min-w-[192px] h-[240px]">
                <div className="w-12 h-12 rounded-[14px] bg-green-50  flex items-center justify-center">
                  <GreenHeartIcon className="w-6 h-6" />
                </div>

                <h3 className="text-h3 text-black-800">Dental Care</h3>
                <p className="text-body-m-regular text-black-800">
                  Professional dental cleaning, oral surgery, and preventive
                  dental health care.
                </p>
              </div>
            </div>
          </div>

          {/* Right column: Surgical services + Emergency */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Surgical services (2nd) */}
            <div className="rounded-4xl bg-neutral-0 border border-green-400 p-6 flex flex-col  gap-4 h-[340px]">
              <div className="w-12 h-12 rounded-[14px] bg-green-50 flex items-center justify-center">
                <StethoscopeIcon className="w-6 h-6" />
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-h3 text-black-800">Surgical services</h3>
                <p className="text-body-m-regular text-black-800">
                  Advanced surgical procedures in sterile operating rooms with
                  anesthesia monitoring.
                </p>
              </div>
            </div>

            {/* 24/7 Emergency Care (5th) */}
            <div className="rounded-4xl bg-pink-600 p-6 flex flex-col gap-4 min-w-[192px] h-[240px]">
              <div className="w-14 h-14 rounded-2xl bg-neutral-0 flex items-center justify-center">
                <PinkClockIcon className="w-7 h-7" />
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-h3 text-neutral-0">24/7 Emergency Care</h3>
                <p className="text-body-m-regular text-neutral-0">
                  Round-the-clock urgent care with immediate triage and
                  treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
