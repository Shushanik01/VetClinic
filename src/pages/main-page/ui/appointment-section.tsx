import { Link } from 'react-router-dom';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

export const AppointmentSection = () => {
  const base = import.meta.env.BASE_URL;
  const images = [
    `${base}book-appointment-main-page1.jpg`,
    `${base}book-appointment-main-page2.jpg`,
  ];

  return (
    <section className="w-full">
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:gap-4 lg:max-h-[550px]">
        {/* Marketing Info Div - fixed width */}
        <div className="w-full lg:w-[41%] lg:min-w-[400px] shrink-0 flex flex-col max-h-[550px]">
          <div className="bg-neutral-0 rounded-4xl p-6 md:p-8 lg:p-10 flex flex-col gap-[24px] flex-[1]">
            <h1 className="text-h1">
              Caring for Your <br />
              <span className="text-green-400">Beloved Pets</span>
            </h1>

            <p className="text-body-m-regular text-black-800">
              Professional veterinary services with compassion and expertise.
            </p>

            <Link
              to={ROUTES_PATH.BOOK_APPOINTMENT}
              className="btn-regular-l inline-block w-fit mt-5"
            >
              Book Appointment
            </Link>
          </div>

          <div className="mt-4 flex gap-4 flex-[0]">
            <div className="flex h-[144px] w-1/3 flex-col gap-2 rounded-4xl border border-green-400 bg-neutral-0 p-6 text-center justify-center">
              <div className="text-h2">30+</div>
              <div className="text-body-m-regular">Years</div>
            </div>
            <div className="flex h-[144px] w-1/3 flex-col gap-2 rounded-4xl bg-green-400 p-6 text-neutral-0 text-center justify-center ">
              <div className="text-h2">50+</div>
              <div className="text-body-m-regular">Expert Vets</div>
            </div>
            <div className="flex h-[144px] w-1/3 flex-col gap-2 rounded-4xl bg-pink-600 p-6 text-neutral-0 text-center justify-center">
              <div className="text-h2">10K+</div>
              <div className="text-body-m-regular">Happy Pets</div>
            </div>
          </div>
        </div>

        {/* Photos Section */}
        <div className="flex w-full lg:flex-1 min-w-0 gap-[2.1%] aspect-[759/464]">
          {/* Large Photo on Left */}
          <img
            src={images[0]}
            alt="Appointment 1"
            className="h-full w-[56.27%] max-h-[550px] rounded-4xl object-cover"
          />

          {/* Stacked Photos on Right */}
          <div className="flex h-full w-[41.63%] max-h-[550px] flex-col gap-[3.45%]">
            <img
              src={images[1]}
              alt="Appointment 2"
              className="h-[60.56%] w-full rounded-4xl object-cover"
            />
            <img
              src={images[0]}
              alt="Appointment 3"
              style={{
                objectPosition: '0% 90%',
                objectViewBox: 'inset(10% 10% 1% 3%)',
              }}
              className="h-[36%] w-full rounded-4xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
