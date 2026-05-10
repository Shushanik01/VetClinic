import { Link } from 'react-router-dom';
import { Tag } from '~/components/ui/tag';
import { useGetVeterinariansListQuery } from '~/store/api/vets/vets-api';

const tagVariants = ['pink', 'blue', 'green'] as const;

export const OurVeterinariansSection = () => {
  const {
    data: vetsResponse,
    isLoading,
    isError,
  } = useGetVeterinariansListQuery();

  const veterinarians = vetsResponse?.veterinarians ?? [];

  return (
    <section className="w-full mt-4 flex justify-center">
      <div className="w-full bg-neutral-0 rounded-4xl p-6 md:p-8 lg:p-12 flex flex-col gap-6">
        <div>
          <h2 className="text-h2 mb-2">Our Veterinarians</h2>
          <p className="text-body-m-regular text-black-800">
            Meet our team of experienced veterinarians specialized in various
            fields of animal care
          </p>
        </div>

        {isLoading ? (
          <p className="text-body-m-regular text-black-700">
            Loading veterinarians...
          </p>
        ) : isError ? (
          <p className="text-body-m-regular text-black-700">
            Could not load veterinarians right now.
          </p>
        ) : veterinarians.length === 0 ? (
          <p className="text-body-m-regular text-black-700">
            No veterinarians available at the moment.
          </p>
        ) : (
          <div className="w-full grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(262px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(292px,1fr))] justify-between">
            {veterinarians.map((vet) => (
              <div
                key={vet.id}
                className="rounded-4xl border border-green-400 bg-neutral-0 flex flex-col overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={vet.imageUrl || '/doctor.png'}
                  alt={vet.fullName}
                  className="w-full h-[220px] object-cover"
                />
                <div className="flex flex-col gap-3 p-6 flex-1">
                  <p className="text-body-m-regular text-black-900">
                    {vet.fullName}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {vet.specializations.length > 0 ? (
                      vet.specializations
                        .slice(0, 3)
                        .map((specialization, index) => (
                          <Tag
                            key={`${vet.id}-${specialization}`}
                            label={specialization}
                            variant={tagVariants[index % tagVariants.length]}
                          />
                        ))
                    ) : (
                      <Tag label="General" variant="green" />
                    )}
                  </div>

                  <Link
                    to={`/veterinarian/${vet.id}`}
                    className="mt-auto h-12 rounded-4xl px-10 flex items-center justify-center bg-green-400 text-neutral-0 font-lato text-button font-normal transition-colors duration-200 hover:bg-green-300"
                  >
                    View Doctor's Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
