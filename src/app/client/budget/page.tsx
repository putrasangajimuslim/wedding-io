"use client";
import { useState, useMemo, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { authManager } from '@/lib/auth-manager';

import { Sidebar } from '../layout/Sidebar';
import { Navbar } from '../layout/Navbar';
import { 
  Plus, Search, Trash2, Edit3, DollarSign, 
  CheckCircle2, Circle, MoreVertical, TrendingUp, Wallet, X,
  ChevronDown, ChevronUp
} from 'lucide-react';

const INITIAL_BUDGET = [
  { id: 1, item: 'Sewa Gedung', category: 'Venue', amount: 25000000, status: 'Paid' },
  { id: 2, item: 'Katering 500 Pax', category: 'Konsumsi', amount: 45000000, status: 'Pending' },
  { id: 3, item: 'Dekorasi Pelaminan', category: 'Dekorasi', amount: 15000000, status: 'Paid' },
  { id: 4, item: 'MUA & Attire', category: 'Pakaian', amount: 10000000, status: 'Pending' },
];

export default function BudgetPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [budgets, setBudgets] = useState<typeof INITIAL_BUDGET>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  
  // State untuk menyembunyikan/menampilkan ringkasan anggaran (Stat Cards)
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setBudgets(INITIAL_BUDGET);
        setIsLoading(false);
      } catch (error) {
        console.error("Gagal memuat data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRedirectToCreate = () => {
    router.push('/client/budget/create');
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setBudgets(prevBudgets =>
      prevBudgets.map(budget =>
        budget.id === id ? { ...budget, status: newStatus } : budget
      )
    );
  };

  const summary = useMemo(() => {
    const total = budgets.reduce((acc, curr) => acc + curr.amount, 0);
    const paid = budgets.filter(b => b.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
    const pending = total - paid;
    return { total, paid, pending };
  }, [budgets]);

  const filteredBudgets = useMemo(() => {
    return budgets.filter(b => 
      b.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [budgets, searchQuery]);

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus anggaran ini?')) {
      setBudgets(budgets.filter(b => b.id !== id));
      setOpenMenuId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F8] flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="p-6 lg:p-10 max-w-6xl mx-auto w-full">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-serif font-bold text-gray-800">Manajemen Anggaran</h1>
                
                {/* Button Chevron ringkas untuk toggle info ringkasan biaya */}
                {!isLoading && (
                  <button 
                    onClick={() => setShowSummary(!showSummary)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors mt-1"
                    title={showSummary ? "Sembunyikan Ringkasan" : "Tampilkan Ringkasan"}
                  >
                    {showSummary ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    <span>{showSummary ? "Sembunyikan" : "Lihat Anggaran"}</span>
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">Pantau dan kelola biaya pernikahan Anda</p>
            </div>
            
            {isLoading ? (
              <div className="w-[168px] h-[44px] bg-pink-100 rounded-xl animate-pulse"></div>
            ) : (
              <button onClick={handleRedirectToCreate} className="flex items-center px-5 py-2.5 bg-pink-500 text-white rounded-xl hover:bg-pink-600 shadow-md shadow-pink-200 text-sm font-bold transition-all active:scale-95">
                <Plus size={18} className="mr-2" /> Tambah Anggaran
              </button>
            )}
          </div>

          {/* Stat Cards Container dengan animasi Collapse */}
          {showSummary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm animate-pulse">
                    <div className="h-3 w-20 bg-gray-200 rounded mb-3"></div>
                    <div className="h-7 w-36 bg-gray-200 rounded"></div>
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
                    <div className="absolute right-[-10px] top-[-10px] bg-pink-50 p-6 rounded-full group-hover:scale-110 transition-transform">
                      <Wallet className="text-pink-200" size={40} />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Estimasi</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">Rp {summary.total.toLocaleString('id-ID')}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
                    <div className="absolute right-[-10px] top-[-10px] bg-green-50 p-6 rounded-full group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="text-green-200" size={40} />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-green-500/60">Sudah Dibayar</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-1">Rp {summary.paid.toLocaleString('id-ID')}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
                    <div className="absolute right-[-10px] top-[-10px] bg-orange-50 p-6 rounded-full group-hover:scale-110 transition-transform">
                      <TrendingUp className="text-orange-200" size={40} />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-orange-500/60">Sisa Tagihan</p>
                    <h3 className="text-2xl font-bold text-orange-600 mt-1">Rp {summary.pending.toLocaleString('id-ID')}</h3>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Filter Bar / Search Section */}
          {isLoading ? (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-50 mb-6 animate-pulse">
              <div className="w-full h-[40px] bg-gray-100 rounded-xl"></div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-50 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari item anggaran atau kategori..." 
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-200 outline-none text-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto min-w-[650px]">
                <thead className="bg-pink-50/50 border-b border-pink-50">
                  <tr>
                    <th className="p-4 text-[11px] font-bold text-pink-600 uppercase tracking-widest">Rincian Item</th>
                    <th className="p-4 text-[11px] font-bold text-pink-600 uppercase tracking-widest">Kategori</th>
                    <th className="p-4 text-[11px] font-bold text-pink-600 uppercase tracking-widest">Jumlah</th>
                    <th className="p-4 text-[11px] font-bold text-pink-600 uppercase tracking-widest">Status</th>
                    <th className="p-4 text-[11px] font-bold text-pink-600 uppercase tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="h-5 w-16 bg-gray-200 rounded-md"></div>
                        </td>
                        <td className="p-4">
                          <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        </td>
                        <td className="p-4">
                          <div className="h-5 w-20 bg-gray-200 rounded-md"></div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="h-8 w-8 bg-gray-200 rounded-lg inline-block"></div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    filteredBudgets.map((b) => (
                      <tr key={b.id} className="hover:bg-pink-50/10 group transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${b.status === 'Paid' ? 'bg-green-50' : 'bg-gray-50'}`}>
                              <DollarSign size={16} className={b.status === 'Paid' ? 'text-green-500' : 'text-gray-400'} />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{b.item}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md uppercase">
                            {b.category}
                          </span>
                        </td>
                        <td className="p-4 text-sm font-bold text-gray-800">
                          Rp {b.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="p-4">
                          {/* Dropdown Pilihan Status */}
                          <div className="relative inline-block text-left">
                            <select
                              value={b.status}
                              onChange={(e) => handleStatusChange(b.id, e.target.value)}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border-0 outline-none cursor-pointer tracking-wider font-sans focus:ring-2 focus:ring-pink-200 ${
                                b.status === 'Paid' 
                                  ? 'bg-green-50 text-green-600' 
                                  : 'bg-orange-50 text-orange-600'
                              }`}
                            >
                              <option value="Pending" className="bg-white text-orange-600 font-bold">PENDING</option>
                              <option value="Paid" className="bg-white text-green-600 font-bold">PAID</option>
                            </select>
                          </div>
                        </td>
                        
                        <td className="p-4 text-right relative">
                          <button 
                            onClick={() => setOpenMenuId(openMenuId === b.id ? null : b.id)}
                            className={`p-2 rounded-lg transition-all ${
                              openMenuId === b.id 
                                ? 'bg-pink-100 text-pink-600' 
                                : 'text-gray-500 bg-gray-50 md:bg-transparent md:text-gray-300 hover:text-pink-500 hover:bg-pink-50'
                            }`}
                          >
                            <MoreVertical size={18} />
                          </button>

                          {openMenuId === b.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)}></div>
                              <div className="absolute right-4 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                                <button 
                                  onClick={() => { alert('Edit: ' + b.item); setOpenMenuId(null); }}
                                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-600 hover:bg-pink-50 hover:text-pink-600 flex items-center gap-2 transition-colors"
                                >
                                  <Edit3 size={14} /> Edit Data
                                </button>
                                <button 
                                  onClick={() => handleDelete(b.id)}
                                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50 transition-colors"
                                >
                                  <Trash2 size={14} /> Hapus Item
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {!isLoading && filteredBudgets.length === 0 && (
              <div className="p-12 text-center">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Search size={24} className="text-gray-300" />
                </div>
                <p className="text-gray-400 italic text-sm">Data anggaran tidak ditemukan...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}