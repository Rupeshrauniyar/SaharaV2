import Link from "next/link";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-slate-50 px-6 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Healthcare Coordination for Nepal
          </div>

          <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-slate-950 md:text-6xl">
            Healthcare Help,
            <span className="block text-blue-600">
              When Every Second Matters.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Find hospitals, blood resources, doctors and emergency healthcare
            support through one connected platform.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/emergency"
              className="rounded-xl bg-red-600 px-6 py-4 text-center font-semibold text-white hover:bg-red-700"
            >
              Emergency SOS
            </Link>

            <Link
              href="/hospitals"
              className="rounded-xl bg-blue-600 px-6 py-4 text-center font-semibold text-white hover:bg-blue-700"
            >
              Explore SAHARA
            </Link>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-slate-200 pt-8">
            <div>
              <p className="text-2xl font-bold">24/7</p>
              <p className="mt-1 text-xs text-slate-500">Emergency Access</p>
            </div>

            <div>
              <p className="text-2xl font-bold">1 Platform</p>
              <p className="mt-1 text-xs text-slate-500">Connected Care</p>
            </div>

            <div>
              <p className="text-2xl font-bold">Nepal</p>
              <p className="mt-1 text-xs text-slate-500">Built Locally</p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl">
          <p className="text-sm text-slate-500">SAHARA Health Network</p>

          <h2 className="mt-2 text-2xl font-bold">
            Healthcare around you
          </h2>

          <div className="mt-6 space-y-4">
            <Link href="/hospitals" className="block rounded-2xl bg-blue-50 p-5">
              <p className="font-semibold">Nearby Hospitals</p>
              <p className="mt-1 text-sm text-slate-500">
                Emergency services and healthcare facilities
              </p>
            </Link>

            <Link href="/blood" className="block rounded-2xl bg-rose-50 p-5">
              <p className="font-semibold">Blood Network</p>
              <p className="mt-1 text-sm text-slate-500">
                Blood banks and donor resources
              </p>
            </Link>

            <Link href="/doctors" className="block rounded-2xl bg-green-50 p-5">
              <p className="font-semibold">Doctor Access</p>
              <p className="mt-1 text-sm text-slate-500">
                Discover doctors and request appointments
              </p>
            </Link>

            <Link href="/ai" className="block rounded-2xl bg-violet-50 p-5">
              <p className="font-semibold">डाक्टर साहेब AI</p>
              <p className="mt-1 text-sm text-slate-500">
                Healthcare navigation in English and Nepali
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}