"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV_LINKS = [
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources", label: "Resources" },
  { href: "/assessments/new", label: "Free Assessment" },
];

export function Header() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
      role="banner"
    >
      <div className="container flex h-16 items-center justify-between gap-8">
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="ComplianceAstra home"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center text-emerald-600">
            <ShieldCheck className="h-5 w-5" strokeWidth={2.25} aria-hidden />
          </span>
          <span className="text-base font-semibold tracking-tight text-slate-900">
            ComplianceAstra
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-slate-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/assessments/new">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  New Assessment
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/assessments/new">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  Start Free Assessment
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile nav */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" aria-hidden />
          </Button>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="sr-only">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-6" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2 text-slate-700 hover:text-slate-900 font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-slate-200 pt-4 mt-4 space-y-2">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block py-2 text-slate-700 hover:text-slate-900 font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/assessments/new"
                      className="block"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                        New Assessment
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block py-2 text-slate-700 hover:text-slate-900 font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/assessments/new"
                      className="block"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Start Free Assessment
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
