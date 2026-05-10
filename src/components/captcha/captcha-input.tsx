import ReCAPTCHA from "react-google-recaptcha";

type CaptchaInputProps = {
    onVerify: (token: string | null) => void
};

export const CaptchaInput = ({ onVerify }: CaptchaInputProps) => {

    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string

    return (
        <ReCAPTCHA
            sitekey={siteKey}
            onChange={onVerify}
        />
    )
}