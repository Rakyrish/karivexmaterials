"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { api, type Session } from "@/lib/manage";

interface DashboardContext {
  session: Session | null;
  can: (permission: string) => boolean;
  setSession: (session: Session) => void;
  signOut: () => Promise<void>;
}

const Context = createContext<DashboardContext | null>(null);

export function useDashboard() {
  const value = useContext(Context);
  if (!value) throw new Error("useDashboard must be used inside DashboardProvider");
  return value;
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const onLoginPage = pathname === "/dashboard/login";

  useEffect(() => {
    let active = true;
    api<Session>("session")
      .then((data) => active && setSession(data))
      .catch(() => active && setSession({ authenticated: false }));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const signedOut = () => setSession({ authenticated: false });
    window.addEventListener("dashboard:signed-out", signedOut);
    return () => window.removeEventListener("dashboard:signed-out", signedOut);
  }, []);

  useEffect(() => {
    if (session && !session.authenticated && !onLoginPage) {
      router.replace(`/dashboard/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [session, onLoginPage, pathname, router]);

  const can = useCallback((permission: string) => !!session?.permissions?.includes(permission), [session]);

  const signOut = useCallback(async () => {
    try {
      await api("logout", { method: "POST" });
    } finally {
      setSession({ authenticated: false });
      router.replace("/dashboard/login");
    }
  }, [router]);

  return <Context.Provider value={{ session, can, setSession, signOut }}>{children}</Context.Provider>;
}
