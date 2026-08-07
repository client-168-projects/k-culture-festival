import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminProtectedLayout({
  children,
}: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar active="notices" />
      <main className="flex-1 overflow-y-auto p-6 sm:p-8">{children}</main>
    </div>
  );
}
