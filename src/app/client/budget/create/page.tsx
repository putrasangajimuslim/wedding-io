"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authManager } from '@/lib/auth-manager';

import { Sidebar } from '../../layout/Sidebar';
import { Navbar } from '../../layout/Navbar';
import { ArrowLeft, Save, FileText, DollarSign, Tag, CheckCircle2, Circle } from 'lucide-react';

export default function CreateBudgetPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [item, setItem] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Pending'); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRedirectToBack = () => {
    router.push('/client/budget');
  };

  const toggleStatus = () => {
    setStatus((prev) => (prev === 'Pending' ? 'Paid' : 'Pending'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log({ item, category, amount: Number(amount), status });
      router.push('/budget'); 
      router.refresh();
    } catch (error) {
      console.error("Gagal menyimpan data anggaran baru:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F8] flex overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="p-6 max-w-5xl mx-auto w-full flex flex-col h-[calc(100vh-64px)] justify-center">
          
          {/* Header Section */}
          <div className="mb-5 pb-3 border-b border-pink-100 flex flex-col gap-1.5">
            <button 
              onClick={handleRedirectToBack}
              className="flex items-center text-md font-bold text-gray-400 hover:text-pink-600 transition-colors w-fit group"
            >
              <ArrowLeft size={14} className="mr-1.5 transition-transform group-hover:-translate-x-0.5" /> 
              Kembali ke Anggaran
            </button>
            <h1 className="text-xl font-serif font-bold text-gray-800">Tambah Anggaran</h1>
          </div>

          {/* Form Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-50">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* BARIS 1: Nama Item & Jumlah Anggaran (Berdampingan dengan Gap Seimbang) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Item */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    <FileText size={14} className="text-pink-400" /> Nama Item
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Souvenir Pernikahan"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-200 outline-none text-sm transition-all"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                  />
                </div>

                {/* Jumlah Nominal */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    <DollarSign size={14} className="text-pink-400" /> Jumlah Anggaran
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">Rp</span>
                    <input 
                      type="number"
                      required
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-200 outline-none text-sm transition-all"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* BARIS 2: Kategori & Status Pembayaran (Sekarang Sejajar Kanan-Kiri dengan Jarak Aman) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kategori */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    <Tag size={14} className="text-pink-400" /> Kategori
                  </label>
                  <select 
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-200 outline-none text-sm bg-white transition-all"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="" disabled>Pilih Kategori</option>
                    <option value="Venue">Venue</option>
                    <option value="Konsumsi">Konsumsi</option>
                    <option value="Dekorasi">Dekorasi</option>
                    <option value="Pakaian">Pakaian / Attire</option>
                    <option value="Hiburan">Hiburan / Music</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Status Pembayaran (Single Button) */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Status Pembayaran
                  </label>
                  <button
                    type="button"
                    onClick={toggleStatus}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border font-bold text-sm transition-all active:scale-[0.99] ${
                      status === 'Paid'
                        ? 'border-green-500 bg-green-50/40 text-green-600 hover:bg-green-50'
                        : 'border-orange-500 bg-orange-50/40 text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    {status === 'Paid' ? (
                      <>
                        <CheckCircle2 size={16} className="text-green-500" />
                        Paid (Sudah Lunas)
                      </>
                    ) : (
                      <>
                        <Circle size={16} className="text-orange-500" />
                        Pending (Belum Bayar)
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Tombol Simpan */}
              <div className="pt-2 border-t border-gray-50 flex justify-end">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-44 flex items-center justify-center py-2.5 bg-pink-500 text-white rounded-xl hover:bg-pink-600 shadow-md shadow-pink-200 text-sm font-bold transition-all active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none"
                >
                  <Save size={16} className="mr-2" /> 
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>

            </form>
          </div>
          
        </main>
      </div>
    </div>
  );
}