import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Apple,
  Bell,
  CalendarDays,
  Check,
  CircleX,
  Compass,
  Droplets,
  Hospital,
  Lock,
  MapPin,
  MessageCircle,
  Navigation,
  Plus,
  ShieldCheck,
  Smartphone,
  X,
  Zap,
} from "lucide-react";
const cities = [
  "Kathmandu",
  "Pokhara",
  "Biratnagar",
  "Dharan",
  "Chitwan",
  "Butwal",
  "Bharatpur",
  "Itahari",
];

const features = [
  {
    title: "Emergency SOS",
    text: "One tap sends your live location, medical ID and vitals (if synced) to the nearest connected hospital — and alerts your emergency contacts automatically.",
    icon: Zap,
    large: true,
    tag: "Core feature",
  },
  {
    title: "AI Health Navigator",
    text: "Describe symptoms in your own words — English or Nepali — and get triaged guidance on what to do next.",
    icon: Compass,
  },
  {
    title: "Care Chat",
    text: "24/7 conversational support for medicine questions, appointment help, and getting around the app.",
    icon: MessageCircle,
  },
  {
    title: "Blood Network",
    text: "Request blood by type, urgency and location — or register as a donor and get notified when it matters.",
    icon: Droplets,
  },
  {
    title: "Find Hospitals & Beds",
    text: "See real-time bed availability, specialities and distance for every verified hospital on the network.",
    icon: Hospital,
  },
  {
    title: "Book Appointments",
    text: "Search doctors by specialty and availability, compare options, and confirm a visit in under a minute.",
    icon: CalendarDays,
  },
];

const roles = {
  patients: {
    eyebrow: "For patients",
    title: "Everything you need, none of the runaround.",
    icon: Activity,
    button: "Join as a patient",
    items: [
      "Request or donate blood by type & distance",
      "One-tap Emergency SOS",
      "AI navigator for symptom guidance",
      "Book & manage appointments",
      "Carry a digital medical ID",
    ],
  },
  doctors: {
    eyebrow: "For doctors",
    title: "Spend more time treating, less time coordinating.",
    icon: MessageCircle,
    button: "Join as a doctor",
    items: [
      "Manage your appointment calendar in one place",
      "Secure access to patient history & medical ID",
      "Respond to Care Chat consultations",
      "Get discovered by patients in your specialty",
    ],
  },
  hospitals: {
    eyebrow: "For hospitals",
    title: "Run your bed count and blood bank in real time.",
    icon: Hospital,
    button: "Register your hospital",
    items: [
      "Register and update bed availability live",
      "Receive incoming SOS cases directly",
      "Offer verified donor access to your blood bank",
      "Appear in hospital & specialty search",
    ],
  },
};

const faqs = [
  ["Is Sahara free to use?", "Yes — creating an account, booking appointments and using the AI navigator are free. Emergency SOS is always free to trigger."],
  ["Does SOS replace calling emergency services?", "No. Sahara is designed to complement — not replace — your national emergency number. If you're able to call for help directly, always do so alongside using SOS."],
  ["Which areas does Sahara cover?", "We're live across major cities in Nepal — including Kathmandu, Pokhara, Biratnagar and Dharan — and expanding to more districts and neighbouring countries."],
  ["How is my medical data protected?", "Your medical ID and health data are encrypted, and only shared with responders and providers directly involved in your care."],
  ["How do I become a blood donor?", "Register your blood type and location in the app. You'll only be notified when a nearby request matches your type — you're always in control of when you respond."],
  ["Can hospitals outside major cities join?", "Yes. Any licensed hospital or clinic can apply regardless of location — our team verifies each listing before it goes live."],
];

const testimonials = [
  ["My father's oxygen dropped at 2am. Sahara had a hospital notified before I finished dialing anyone.", "Sushant R.", "Patient · Kathmandu", "SR"],
  ["I registered as a donor on a whim. A couple weeks later I got a match request nearby — it actually worked.", "Nirisha T.", "Donor · Pokhara", "NT"],
  ["Booking my mother's cardiology visit used to mean three phone calls. Now it's one search.", "Bipin K.", "Patient · Biratnagar", "BK"],
];

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, light = false }) {
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] ${light ? "text-[#4E9EF0]" : "text-[#1657CC]"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${light ? "bg-[#4E9EF0]" : "bg-[#E0393E]"}`} />
      {children}
    </span>
  );
}

function Button({ children, variant = "primary", href = "#", className = "", onClick }) {
  const styles = {
    primary: "bg-[#1657CC] text-white shadow-[0_24px_48px_-24px_rgba(22,87,204,.45)] hover:bg-[#0C3B90]",
    ghost: "border border-[#DCE6F6] bg-transparent text-[#0A1F3D] hover:border-[#1657CC] hover:text-[#1657CC]",
    alert: "bg-[#E0393E] text-white shadow-[0_20px_40px_-18px_rgba(224,57,62,.55)] hover:bg-[#B92A2F]",
    light: "bg-white text-[#0A1F3D] shadow-[0_8px_20px_-12px_rgba(10,31,61,.25)] hover:-translate-y-0.5",
    outlineLight: "border border-white/35 bg-transparent text-white hover:border-white hover:bg-white/10",
  };
  return (
    <a
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-px ${styles[variant]} ${className}`}
    >
      {children}
    </a>
  );
}

function Logo() {
  return (
    <a href="#main" className="flex items-center gap-2 font-serif text-2xl italic font-semibold text-[#0A1F3D]" aria-label="Sahara home">
      <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-gradient-to-br from-[#1657CC] to-[#0C3B90] text-white">
        <Activity size={20} strokeWidth={2.2} />
      </span>
      sahara
    </a>
  );
}

function PhoneMockup() {
  return (
    <div className="relative w-[290px] h-[580px] rounded-[44px] bg-[#0A1F3D] p-3.5 shadow-[0_40px_80px_-30px_rgba(10,31,61,.4)] sm:w-[290px]">
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[32px] bg-gradient-to-b from-white to-[#EAF1FC]">
        <div className="absolute left-1/2 top-0 z-10 h-6 w-[120px] -translate-x-1/2 rounded-b-2xl bg-[#0A1F3D]" />
        <div className="flex items-center justify-between px-5 pb-1.5 pt-3.5 font-mono text-[10px] font-semibold text-[#57678A]">
          <span>9:41</span>
          <span className="flex gap-1"><i className="h-1.5 w-1.5 rounded-full bg-[#57678A]" /><i className="h-1.5 w-1.5 rounded-full bg-[#57678A]" /><i className="h-1.5 w-1.5 rounded-full bg-[#57678A]" /></span>
        </div>
        <div className="flex items-center justify-between px-4 pb-4 pt-2">
          <span className="flex items-center gap-1.5 font-serif text-base italic font-semibold">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-[#1657CC] text-white"><Activity size={12} /></span>
            sahara
          </span>
          <Bell size={18} className="text-[#57678A]" />
        </div>
        <p className="px-4 text-xs font-semibold text-[#57678A]">Namaste, Aayush 👋</p>

        <div className="relative flex flex-col items-center px-3 py-5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute top-5 h-[150px] w-[150px] rounded-full border border-[#E0393E]/35"
              animate={{ scale: [0.55, 1.5], opacity: [0.9, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
            />
          ))}
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="relative z-10 flex h-[118px] w-[118px] flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#ff5a5f] to-[#B92A2F] text-white shadow-[0_20px_40px_-14px_rgba(224,57,62,.65)]"
          >
            <Zap size={26} />
            <span className="mt-1 font-mono text-[10px] font-bold tracking-wider">HOLD FOR SOS</span>
          </motion.div>
          <span className="relative z-10 mt-3 text-[10px] font-semibold text-[#8C99B8]">Shares location + medical ID instantly</span>
        </div>

        <div className="mx-4 mt-1 flex items-center gap-3 rounded-[18px] bg-white p-3 shadow-[0_8px_20px_-12px_rgba(10,31,61,.25)]">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#EAF1FC] text-[#1657CC]"><MapPin size={17} /></span>
          <div>
            <div className="text-[11px] font-bold">Nearest: Himal General Hospital</div>
            <div className="mt-0.5 text-[10px] text-[#8C99B8]">4 min away · notifying family</div>
          </div>
        </div>

        <div className="mt-auto flex gap-2 px-4 pb-4 pt-3">
          {[[Compass, "Navigator"], [Droplets, "Blood"], [CalendarDays, "Book"]].map(([Icon, label]) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-1 rounded-[10px] bg-white px-1 py-2.5 shadow-[0_8px_20px_-12px_rgba(10,31,61,.25)]">
              <Icon size={16} className="text-[#1657CC]" />
              <span className="text-[9px] font-bold text-[#57678A]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState("patients");
  const [openFaq, setOpenFaq] = useState(null);
  const [sosOpen, setSosOpen] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const close = () => setMobileOpen(false);
    document.querySelectorAll("#mobile-menu a").forEach((a) => a.addEventListener("click", close));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.querySelectorAll("#mobile-menu a").forEach((a) => a.removeEventListener("click", close));
    };
  }, [mobileOpen]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  return (
    <div id="main" className="min-h-screen overflow-x-hidden bg-[#F6F9FD] text-[#0A1F3D] antialiased">
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-lg focus:bg-[#0A1F3D] focus:px-5 focus:py-3 focus:text-white">
        Skip to content
      </a>

      {/* NAVIGATION */}
      <header className={`sticky top-0 z-[100] border-b transition-all duration-300 ${scrolled ? "border-[#DCE6F6] bg-[#F6F9FD]/90 py-3 shadow-[0_10px_30px_-20px_rgba(10,31,61,.25)] backdrop-blur-xl" : "border-transparent bg-[#F6F9FD]/70 py-4 backdrop-blur-xl"}`}>
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Logo />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {[
              ["Features", "#features"],
              ["How it works", "#how-it-works"],
              ["Blood network", "#blood"],
              ["For hospitals", "#hospitals"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a key={href} href={href} className="text-sm font-semibold text-[#57678A] transition hover:text-[#1657CC]">{label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a href="/login" className="hidden text-sm font-bold text-[#57678A] hover:text-[#0A1F3D] sm:block">Log in</a>
            <Button href="#download" className="hidden px-4 py-2.5 text-xs sm:inline-flex">Get the app</Button>
            <button onClick={() => setMobileOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-lg lg:hidden" aria-label="Open menu" aria-expanded={mobileOpen}>
              {mobileOpen ? <X /> : <span className="flex flex-col gap-1.5"><i className="h-0.5 w-5 bg-[#0A1F3D]" /><i className="h-0.5 w-5 bg-[#0A1F3D]" /><i className="h-0.5 w-5 bg-[#0A1F3D]" /></span>}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 top-0 z-[99] flex flex-col justify-center gap-7 bg-[#F6F9FD] px-6 pb-12 pt-24 lg:hidden"
          >
            {[
              ["Features", "#features"],
              ["How it works", "#how-it-works"],
              ["Blood network", "#blood"],
              ["For hospitals", "#hospitals"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => <a key={href} href={href} className="font-serif text-3xl" onClick={() => setMobileOpen(false)}>{label}</a>)}
            <Button href="#download" onClick={() => setMobileOpen(false)} className="self-start">Get the app</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="content">
        {/* HERO */}
        <section className="overflow-hidden pb-8 pt-14 sm:pt-20">
          <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-12">
            <Reveal>
              <Eyebrow>Live across Nepal · expanding across South Asia</Eyebrow>
              <h1 className="mt-4 max-w-3xl font-serif text-[clamp(2.7rem,5vw,4.4rem)] font-semibold leading-[1.04] tracking-tight">
                Someone to lean on, <em className="text-[#1657CC]">the moment it matters most.</em>
              </h1>
              <p className="mt-5 max-w-xl text-[1.08rem] leading-7 text-[#57678A]">
                Sahara puts a hospital network, an AI health navigator, and a community of blood donors one tap away — starting with the moments that can't wait.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#download">Get SOS-ready <ArrowRight size={18} /></Button>
                <Button href="#how-it-works" variant="ghost">Watch how SOS works</Button>
              </div>
              <div className="mt-9 flex flex-wrap gap-2">
                {["⏱  ~90s avg. dispatch*", "🏥  Verified hospital network", "🩸  Donor-matched by type & distance"].map((x) => (
                  <span key={x} className="rounded-full border border-[#DCE6F6] bg-white px-4 py-2 font-mono text-xs font-medium">{x}</span>
                ))}
              </div>
              <p className="mt-2 text-xs text-[#8C99B8]">*Reflects our network's design target, not a guaranteed response time.</p>
            </Reveal>

            <div className="relative flex min-h-[560px] items-center justify-center">
              <div className="absolute h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(22,87,204,.16),transparent_70%)] blur-xl" />
              <svg className="absolute left-[-20%] top-[38%] w-[140%] opacity-50" viewBox="0 0 600 120">
                <path d="M0 60 H180 L210 20 L245 100 L275 40 L300 60 H600" fill="none" stroke="#4E9EF0" strokeWidth="1.4" strokeDasharray="8 6">
                  <animate attributeName="stroke-dashoffset" from="0" to="-110" dur="4s" repeatCount="indefinite" />
                </path>
              </svg>
              <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative z-10">
                <PhoneMockup />
              </motion.div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }} className="absolute right-0 top-[8%] z-20 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold shadow-[0_24px_48px_-24px_rgba(22,87,204,.45)]">
                <ShieldCheck size={15} className="text-[#1657CC]" /> Verified network
              </motion.div>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[10%] left-0 z-20 rounded-[18px] bg-white p-4 shadow-[0_40px_80px_-30px_rgba(10,31,61,.35)]">
                <div className="font-mono text-2xl font-bold text-[#1657CC]">78s</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#8C99B8]">Dispatch target*</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="border-y border-[#DCE6F6] bg-white py-12">
          <p className="mb-6 text-center text-sm font-bold text-[#57678A]">Built for how care actually works across Nepal</p>
          <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
              className="flex w-max gap-10"
            >
              {[...cities, ...cities].map((city, i) => (
                <span key={`${city}-${i}`} className="flex items-center gap-2 whitespace-nowrap font-mono text-sm font-semibold text-[#57678A]">
                  <MapPin size={15} className="text-[#4E9EF0]" /> {city}
                </span>
              ))}
            </motion.div>
          </div>
          <div className="mx-auto mt-9 flex max-w-5xl flex-wrap justify-center gap-x-9 gap-y-4 px-5">
            {[
              [Lock, "Encrypted health records"],
              [ShieldCheck, "Verified hospitals only"],
              [Droplets, "Licensed blood-bank protocols"],
            ].map(([Icon, text]) => <span key={text} className="flex items-center gap-2 text-sm font-semibold text-[#57678A]"><Icon size={18} className="text-[#1657CC]" />{text}</span>)}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24 sm:py-32">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
            <Reveal>
              <Eyebrow>What Sahara does</Eyebrow>
              <h2 className="mt-3 max-w-2xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">Every piece of care, in one place.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#57678A]">Six tools working together so you're never navigating a health emergency — or a routine visit — alone.</p>
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ title, text, icon: Icon, large, tag }, i) => (
                <Reveal key={title} delay={i * 0.07} className={large ? "sm:col-span-2" : ""}>
                  <motion.div whileHover={{ y: -6 }} className={`flex h-full min-h-[250px] flex-col gap-4 rounded-[28px] border p-7 shadow-sm transition ${large ? "border-[#F6D3D4] bg-gradient-to-br from-[#FFF5F5] to-white" : "border-[#DCE6F6] bg-white hover:border-transparent hover:shadow-[0_24px_48px_-24px_rgba(22,87,204,.28)]"}`}>
                    {tag && <span className="self-start rounded-full bg-[#FCE3E3] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#E0393E]">{tag}</span>}
                    <span className={`grid h-13 w-13 place-items-center rounded-[14px] ${large ? "bg-[#FCE3E3] text-[#E0393E]" : "bg-[#EAF1FC] text-[#1657CC]"}`}><Icon size={24} /></span>
                    <h3 className="font-serif text-xl font-semibold">{title}</h3>
                    <p className="flex-1 text-sm leading-6 text-[#57678A]">{text}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24 sm:py-32">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
            <Reveal>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">From tap to help — in four steps.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#57678A]">Designed so that in the worst moment, the app asks the least of you.</p>
            </Reveal>
            <div className="mt-14 grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["01", "Tap SOS", "No forms, no typing. One press starts the alert."],
                ["02", "Share what matters", "Your live location and medical ID — allergies, blood type, conditions — go out instantly."],
                ["03", "Nearest hospital responds", "The closest connected hospital is notified and a responder is dispatched."],
                ["04", "Family stays informed", "Emergency contacts get a live status update automatically, until help arrives."],
              ].map(([num, title, text], i) => (
                <Reveal key={num} delay={i * 0.08}>
                  <div className="relative">
                    <span className="grid h-[52px] w-[52px] place-items-center rounded-full border border-[#DCE6F6] font-mono font-bold text-[#1657CC]">{num}</span>
                    <h4 className="mt-4 font-serif text-lg font-semibold">{title}</h4>
                    <p className="mt-2 text-sm leading-6 text-[#57678A]">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ROLES */}
        <section id="roles" className="border-y border-[#DCE6F6] bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
            <Reveal>
              <Eyebrow>One app, three ways in</Eyebrow>
              <h2 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">Built around who you are, not just what you need.</h2>
            </Reveal>
            <div className="mt-10 inline-flex gap-1 rounded-full border border-[#DCE6F6] bg-white p-1.5 shadow-sm">
              {Object.keys(roles).map((key) => (
                <button key={key} onClick={() => setRole(key)} className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${role === key ? "bg-[#1657CC] text-white" : "text-[#57678A] hover:text-[#1657CC]"}`}>
                  {key[0].toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={role} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="mt-10 grid items-center gap-10 lg:grid-cols-2">
                <div>
                  <Eyebrow>{roles[role].eyebrow}</Eyebrow>
                  <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">{roles[role].title}</h3>
                  <ul className="mt-7 flex flex-col gap-4">
                    {roles[role].items.map((item) => <li key={item} className="flex items-start gap-3 text-sm font-medium"><Check size={20} className="mt-0.5 shrink-0 text-[#1657CC]" />{item}</li>)}
                  </ul>
                  <Button href="#download" className="mt-7">{roles[role].button}</Button>
                </div>
                <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[28px] bg-[#EAF1FC]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,.7),transparent_60%)]" />
                  {(() => { const Icon = roles[role].icon; return <Icon size={88} strokeWidth={1.4} className="relative text-[#1657CC]" />; })()}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* BLOOD */}
        <section id="blood" className="border-y border-[#F6D3D4] bg-gradient-to-br from-[#FFF6F6] to-[#FCEAEA] py-24 sm:py-32">
          <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:px-12">
            <Reveal>
              <Eyebrow>Blood network</Eyebrow>
              <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">When blood is needed, minutes matter.</h2>
              <p className="mt-4 max-w-xl leading-7 text-[#57678A]">Sahara matches blood requests to nearby donors by type and distance — so hospitals and families spend less time searching and more time treating.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="#download" variant="alert">Request blood</Button>
                <Button href="#download" variant="ghost">Become a donor</Button>
              </div>
            </Reveal>
            <Reveal>
              <div className="flex flex-col">
                {[
                  [Droplets, "Request placed", "Type O+ · Kathmandu"],
                  [MapPin, "Nearby donors matched", "3 donors within 2 km"],
                  [Check, "Donor confirms", "En route to hospital"],
                  [Hospital, "Hospital notified", "Ready for donation"],
                ].map(([Icon, title, sub], i) => (
                  <div key={title}>
                    <div className="flex items-center gap-4 rounded-[18px] bg-white p-4 shadow-sm">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FCE3E3] text-[#E0393E]"><Icon size={20} /></span>
                      <div><strong className="block text-sm">{title}</strong><span className="text-xs text-[#8C99B8]">{sub}</span></div>
                    </div>
                    {i < 3 && <div className="ml-5 h-6 w-0.5 border-l-2 border-dashed border-[#E0393E]" />}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Early voices</Eyebrow>
              <h2 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">What people are telling us.</h2>
            </Reveal>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {testimonials.map(([quote, name, info, initials], i) => (
                <Reveal key={name} delay={i * 0.08}>
                  <div className="flex h-full flex-col gap-5 rounded-[28px] border border-[#DCE6F6] bg-white p-7">
                    <p className="font-serif text-lg leading-7">"{quote}"</p>
                    <div className="mt-auto flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#4E9EF0] to-[#1657CC] font-serif font-bold text-white">{initials}</span>
                      <div><div className="text-sm font-bold">{name}</div><div className="text-xs text-[#8C99B8]">{info}</div></div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* HOSPITALS */}
        <section id="hospitals" className="py-10 sm:py-16">
          <div className="mx-4 rounded-[28px] bg-[radial-gradient(circle_at_15%_20%,#123a80,#0A1F3D_55%)] px-5 py-20 text-white sm:mx-8 sm:px-10 lg:mx-12 lg:px-16">
            <div className="mx-auto grid max-w-[1160px] items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
              <Reveal>
                <Eyebrow light>For hospitals & clinics</Eyebrow>
                <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">Bring your hospital onto the Sahara network.</h2>
                <p className="mt-4 max-w-xl leading-7 text-white/70">Join a growing network of verified hospitals across Nepal. Update bed availability in real time, receive SOS cases directly, and reach patients searching for your specialities.</p>
                <ul className="mt-7 flex flex-col gap-3">
                  {["Real-time bed & capacity management", "Direct SOS case routing", "Verified donor-access listing", "Visibility in hospital & specialty search"].map((x) => <li key={x} className="flex gap-3 text-sm text-white/90"><Check size={19} className="shrink-0 text-[#4E9EF0]" />{x}</li>)}
                </ul>
                <Button href="#download" variant="light" className="mt-7">Register your hospital <ArrowRight size={18} /></Button>
              </Reveal>
              <Reveal>
                <div className="rounded-[18px] border border-white/15 bg-white/5 p-6 backdrop-blur-md">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/60">Himal General Hospital</span>
                    <Hospital size={16} className="text-[#4E9EF0]" />
                  </div>
                  {[["ICU", "4 / 12 open", 33], ["General ward", "21 / 40 open", 52], ["Maternity", "6 / 10 open", 60]].map(([name, count, width]) => (
                    <div key={name} className="border-t border-white/10 py-3 first:border-0">
                      <div className="flex justify-between text-sm"><span className="font-semibold">{name}</span><span className="font-mono text-xs text-[#4E9EF0]">{count}</span></div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/15"><motion.span initial={{ width: 0 }} whileInView={{ width: `${width}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className="block h-full rounded-full bg-[#4E9EF0]" /></div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* DOWNLOAD */}
        <section id="download" className="py-24 sm:py-32">
          <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:px-12">
            <Reveal>
              <Eyebrow>Get Sahara</Eyebrow>
              <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">Healthcare that shows up, right from your pocket.</h2>
              <p className="mt-4 max-w-xl leading-7 text-[#57678A]">Available for patients, doctors and hospital staff. Set up your medical ID once — Sahara handles the rest when it counts.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#" className="flex items-center gap-3 rounded-[10px] bg-[#0A1F3D] px-5 py-3 text-white transition hover:-translate-y-0.5"><Apple size={23} /><span><small className="block text-[9px] text-white/60">Download on the</small><strong className="text-sm">App Store</strong></span></a>
                <a href="#" className="flex items-center gap-3 rounded-[10px] bg-[#0A1F3D] px-5 py-3 text-white transition hover:-translate-y-0.5"><Navigation size={23} /><span><small className="block text-[9px] text-white/60">Get it on</small><strong className="text-sm">Google Play</strong></span></a>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="grid h-[88px] w-[88px] grid-cols-6 gap-0.5 rounded-xl border border-[#DCE6F6] bg-white p-2 shadow-sm">
                  {Array.from({ length: 36 }, (_, i) => <span key={i} className={((i * 7 + i * i) % 5) < 2 ? "rounded-[1px] bg-[#0A1F3D]" : "rounded-[1px] bg-transparent"} />)}
                </div>
                <span className="max-w-[16ch] text-xs font-semibold text-[#57678A]">Scan with your phone camera to download</span>
              </div>
            </Reveal>
            <Reveal>
              <div className="relative flex min-h-[250px] items-center justify-center">
                <svg viewBox="0 0 600 120" className="w-full opacity-40">
                  <path d="M0 60 H180 L210 20 L245 100 L275 40 L300 60 H600" fill="none" stroke="#1657CC" strokeWidth="1.5" strokeDasharray="8 6">
                    <animate attributeName="stroke-dashoffset" from="0" to="-110" dur="3.2s" repeatCount="indefinite" />
                  </path>
                </svg>
                <div className="absolute grid h-32 w-32 place-items-center rounded-[28px] bg-[#EAF1FC] text-[#1657CC] shadow-sm"><Smartphone size={56} strokeWidth={1.4} /></div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 sm:py-32">
          <div className="mx-auto max-w-[760px] px-5 sm:px-8">
            <Reveal className="text-center">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">Frequently asked questions.</h2>
            </Reveal>
            <div className="mt-12 flex flex-col gap-3">
              {faqs.map(([question, answer], i) => {
                const open = openFaq === i;
                return (
                  <div key={question} className="overflow-hidden rounded-[18px] border border-[#DCE6F6] bg-white">
                    <button onClick={() => setOpenFaq(open ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-serif text-base font-semibold">
                      {question}
                      <motion.span animate={{ rotate: open ? 45 : 0 }}><Plus size={20} className="shrink-0 text-[#1657CC]" /></motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <p className="px-5 pb-5 text-sm leading-6 text-[#57678A]">{answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-10 sm:py-16">
          <div className="mx-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0C3B90] via-[#1657CC] to-[#4E9EF0] px-5 py-20 text-center text-white sm:mx-8 sm:px-10 lg:mx-12">
            <div className="mx-auto max-w-2xl">
              <Reveal>
                <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">Someone should have your back. Now something does.</h2>
                <p className="mx-auto mt-4 max-w-xl leading-7 text-white/85">Set up your medical ID in minutes — and have a hospital network, an AI navigator, and a donor community ready the moment you need them.</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button href="#download" variant="light">Get the app</Button>
                  <Button href="#hospitals" variant="outlineLight">Register your hospital</Button>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#DCE6F6] pb-10 pt-20">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-10 border-b border-[#DCE6F6] pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
            <div className="sm:col-span-2 lg:col-span-1">
              <Logo />
              <p className="mt-4 max-w-xs text-sm leading-6 text-[#57678A]">Emergency-ready healthcare for Nepal and South Asia — hospitals, doctors and blood donors, one tap away.</p>
              <p className="mt-4 font-serif text-sm italic text-[#1657CC]">"Sahara" (सहारा) means support — that's the promise behind everything we build.</p>
            </div>
            {[
              ["Product", [["Emergency SOS", "#features"], ["AI Health Navigator", "#features"], ["Blood network", "#blood"], ["Appointments", "#features"]]],
              ["Company", [["About", "#"], ["Careers", "#"], ["Press", "#"], ["Contact", "#"]]],
              ["Partners", [["For hospitals", "#hospitals"], ["For doctors", "#roles"], ["Become a donor", "#blood"]]],
              ["Legal", [["Privacy policy", "#"], ["Terms of service", "#"], ["Data security", "#"]]],
            ].map(([heading, links]) => (
              <div key={heading}>
                <h5 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#8C99B8]">{heading}</h5>
                <ul className="flex flex-col gap-3">
                  {links.map(([label, href]) => <li key={label}><a href={href} className="text-sm text-[#57678A] transition hover:text-[#1657CC]">{label}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-4xl text-xs leading-5 text-[#8C99B8]">Sahara's SOS feature is a coordination tool that connects you with the nearest hospital and your emergency contacts — it does not replace calling your national emergency number where available.</p>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-[#DCE6F6] pt-6">
            <span className="text-xs text-[#8C99B8]">© 2026 Sahara. All rights reserved.</span>
            <div className="flex items-center gap-1 text-xs font-bold">
              <button onClick={() => setLanguage("EN")} className={`rounded-md px-2.5 py-1 ${language === "EN" ? "bg-[#EAF1FC] text-[#1657CC]" : "text-[#8C99B8]"}`}>EN</button>
              <button onClick={() => { setLanguage("NP"); showToast("नेपाली version coming soon"); }} className={`rounded-md px-2.5 py-1 ${language === "NP" ? "bg-[#EAF1FC] text-[#1657CC]" : "text-[#8C99B8]"}`}>नेपाली</button>
            </div>
            {/* <div className="flex gap-2">
              {[Facebook, Instagram, X].map((Icon, i) => <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-[#DCE6F6] text-[#57678A] transition hover:border-[#1657CC] hover:text-[#1657CC]"><Icon size={16} /></a>)}
            </div> */}
          </div>
        </div>
      </footer>

      {/* SOS DEMO */}
      <button onClick={() => setSosOpen((v) => !v)} aria-label="Preview Emergency SOS" className="fixed bottom-5 right-5 z-[200] grid h-14 w-14 place-items-center rounded-full bg-[#E0393E] text-white shadow-[0_16px_34px_-10px_rgba(224,57,62,.6)]">
        <motion.span animate={{ scale: [1, 1.45], opacity: [0.7, 0] }} transition={{ duration: 2.2, repeat: Infinity }} className="absolute inset-0 rounded-full border-2 border-[#E0393E]/50" />
        <Zap size={22} className="relative" />
      </button>
      <AnimatePresence>
        {sosOpen && (
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} className="fixed bottom-24 right-5 z-[200] w-[min(300px,80vw)] rounded-[18px] bg-white p-5 shadow-[0_40px_80px_-30px_rgba(10,31,61,.35)]">
            <div className="mb-2 flex items-center justify-between">
              <strong className="font-serif">SOS preview</strong>
              <button onClick={() => setSosOpen(false)}><CircleX size={17} className="text-[#8C99B8]" /></button>
            </div>
            <p className="text-sm leading-6 text-[#57678A]">In the real app, this instantly alerts the nearest hospital and your emergency contacts with your location and medical ID.</p>
            <span className="mt-3 inline-block rounded-full bg-[#FCE3E3] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#E0393E]">Demo — no alert sent</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 20, x: "-50%" }} className="fixed bottom-5 left-1/2 z-[300] rounded-full bg-[#0A1F3D] px-5 py-3 text-sm font-semibold text-white shadow-lg">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>   
  );
}
