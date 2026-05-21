"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { decryptData } from "@/lib/crypto";

export default function ForbiddenPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const authCookie = Cookies.get("auth");
    let targetPath = "/auth";

    if (authCookie) {
      const userData = decryptData(authCookie);
      if (userData?.role?.toLowerCase() === "admin") {
        targetPath = "/admin/dashboard";
      } else if (userData?.role?.toLowerCase() === "client") {
        targetPath = "/client/dashboard";
      }
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      router.push(targetPath);
    }, 1500);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full text-center">
        {/* Lingkaran Dekoratif & Ikon */}
        <div className="relative mb-10 flex justify-center">
          <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-20">
            <div className="w-32 h-32 bg-red-400 rounded-full"></div>
          </div>
          <div className="relative bg-white shadow-2xl rounded-3xl p-8 border border-slate-100">
            <svg 
              className="w-20 h-20 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
              />
            </svg>
          </div>
        </div>

        {/* Teks Utama */}
        <h1 className="text-[120px] font-black text-slate-200 leading-none mb-4 select-none">
          403
        </h1>
        <div className="relative -mt-20">
          <h2 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight">
            Akses Terbatas
          </h2>
          <p className="text-lg text-slate-500 max-w-md mx-auto mb-10 leading-relaxed">
            Halaman ini berada di bawah enkripsi ketat. Role Anda saat ini tidak memiliki izin untuk melihat konten di URL ini.
          </p>
        </div>
      </div>
    </div>
  );
}