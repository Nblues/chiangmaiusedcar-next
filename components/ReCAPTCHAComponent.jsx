import { useImperativeHandle, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const ReCAPTCHAComponent = ({ sitekey, onChange, onRef }) => {
  const recaptchaRef = useRef(null);

  // ให้ parent component สามารถเข้าถึง methods ของ ReCAPTCHA ได้
  useImperativeHandle(onRef, () => ({
    reset: () => recaptchaRef.current?.reset?.(),
    executeAsync: () => recaptchaRef.current?.executeAsync?.(),
    getValue: () => recaptchaRef.current?.getValue?.(),
  }));

  return <ReCAPTCHA ref={recaptchaRef} sitekey={sitekey} onChange={onChange} />;
};

export default ReCAPTCHAComponent;
