"use client";

import { useState } from "react";
import Link from "next/link";

const banks = [
  {
    name: "Nepal Red Cross Blood Bank",
    location: "Kathmandu",
    groups: ["A+", "B+", "O+", "AB+", "O-"],
  },
  {
    name: "Teaching Hospital Blood Bank",
    location: "Maharajgunj",
    groups: ["A+", "A-", "B+", "O+", "AB+"],
  },
];

const donors = [
  {
    name: "Demo Donor 01",
    group: "O+",
    location: "Baneshwor",
  },
  {
    name: "Demo Donor 02",
    group: "A+",
    location: "Koteshwor",
  },
  {
    name: "Demo Donor 03",
    group: "B+",
    location: "Lalitpur",
  },
];

export default function BloodPage() {
  const [tab, setTab] = useState<"banks" | "donors">("banks");

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            SAHARA
          </Link>

          <Link href="/emergency" className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white">
            Emergency SOS
          </Link>
        </div>
      </header>

      <section className="bg-rose-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">
            Blood Network
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Find blood resources faster.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex w-fit rounded-xl bg-slate-200 p-1">
          <button
            onClick={() => setTab("banks")}
            className={`rounded-lg px-5 py-2.5 ${
              tab === "banks" ? "bg-white font-semibold" : ""
            }`}
          >
            Blood Banks
          </button>

          <button
            onClick={() => setTab("donors")}
            className={`rounded-lg px-5 py-2.5 ${
              tab === "donors" ? "bg-white font-semibold" : ""
            }`}
          >
            Donors
          </button>
        </div>

        {tab === "banks" && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {banks.map((bank) => (
              <div key={bank.name} className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-bold">{bank.name}</h2>

                <p className="mt-2 text-sm text-slate-500">
                  {bank.location}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {bank.groups.map((group) => (
                    <span
                      key={group}
                      className="rounded-lg bg-rose-50 px-3 py-2 font-semibold text-rose-700"
                    >
                      {group}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "donors" && (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {donors.map((donor) => (
              <div key={donor.name} className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-xl font-bold text-rose-700">
                  {donor.group}
                </div>

                <h2 className="mt-5 font-bold">{donor.name}</h2>

                <p className="mt-2 text-sm text-slate-500">
                  {donor.location}
                </p>

                <button className="mt-5 w-full rounded-xl bg-rose-600 px-4 py-3 font-semibold text-white">
                  Request Contact
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}