"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function SaharaNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
            S
          </div>

          <div>
            <p className="text-xl font-bold text-slate-950">SAHARA</p>
            <p className="text-xs text-slate-500">
              Healthcare Coordination
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <Link href="/hospitals" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Hospitals
          </Link>

          <Link href="/blood" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Blood
          </Link>

          <Link href="/doctors" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            Doctors
          </Link>

          <Link href="/ai" className="text-sm font-medium text-slate-600 hover:text-blue-600">
            डाक्टर साहेब
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            Login
          </Link>

          <Link
            href="/emergency"
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Emergency SOS
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-slate-200 p-2 lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-6 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/hospitals" onClick={() => setOpen(false)}>
              Hospitals
            </Link>

            <Link href="/blood" onClick={() => setOpen(false)}>
              Blood
            </Link>

            <Link href="/doctors" onClick={() => setOpen(false)}>
              Doctors
            </Link>

            <Link href="/ai" onClick={() => setOpen(false)}>
              डाक्टर साहेब
            </Link>

            <Link href="/login" onClick={() => setOpen(false)}>
              Login
            </Link>

            <Link
              href="/emergency"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-red-600 px-4 py-3 text-center font-semibold text-white"
            >
              Emergency SOS
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}