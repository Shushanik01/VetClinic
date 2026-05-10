import StethoscopeIcon from '~/assets/svg/main/stethoscope.svg?react';
import CheckMarkIcon from '~/assets/svg/main/check-mark.svg?react';
import PairHumanIcon from '~/assets/svg/main/pair-human.svg?react';
import MedalIcon from '~/assets/svg/main/medal.svg?react';
import PinkHeartIcon from '~/assets/svg/main/pink-heart.svg?react';

export const WhyChooseSection = () => {
  const checklistItems = [
    'Advanced diagnostic imaging (X-ray, Ultrasound)',
    'In-house laboratory for rapid results',
    'Sterile surgical suites with monitoring',
  ];

  const featureCards = [
    {
      title: '10,000+',
      subtitle: 'Pets Treated Annually',
      Icon: PairHumanIcon,
      borderColor: 'border-green-400',
      iconBg: 'bg-green-50',
      iconBorder: 'border-green-400',
    },
    {
      title: '98%',
      subtitle: 'Client Satisfaction',
      Icon: PinkHeartIcon,
      borderColor: 'border-pink-600',
      iconBg: 'bg-pink-100',
      iconBorder: 'border-pink-600',
    },
    {
      title: 'AAHA',
      subtitle: 'Accredited Facility',
      Icon: MedalIcon,
      borderColor: 'border-green-400',
      iconBg: 'bg-green-50',
      iconBorder: 'border-green-400',
    },
    {
      title: '24/7',
      subtitle: 'Emergency Services',
      Icon: PairHumanIcon,
      borderColor: 'border-green-400',
      iconBg: 'bg-green-50',
      iconBorder: 'border-green-400',
    },
  ];

  return (
    <section className="w-full mt-4">
      <div className="w-full bg-neutral-0 rounded-4xl p-6 md:p-8 lg:p-12 flex flex-col gap-6">
        <div>
          <h2 className="text-h2 mb-2">Why Choose PawCare</h2>
          <p className="text-body-m-regular text-black-800">
            Combining advanced medical technology with compassionate veterinary
            care
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left: Board-Certified Specialists card */}
          <div className="flex-1 border border-green-400 rounded-4xl p-6 flex flex-col gap-4 bg-neutral-0 h-[436px]">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
              <StethoscopeIcon className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-h3 mb-2" style={{ letterSpacing: '0.01em' }}>
                Board-Certified Specialists
              </h3>
              <p className="text-body-m-regular text-black-800">
                Our team of experienced veterinarians and certified specialists
                are dedicated to providing the highest standard of medical care
                using evidence-based practices and modern diagnostic equipment.
              </p>
            </div>

            <ul className="mt-2 flex flex-col gap-2">
              {checklistItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 text-green-400">
                    <CheckMarkIcon className="w-5 h-5" />
                  </span>
                  <span className="text-body-m-regular text-black-800">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: 4 feature cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className={`border rounded-4xl p-6 bg-neutral-0 flex flex-col gap-3 ${card.borderColor}`}
              >
                <div
                  className={`w-12 h-12 rounded-[14px] flex items-center justify-center ${card.iconBg} ${card.iconBorder}`}
                >
                  <card.Icon className="w-6 h-6" />
                </div>

                <h2 className="text-h2 text-black-900 mt-2">{card.title}</h2>
                <p className="text-body-m-regular text-black-800">
                  {card.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
