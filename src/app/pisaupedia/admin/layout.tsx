"use client";

import { type ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AuthProvider, useAuth } from "@/features/auth/model/AuthProvider";

import { AdminHeader } from "@/widgets/admin/admin-header";
import { AdminSidebar } from "@/widgets/admin/admin-sidebar";

function AdminGuard({ children }: { children: ReactNode }) {
  const { status, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/pisaupedia/admin/login";

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" && !isLoginPage) {
      router.replace("/pisaupedia/admin/login");
    }
    if (status === "authenticated" && isLoginPage) {
      router.replace("/pisaupedia/admin");
    }
    if (status === "authenticated" && user?.role !== "admin" && !isLoginPage) {
      router.replace("/");
    }
  }, [status, isLoginPage, user, router]);

  if (status === "loading") return null;
  if (isLoginPage) return <>{children}</>;
  if (status !== "authenticated" || user?.role !== "admin") return null;

  return <>{children}</>;
}

function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/pisaupedia/admin/login") {
    return <div className="h-screen overflow-y-auto">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f1f3]">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:relative lg:z-auto lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader onMenuToggle={() => setSidebarOpen((o) => !o)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>
        <AdminShell>{children}</AdminShell>
      </AdminGuard>
    </AuthProvider>
  );
}