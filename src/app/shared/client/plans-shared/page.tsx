"use client";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { Sidebar } from '../../../client/layout/Sidebar'; 
import { Navbar } from '../../../client/layout/Navbar';   
import { Calendar, Tag, FileText, CheckCircle2, Info, X } from 'lucide-react';
import { TaskData } from '@/models/task';
import { PlanService } from '@/services/planService';

// 1. Definisikan Interface Props dengan benar di sini
interface PlansSharedPageProps {
  initialData?: TaskData | null;
}

export default function PlansSharedPage({ initialData }: PlansSharedPageProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Menentukan mode berdasarkan keberadaan initialData
  const isEditMode = !!initialData;

  // State untuk Toggle Info/Attention Box
  const [showAttention, setShowAttention] = useState(false);

  // Form States (Diinisialisasi langsung dari initialData)
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [deadline, setDeadline] = useState(initialData?.deadline || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Efek pendukung jika sewaktu-waktu initialData berubah dari sisi parent
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category);
      setDeadline(initialData.deadline);
      setNotes(initialData.notes || '');
    }
  }, [initialData]);

  const handleRedirectToBack = () => {
    router.push('/client/plan');
  };

  // Fungsi Service untuk handle Submit data ke API Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const taskData: TaskData = {
      title: title.trim(),
      category,
      deadline,
      notes: notes.trim(),
    };

    try {
      console.log("Submitting Task Data:", taskData, "Edit Mode:", isEditMode);

      if (isEditMode && initialData) {
      } else {
        await PlanService.createPlan(taskData);
        router.push('/client/plan');
      }
      
    } catch (error) {
      console.error("Gagal menyimpan tugas:", error);
      alert(isEditMode ? "Terjadi kesalahan: Gagal memperbarui plan. Silakan coba lagi." : "Terjadi kesalahan: Gagal menyimpan plan baru. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen bg-[#FDF8F8] flex overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 lg:p-6 max-w-4xl mx-auto w-full flex flex-col justify-center overflow-y-auto md:overflow-hidden">
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-serif font-bold text-gray-800">
                {isEditMode ? "Edit Tugas / Plan" : "Tambah Tugas Baru"}
              </h1>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">Rencanakan detail pernikahanmu selangkah demi selangkah</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-pink-50 p-5 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="border-b border-gray-100 pb-3 mb-2">
                <button
                  type="button"
                  onClick={() => setShowAttention(!showAttention)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    showAttention 
                      ? 'bg-pink-100 text-pink-700 shadow-sm' 
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Info size={15} className={showAttention ? 'text-pink-600' : 'text-gray-400'} />
                  {showAttention ? "Tutup Tips Prioritas" : "Lihat Tips Prioritas Pernikahan"}
                </button>

                {showAttention && (
                  <div className="mt-3 bg-pink-50/60 border border-pink-100/80 rounded-xl p-4 animate-fadeIn text-xs text-gray-700 space-y-2.5 relative">
                    <button 
                      type="button"
                      onClick={() => setShowAttention(false)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                    <div>
                      <p className="font-bold text-pink-700 mb-0.5">📌 Prioritas Utama (H-6 Bulan):</p>
                      <p className="text-gray-600 leading-relaxed pl-4">Selesaikan urusan Venue dan KUA terlebih dahulu karena slot tanggal pernikahan biasanya cepat penuh.</p>
                    </div>
                    <div>
                      <p className="font-bold text-pink-700 mb-0.5">🔑 Kunci Vendor (H-3 Bulan):</p>
                      <p className="text-gray-600 leading-relaxed pl-4">Pastikan DP untuk MUA, Dekorasi, dan Dokumentasi sudah masuk agar jadwal mereka aman untuk hari-H Anda.</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center">
                      <FileText size={14} className="mr-1.5 text-pink-400" /> Nama Tugas / Plan
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: DP Vendor Dekorasi, Fitting Baju..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center">
                      <Tag size={14} className="mr-1.5 text-pink-400" /> Kategori
                    </label>
                    <select
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none text-sm bg-white transition-all text-gray-700"
                    >
                      <option value="" disabled>Pilih kategori...</option>
                      <option value="Konsumsi">Konsumsi</option>
                      <option value="Pakaian">Pakaian</option>
                      <option value="Vendor">Vendor</option>
                      <option value="Undangan">Undangan & Souvenir</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center">
                      <Calendar size={14} className="mr-1.5 text-pink-400" /> Batas Waktu (Deadline)
                    </label>
                    <input
                      type="date"
                      required
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none text-sm transition-all text-gray-700"
                    />
                  </div>
                </div>

                <div className="flex flex-col h-full">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Catatan Tambahan <span className="text-xs text-gray-400 font-normal">(Opsional)</span>
                  </label>
                  <textarea
                    placeholder="Tulis detail penting, nomor telepon, atau kontak vendor di sini..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full flex-1 min-h-[120px] md:min-h-0 px-3 py-2 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none text-sm transition-all resize-none"
                  />
                </div>

              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-50">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleRedirectToBack}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-5 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 shadow-md shadow-pink-200 text-sm font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                  ) : (
                    <CheckCircle2 size={16} className="mr-1.5" />
                  )}
                  {isLoading ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Simpan Plan"}
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
}