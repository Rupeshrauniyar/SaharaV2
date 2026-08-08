import Link from "next/link";

export default function HospitalDashboard() {
  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="text-xl font-bold text-blue-600">
            SAHARA
          </Link>

          <p className="text-xs text-slate-500">
            Hospital Dashboard
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-4xl font-bold">
          City Hospital Dashboard
        </h1>

        <p className="mt-3 text-slate-600">
          Monitor emergency requests and healthcare resources.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            ["12", "Emergency Requests"],
            ["28", "Appointments"],
            ["7", "Blood Requests"],
            ["34", "Available Beds"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-3xl bg-white p-6">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-3 text-4xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6">
            <h2 className="text-xl font-bold">
              Emergency Requests
            </h2>

            <div className="mt-5 space-y-4">
              {[
                "Chest pain — Baneshwor",
                "Road accident — Koteshwor",
                "Severe fever — Maharajgunj",
              ].map((request) => (
                <div key={request} className="rounded-2xl bg-red-50 p-5">
                  <p className="font-semibold">{request}</p>

                  <button className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                    Accept
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6">
            <h2 className="text-xl font-bold">
              Blood Inventory
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (group) => (
                  <div key={group} className="rounded-2xl bg-rose-50 p-5">
                    <p className="text-xl font-bold text-rose-700">
                      {group}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Demo units available
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
