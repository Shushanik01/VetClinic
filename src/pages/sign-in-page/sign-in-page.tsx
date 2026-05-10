import { SignInForm } from '~/pages/sign-in-page/sign-in-form';
import { AuthMarketingPanel } from '~/components/ui/components/auth-marketing-panel';
import { SIGN_IN_MARKETING_CONTENT } from '~/pages/sign-in-page/sign-in-content';

export const SignInPage = () => {
  return (
    <div className="w-full min-h-[calc(100vh-3rem)] flex flex-col lg:flex-row items-stretch gap-4 px-4 lg:px-0 py-4">
      <div className="w-full lg:w-1/2 flex order-2 lg:order-1">
        <AuthMarketingPanel
          {...SIGN_IN_MARKETING_CONTENT}
          className="w-full h-full"
        />
      </div>

      <div className="w-full lg:w-1/2 flex order-1 lg:order-2">
        <SignInForm />
      </div>
    </div>
  );
};
