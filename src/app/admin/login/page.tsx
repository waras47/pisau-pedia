import { LoginForm } from "@/features/auth/ui/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-lg font-semibold">Masuk ke Admin Panel</h1>
        <LoginForm />
      </div>
    </div>
  );
}