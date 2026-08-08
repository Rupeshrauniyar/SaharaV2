"use client";

import { useState } from "react";
import Link from "next/link";

const doctors = [
  {
    name: "Dr. Anish Sharma",
    speciality: "Cardiology",
    hospital: "Teaching Hospital",
  },
  {
    name: "Dr. Sushmita Karki",
    speciality: "General Medicine",
    hospital: "Bir Hospital",
  },
  {
    name: "Dr. Prabin Shrestha",
    speciality: "Orthopedics",
    hospital: "Patan Hospital",
  },
];

export default function DoctorsPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            SAHARA
          </Link>

          <Link href="/emergency" className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white">
            Emergency SOS
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Doctor Discovery
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Find the right doctor.
        </h1>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {doctors.map((doctor) => (
            <div key={doctor.name} className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 font-bold text-blue-700">
                DR
              </div>

              <h2 className="mt-5 text-xl font-bold">{doctor.name}</h2>

              <p className="mt-2 font-semibold text-blue-600">
                {doctor.speciality}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {doctor.hospital}
              </p>

              <button
                onClick={() => setSelected(doctor.name)}
                className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white"
              >
                Request Appointment
              </button>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7">
            <h2 className="text-2xl font-bold">
              Appointment Request
            </h2>

            <p className="mt-2 text-slate-500">{selected}</p>

            <input
              type="date"
              className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3"
            />

            <textarea
              placeholder="Reason for visit"
              rows={4}
              className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3"
            />

            <button
              onClick={() => setSelected(null)}
              className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white"
            >
              Submit Demo Request
            </button>
          </div>
        </div>
      )}
    </main>
  );
}