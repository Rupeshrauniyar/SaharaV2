"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [message, setMessage] = useState("");

  function register() {
    setMessage(
      "Demo registration successful. Backend registration API will be connected later."
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <Link href="/" className="text-xl font-bold text-blue-600">
          SAHARA
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          Create your account
        </h1>

        <div className="mt-6 space-y-4">
          <input
            placeholder="Full Name"
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          />

          <select className="w-full rounded-xl border border-slate-200 px-4 py-3">
            <option>Patient</option>
            <option>Doctor</option>
            <option>Hospital</option>
          </select>

          <button
            onClick={register}
            className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white"
          >
            Register
          </button>
        </div>

        {message && (
          <div className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}