export type AuthUser = {
  email: string | null;
  emailVerified: boolean;
  fullName: string;
  hasGoogle: boolean;
  id: string;
  nationality: string | null;
  preferredLang: string;
};

export type EmailOtpRequestInput = {
  email: string;
};

export type EmailOtpRequestResponse = {
  expiresIn: number;
  sent: boolean;
};

export type EmailOtpVerifyInput = {
  code: string;
  email: string;
};

export type EmailOtpVerifyResponse = {
  email: string;
  userId: string;
};
