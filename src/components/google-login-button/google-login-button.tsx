import { useGoogleLogin } from "@react-oauth/google";

type GoogleLoginButtonProps = {
    onSuccess: (accessToken: string) => void;
    onError: (message: string) => void;
    disabled?: boolean;
};

export const GoogleLoginButton = ({onSuccess, onError, disabled}: GoogleLoginButtonProps) =>{

    const login = useGoogleLogin({
        onSuccess: (response) => onSuccess(response.access_token),
        onError: () => onError('Google sign - in failed. Please try again')
    })
   return (
    <div>
      <button
        type="button"
        onClick={() => login()}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-3 border border-neutral-300 rounded-lg px-4 py-2.5 text-sm font-medium text-black-900 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
          <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.84l6.08-6.08C34.46 3.39 29.5 1.5 24 1.5 14.82 1.5 6.98 6.98 3.29 14.82l7.08 5.5C12.18 13.59 17.6 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.74H24v8.98h12.42c-.54 2.9-2.18 5.36-4.64 7.02l7.18 5.58C43.18 37.1 46.1 31.24 46.1 24.5z"/>
          <path fill="#FBBC05" d="M10.37 28.32A14.6 14.6 0 0 1 9.5 24c0-1.5.26-2.95.72-4.32l-7.08-5.5A22.44 22.44 0 0 0 1.5 24c0 3.62.86 7.04 2.38 10.08l6.49-5.76z"/>
          <path fill="#34A853" d="M24 46.5c5.5 0 10.12-1.82 13.5-4.94l-7.18-5.58c-1.82 1.22-4.14 1.94-6.32 1.94-6.4 0-11.82-4.09-13.63-9.8l-6.49 5.76C6.98 41.02 14.82 46.5 24 46.5z"/>
        </svg>
        Continue with Google
      </button>
    </div>
  );
}