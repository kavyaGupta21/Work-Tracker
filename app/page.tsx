"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/storage";
import { Loader as Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.replace("/board");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-blue-600" />
    </div>
  );
}
