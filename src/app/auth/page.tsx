"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginRequest, RegisterRequest } from '@/models/auth';
import { Eye, EyeOff, Heart, Loader2 } from "lucide-react";
import { authService } from '@/services/auth-service';
import Swal from 'sweetalert2';
import { redirectByRole } from '@/utils/redirectByRole';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    if (!isLogin) {
      if (step === 1) {
        setStep(2);
        return;
      }

      setIsLoading(true);

      try {
        const registerData = formValues as unknown as RegisterRequest;
        const response = await authService.register(registerData);

        setIsLoading(false);

        await Swal.fire({
          title: "Registrasi Berhasil!",
          text: "Akun berhasil dibuat.",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        setIsLogin(true);
        setStep(1);

      } catch (error: any) {
        setIsLoading(false);
        Swal.fire({
          title: "Gagal!",
          text: error.response?.error || "Terjadi kesalahan saat register",
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
      return;
    }

    setIsLoading(true);

    try {
      const loginData = formValues as unknown as LoginRequest;
      const response = await authService.login(loginData);
      
      if (!response.success) {
        setIsLoading(false);
        Swal.fire({
          title: "Login Gagal!",
          text: response.error,
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return;
      }

      const redirectPath = redirectByRole(response.user?.role?.toLowerCase() || "");

      setTimeout(() => {
        setIsLoading(false);
        router.push(redirectPath);
      }, 1000);

    } catch (error: any) {
      setIsLoading(false);
      Swal.fire({
        title: "Login Gagal!",
        text: error.response?.error || "Terjadi kesalahan",
        icon: "error",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setStep(1);
    setShowPassword(false);
  };

  return (
    <div className="h-screen w-full relative flex items-center justify-center font-sans antialiased overflow-hidden bg-slate-900">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-60 scale-110" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2940&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70"></div>
      </div>

      {/* Brand Logo */}
      <header className="absolute top-8 left-8 z-20">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="h-10 w-10 bg-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30">
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            abadi<span className="text-rose-400 font-light">wedding</span>
          </span>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-[1100px] px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left Side Content */}
        <div className="hidden md:block text-left max-w-md">
          <h1 className="text-6xl font-extrabold text-white leading-[1.1] mb-6">
            Mulai Cerita <br/>
            <span className="text-rose-400">Bahagiamu.</span>
          </h1>
          <p className="text-lg text-gray-300 font-light leading-relaxed">
            {isLogin 
              ? "Masuk untuk melanjutkan perencanaan pernikahan impian yang sudah Anda susun." 
              : "Daftar sekarang dan nikmati kemudahan merancang hari spesial Anda dalam satu genggaman."}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl w-full max-w-[480px] border border-white/20 flex flex-col max-h-[90vh]">
          <div className="mb-6 text-center shrink-0">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {isLogin ? "Selamat Datang" : step === 1 ? "Buat Akun" : "Detail Alamat"}
            </h2>
            {!isLogin && (
              <div className="flex justify-center gap-1.5 mt-3">
                <div className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step === 1 ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
                <div className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step === 2 ? 'bg-rose-500' : 'bg-gray-200'}`}></div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
            
            {/* Scrollable Area for Form Fields */}
            <div className="overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-6">
              
              {/* STEP 1: Basic Info */}
              <div className={`space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 ${step !== 1 ? 'hidden' : 'block'}`}>
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">First Name</label>
                        <input type="text" name="firstName" required={!isLogin && step === 1} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-rose-500 outline-none text-sm" placeholder="M." />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Middle Name</label>
                        <input type="text" name="middleName" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-rose-500 outline-none text-sm" placeholder="Halkim" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Last Name</label>
                        <input type="text" name="lastName" required={!isLogin && step === 1} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-rose-500 outline-none text-sm" placeholder="Taufik" />
                      </div>
                    </div>

                    {/* NEW: Gender Field */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Jenis Kelamin</label>
                      <select 
                        name="gender" 
                        required={!isLogin && step === 1}
                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-rose-500 outline-none text-sm appearance-none cursor-pointer"
                      >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="male">Laki-laki</option>
                        <option value="female">Perempuan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">NIK</label>
                      <input type="number" name="nik" required={!isLogin && step === 1} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-rose-500 outline-none" placeholder="1234567890123456" />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                  <input type="email" name="email" required={step === 1} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-rose-500 outline-none" placeholder="user@mail.com" />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      required={step === 1} 
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-rose-500 outline-none pr-12" 
                      placeholder="••••••••" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* STEP 2: Address Info */}
              {!isLogin && (
                <div className={`space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 ${step !== 2 ? 'hidden' : 'block'}`}>
                  {/* NEW: Invite Code Field */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Couple Code (Optional)</label>
                    <input type="text" name="CoupleCode" className="w-full px-5 py-3.5 bg-rose-50/50 border border-rose-100 rounded-xl focus:border-rose-500 outline-none font-mono tracking-wider" placeholder="ABC-123" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                    <input type="number" name="phone" required={step === 2} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-rose-500 outline-none" placeholder="082121..." />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Alamat</label>
                    <input type="text" name="address" required={step === 2} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-rose-500 outline-none" placeholder="Nama Jalan & No. Rumah" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Kota</label>
                      <input type="text" name="city" required={step === 2} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-rose-500 outline-none" placeholder="Jakarta" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Kode Pos</label>
                      <input type="text" name="postalCode" required={step === 2} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-rose-500 outline-none" placeholder="12345" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Negara</label>
                    <input type="text" name="country" required={step === 2} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-rose-500 outline-none" placeholder="Indonesia" />
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Navigation Buttons */}
            <div className="flex gap-3 pt-2 mt-auto shrink-0 border-t border-gray-50 pt-4">
              {step === 2 && !isLogin && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 font-bold transition-all"
                >
                  Kembali
                </button>
              )}
              
              <button
                disabled={isLoading}
                className="flex-[2] py-4 rounded-xl text-white bg-gray-900 hover:bg-rose-600 font-bold transition-all shadow-lg active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  isLogin ? 'Masuk Sekarang' : (step === 1 ? 'Selanjutnya' : 'Daftar Akun')
                )}
              </button>
            </div>
          </form>

          {/* Toggle Switch */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6 shrink-0">
            <p className="text-sm text-gray-600">
              {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
              <button 
                onClick={toggleAuthMode}
                className="ml-1.5 font-bold text-rose-600 hover:underline"
              >
                {isLogin ? "Daftar Gratis" : "Masuk di sini"}
              </button>
            </p>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-6 w-full text-center text-[11px] text-gray-400/80 z-20 font-medium">
        © 2026 ABADI WEDDING ORGANIZER. ALL RIGHTS RESERVED.
      </footer>

      {/* Inline Style for Scrollbar appearance */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #fb7185;
        }
      `}</style>
    </div>
  );
}