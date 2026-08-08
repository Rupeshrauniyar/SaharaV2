import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div>
          <p className="text-2xl font-bold">SAHARA</p>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            Healthcare coordination built for Nepal.
          </p>
        </div>

        <div>
          <p className="font-semibold">Healthcare</p>

          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <Link href="/hospitals" className="block">Hospitals</Link>
            <Link href="/doctors" className="block">Doctors</Link>
            <Link href="/blood" className="block">Blood Network</Link>
          </div>
        </div>

        <div>
          <p className="font-semibold">Support</p>

          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <Link href="/emergency" className="block">Emergency SOS</Link>
            <Link href="/ai" className="block">डाक्टर साहेब</Link>
          </div>
        </div>

        <div>
          <p className="font-semibold">Account</p>

          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <Link href="/login" className="block">Login</Link>
            <Link href="/register" className="block">Register</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-slate-800 pt-6 text-sm text-slate-500">
        © 2026 SAHARA • Hackathon MVP
      </div>
    </footer>
  );
}