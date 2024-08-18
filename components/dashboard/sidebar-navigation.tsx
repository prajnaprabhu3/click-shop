"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./lagout-button";

type SidebarProps = {
  dashboardLinks: { label: string; path: string; icon: JSX.Element }[];
};

export default function Sidebar({ dashboardLinks }: SidebarProps) {
  const pathname = usePathname();
  return (
    <div className="py-4">
      <Link className="p-2 px-4" href={"/"}>
        Logo.
      </Link>

      <div className="flex flex-col gap-3 text-gray-500 px-3 py-8">
        <>
          {dashboardLinks.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-2 p-2 rounded hover:px-4 duration-300 ${
                pathname.includes(item.path) ? "text-primary" : ""
              }`}
            >
              <p> {item.icon}</p>
              <p className="text-sm">{item.label}</p>
            </Link>
          ))}

          <LogoutButton />
        </>
      </div>
    </div>
  );
}
