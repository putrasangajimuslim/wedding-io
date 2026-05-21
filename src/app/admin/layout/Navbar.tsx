"use client";
import { Menu, Bell, Search } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
        <button 
        onClick={onMenuClick}
        className="p-2 text-gray-600 lg:hidden hover:bg-gray-100 rounded-md"
        >
        <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center bg-gray-100 px-3 py-1.5 rounded-lg w-96">
        <Search size={18} className="text-gray-400 mr-2" />
        <input type="text" placeholder="Cari data klien..." className="bg-transparent border-none focus:ring-0 text-sm w-full" />
        </div>

        <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold border border-pink-200">
            A
        </div>
        </div>
    </header>
  );
}