"use client";

import { useState } from "react";
import Link from "next/link";

export default function EmergencyPage() {
  const [location, setLocation] = useState("Location not detected.");

  function detectLocation() {
    if (!navigator.geolocation) {
      setLocation("Location is not supported.");
      return;
    }

    setLocation("Detecting location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(
          `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
        );
      },
      () => {
        setLocation("Unable to access location.");
      }
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-red-600 px-6 py-5 text-white">
        <div className="mx-auto flex max-w-7xl justify-between">
          <div>
            <p className="text-sm text-red-100">SAHARA Emergency</p>
            <h1 className="text-2xl font-bold">Emergency SOS</h1>
          </div>

          <Link href="/" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-600">
            Home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
            Emergency Mode
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Get help quickly.
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Allow SAHARA to detect your location and help you find nearby
            emergency care.
          </p>

          <button
            type="button"
            onClick={detectLocation}
            className="mt-8 rounded-2xl bg-red-600 px-6 py-4 font-semibold text-white"
          >
            Use My Current Location
          </button>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Current Location</p>
            <p className="mt-2 font-semibold">{location}</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Link href="/hospitals" className="rounded-2xl bg-blue-50 p-5">
              <p className="font-bold">Find Hospital</p>
              <p className="mt-2 text-sm text-slate-500">
                Nearby emergency facilities
              </p>
            </Link>

            <Link href="/blood" className="rounded-2xl bg-rose-50 p-5">
              <p className="font-bold">Blood Emergency</p>
              <p className="mt-2 text-sm text-slate-500">
                Blood banks and donors
              </p>
            </Link>

            <Link href="/ai" className="rounded-2xl bg-violet-50 p-5">
              <p className="font-bold">डाक्टर साहेब</p>
              <p className="mt-2 text-sm text-slate-500">
                Healthcare navigation
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}