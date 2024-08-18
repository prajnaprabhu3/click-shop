import { ProfileButton } from "../navigation/profile-button";
import DashboardProfileButton from "./dashboard-profile-button";
import SidebarNavigation from "./sidebar-navigation";

type SidebarProps = {
  dashboardLinks: { label: string; path: string; icon: JSX.Element }[];
};

export default function Sidebar({ dashboardLinks }: SidebarProps) {
  return (
    <aside className="w-52 h-screen flex sticky top-0 flex-col justify-between gap-10 border-r p-4">
      <SidebarNavigation dashboardLinks={dashboardLinks} />

      <DashboardProfileButton />
    </aside>
  );
}
