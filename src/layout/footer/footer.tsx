import dogPaw from '~/assets/svg/DogPaw.svg';
import location from '~/assets/svg/location1.svg';
import mail from '~/assets/svg/Mail.svg';
import time from '~/assets/svg/Time.svg';
import { Link } from 'react-router-dom';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

export const Footer = () => {
  const linkClass =
    'text-body-s-regular text-black-800 hover:text-black-900 cursor-pointer transition-colors';

  return (
    <footer className="bg-neutral-0 rounded-2xl p-12 w-full">
      <div className="mx-auto">
        {/* Top Section */}
        <div
          className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-4 
          lg:grid-cols-[1.5fr_1fr_1fr_1fr] 
          gap-8
        "
        >
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <img src={dogPaw} alt="PawCare Logo" />
              <div>
                <p className="text-xl font-bold text-black-900">PawCare</p>
                <p className="text-body-s-regular text-black-800">
                  Veterinary Excellence
                </p>
              </div>
            </div>
            <p className="text-body-s-regular text-black-800 leading-relaxed max-w-[280px]">
              Providing compassionate veterinary care with advanced medical
              technology since 1995.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-body-m-bold text-black-900 mb-4">
              Quick Links
            </h4>
            <div className="flex flex-col gap-y-2">
              <Link to="#" className={linkClass}>
                Services
              </Link>
              <Link to="#" className={linkClass}>
                About Us
              </Link>
              <Link to="#" className={linkClass}>
                Testimonials
              </Link>
              <Link to={ROUTES_PATH.BOOK_APPOINTMENT} className={linkClass}>
                Book Appointment
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-body-m-bold text-black-900 mb-4">Services</h4>
            <div className="flex flex-col gap-y-2">
              <Link to="#" className={linkClass}>
                General Practice
              </Link>
              <Link to="#" className={linkClass}>
                Surgery
              </Link>
              <Link to="#" className={linkClass}>
                Dental Care
              </Link>
              <Link to="#" className={linkClass}>
                Emergency Care
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-body-m-bold text-black-900 mb-4">Contact</h4>

            <div className="flex flex-col gap-y-3">
              <div className="flex items-center gap-3">
                <img src={location} alt="Location" className="w-5 h-5" />
                <span className="text-body-s-regular text-black-800">
                  123 Veterinary Lane
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img src={mail} alt="Email" className="w-5 h-5" />
                <span className="text-body-s-regular text-black-800">
                  info@pawcare.vet
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img src={time} alt="Hours" className="w-5 h-5" />
                <span className="text-body-s-regular text-black-800">
                  24/7 Emergency Available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-neutral-100 text-center">
          <p className="text-body-s-regular text-black-800">
            © {new Date().getFullYear()} PawCare Veterinary Clinic. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
