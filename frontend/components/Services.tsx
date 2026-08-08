import Link from "next/link";

const services = [
  {
    title: "Emergency SOS",
    description: "Quick access to urgent healthcare support.",
    href: "/emergency",
    style: "bg-red-50",
  },
  {
    title: "Nearby Hospitals",
    description: "Find hospitals and healthcare services around you.",
    href: "/hospitals",
    style: "bg-blue-50",
  },
  {
    title: "Blood Network",
    description: "Find blood banks, donors and blood resources.",
    href: "/blood",
    style: "bg-rose-50",
  },
  {
    title: "Find Doctors",
    description: "Search doctors and request appointments.",
    href: "/doctors",
    style: "bg-green-50",
  },
  {
    title: "डाक्टर साहेब AI",
    description: "Get safe healthcare navigation and service guidance.",
    href: "/ai",
    style: "bg-violet-50",
  },
];

export default function Services() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Connected Healthcare
        </p>

        <h2 className="mt-4 max-w-3xl text-3xl font-bold md:text-5xl">
          One platform. Multiple ways to reach care.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              href={service.href}
              key={service.title}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`h-12 w-12 rounded-2xl ${service.style}`} />

              <h3 className="mt-6 text-xl font-bold">{service.title}</h3>

              <p className="mt-3 leading-7 text-slate-600">
                {service.description}
              </p>

              <p className="mt-6 text-sm font-semibold text-blue-600">
                Explore service →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}