import Link from "next/link";

export default function AIPreview() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            AI Healthcare Navigator
          </p>

          <h2 className="mt-4 text-4xl font-bold text-slate-950">
            Meet डाक्टर साहेब
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            A healthcare navigation assistant that helps users understand what
            type of care they may need and guides them toward the right SAHARA
            service.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-950">
                Understand the concern
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Users can describe healthcare concerns in simple English or
                Nepali.
              </p>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <h3 className="font-semibold text-red-800">
                Detect urgent situations
              </h3>

              <p className="mt-2 text-sm leading-6 text-red-700">
                Potential emergencies can be redirected toward Emergency SOS
                and nearby hospitals.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <h3 className="font-semibold text-blue-900">
                Connect to SAHARA services
              </h3>

              <p className="mt-2 text-sm leading-6 text-blue-700">
                Guide users toward hospitals, doctors, blood resources or other
                appropriate healthcare support.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="font-semibold text-amber-900">
              Responsible AI
            </p>

            <p className="mt-2 text-sm leading-6 text-amber-800">
              डाक्टर साहेब does not diagnose diseases, prescribe medicines or
              replace qualified healthcare professionals.
            </p>
          </div>

          <Link
            href="/ai"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Try डाक्टर साहेब
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-lg">
          <div className="rounded-2xl bg-blue-600 p-4 text-sm leading-6 text-white">
            I have severe chest pain and I am feeling short of breath.
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm leading-6 text-slate-700">
              These symptoms may require urgent medical attention. Please do
              not rely on this chat alone.
            </p>

            <p className="mt-3 text-sm font-semibold text-slate-950">
              Use Emergency SOS or find the nearest emergency hospital.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/emergency"
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Emergency SOS
              </Link>

              <Link
                href="/hospitals"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
              >
                Find Hospital
              </Link>
            </div>
          </div>

          <div className="mt-5 ml-auto max-w-[85%] rounded-2xl bg-blue-600 p-4 text-sm text-white">
            के म नजिकको अस्पताल खोज्न सक्छु?
          </div>

          <div className="mt-5 max-w-[90%] rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">
            Yes. SAHARA can help show nearby hospitals using your location.
          </div>
        </div>
      </div>
    </section>
  );
}