"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const HealthMap = dynamic(() => import("@/components/HealthMap"), {
  ssr: false,
});

const hospitals = [
  {
    name: "Tribhuvan University Teaching Hospital",
    location: "Maharajgunj, Kathmandu",
    distance: "2.4 km",
  },
  {
    name: "Bir Hospital",
    location: "Mahaboudha, Kathmandu",
    distance: "3.6 km",
  },
  {
    name: "Patan Hospital",
    location: "Lagankhel, Lalitpur",
    distance: "5.2 km",
  },
];

export default function HospitalsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-blue-600">
            SAHARA
          </Link>

          <Link
            href="/emergency"
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Emergency SOS
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Nearby Healthcare
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Find hospitals near you.
        </h1>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1.2fr_.8fr]">
          <HealthMap />

          <div className="space-y-4">
            {hospitals.map((hospital) => (
              <div
                key={hospital.name}
                className="rounded-3xl border border-slate-200 bg-white p-6"
              >
                <h2 className="text-lg font-bold">{hospital.name}</h2>

                <p className="mt-2 text-sm text-slate-500">
                  {hospital.location}
                </p>

                <p className="mt-4 text-sm font-semibold text-blue-600">
                  {hospital.distance} away
                </p>

                <div className="mt-5 flex gap-3">
                  <button className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">
                    View Route
                  </button>

                  <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}