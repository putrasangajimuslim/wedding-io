"use client";
import { useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../layout/Sidebar';
import { Navbar } from '../layout/Navbar';
import { Agenda, FinalWedding } from '../../../models/wedding';
import { 
  X, MapPin, ChevronLeft, ChevronRight,
  Clock, Stars, Bell, MessageCircle, 
  Trash2, AlertCircle, Plus, CheckCircle2,
  Phone, User, Info, Edit3, Check, Heart, Copy, Share2,
  CalendarDays, Building2, Link2
} from 'lucide-react';
import { AgendaService, WeddingService } from '@/services/weddingService';
import { CoupleService } from '@/services/coupleService';

// --- Komponen Custom Modal Reusable ---
interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  type?: 'danger' | 'success' | 'info';
}

const CustomModal = ({ isOpen, onClose, title, description, icon, children, type = 'info' }: CustomModalProps) => {
  if (!isOpen) return null;
  
  const iconColors = {
    danger: 'bg-red-50 text-red-500',
    success: 'bg-green-50 text-green-500',
    info: 'bg-rose-50 text-[#F6339A]'
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-[320px] rounded-[2.5rem] p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className={`w-16 h-16 ${iconColors[type]} rounded-full flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
        {description && <p className="text-[11px] text-gray-500 leading-relaxed px-2">{description}</p>}
        <div className="mt-6 flex flex-col gap-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function ClientDashboard() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isCopySuccessOpen, setIsCopySuccessOpen] = useState(false);
  const [showCodeInfo, setShowCodeInfo] = useState(false);
  const [CoupleCode, setCoupleCode] = useState<string>("");

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [agendasAtDate, setAgendasAtDate] = useState<Agenda[]>([]);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  const [isFinalWeddingMode, setIsFinalWeddingMode] = useState(false);
  const [isTwoEvents, setIsTwoEvents] = useState(false); 
  const [finalWeddingData, setFinalWeddingData] = useState<FinalWedding | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [newFinalWedding, setNewFinalWedding] = useState<any>({
    weddingName: '',
    inviteCode: '',
    akadDate: '',
    resepsiDate: '',
    akadVenue: '',
    akadLocation: '',
    resepsiVenue: '',
    resepsiLocation: ''
  });

  const [isConfirmDeleteWeddingOpen, setIsConfirmDeleteWeddingOpen] = useState(false);

  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [viewDate, setViewDate] = useState(new Date()); 
  const [today, setToday] = useState(new Date());

  const generateInviteCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setNewFinalWedding((prev: any) => ({ ...prev, inviteCode: code }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopySuccessOpen(true);
  };

  const fetchAgendaData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await AgendaService.getAgendas();
      
      if (response.success && response.data) {
        const adjustedData = response.data.map((agenda: Agenda) => ({
          ...agenda,
          month: agenda.month - 1
        }));
        setAgendas(adjustedData);
      }
    } catch (error) {
      console.error("Gagal memuat agenda:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWeddingData = useCallback(async () => {
    try {
      const response = await WeddingService.FinalWeddingMe();
      if (response.success && response.data) {
        setFinalWeddingData(response.data);
        setNewFinalWedding(response.data);
      }
    } catch (error) {
      console.error("Gagal memuat wedding:", error);
    }
  }, []);

  const fetchCoupleData = useCallback(async () => {
    try {
      const response = await CoupleService.getCouple();
      if (response.success && response.data) {
        setCoupleCode(response.data?.couple_code || "");
      }
    } catch (error) {
      console.error("Gagal memuat wedding:", error);
    }
  }, []);

  const handleDeleteWedding = async () => {
    try {
      setIsLoading(true);
      const res = await WeddingService.deleteFinalWedding();
      if (res.success) {
        setFinalWeddingData(null);
        setNewFinalWedding({
          weddingName: '', inviteCode: '', akadDate: '', resepsiDate: '',
          akadVenue: '', akadLocation: '', resepsiVenue: '', resepsiLocation: ''
        });
        setIsConfirmDeleteWeddingOpen(false);
      }
    } catch (error) {
      console.error("Gagal menghapus countdown pernikahan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendaData();
    fetchWeddingData();
    fetchCoupleData();
    setToday(new Date());
  }, [fetchAgendaData, fetchWeddingData, fetchCoupleData]);

  useEffect(() => {
    if (finalWeddingData && finalWeddingData.akadDate) {
      const timer = setInterval(() => {
        const target = new Date(finalWeddingData.akadDate).getTime();
        const now = new Date().getTime();
        const gap = target - now;

        if (gap > 0) {
          setCountdown({
            days: Math.floor(gap / (1000 * 60 * 60 * 24)),
            hours: Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            mins: Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60)),
            secs: Math.floor((gap % (1000 * 60)) / 1000)
          });
        } else {
          setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [finalWeddingData]);

  const [newAgenda, setNewAgenda] = useState({
    title: '', time: '', venue: '', location: '', pic: '', phone: ''
  });

  const changeMonth = (offset: number) => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const handleDateClick = (day: number) => {
    const found = agendas.filter(a => 
      a.day === day && a.month === viewDate.getMonth() && a.year === viewDate.getFullYear()
    );

    setSelectedDay(day);
    
    const year = viewDate.getFullYear();
    const month = String(viewDate.getMonth() + 1).padStart(2, '0');
    const dateStr = String(day).padStart(2, '0');
    const fullDateISO = `${year}-${month}-${dateStr}T08:00`;

    setNewFinalWedding((prev: any) => ({
      ...prev,
      akadDate: fullDateISO
    }));

    if (isSelectionMode && found.length > 0) {
      const foundIds = found.map(a => a.id as number);
      const allSelected = foundIds.every(id => selectedIds.includes(id));
      if (allSelected) {
        setSelectedIds(prev => prev.filter(id => !foundIds.includes(id)));
      } else {
        setSelectedIds(prev => [...new Set([...prev, ...foundIds])]);
      }
      return;
    }

    setHighlightedId(null);
    setEditingId(null);
    if (found.length > 0) {
      setAgendasAtDate(found.sort((a, b) => a.time.localeCompare(b.time)));
      setIsDetailOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSpecificAgendaClick = (agenda: Agenda) => {
    if (isSelectionMode) {
      toggleSelect(agenda.id as number);
      return;
    }
    setSelectedDay(agenda.day);
    setHighlightedId(agenda.id as number);
    setEditingId(null);
    setAgendasAtDate([agenda]); 
    setIsDetailOpen(true);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSaveAgenda = async () => {
    try {
      setIsLoading(true);
      if (isFinalWeddingMode) {
        const payload: FinalWedding = {
          ...newFinalWedding,
          isTwoEvents 
        };
        const res = await WeddingService.saveFinalWedding(payload);
        if (res.success) {
          fetchWeddingData();
          setIsModalOpen(false);
          setIsFinalWeddingMode(false);
        }
      } else {
        const item: Agenda = {
          day: selectedDay!,
          month: viewDate.getMonth() + 1,
          year: viewDate.getFullYear(),
          ...newAgenda
        };

        const savedData = await AgendaService.saveAgenda(item);
        if (savedData.success) {
          setIsModalOpen(false);
          setNewAgenda({ title: '', time: '', venue: '', location: '', pic: '', phone: '' });
          fetchAgendaData();
        }
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (agenda: any) => {
    setEditingId(agenda.id);
    setEditForm({ ...agenda });
  };

  const saveEdit = async () => {
    if (!editForm || !editingId) return;
    try {
      setIsLoading(true);
      const payload = {
        ...editForm,
        month: editForm.month + 1
      };
      
      const res = await AgendaService.saveAgenda(payload);
      
      if (res.success) {
        const updatedAgendas = agendas.map(a => a.id === editingId ? editForm : a);
        setAgendas(updatedAgendas);
        setAgendasAtDate(prev => prev.map(a => a.id === editingId ? editForm : a));
        setEditingId(null);
      }
    } catch (err) {
      console.error("Gagal memperbarui agenda:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAction = async () => {
    if (selectedIds.length === 0) return;
    try {
      setIsLoading(true);

      const res = await AgendaService.deleteMultipleAgendas(selectedIds);
      
      if (res && res.success) {
        setAgendas(agendas.filter(a => !selectedIds.includes(a.id as number)));
        
        setIsConfirmDeleteOpen(false);
        setIsDetailOpen(false);
        setIsSelectionMode(false);
        setSelectedIds([]);
      }
    } catch (err) {
      console.error("Gagal memproses hapus massal:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const monthName = viewDate.toLocaleString('id-ID', { month: 'long' });
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const sortedAgendas = [...agendas]
    .filter(a => a.month === viewDate.getMonth() && a.year === viewDate.getFullYear())
    .sort((a, b) => (a.day !== b.day ? a.day - b.day : a.time.localeCompare(b.time)));

  const isAkadDay = (day: number) => {
    if (!finalWeddingData?.akadDate) return false;
    const d = new Date(finalWeddingData.akadDate);
    return d.getDate() === day && d.getMonth() === viewDate.getMonth() && d.getFullYear() === viewDate.getFullYear();
  };

  const isResepsiDay = (day: number) => {
    if (!finalWeddingData?.resepsiDate || !finalWeddingData?.isTwoEvents) return false;
    const d = new Date(finalWeddingData.resepsiDate);
    return d.getDate() === day && d.getMonth() === viewDate.getMonth() && d.getFullYear() === viewDate.getFullYear();
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex text-[#1A1A1A]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-[850px] mx-auto space-y-5">
            
            {/* COMPACT COUNTDOWN */}
            {finalWeddingData && (
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-4 md:p-5 shadow-2xl border border-white/10">
                <button onClick={() => setFinalWeddingData(null)} className="absolute top-3 right-3 z-20 text-white/30 hover:text-white"><X size={14} /></button>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <h2 className="text-lg md:text-xl font-serif italic text-white mb-1">
                      {finalWeddingData.weddingName || 'Our Wedding'}
                    </h2>
                    
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center md:justify-start gap-1.5 text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                        <Building2 size={11} />
                        <span>{finalWeddingData.akadVenue || 'Nama Tempat'}</span>
                      </div>
                      <div className="flex items-center justify-center md:justify-start gap-1.5 text-[9px] text-white/50">
                        <MapPin size={10} />
                        <span className="max-w-[200px] md:max-w-none truncate md:whitespace-normal">{finalWeddingData.akadLocation || 'Alamat Lokasi'}</span>
                      </div>
                    </div>

                    {finalWeddingData.inviteCode && (
                       <div onClick={() => copyToClipboard(finalWeddingData.inviteCode)} className="inline-flex items-center gap-2 mt-2 px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md cursor-pointer transition-all">
                         <span className="text-[8px] font-black text-rose-400 tracking-widest uppercase">CODE: {finalWeddingData.inviteCode}</span>
                         <Copy size={9} className="text-white/40" />
                       </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-2">
                    <div className="flex gap-1.5">
                      {Object.entries(countdown).map(([unit, val]) => (
                        <div key={unit} className="flex flex-col items-center">
                          <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg shadow-inner mb-1">
                            <span className="text-xs md:text-sm font-black text-white">{val}</span>
                          </div>
                          <span className="text-[6px] uppercase font-bold text-white/30 tracking-widest">{unit}</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => setIsConfirmDeleteWeddingOpen(true)}
                      className="flex items-center gap-1 text-[8px] text-red-400/70 hover:text-red-400 font-bold uppercase tracking-wider transition-colors mt-1"
                    >
                      <Trash2 size={10} />
                      <span>Hapus Setup</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-2">
              <div className="w-full sm:w-auto min-w-0">
                <div className="flex items-center gap-1.5 text-[#F6339A] mb-1">
                  <Stars size={12} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Wedding Chapter</span>
                </div>
                
                <div className="flex flex-col xs:flex-row xs:items-center gap-3 min-w-0">
                  <h1 className="text-2xl font-serif italic text-gray-900 tracking-tight whitespace-nowrap">
                    Rencana <span className="font-bold not-italic">Bahagia.</span>
                  </h1>
                  
                  <div className="relative flex items-center min-w-0">
                    <div 
                      onClick={() => CoupleCode && copyToClipboard(CoupleCode)}
                      className="group flex flex-nowrap items-center gap-2 px-3 py-1.5 bg-white border border-rose-100 rounded-full shadow-sm hover:shadow-md hover:border-[#F6339A] transition-all cursor-pointer min-w-0 max-w-full"
                    >
                      <div className="p-1 bg-rose-50 rounded-full group-hover:bg-[#F6339A] transition-colors flex-shrink-0">
                        <Link2 size={10} className="text-[#F6339A] group-hover:text-white" />
                      </div>
                      <div className="flex flex-col leading-none min-w-0">
                        <span className="text-[7px] font-black text-gray-400 uppercase tracking-tighter whitespace-nowrap">Couple Code</span>
                        <span className="text-[10px] font-bold text-gray-800 tracking-wider truncate">
                          {CoupleCode || '------'}
                        </span>
                      </div>
                      <div 
                        onMouseEnter={() => setShowCodeInfo(true)}
                        onMouseLeave={() => setShowCodeInfo(false)}
                        onClick={(e) => { e.stopPropagation(); setShowCodeInfo(!showCodeInfo); }}
                        className="ml-1 text-gray-300 hover:text-[#F6339A] relative flex-shrink-0"
                      >
                        <Info size={14} />
                        
                        {showCodeInfo && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-gray-900 text-white text-[9px] rounded-2xl shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2">
                            <p className="leading-relaxed font-medium whitespace-normal">
                              Gunakan kode ini saat registrasi pasangan Anda agar akun terhubung dalam satu rencana pernikahan.
                            </p>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => { setIsSelectionMode(!isSelectionMode); setSelectedIds([]); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all w-full sm:w-auto justify-center ${isSelectionMode ? 'bg-[#F6339A] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}
              >
                <CheckCircle2 size={14} />
                {isSelectionMode ? `Batal (${selectedIds.length})` : 'Pilih Agenda'}
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Kalender */}
              <div className="flex-1 space-y-5">
                <div className="flex justify-center items-center gap-2 bg-white px-3 py-1 rounded-full w-fit mx-auto shadow-sm border border-gray-100 text-[10px] font-black uppercase tracking-widest">
                  <button onClick={() => changeMonth(-1)} className="p-1 hover:text-[#F6339A]"><ChevronLeft size={18} /></button>
                  <span className="min-w-[120px] text-center">{monthName} {viewDate.getFullYear()}</span>
                  <button onClick={() => changeMonth(1)} className="p-1 hover:text-[#F6339A]"><ChevronRight size={18} /></button>
                </div>

                <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-50">
                  <div className="grid grid-cols-7 mb-3 text-center text-[8px] font-black uppercase tracking-widest text-gray-400"> 
                    {['S','M','T','W','T','F','S'].map((d, i) => <span key={i} className={i===0?'text-[#F6339A]':''}>{d}</span>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={i} className="h-9"></div>)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      
                      const agendasOnDay = agendas.filter(a => a.day === day && a.month === viewDate.getMonth() && a.year === viewDate.getFullYear());
                      const hasAgenda = agendasOnDay.length > 0;
                      const isAllAgendasOnDaySelected = hasAgenda && agendasOnDay.every(a => selectedIds.includes(a.id as number));
                      
                      const isToday = today.getDate() === day && today.getMonth() === viewDate.getMonth() && today.getFullYear() === viewDate.getFullYear();
                      const akad = isAkadDay(day);
                      const resepsi = isResepsiDay(day);

                      return (
                        <div key={day} onClick={() => handleDateClick(day)} className="relative flex items-center justify-center cursor-pointer group">
                          <div className={`
                            w-9 h-9 rounded-xl flex flex-col items-center justify-center text-[11px] font-bold transition-all relative
                            ${isSelectionMode && isAllAgendasOnDaySelected ? 'bg-rose-500 text-white shadow-md ring-2 ring-rose-300' : akad ? 'bg-gray-900 text-white shadow-xl' : resepsi ? 'bg-[#F6339A] text-white shadow-xl' : hasAgenda ? 'bg-rose-100 text-[#F6339A]' : 'text-gray-700 hover:bg-rose-50'}
                            ${isToday && !hasAgenda && !akad && !resepsi ? 'border-2 border-[#F6339A] text-[#F6339A]' : ''}
                          `}>
                            <span>{day}</span>
                            {akad && !isAllAgendasOnDaySelected && <Heart size={6} fill="white" className="absolute bottom-1" />}
                            {resepsi && !isAllAgendasOnDaySelected && <Stars size={6} fill="white" className="absolute bottom-1" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar Agenda List */}
              <div className="w-full lg:w-[320px] shrink-0">
                <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                    <Bell size={12} className="text-[#F6339A]" /> Agenda Terdaftar
                  </div>
                  {isSelectionMode && selectedIds.length > 0 && (
                    <button onClick={() => setIsConfirmDeleteOpen(true)} className="text-red-500 animate-bounce transition-transform p-1 hover:scale-110">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div className="space-y-2 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                  {sortedAgendas.length > 0 ? sortedAgendas.map((agenda) => {
                    const isItemSeclected = selectedIds.includes(agenda.id as number);
                    return (
                      <div 
                        key={agenda.id} 
                        onClick={() => handleSpecificAgendaClick(agenda)} 
                        className={`p-3.5 rounded-[1.2rem] border flex items-center gap-4 transition-all cursor-pointer ${isSelectionMode && isItemSeclected ? 'bg-rose-50 border-[#F6339A] shadow-inner' : 'bg-white border-gray-50 hover:shadow-md'}`}
                      >
                        <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold transition-colors ${isSelectionMode && isItemSeclected ? 'bg-[#F6339A] text-white' : 'bg-rose-50 text-[#F6339A]'}`}>
                          <span className="text-[12px] leading-none">{agenda.day}</span>
                          <span className="text-[7px] uppercase">{monthName.substring(0,3)}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[11px] font-bold truncate text-gray-800">{agenda.title}</h4>
                          <div className="flex flex-col gap-0.5 mt-1">
                              <p className="text-[9px] font-bold text-[#F6339A] flex items-center gap-1"><Clock size={8}/> {agenda.time}</p>
                              <p className="text-[9px] text-gray-400 truncate flex items-center gap-1"><Building2 size={8}/> {agenda.venue || 'No Venue'}</p>
                          </div>
                        </div>
                        {isSelectionMode && (
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${isItemSeclected ? 'bg-[#F6339A] border-[#F6339A] text-white' : 'border-gray-200'}`}>
                            {isItemSeclected && <Check size={10} strokeWidth={3} />}
                          </div>
                        )}
                      </div>
                    );
                  }) : (
                    <div className="text-center py-10 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Belum Ada Agenda</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Form */}
          {isModalOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-7 shadow-2xl max-h-[85vh] flex flex-col">
                <div className="flex justify-between items-center mb-5 shrink-0">
                  <h3 className="text-lg font-serif italic text-gray-900">{isFinalWeddingMode ? 'Final Wedding Setup' : 'Tambah Agenda'}</h3>
                  <button onClick={() => {setIsModalOpen(false); setIsFinalWeddingMode(false);}} className="text-gray-300 hover:text-gray-900"><X size={20}/></button>
                </div>
                
                <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar space-y-4">
                    {!isFinalWeddingMode ? (
                        <>
                        <button onClick={() => setIsFinalWeddingMode(true)} className="w-full py-3 border-2 border-dashed border-rose-100 rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black text-[#F6339A] hover:bg-rose-50 transition-all uppercase tracking-widest">
                            <Heart size={14} fill="#F6339A"/> Aktifkan Mode Final Wedding
                        </button>
                        
                        <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 flex items-center justify-between">
                           <span className="text-[10px] font-black text-[#F6339A] uppercase tracking-widest">Tanggal Terpilih</span>
                           <span className="text-[12px] font-bold text-gray-900">{selectedDay} {monthName} {viewDate.getFullYear()}</span>
                        </div>

                        <input type="text" placeholder="Judul Agenda" value={newAgenda.title} onChange={(e)=>setNewAgenda({...newAgenda, title: e.target.value})} className="w-full bg-gray-50 rounded-xl p-4 text-[12px] outline-none" />
                        <div className="grid grid-cols-2 gap-2">
                            <input type="time" value={newAgenda.time} onChange={(e)=>setNewAgenda({...newAgenda, time: e.target.value})} className="w-full bg-gray-50 rounded-xl p-4 text-[12px] outline-none" />
                            <input type="text" placeholder="Nama Tempat" value={newAgenda.venue} onChange={(e)=>setNewAgenda({...newAgenda, venue: e.target.value})} className="w-full bg-gray-50 rounded-xl p-4 text-[12px] outline-none" />
                        </div>
                        <input type="text" placeholder="Lokasi Spesifik" value={newAgenda.location} onChange={(e)=>setNewAgenda({...newAgenda, location: e.target.value})} className="w-full bg-gray-50 rounded-xl p-4 text-[12px] outline-none" />
                        <input type="text" placeholder="Nama PIC (Opsional)" value={newAgenda.pic} onChange={(e)=>setNewAgenda({...newAgenda, pic: e.target.value})} className="w-full bg-gray-50 rounded-xl p-4 text-[12px] outline-none" />
                        <input type="text" placeholder="WhatsApp (628...) (Opsional)" value={newAgenda.phone} onChange={(e)=>setNewAgenda({...newAgenda, phone: e.target.value})} className="w-full bg-gray-50 rounded-xl p-4 text-[12px] outline-none" />
                        </>
                    ) : (
                        <div className="space-y-4">
                        <input type="text" placeholder="Nama Pasangan" value={newFinalWedding.weddingName} onChange={(e)=>setNewFinalWedding({...newFinalWedding, weddingName: e.target.value})} className="w-full bg-gray-50 rounded-xl p-4 text-[12px] outline-none font-bold" />
                        
                        <div className="bg-gray-50 p-1 rounded-2xl flex gap-1">
                            <button onClick={() => setIsTwoEvents(false)} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all ${!isTwoEvents ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}>Satu Acara</button>
                            <button onClick={() => setIsTwoEvents(true)} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all ${isTwoEvents ? 'bg-[#F6339A] shadow-sm text-white' : 'text-gray-400'}`}>Dua Acara</button>
                        </div>

                        <div className="flex gap-2">
                            <input type="text" readOnly placeholder="Invite Code" value={newFinalWedding.inviteCode} className="flex-1 bg-gray-50 rounded-xl p-3 text-[11px] font-black text-[#F6339A]" />
                            <button onClick={generateInviteCode} className="bg-gray-900 text-white px-3 rounded-xl flex-shrink-0"><Share2 size={14}/></button>
                            {newFinalWedding.inviteCode && <button onClick={() => copyToClipboard(newFinalWedding.inviteCode)} className="bg-[#F6339A] text-white px-3 rounded-xl flex-shrink-0"><Copy size={14}/></button>}
                        </div>

                        <div className="space-y-2 pt-2 border-t border-gray-50">
                            <p className="text-[9px] font-black text-gray-400 uppercase ml-1">{isTwoEvents ? 'Akad Nikah' : 'Detail Acara'}</p>
                            <input type="datetime-local" value={newFinalWedding.akadDate} onChange={(e)=>setNewFinalWedding({...newFinalWedding, akadDate: e.target.value})} className="w-full bg-rose-50/50 border border-rose-100 rounded-xl p-4 text-[12px]" />
                            <input type="text" placeholder="Nama Tempat" value={newFinalWedding.akadVenue} onChange={(e)=>setNewFinalWedding({...newFinalWedding, akadVenue: e.target.value})} className="w-full bg-gray-50 rounded-xl p-4 text-[12px] outline-none" />
                            <input type="text" placeholder="Alamat Lengkap" value={newFinalWedding.akadLocation} onChange={(e)=>setNewFinalWedding({...newFinalWedding, akadLocation: e.target.value})} className="w-full bg-gray-50 rounded-xl p-4 text-[12px] outline-none" />
                        </div>

                        {isTwoEvents && (
                            <div className="space-y-2 pt-2 border-t border-gray-50">
                            <p className="text-[9px] font-black text-gray-400 uppercase ml-1">Resepsi</p>
                            <input type="datetime-local" value={newFinalWedding.resepsiDate} onChange={(e)=>setNewFinalWedding({...newFinalWedding, resepsiDate: e.target.value})} className="w-full bg-gray-50 rounded-xl p-4 text-[12px]" />
                            <input type="text" placeholder="Tempat Resepsi" value={newFinalWedding.resepsiVenue} onChange={(e)=>setNewFinalWedding({...newFinalWedding, resepsiVenue: e.target.value})} className="w-full bg-gray-50 rounded-xl p-4 text-[12px] outline-none" />
                            <input type="text" placeholder="Alamat Resepsi" value={newFinalWedding.resepsiLocation} onChange={(e)=>setNewFinalWedding({...newFinalWedding, resepsiLocation: e.target.value})} className="w-full bg-gray-50 rounded-xl p-4 text-[12px] outline-none" />
                            </div>
                        )}
                        </div>
                    )}
                </div>

                <div className="pt-4 shrink-0">
                    <button disabled={isLoading} onClick={handleSaveAgenda} className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-[#F6339A] transition-colors shadow-lg disabled:opacity-50">
                        {isFinalWeddingMode ? 'Simpan & Tampilkan Countdown' : 'Simpan Agenda'}
                    </button>
                    {isFinalWeddingMode && <button onClick={() => setIsFinalWeddingMode(false)} className="w-full py-2 text-[10px] font-bold text-gray-400">Batal</button>}
                </div>
              </div>
            </div>
          )}

          {/* Modal Detail Agenda */}
          {isDetailOpen && !isSelectionMode && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2.5rem] p-7 shadow-2xl">
                <div className="flex justify-between items-start mb-5">
                    <h2 className="text-xl font-serif italic text-gray-900">Agenda Terpilih</h2>
                    <button onClick={() => setIsDetailOpen(false)} className="text-gray-300 hover:text-gray-900"><X size={24} /></button>
                </div>

                <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                  {agendasAtDate.map((item) => (
                    <div key={item.id} className={`p-5 rounded-[2rem] border transition-all ${editingId === item.id ? 'bg-white border-[#F6339A] ring-1 ring-[#F6339A]' : 'bg-gray-50/50 border-gray-100'}`}>
                      {editingId === item.id ? (
                        <div className="space-y-3">
                          <input type="text" value={editForm.title} onChange={(e)=>setEditForm({...editForm, title: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-[12px] font-bold" />
                          <div className="grid grid-cols-2 gap-2">
                             <input type="time" value={editForm.time} onChange={(e)=>setEditForm({...editForm, time: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-[12px] font-bold" />
                             <input type="text" placeholder="Tempat" value={editForm.venue} onChange={(e)=>setEditForm({...editForm, venue: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-[12px] font-bold" />
                          </div>
                          <input type="text" placeholder="Lokasi Spesifik" value={editForm.location} onChange={(e)=>setEditForm({...editForm, location: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl p-3 text-[12px] font-bold" />
                          <div className="flex gap-2 pt-2">
                             <button onClick={saveEdit} className="flex-1 bg-[#F6339A] text-white py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2"><Check size={14}/> Simpan</button>
                             <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl text-[10px] font-black uppercase">Batal</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-black text-[#F6339A] uppercase tracking-widest">{item.time} WIB</span>
                            <div className="flex gap-3">
                               <button onClick={() => startEditing(item)} className="text-gray-300 hover:text-[#F6339A]"><Edit3 size={16} /></button>
                               <button onClick={() => { setSelectedIds([item.id as number]); setIsConfirmDeleteOpen(true); }} className="text-gray-200 hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                          </div>
                          <h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3>
                          
                          <div className="space-y-1 mb-4">
                            <div className="flex items-center gap-1.5 text-gray-800 text-[10px] font-bold">
                              <Building2 size={10} className="text-[#F6339A]"/> {item.venue || 'Tanpa Tempat'}
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                              <MapPin size={10}/> {item.location || 'Tanpa Lokasi Spesifik'}
                            </div>
                          </div>

                          {/* Hanya tampil jika data PIC atau WhatsApp diisi */}
                          {(item.pic || item.phone) && (
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                {item.pic && (
                                  <>
                                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[#F6339A]"><User size={12}/></div>
                                    <p className="text-[10px] font-bold text-gray-700">{item.pic}</p>
                                  </>
                                )}
                              </div>
                              {item.phone && (
                                <a href={`https://wa.me/${item.phone}`} target="_blank" className="bg-[#25D366] text-white p-2 rounded-lg flex-shrink-0"><MessageCircle size={14} fill="white" /></a>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={() => { setIsDetailOpen(false); setIsModalOpen(true); }} className="w-full mt-6 py-4 bg-gray-50 rounded-2xl text-[10px] font-black uppercase text-gray-400 hover:bg-rose-50 flex items-center justify-center gap-2">
                  <Plus size={14}/> Tambah Agenda Lain
                </button>
              </div>
            </div>
          )}

          {/* Modals Konfirmasi & Success */}
          <CustomModal 
            isOpen={isConfirmDeleteOpen} 
            onClose={() => setIsConfirmDeleteOpen(false)}
            title={selectedIds.length > 1 ? `Hapus ${selectedIds.length} Agenda?` : "Hapus Agenda?"}
            description="Tindakan ini tidak bisa dibatalkan."
            icon={<AlertCircle size={32} />}
            type="danger"
          >
            <button disabled={isLoading} onClick={handleDeleteAction} className="w-full bg-red-500 text-white font-black py-4 rounded-2xl text-[10px] uppercase shadow-lg shadow-red-100 disabled:opacity-50">Hapus Sekarang</button>
            <button onClick={() => setIsConfirmDeleteOpen(false)} className="w-full bg-gray-50 text-gray-500 font-bold py-4 rounded-2xl text-[10px] uppercase">Batal</button>
          </CustomModal>

          {/* Setup Pernikahan Confirmation Modal */}
          <CustomModal
            isOpen={isConfirmDeleteWeddingOpen}
            onClose={() => setIsConfirmDeleteWeddingOpen(false)}
            title="Hapus Setup Pernikahan?"
            description="Perhatian: Menghapus setup ini akan menghilangkan widget countdown dan detail info lokasi utama di dashboard Anda secara permanen."
            icon={<AlertCircle size={32} />}
            type="danger"
          >
            <button disabled={isLoading} onClick={handleDeleteWedding} className="w-full bg-red-500 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-600 disabled:opacity-50 shadow-lg">Ya, Hapus Setup</button>
            <button onClick={() => setIsConfirmDeleteWeddingOpen(false)} className="w-full bg-gray-50 text-gray-500 font-bold py-4 rounded-2xl text-[10px] uppercase">Batal</button>
          </CustomModal>

          <CustomModal 
            isOpen={isCopySuccessOpen} 
            onClose={() => setIsCopySuccessOpen(false)}
            title="Tersalin!"
            description="Kode undangan berhasil disalin."
            icon={<CheckCircle2 size={32} />}
            type="success"
          >
            <button onClick={() => setIsCopySuccessOpen(false)} className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest">Oke</button>
          </CustomModal>

        </main>
      </div>
    </div>
  );
}