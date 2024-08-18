import { auth } from "@/auth/config";
import { BarChart, Package, PenSquare, Settings, Truck } from "lucide-react";
import Sidebar from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log(session?.user, "from dashboard");

  const userLinks = [
    {
      label: "Orders",
      path: "/dashboard/orders",
      icon: <Truck size={16} />,
    },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <Settings size={16} />,
    },
  ] as const;

  const adminLinks =
    session?.user?.role === "admin"
      ? [
          {
            label: "Analytics",
            path: "/dashboard/analytics",
            icon: <BarChart size={16} />,
          },
          {
            label: "Create",
            path: "/dashboard/add-product",
            icon: <PenSquare size={16} />,
          },
          {
            label: "Products",
            path: "/dashboard/products",
            icon: <Package size={16} />,
          },
        ]
      : [];

  const dashboardLinks = [...adminLinks, ...userLinks];

  return (
    <div className="flex">
      <Sidebar dashboardLinks={dashboardLinks} />

      <main className="w-full flex items-center justify-center h-screen">
        {children}
      </main>
    </div>
  );
}
