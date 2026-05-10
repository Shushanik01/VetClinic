import { AppointmentSection } from '~/pages/main-page/ui/appointment-section';
import { WhyChooseSection } from '~/pages/main-page/ui/why-choose-section';
import { OurServicesSection } from '~/pages/main-page/ui/our-services-section';
import { OurVeterinariansSection } from '~/pages/main-page/ui/our-veterinarians-section';

export const MainPage = () => {
  return (
    <main>
      <AppointmentSection />
      <WhyChooseSection />
      <OurServicesSection />
      <OurVeterinariansSection />
    </main>
  );
};
