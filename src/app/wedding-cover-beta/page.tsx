'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function WeddingCover({ handleOpenInvitation }) {
  // Animasi Staggered (Anak muncul bergantian dengan jeda waktu)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, 
        delayChildren: 0.6,   
      },
    },
  };

  // Animasi Teks & Elemen Konten (Muncul perlahan dari bawah ke atas)
  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.215, 0.610, 0.355, 1.000] },
    },
  };

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#f7f2eb]">
      
      {/* 1. Efek Zoom Latar Belakang Lambat Secara Sinematik */}
      <motion.div
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/walpaper9.png"
          alt="Wedding Background Wallpaper"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Efek Gradasi Lapisan agar teks kontras dan mudah dibaca */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/30 via-white/55 to-white/30" />

      {/* 2. Animasi Garis Bingkai Emas: Mengembang dari tengah */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
        className="absolute inset-5 z-20 rounded-[40px] border-2 border-[#b28a4a]/30 md:inset-8"
      />

      {/* Blok Area Teks Konten */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-30 px-6 text-center max-w-sm w-full"
      >
        {/* Atas Teks */}
        <motion.p
          variants={itemVariants}
          className="mb-5 text-[10px] font-medium uppercase tracking-[6px] text-[#9d7b46]"
        >
          The Wedding Of
        </motion.p>

        {/* Blok Nama Mempelai */}
        <motion.div variants={itemVariants} className="flex flex-col items-center">
          <h2 className="font-serif text-5xl font-light tracking-wide text-[#9d7b46] md:text-6xl">
            Erika
          </h2>
          
          {/* Garis Pembatas Estetik Kanan & Kiri Simbol Ampersand */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="my-3 flex items-center justify-center gap-4 w-full"
          >
            <div className="h-[1px] w-14 bg-[#9d7b46]/30" />
            <span className="font-serif text-2xl italic text-[#9d7b46]/60">&</span>
            <div className="h-[1px] w-14 bg-[#9d7b46]/30" />
          </motion.div>

          <h2 className="font-serif text-5xl font-light tracking-wide text-[#9d7b46] md:text-6xl">
            Yogi
          </h2>
        </motion.div>

        {/* Kartu Informasi Nama Penerima Tamu */}
        <motion.div 
          variants={itemVariants} 
          className="mt-12 rounded-2xl bg-white/40 p-6 backdrop-blur-[4px] border border-white/60 shadow-sm"
        >
          <p className="text-xs font-light tracking-wider text-[#9d7b46]/80">
            Kepada Yth. Bapak/Ibu/Saudara/i
          </p>
          <h3 className="mt-3 font-serif text-2xl font-semibold tracking-wide text-[#86642f]">
            PutraSangaji
          </h3>
        </motion.div>

        {/* Tombol Interaktif dengan Trigger Fungsi Props */}
        <motion.div variants={itemVariants} className="mt-10">
          <motion.button
            onClick={handleOpenInvitation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              y: {
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            }}
            className="cursor-pointer rounded-full bg-[#9d7b46] px-10 py-3.5 text-[11px] uppercase tracking-[3px] font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#86642f] hover:shadow-lg"
          >
            Buka Undangan
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}