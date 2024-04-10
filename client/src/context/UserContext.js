import { getAuth } from 'firebase/auth';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export function setUpRecaptcha(number) {
  const auth = getAuth(); // Get Auth instance
  const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {});

  recaptchaVerifier.render();
  
  // Return both recaptchaVerifier and signInWithPhoneNumber functions
  return signInWithPhoneNumber(auth, number, recaptchaVerifier);
}
