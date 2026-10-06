"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { Notice, inputClass } from "@/components/dashboard/ui";
import { ApiError, api, type Session } from "@/lib/manage";

import mark from "../../../../public/brand/karivex-mark.png";

function safeNext(value: string | null) {
  // Only return to a dashboard page on this site.
  return value && /^\/dashboard(\/[\w\-/]*)?$/.test(value) && value !== "/dashboard/login" ? value : "/dashboard";
}

function LoginForm() {
  const { session, setSession } = useDashboard();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session?.authenticated) router.replace(next);
  }, [session, next, router]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      // Make sure a CSRF cookie exists before posting.
      if (!document.cookie.includes("csrftoken=")) await api("session");
      const data = await api<Session>("login", {
        body: { username: form.get("username"), password: form.get("password") },
      });
      setSession(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server. Try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      {error && <Notice tone="error">{error}</Notice>}
      <div>
        <label htmlFor="username" className="block text-sm font-semibold text-navy">
          Username
        </label>
        <input id="username" name="username" autoComplete="username" required className={`${inputClass} mt-1 min-h-11`} />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-navy">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={`${inputClass} mt-1 min-h-11`} />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="min-h-12 w-full rounded-lg bg-orange font-bold text-navy hover:bg-orange-600 disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <Image src={mark} alt="" className="h-12 w-auto" preload />
          <div>
            <p className="font-display text-lg font-bold text-navy">KariVex Industrial Materials</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">Website dashboard</p>
          </div>
        </div>
        <h1 className="mt-6 font-display text-2xl font-extrabold text-navy">Staff sign-in</h1>
        <p className="mt-1 text-sm text-slate">Use your staff account. Ask the site owner if you need one.</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
