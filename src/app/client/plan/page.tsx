"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Sidebar } from '../layout/Sidebar';
import { Navbar } from '../layout/Navbar';
import { 
  Plus, Search, Trash2, Edit3, Calendar, ClipboardList, ChevronLeft, ChevronRight
} from 'lucide-react';
import { PlanService } from '@/services/planService';
import { TaskData } from '@/models/task';

// Definisikan limit data per halaman sesuai setelan default backend
const ITEMS_PER_PAGE = 5;

export default function PlanPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State Pagination & Metadata yang disinkronkan langsung dari Response Backend
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data dari Backend berdasarkan Page & Search Query yang aktif
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Memanggil service dengan membawa parameter pagination dan pencarian
        const response = await PlanService.getPlanList({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: searchQuery
        });
        
        if (response.success && response.data) {
          setTasks(response.data);
          
          // Petakan metadata pagination dari backend ke state komponen
          if (response.pagination) {
            setTotalPages(response.pagination.total_pages || 1);
            setTotalRows(response.pagination.total_rows || 0);
          }
        } else {
          setTasks([]);
          setTotalPages(1);
          setTotalRows(0);
        }
      } catch (error) {
        console.error("Gagal memuat data dari server:", error);
        setTasks([]);
        setTotalPages(1);
        setTotalRows(0);
      } finally {
        setIsLoading(false);
      }
    };

    // Mekanisme debounce: beri jeda 300ms saat mengetik agar tidak membombardir server backend
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, searchQuery ? 300 : 0);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery]);

  // Reset halaman ke hlm 1 setiap kali user mengetik pencarian baru
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleRedirectToCreate = () => {
    router.push('/client/plan/create');
  };

  const handleRedirectToEdit = (id: number) => {
    router.push(`/client/plan/edit/${id}`);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Logic Selection (Berlaku untuk ID data yang ada di halaman aktif saat ini saja)
  const toggleSelectAll = () => {
    if (tasks.length === 0) return;
    
    const currentPageIds = tasks.map(t => t.id).filter((id): id is number => id !== undefined);
    const isAllSelected = currentPageIds.every(id => selectedTasks.includes(id));

    if (isAllSelected) {
      setSelectedTasks(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedTasks(prev => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  const toggleSelectTask = (id: number) => {
    setSelectedTasks(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Integrasi Hapus Data Massal
  const deleteSelected = async () => {
    if (confirm(`Hapus ${selectedTasks.length} tugas terpilih?`)) {
      try {
        // TODO: Jalankan looping/endpoint delete ke backend, contoh:
        // await PlanService.deleteBulkPlans(selectedTasks);
        
        setSelectedTasks([]);
        // Muat ulang halaman pertama atau kurangi halaman jika data di halaman terakhir habis
        if (tasks.length === selectedTasks.length && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        } else {
          setCurrentPage(1);
        }
      } catch (err) {
        console.error("Gagal menghapus tugas:", err);
      }
    }
  };

  // Integrasi Update Status ke Backend
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      // Optimistic UI update di lokal dulu
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      
      // Panggil API patch/put ke backend Golang
      await PlanService.updatePlanStatus(id, newStatus);
    } catch (error) {
      console.error("Gagal memperbarui status di server:", error);
      alert("Gagal merubah status tugas. Silakan coba beberapa saat lagi.");
    }
  };

  const formatDateAndCheckOverdue = (deadlineStr: string, status: string) => {
    if (!deadlineStr) return { formattedDate: '-', isOverdue: false };
    
    const deadlineDate = new Date(deadlineStr);
    const today = new Date();
    
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    const isOverdue = deadlineDate < today && status !== 'Completed';
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = deadlineDate.toLocaleDateString('id-ID', options);

    return { formattedDate, isOverdue };
  };

  // Cek apakah semua item di halaman saat ini sudah dicentang
  const isCurrentPageAllSelected = tasks.length > 0 && tasks.map(t => t.id).every(id => id && selectedTasks.includes(id));

  return (
    <div className="min-h-screen bg-[#FDF8F8] flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="p-6 lg:p-10 max-w-6xl mx-auto w-full">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-800">Checklist Persiapan</h1>
              <p className="text-sm text-gray-500">Kelola semua daftar tugasmu di sini</p>
            </div>
            
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="animate-pulse h-10 bg-gray-200 rounded-xl w-32"></div>
              ) : (
                <>
                  {selectedTasks.length > 0 && (
                    <button onClick={deleteSelected} className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 text-sm font-bold transition-colors">
                      <Trash2 size={18} className="mr-2" /> Hapus ({selectedTasks.length})
                    </button>
                  )}
                  <button onClick={handleRedirectToCreate} className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 shadow-md shadow-pink-200 text-sm font-bold">
                    <Plus size={18} className="mr-2" /> Tambah Tugas
                  </button>
                </>
              )}
            </div>
          </div>

          {/* SEARCH BAR SECTION */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-50 mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari tugas berdasarkan judul atau kategori..." 
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-100 focus:ring-2 focus:ring-pink-200 outline-none text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* TABLE DATA SECTION */}
          <div className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto min-w-[700px]">
                <thead className="bg-pink-50/50 border-b border-pink-50">
                  <tr>
                    <th className="p-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                        checked={isCurrentPageAllSelected}
                        onChange={toggleSelectAll}
                        disabled={isLoading || tasks.length === 0}
                      />
                    </th>
                    <th className="p-4 text-xs font-bold text-pink-600 uppercase">Tugas</th>
                    <th className="p-4 text-xs font-bold text-pink-600 uppercase">Kategori</th>
                    <th className="p-4 text-xs font-bold text-pink-600 uppercase">Batas Waktu</th>
                    <th className="p-4 text-xs font-bold text-pink-600 uppercase">Status</th>
                    <th className="p-4 text-xs font-bold text-pink-600 uppercase text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                      <tr key={`skeleton-${index}`} className="animate-pulse">
                        <td className="p-4 text-center"><div className="w-4 h-4 bg-gray-200 rounded mx-auto"></div></td>
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded-md w-3/4"></div></td>
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded-md w-20"></div></td>
                        <td className="p-4"><div className="h-4 bg-gray-200 rounded-md w-24"></div></td>
                        <td className="p-4"><div className="h-5 bg-gray-200 rounded-lg w-24"></div></td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <div className="w-7 h-7 bg-gray-200 rounded-md"></div>
                            <div className="w-7 h-7 bg-gray-200 rounded-md"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : tasks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <ClipboardList size={36} className="text-gray-300" />
                          <p className="text-sm">Tidak ada tugas yang ditemukan.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => {
                      if (!task.id) return null;
                      const { formattedDate, isOverdue } = formatDateAndCheckOverdue(task.deadline, task.status || '');
                      
                      return (
                        <tr key={task.id} className="hover:bg-pink-50/10 transition-colors">
                          <td className="p-4 text-center">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                              checked={selectedTasks.includes(task.id)}
                              onChange={() => toggleSelectTask(task.id)}
                            />
                          </td>
                          <td className="p-4">
                            <span className={`text-sm font-medium ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                              {task.title || task.task_name || '-'}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-gray-500">{task.category || '-'}</td>
                          
                          <td className="p-4">
                            <div className={`flex items-center gap-1.5 text-xs font-medium ${
                              isOverdue ? 'text-red-500 font-bold bg-red-50 px-2 py-1 rounded-lg w-fit' : 'text-gray-600'
                            }`}>
                              <Calendar size={14} />
                              <span>{formattedDate} {isOverdue && '(Terlambat)'}</span>
                            </div>
                          </td>

                          <td className="p-4">
                            <select
                              value={task.status || 'Pending'}
                              onChange={(e) => handleStatusChange(task.id!, e.target.value)}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border-0 outline-none cursor-pointer tracking-wider focus:ring-2 focus:ring-pink-200 ${
                                task.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                              }`}
                            >
                              <option value="Pending">PENDING</option>
                              <option value="Completed">COMPLETED</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button 
                                onClick={() => handleRedirectToEdit(task.id!)}
                                className="p-1.5 text-gray-400 hover:text-pink-500 rounded-lg hover:bg-gray-50 transition-colors" 
                                title="Edit Tugas"
                              >
                                <Edit3 size={16}/>
                              </button>
                              <button 
                                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors" 
                                onClick={() => {
                                  if(confirm("Hapus tugas ini?")) {
                                    setTasks(prev => prev.filter(t => t.id !== task.id));
                                    // Mengurangi total rows lokal secara manual jika dihapus dari sisi client
                                    setTotalRows(prev => Math.max(0, prev - 1));
                                  }
                                }} 
                                title="Hapus"
                              >
                                <Trash2 size={16}/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION PANEL CONTROLLER */}
          {!isLoading && tasks.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-pink-50">
              <p className="text-xs text-gray-500">
                Menampilkan <span className="font-semibold text-gray-700">{totalRows === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}</span> sampai <span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, totalRows)}</span> dari <span className="font-semibold text-gray-700">{totalRows}</span> tugas.
              </p>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-gray-100 hover:bg-pink-50 hover:text-pink-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400 text-gray-500 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={`page-${pageNum}`}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                          currentPage === pageNum
                            ? 'bg-pink-500 text-white shadow-md shadow-pink-100'
                            : 'border border-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-gray-100 hover:bg-pink-50 hover:text-pink-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400 text-gray-500 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}