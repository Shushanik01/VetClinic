import BookAppointments from './booking-card/book-appointment';
import Qualifications from './qualifications/qualifications';
import ClientFeedback from './client-feedback/client-feedback';
import { useParams } from 'react-router-dom';
import { useGetVeterinarianByIdQuery } from '~/store/api/vets/vets-api';

const VeterinarianDetailsPage: React.FC = () => {
  const { veterinarianId } = useParams<{ veterinarianId: string }>();

  const {
    data: veterinarian,
    isLoading,
    isError,
  } = useGetVeterinarianByIdQuery(veterinarianId ?? '', {
    skip: !veterinarianId,
  });

  if (!veterinarianId) {
    return (
      <section className="flex flex-col gap-4">
        <div className="rounded-2xl bg-red-50 border border-red-200 px-6 py-4 text-body-m-regular text-red-700">
          Invalid veterinarian profile URL.
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="flex flex-col gap-4">
        <div className="rounded-2xl bg-neutral-0 border border-neutral-200 px-6 py-4 text-body-m-regular text-black-900">
          Loading veterinarian profile...
        </div>
      </section>
    );
  }

  if (isError || !veterinarian) {
    return (
      <section className="flex flex-col gap-4">
        <div className="rounded-2xl bg-red-50 border border-red-200 px-6 py-4 text-body-m-regular text-red-700">
          Failed to load veterinarian profile. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mx-auto flex flex-col gap-4">
      <BookAppointments
        veterinarian={veterinarian}
        veterinarianId={veterinarianId}
      />
      <Qualifications veterinarian={veterinarian} />
      <ClientFeedback veterinarianId={veterinarianId} />
    </section>
  );
};
export default VeterinarianDetailsPage;
