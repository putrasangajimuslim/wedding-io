"use client";
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../layout/Sidebar';
import { Navbar } from '../layout/Navbar';
import { 
  Plus, Search, Trash2, Edit3, UserPlus, 
  CheckCircle2, Mail, Users, MoreVertical, X, PieChart, Info, Filter,
  Eye // Ditambahkan untuk representasi visual melihat desain
} from 'lucide-react';

// Data Mock Awal untuk Daftar Undangan
const INITIAL_GUESTS = [
  { id: 1, name: 'Budi Santoso', category: 'Keluarga', pax: 2, status: 'Attending' },
  { id: 2, name: 'Siti Rahma', category: 'VIP', pax: 4, status: 'Sent' },
  { id: 3, name: 'Andi Wijaya', category: 'Teman', pax: 1, status: 'Read' },
  { id: 4, name: 'Citra Lestari', category: 'Teman', pax: 2, status: 'Declined' },
];

export default function InvitatioListPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [guests, setGuests] = useState<typeof INITIAL_GUESTS>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);

  // Ambil daftar kategori unik dari data tamu untuk Filter Pills
  const categories = useMemo(() => {
    const cats = guests.map(g => g.category);
    return ['Semua', ...Array.from(new Set(cats))];
  }, [guests]);

  // Simulasi Fetching Data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setGuests(INITIAL_GUESTS);
      } catch (error) {
        console.error("Gagal memuat data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRedirectToCreate = () => {
    router.push('/client/invitation/create');
  };

  // Handler Baru: Mengarahkan pengguna ke halaman preview/desain undangan utama
  // const handleRedirectToDesign = () => {
  //   router.push('/preview-digital-invitation');
  // };

  const handleRedirectToDesign = () => {
    window.open("/preview-digital-invitation", "_blank", "noopener,noreferrer");
  };

  // Kalkulasi Statistik Undangan
  const summary = useMemo(() => {
    const totalGuests = guests.length;
    const totalPax = guests.reduce((acc, curr) => acc + curr.pax, 0);
    const attending = guests.filter(g => g.status === 'Attending').reduce((acc, curr) => acc + curr.pax, 0);
    const pending = guests.filter(g => g.status === 'Sent' || g.status === 'Read').reduce((acc, curr) => acc + curr.pax, 0);
    const declined = guests.filter(g => g.status === 'Declined').reduce((acc, curr) => acc + curr.pax, 0);
    return { totalGuests, totalPax, attending, pending, declined };
  }, [guests]);

  // Penyaringan data berdasarkan Search Query DAN Kategori Terpilih
  const filteredGuests = useMemo(() => {
    return guests.filter(g => {
      const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            g.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Semua' || g.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [guests, searchQuery, selectedCategory]);

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus tamu ini dari daftar undangan?')) {
      setGuests(guests.filter(g => g.id !== id));
      setOpenMenuId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Attending': return 'text-green-600 bg-green-50 border border-green-100';
      case 'Declined': return 'text-red-600 bg-red-50 border border-red-100';
      case 'Read': return 'text-blue-600 bg-blue-50 border border-blue-100';
      default: return 'text-orange-600 bg-orange-50 border border-orange-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F8] flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="p-4 md:p-8 max-w-6xl mx-auto w-full">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4 bg-white p-4 rounded-2xl border border-pink-50 shadow-sm">
            <div>
              <h1 className="text-xl font-serif font-bold text-gray-800">Daftar Undangan</h1>
              <p className="text-xs text-gray-500">Total: <span className="font-bold text-gray-700">{summary.totalGuests} Tamu</span> ({summary.totalPax} Pax)</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
              {isLoading ? (
                <div className="animate-pulse h-9 bg-gray-200 rounded-xl w-64"></div>
              ) : (
                <>
                  {/* TOMBOL BARU: Direct ke halaman melihat desain undangan */}
                  <button 
                    onClick={handleRedirectToDesign} 
                    className="flex items-center px-3 py-2 border border-pink-200 bg-pink-50/30 text-pink-600 rounded-xl hover:bg-pink-50 text-xs font-bold transition-all hover:scale-[1.02]"
                  >
                    <Eye size={16} className="mr-1.5" /> Lihat Desain
                  </button>

                  <button 
                    onClick={() => setIsStatModalOpen(true)} 
                    className="flex items-center px-3 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-xs font-bold transition-colors"
                  >
                    <PieChart size={16} className="mr-1.5" /> Statistik
                  </button>
                  
                  <button 
                    onClick={handleRedirectToCreate} 
                    className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 shadow-md shadow-pink-200 text-xs font-bold transition-all"
                  >
                    <Plus size={16} className="mr-1.5" /> Tambah Tamu
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Desain Search Filter Area */}
          {isLoading ? (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-50 mb-4 animate-pulse space-y-3">
              <div className="w-full h-9 bg-gray-100 rounded-xl"></div>
              <div className="w-2/3 h-6 bg-gray-100 rounded-lg"></div>
            </div>
          ) : (
            <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border-pink-50/80 mb-4 flex flex-col gap-3">
              
              {/* Input Row */}
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 text-gray-400 pointer-events-none transition-colors group-focus-within:text-pink-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Cari nama tamu spesifik..." 
                  className="w-full pl-10 pr-10 py-2 bg-gray-50/50 hover:bg-gray-50 text-xs rounded-xl focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100 outline-none transition-all placeholder:text-gray-400 text-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Quick Filter Pills Row */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5">
                <div className="flex items-center text-gray-400 shrink-0 text-[11px] font-bold uppercase tracking-wider mr-1">
                  <Filter size={12} className="mr-1 text-pink-400" /> Kategori:
                </div>
                <div className="flex items-center gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg border transition-all shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-pink-500 text-white border-pink-500 shadow-sm shadow-pink-100'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-pink-200 hover:text-pink-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-pink-50/50 border-b border-pink-50">
                  <tr>
                    <th className="p-3.5 text-[11px] font-bold text-pink-600 uppercase tracking-widest italic">Nama Tamu</th>
                    <th className="p-3.5 text-[11px] font-bold text-pink-600 uppercase tracking-widest italic">Kategori</th>
                    <th className="p-3.5 text-[11px] font-bold text-pink-600 uppercase tracking-widest italic">Jumlah Pax</th>
                    <th className="p-3.5 text-[11px] font-bold text-pink-600 uppercase tracking-widest italic">Status</th>
                    <th className="p-3.5 text-[11px] font-bold text-pink-600 uppercase tracking-widest italic text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 italic">
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-pink-50/10 group transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-pink-50 text-pink-500">
                            <UserPlus size={14} />
                          </div>
                          <span className="text-xs font-semibold text-gray-700">{guest.name}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md uppercase">
                          {guest.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-xs font-bold text-gray-800">
                        {guest.pax} Pax
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${getStatusStyle(guest.status)}`}>
                          {guest.status === 'Sent' && 'Terkirim'}
                          {guest.status === 'Read' && 'Dibaca'}
                          {guest.status === 'Attending' && 'Hadir'}
                          {guest.status === 'Declined' && 'Tidak Hadir'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right relative">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === guest.id ? null : guest.id)}
                          className={`p-1.5 rounded-lg transition-all ${openMenuId === guest.id ? 'bg-pink-100 text-pink-600' : 'text-gray-300 hover:text-pink-500 hover:bg-pink-50'}`}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openMenuId === guest.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)}></div>
                            <div className="absolute right-4 mt-1 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                              <button 
                                onClick={() => { alert('Edit Tamu: ' + guest.name); setOpenMenuId(null); }}
                                className="w-full px-3 py-2 text-left text-[11px] font-bold text-gray-600 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2 transition-colors"
                              >
                                <Edit3 size={12} /> Edit Data
                              </button>
                              <button 
                                onClick={() => handleDelete(guest.id)}
                                className="w-full px-3 py-2 text-left text-[11px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50 transition-colors"
                              >
                                <Trash2 size={12} /> Hapus Tamu
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {!isLoading && filteredGuests.length === 0 && (
              <div className="p-10 text-center">
                <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search size={20} className="text-gray-300" />
                </div>
                <p className="text-gray-400 italic text-xs">Tidak ada data undangan yang cocok...</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL POPUP: IKHTISAR & STATISTIK DETAIL */}
      {isStatModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-pink-50 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-gradient-to-r from-pink-500 to-rose-400 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart size={18} />
                <h2 className="font-serif font-bold text-base">Ikhtisar Konfirmasi Tamu</h2>
              </div>
              <button onClick={() => setIsStatModalOpen(false)} className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-pink-50/50 rounded-xl p-3 flex items-center gap-2 text-xs text-pink-700 border border-pink-100">
                <Info size={16} className="shrink-0" />
                <span>Kalkulasi otomatis berdasarkan update konfirmasi kehadiran RSVP digital tamu.</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-start text-gray-400 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Total Undangan</span>
                    <Users size={16} className="text-gray-400" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">{summary.totalGuests} <span className="text-xs font-normal text-gray-500">Tamu</span></h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{summary.totalPax} Total Pax keseluruhan</p>
                </div>
                <div className="bg-green-50/60 p-4 rounded-xl border border-green-100">
                  <div className="flex justify-between items-start text-green-600/70 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Pasti Hadir</span>
                    <CheckCircle2 size={16} className="text-green-500" />
                  </div>
                  <h4 className="text-lg font-bold text-green-700">{summary.attending} <span className="text-xs font-normal text-green-600">Pax</span></h4>
                  <p className="text-[11px] text-green-600/70 mt-0.5">Telah konfirmasi datang</p>
                </div>
                <div className="bg-orange-50/60 p-4 rounded-xl border border-orange-100">
                  <div className="flex justify-between items-start text-orange-600/70 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Pending</span>
                    <Mail size={16} className="text-orange-400" />
                  </div>
                  <h4 className="text-lg font-bold text-orange-700">{summary.pending} <span className="text-xs font-normal text-orange-600">Pax</span></h4>
                  <p className="text-[11px] text-orange-600/70 mt-0.5">Undangan terkirim / dibaca</p>
                </div>
                <div className="bg-red-50/60 p-4 rounded-xl border border-red-100">
                  <div className="flex justify-between items-start text-red-600/70 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Absen</span>
                    <X size={16} className="text-red-400" />
                  </div>
                  <h4 className="text-lg font-bold text-red-700">{summary.declined} <span className="text-xs font-normal text-red-600">Pax</span></h4>
                  <p className="text-[11px] text-red-600/70 mt-0.5">Konfirmasi tidak bisa hadir</p>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                  <span>Rasio Kehadiran (Pax)</span>
                  <span className="font-bold text-green-600">
                    {summary.totalPax > 0 ? Math.round((summary.attending / summary.totalPax) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-green-500 h-full transition-all" style={{ width: `${summary.totalPax > 0 ? (summary.attending / summary.totalPax) * 100 : 0}%` }} />
                  <div className="bg-orange-400 h-full transition-all" style={{ width: `${summary.totalPax > 0 ? (summary.pending / summary.totalPax) * 100 : 0}%` }} />
                  <div className="bg-red-400 h-full transition-all" style={{ width: `${summary.totalPax > 0 ? (summary.declined / summary.totalPax) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 text-right border-t border-gray-100">
              <button onClick={() => setIsStatModalOpen(false)} className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-300 transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}