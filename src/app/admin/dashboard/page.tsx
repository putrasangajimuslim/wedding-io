"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../layout/Sidebar';
import { Navbar } from '../layout/Navbar';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Search
} from 'lucide-react'; // Pastikan install lucide-react: npm install lucide-react

export default function DashboardPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* --- SIDEBAR (Desktop & Mobile) --- */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Navbar */}
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Content Area */}
        <main className="p-4 lg:p-8 overflow-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Selamat Datang, Admin WO!</h1>
            <p className="text-gray-500 text-sm mt-1">Berikut adalah ringkasan perencanaan pernikahan hari ini.</p>
          </div>

          {/* Stats Cards (Responsive Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard label="Total Klien" value="128" color="blue" />
            <StatsCard label="Acara Mendatang" value="12" color="pink" />
            <StatsCard label="Vendor Aktif" value="45" color="purple" />
            <StatsCard label="Janji Temu" value="8" color="orange" />
          </div>

          {/* Placeholder Table / List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
            <h3 className="font-semibold text-gray-800 mb-4">Agenda Terdekat</h3>
            <div className="text-center text-gray-400 mt-20">
              <Calendar size={48} className="mx-auto mb-4 opacity-20" />
              <p>Belum ada jadwal tersimpan untuk hari ini.</p>
            </div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function StatsCard({ label, value, color }: { label: string, value: string, color: string }) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    pink: 'bg-pink-50 text-pink-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <p className="text-sm font-medium text-gray-500 mb-2">{label}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${colors[color]}`}>
          +12%
        </span>
      </div>
    </div>
  );
}