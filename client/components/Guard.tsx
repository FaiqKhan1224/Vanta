"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function Guard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !user) router.replace("/login?next=" + encodeURIComponent(location.pathname + location.search)); }, [loading, user, router]);
  if (loading || !user) return <div className="boot" />;
  return <>{children}</>;
}
