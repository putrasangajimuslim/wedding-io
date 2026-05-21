"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../layout/Sidebar';
import { Navbar } from '../../layout/Navbar';
import { 
  ArrowLeft, Users, Tag, Sparkles, Check, 
  HelpCircle, UserPlus, Heart
} from 'lucide-react';

export default function CreateInvitationPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Teman',
    pax: 1,
    status: 'Sent'
  });

  const handleBack = () => {
    router.push('/client/invitation');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pax' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulasi request
    setIsSubmitting(false);
    router.push('/client/guests');
  };

  return (
    <div className="min-h-screen bg-[#FDF8F8] flex font-sans antialiased">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="p-4 md:p-10 max-w-5xl mx-auto w-full transition-all">
          
          {/* Top Bar Back Button */}
          <div className="mb-6">
            <button 
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-pink-500 transition-colors group"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" /> 
              Kembali ke Manajemen Tamu
            </button>
          </div>

          {/* Main Layout Split Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden grid grid-cols-1 md:grid-cols-12">
            
            {/* Left Side: Editorial Banner Context */}
            <div className="md:col-span-4 bg-gradient-to-b from-pink-50/70 via-rose-50/30 to-white p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100/80">
              <div className="space-y-4">
                <div className="inline-flex p-2.5 bg-white rounded-2xl shadow-sm border border-pink-100 text-pink-500">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h1 className="text-xl font-serif font-black tracking-tight text-gray-800">Registrasi Tamu</h1>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    Tambahkan kerabat, kolega, atau tamu VIP Anda untuk menghasilkan akses personalisasi RSVP secara instan.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Form Controls */}
            <div className="md:col-span-8 p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Field: Nama Tamu */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    Nama Penerima Undangan
                  </label>
                  <div className="relative group">
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Misal: Keluarga Malik Ibrahim" 
                      className="w-full px-4 py-3 bg-gray-50/50 focus:bg-white text-xs font-medium rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-50 outline-none transition-all placeholder:text-gray-400 text-gray-700 shadow-inner-sm"
                      required
                    />
                  </div>
                </div>

                {/* Grid Group: Kategori & Pax */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Field: Kategori */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400">
                      Kelompok / Kategori
                    </label>
                    <div className="relative flex items-center">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full pl-4 pr-10 py-3 bg-gray-50/50 hover:bg-gray-100/70 focus:bg-white text-xs font-medium rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-50 outline-none transition-all text-gray-700 cursor-pointer appearance-none"
                      >
                        <option value="Teman">Teman Sebaya</option>
                        <option value="VIP">Tamu VIP</option>
                        <option value="Keluarga">Keluarga Besar</option>
                        <option value="Rekan Kerja">Rekan Kerja / Bisnis</option>
                      </select>
                      <Tag size={14} className="absolute right-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Field: Jumlah Pax */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400">
                      Batas Kuota Pax
                    </label>
                    <div className="relative flex items-center">
                      <input 
                        type="number"
                        name="pax"
                        min="1"
                        max="20"
                        value={formData.pax}
                        onChange={handleChange}
                        className="w-full pl-4 pr-10 py-3 bg-gray-50/50 focus:bg-white text-xs font-medium rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-50 outline-none transition-all text-gray-700"
                      />
                      <Users size={14} className="absolute right-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                </div>

                {/* Field: Segmented Control Status */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    Opsi Distribusi Awal
                  </label>
                  <div className="p-1 bg-gray-100/80 rounded-xl grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, status: 'Sent' }))}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${formData.status === 'Sent' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      Tandai Terkirim
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, status: 'Attending' }))}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${formData.status === 'Attending' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      Konfirmasi Hadir (Manual)
                    </button>
                  </div>
                </div>

                {/* Bottom Informative Note */}
                <div className="pt-2 flex gap-2 text-[11px] text-gray-400 leading-normal">
                  <HelpCircle size={14} className="shrink-0 text-gray-300 mt-0.5" />
                  <span>Tautan tautan unik (`slug`) akan di-generate otomatis berdasarkan nama yang Anda masukkan di atas.</span>
                </div>

                {/* Action Row */}
                <div className="pt-4 border-t border-gray-50 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] text-xs font-bold rounded-xl shadow-lg shadow-gray-900/10 transition-all disabled:opacity-40"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Entri Data <Check size={14} />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}