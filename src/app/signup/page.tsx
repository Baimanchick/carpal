import { AuthScreen } from "@/features/auth/components/auth-screen";

export const metadata = { title: "Регистрация" };

export default function SignupPage() {
  return <AuthScreen variant="signup" />;
}
