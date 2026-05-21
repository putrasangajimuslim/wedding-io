'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WeddingCover from '../wedding-cover-beta/page';

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    
    // Logika Otomatis Putar Musik/Audio saat undangan dibuka
    const audio = document.getElementById('wedding-audio');
    if (audio) {
      audio.play().catch((err) => 
        console.log("Autoplay musik tertahan oleh kebijakan privasi browser:", err)
      );
    }
  };

  return (
    <main className={`relative min-h-screen w-full bg-[#f7f2eb] ${isOpened ? 'overflow-y-auto' : 'overflow-hidden h-screen'}`}>
      
      {/* File audio ditaruh di folder /public/audio/wedding-song.mp3 */}
      <audio id="wedding-audio" loop src="/audio/wedding-song.mp3" />

      {/* AnimatePresence menjaga animasi keluar (exit anim) agar tetap berjalan sebelum komponen hilang */}
      <AnimatePresence mode="wait">
        {!isOpened && (
          <motion.div
            key="cover"
            initial={{ opacity: 1, y: 0 }}
            exit={{ 
              y: '-100%', 
              opacity: 0,
              transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } 
            }}
            className="fixed inset-0 z-50 w-full h-screen"
          >
            <WeddingCover handleOpenInvitation={handleOpenInvitation} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        KONTEN UTAMA UNDANGAN 
        Hanya akan aktif/bisa di-scroll setelah tombol Buka Undangan diklik
      */}
      <div className="mx-auto max-w-md bg-white min-h-screen shadow-xl px-6 py-12 text-[#9d7b46]">
        <h1 className="font-serif text-3xl text-center mb-8">Acara Pernikahan</h1>
        <p className="text-sm leading-relaxed mb-6">
          Selamat datang di halaman undangan resmi kami. Kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri hari bahagia kami.
        </p>
        <div className="border border-[#b28a4a]/30 p-6 rounded-xl text-center mb-6">
          <p className="font-semibold uppercase tracking-wider mb-2">Akad Nikah</p>
          <p className="text-xs text-neutral-600">Sabtu, 12 Desember 2026</p>
          <p className="text-xs text-neutral-600 mt-1">Pukul 09.00 WIB - Selesai</p>
        </div>
        <div className="border border-[#b28a4a]/30 p-6 rounded-xl text-center">
          <p className="font-semibold uppercase tracking-wider mb-2">Resepsi</p>
          <p className="text-xs text-neutral-600">Sabtu, 12 Desember 2026</p>
          <p className="text-xs text-neutral-600 mt-1">Pukul 11.00 WIB - Selesai</p>
        </div>
      </div>

    </main>
  );
}