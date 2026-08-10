"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white md:flex">
      <Sidebar />

      <main className="min-h-screen flex-1 overflow-y-auto pb-24 md:pb-8">
        <div className="mx-auto max-w-7xl p-4 md:p-8">
          {children}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
