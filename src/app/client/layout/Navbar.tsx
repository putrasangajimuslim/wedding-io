"use client";
import { useState, useEffect, useCallback } from 'react';
import { Menu } from 'lucide-react';
import { CoupleService } from '@/services/coupleService';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [displayName, setDisplayName] = useState<string>("");

  const fetchCoupleData = useCallback(async () => {
      try {
        const response = await CoupleService.getCouple();
        if (response.success && response.data) {
          const { groom, bride } =  response.data;

          // Cek apakah data groom memiliki nama (bukan objek kosong {})
          const hasGroom = groom && groom.firstName;
          // Cek apakah data bride memiliki nama (bukan objek kosong {})
          const hasBride = bride && bride.firstName;

          if (hasGroom && hasBride) {
            setDisplayName(`${groom.firstName} & ${bride.firstName}`);
          } else if (hasGroom) {
            setDisplayName(groom.firstName);
          } else if (hasBride) {
            setDisplayName(bride.firstName);
          }
        }
      } catch (error) {
        console.error("Gagal memuat wedding:", error);
      }
    }, []);
    
  useEffect(() => {
    fetchCoupleData();
  }, [fetchCoupleData]);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-pink-50 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
      <button onClick={onMenuClick} className="lg:hidden p-2 text-pink-500 hover:bg-pink-50 rounded-lg">
        <Menu size={24} />
      </button>
      
      <div className="flex items-center space-x-2 ml-auto">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-400 font-medium">Hai,</p>
          <p className="text-sm font-bold text-gray-700">{displayName}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-pink-400 to-rose-300 border-2 border-white shadow-sm" />
      </div>
    </header>
  );
}