"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const APP_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/reports", label: "Reports" },
  { href: "/billing", label: "Billing" },
  { href: "/settings/organization", label: "Organization" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav
      className="border-b border-slate-200 bg-slate-50/50"
      aria-label="Application navigation"
    >
      <div className="container">
        <ul className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
          {APP_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  pathname?.startsWith(link.href)
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
