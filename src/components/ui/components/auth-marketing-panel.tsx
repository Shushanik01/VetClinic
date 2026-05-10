import DogPaw from '~/assets/svg/dog-paw.svg?react';
import Container from '~/assets/svg/container.svg?react';

type FeatureItem = {
  title: string;
  description: string;
};

type AuthMarketingPanelProps = {
  title: string;
  description: string;
  features: FeatureItem[];
  className?: string;
};

export const AuthMarketingPanel = ({
  title,
  description,
  features,
  className = '',
}: AuthMarketingPanelProps) => {
  return (
    <div
      className={`flex-1 flex flex-col min-h-[260px] md:min-h-[320px] min-w-[220px] p-6 md:p-8 lg:p-12 bg-green-400 rounded-4xl text-white gap-6 md:gap-8 ${className}`}
    >
      {/* Header */}
      <div>
        <div>
          <DogPaw />
        </div>

        <h1 className="text-h1 mb-4">{title}</h1>
        <p className="text-body-m-regular">{description}</p>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-6">
        {features.map((feature, index) => {
          return (
            <div key={index} className="flex gap-4">
              <Container />

              <div>
                <h3 className="text-body-m-bold mb-1">{feature.title}</h3>
                <p className="text-body-s-regular">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
