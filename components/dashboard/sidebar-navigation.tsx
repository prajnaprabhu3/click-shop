"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./lagout-button";
import { SquareMousePointer } from "lucide-react";

type SidebarProps = {
  dashboardLinks: { label: string; path: string; icon: JSX.Element }[];
};

export default function Sidebar({ dashboardLinks }: SidebarProps) {
  const pathname = usePathname();
  return (
    <div className="py-4">
      <Link href={"/"} className="flex items-center gap-x-2 px-4">
        <SquareMousePointer size={18} />
        <h4 className="text-base font-medium">Click Shop</h4>
      </Link>

      <div className="flex flex-col gap-3 text-gray-500 px-3 py-8">
        <>
          {dashboardLinks.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-2 p-2 rounded hover:px-4 duration-300 hover:text-primary ${
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
