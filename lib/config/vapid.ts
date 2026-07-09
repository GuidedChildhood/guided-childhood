// The VAPID public key is not a secret. It is handed to every browser to
// create a push subscription, so baking it in as a reliable fallback
// removes the most fragile part of the setup: a NEXT_PUBLIC env var that
// has to be present at build time or the subscribe call silently fails and
// the turn on button looks dead. The env var still wins if set, so the key
// can be rotated without a code change. Only the PRIVATE key and the email
// remain true server secrets, set in the host environment.
export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_KEY ||
  'BBZjfqow7fWhqWjvT-0qNS8gDLCuBrpJmsGVRg1adL__MbkBf94OUGBKxWCvr7pkOrLfMIRgJKra0WwzR35w9xU'
