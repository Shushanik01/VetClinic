import FacebookLogin  from '@greatsumini/react-facebook-login';

type FacebookButtonProps = {
    onSuccess: (accessToken:string) => void,
    onError: (msg:string) => void,
    disabled?: boolean,
}

export const FacebookLoginButton = ({onSuccess, onError, disabled} : FacebookButtonProps)=>{

        const appId = import.meta.env.VITE_FACEBOOK_APP_ID as string;


    return(
        <div>
            <FacebookLogin
                appId={appId}
                onSuccess={(response) => onSuccess(response.accessToken)}
                onFail={() => onError('Facebook sign-in failed. Please try again')}
                render={({ onClick }) => (
                    <button
                        type="button"
                        onClick={onClick}
                        disabled={disabled}
                        className="w-full flex items-center justify-center gap-3 border border-neutral-300 rounded-lg px-4 py-2.5 text-sm font-medium text-black-900 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                            <path fill="#1877F2" d="M48 24C48 10.745 37.255 0 24 0S0 10.745 0 24c0 11.979 8.776 21.908 20.25 23.708V30.938h-6.094V24h6.094v-5.288c0-6.014 3.583-9.337 9.065-9.337 2.625 0 5.372.469 5.372.469v5.906h-3.026c-2.981 0-3.911 1.85-3.911 3.75V24h6.656l-1.064 6.938H27.75v16.77C39.224 45.908 48 35.979 48 24z"/>
                            <path fill="#fff" d="M33.342 30.938 34.406 24H27.75v-4.5c0-1.9.93-3.75 3.911-3.75h3.026V9.844s-2.747-.469-5.372-.469c-5.482 0-9.065 3.323-9.065 9.337V24h-6.094v6.938h6.094v16.77a24.18 24.18 0 0 0 7.5 0V30.938h5.592z"/>
                        </svg>
                        Continue with Facebook
                    </button>
                )}
            />
        </div>
    )
}