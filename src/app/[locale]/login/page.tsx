import { Suspense } from "react";
import { AuthScreen } from "@/features/auth/components/auth-screen";

export const metadata = { title: "Войти" };

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthScreen />
    </Suspense>
  );
}
