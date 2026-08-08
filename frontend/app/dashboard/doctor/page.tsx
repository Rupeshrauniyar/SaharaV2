import Link from "next/link";

export default function DoctorDashboard() {
  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="text-xl font-bold text-blue-600">
            SAHARA
          </Link>

          <p className="text-xs text-slate-500">
            Doctor Dashboard
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-4xl font-bold">
          Welcome, Dr. Anish Sharma
        </h1>

        <p className="mt-3 text-slate-600">
          Cardiology • Teaching Hospital
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            ["8", "Appointments Today"],
            ["5", "Pending Requests"],
            ["31", "Patients This Week"],
            ["Online", "Availability"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-3xl bg-white p-6">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-3 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6">
          <h2 className="text-xl font-bold">
            Today&apos;s Appointments
          </h2>

          <div className="mt-5 space-y-4">
            {[
              "09:30 AM — Demo Patient 01",
              "10:45 AM — Demo Patient 02",
              "12:15 PM — Demo Patient 03",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 p-5">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}