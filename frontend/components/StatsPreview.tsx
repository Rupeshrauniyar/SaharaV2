export default function StatsPreview() {
  const stats = [
    ["120+", "Hospitals Listed"],
    ["80+", "Blood Resources"],
    ["250+", "Doctors"],
  ];

  return (
    <section className="bg-slate-50 px-6 py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Healthcare at a Glance
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            See healthcare resources around you.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            SAHARA brings hospitals, doctors and blood resources together so
            users can find help faster.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <p className="text-3xl font-bold text-blue-600">{value}</p>
                <p className="mt-2 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <p className="text-sm text-slate-500">Current Location</p>

          <h3 className="mt-1 text-xl font-bold">Kathmandu, Nepal</h3>

          <div className="mt-6 space-y-4">
            {[
              "Tribhuvan University Teaching Hospital",
              "Nepal Red Cross Blood Bank",
              "Patan Hospital",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-slate-50 p-5"
              >
                <p className="font-semibold">{item}</p>
                <p className="mt-2 text-sm text-green-600">
                  Demo availability
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}