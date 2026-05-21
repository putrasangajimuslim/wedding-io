"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import {
  Home,
  Heart,
  ImageIcon,
  Calendar,
  MapPin,
  Gift,
  MessageCircleHeart,
  Play,
  Pause,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { FaInstagram } from "react-icons/fa";

export default function HomePage() {
  const [opened, setOpened] = useState(false);

  const [copied, setCopied] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // SECTION REFS
  const coupleRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [heroInView, setHeroInView] = useState(true);

  const [showGift, setShowGift] = useState(false);

  // ================= MUSIC =================
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // ================= COUNTDOWN =================
  const weddingDate = new Date("2026-05-31T08:00:00").getTime();

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = weddingDate - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

   useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroInView(entry.isIntersecting);
      },
      {
        threshold: 0.3,
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  // ================= MUSIC TOGGLE =================
  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // ================= OPEN INVITATION =================
  const handleOpenInvitation = async () => {
    setOpened(true);

    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log(error);
      }
    }

    setTimeout(() => {
      contentRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 400);
  };

  // ================= BACK HOME =================
  const handleBackHome = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
    
    heroRef.current?.scrollIntoView({
      behavior: "smooth",
    });

    setTimeout(() => {
      setOpened(false);
    }, 600);
  };

  // ================= SCROLL =================
  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement | null>
  ) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // ================= COPY =================
  const handleCopy = async (
    text: string,
    type: string
  ) => {
    await navigator.clipboard.writeText(text);

    setCopied(type);

    setTimeout(() => {
      setCopied("");
    }, 2000);
  };

  const EVENTS = [
    {
      title: "Akad Nikah",
      date: "Minggu, 12 Desember 2026",
      time: "08.00 WIB - Selesai",
      location: "Gedung Serbaguna Sukabumi",
      address:
        "Jl. Raya Sukabumi No. 88, Kecamatan Cibadak, Kabupaten Sukabumi, Jawa Barat",
      mapUrl: "https://maps.google.com",
    },
  ];

  const GIFT_LIST = [
    {
      id: "bca1",
      bank: "BCA",
      number: "1234567890",
      name: "Erika Putri Damayanti",
      label: "NOMOR REKENING",
    },
    {
      id: "bca2",
      bank: "BCA",
      number: "1242345678",
      name: "Yogi Pratikno",
      label: "NOMOR REKENING",
    },
    {
      id: "dana",
      bank: "DANA",
      number: "081234567890",
      name: "Yogi Pratikno",
      label: "NOMOR",
    },
    {
      id: "bni",
      bank: "BNI",
      number: "9876543210",
      name: "Putra Sangaji",
      label: "NOMOR REKENING",
    },
  ];

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -350,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 350,
      behavior: "smooth",
    });
  };

  return (
    <main className="relative h-screen overflow-y-auto scroll-smooth bg-[#f6f1ea]">
      {/* ================= AUDIO ================= */}
      <audio
        ref={audioRef}
        loop
        src="/music/Broken_Symphony.mp3"
      />

      {/* ================= HERO ================= */}
      <section
        ref={heroRef}
        className="relative h-screen overflow-hidden"
      >
        <div className="grid h-full lg:grid-cols-[1fr_380px]">
          {/* LEFT IMAGE */}
          <section className="relative hidden overflow-hidden lg:block">
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <Image
                src="/images/testfoto2.jpg"
                alt="Wedding"
                fill
                priority
                className="object-cover object-center"
              />
            </motion.div>

            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute bottom-0 left-0 z-20 p-16 text-white">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4 text-lg uppercase tracking-[5px]"
              >
                Undangan Pernikahan
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-cormorant text-8xl leading-none"
              >
                Erika & Yogi
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-5 text-xl tracking-[4px]"
              >
                09 Mei 2026
              </motion.p>
            </div>
          </section>

          {/* RIGHT SIDEBAR */}
         <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f2eb] px-4 py-6 sm:px-6 lg:px-8">
          {/* 1. Background Gambar dengan Warna Asli */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/walpaper10.png"
              alt="Background"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* 2. Bingkai Border Emas */}
          <div className="absolute inset-4 sm:inset-6 md:inset-8 rounded-[24px] sm:rounded-[32px] md:rounded-[40px] border border-[#b28a4a]/40 z-10 pointer-events-none" />

          {/* 3. Konten Utama */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-20 w-full max-w-sm mx-auto text-center flex flex-col items-center justify-center py-2 my-auto"
          >
            {/* "The Wedding Of" - Diperbesar di tablet(md), diperkecil sedikit di desktop(lg) */}
            <div className="mb-2 sm:mb-4 lg:mb-2 flex flex-col items-center justify-center text-center font-serif text-[16px] sm:text-[18px] md:text-[24px] lg:text-[18px] text-[#9d7b46] font-medium leading-[1.3] tracking-wide">
              <span>The</span>
              <span>Wedding</span>
              <span>Of</span>
            </div>

            {/* Nama Pengantin (Erika & Yogi) - Diperbesar signifikan di md, proporsional di lg */}
            <h2 className="font-cursive text-3xl sm:text-4xl md:text-5xl lg:text-4.5xl text-[#9d7b46] leading-[1.1] my-1.5 sm:my-3 lg:my-2 w-full px-2 drop-shadow-sm">
              <span className="block capitalize">Erika</span>
              <span className="block text-xl sm:text-2xl md:text-3xl lg:text-2xl my-0.5 font-light font-serif">&</span>
              <span className="block capitalize">Yogi</span>
            </h2>

            {/* Garis Pembatas Halus */}
            <div className="relative w-20 sm:w-24 md:w-32 lg:w-24 h-[1px] bg-gradient-to-r from-transparent via-[#b28a4a]/70 to-transparent my-2 sm:my-3 lg:my-2 flex items-center justify-center">
              <div className="absolute w-1.5 h-1 bg-[#b28a4a]/80 rounded-full" />
            </div>

            {/* 4. Bagian Kepada Yth. & Nama Tamu */}
            <div className="mt-2 sm:mt-3 lg:mt-2 mb-2 w-full px-4">
              <p className="text-[12px] sm:text-[13px] md:text-[15px] lg:text-[13px] text-[#9d7b46] font-serif leading-relaxed">
                Kepada Yth.
              </p>
              <p className="text-[11px] sm:text-[12px] md:text-[14px] lg:text-[12px] text-[#9d7b46]/90 font-serif leading-relaxed">
                Bapak / Ibu / Saudara/i
              </p>
              
              {/* Nama Tamu - Ekstra bold dan besar di layar md */}
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-3xl font-bold text-[#695027] tracking-wide break-words max-w-full px-2 leading-tight">
                PutraSangaji
              </h3>
            </div>

            {/* 5. Tombol Buka Undangan */}
            <button
              onClick={handleOpenInvitation}
              className="mt-4 sm:mt-5 lg:mt-3 cursor-pointer rounded-full bg-[#9d7b46] px-10 py-2.5 md:px-12 md:py-3 lg:px-10 lg:py-2.5 text-xs sm:text-sm md:text-base lg:text-sm font-medium tracking-widest uppercase text-white transition-all duration-300 hover:scale-105 hover:bg-[#86642f] shadow-md hover:shadow-lg active:scale-95"
            >
              Buka Undangan
            </button>
          </motion.div>
        </section>
        </div>
      </section>

      {/* ================= AFTER OPEN ================= */}
      <AnimatePresence>
        {opened && (
          <motion.section
            ref={contentRef}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="relative overflow-hidden bg-[#f8f5f0] pb-40"
          >
            {/* BACKGROUND */}
            <Image
              src="/images/walpaper6.jpg"
              alt="Background"
              fill
              className="object-cover opacity-[0.05]"
            />

            {/* ================= WEDDING CHAPTER ================= */}
            <section className="relative z-10 px-4 pt-20 md:px-6">
              <div className="mx-auto max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative overflow-hidden rounded-[38px] border border-[#e3d5be]/30 bg-white/80 px-6 py-12 shadow-[0_18px_60px_rgba(0,0,0,0.07)] backdrop-blur-xl md:px-10 md:py-14"
                >
                  {/* Background */}
                  <Image
                    src="/images/walpaper6.jpg"
                    alt="Background"
                    fill
                    className="object-cover opacity-[0.04]"
                  />

                  {/* Decorative Flower Top */}
                  <div className="absolute -left-8 -top-8 h-24 w-24 opacity-50 md:h-28 md:w-28">
                    <Image
                      src="/images/icon3.png"
                      alt="Flower"
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Decorative Flower Bottom */}
                  <div className="absolute -bottom-8 -right-8 h-24 w-24 opacity-50 md:h-28 md:w-28">
                    <Image
                      src="/images/icon3.png"
                      alt="Flower"
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <p className="text-[11px] uppercase tracking-[5px] text-[#b28a4a] md:text-sm">
                      Wedding Chapter
                    </p>

                    <h2 className="mt-4 font-cormorant text-4xl leading-tight text-[#9d7b46] md:text-6xl">
                      A Journey Of <br /> Love & Happiness
                    </h2>

                    <div className="mx-auto mt-8 h-px w-20 bg-[#d8b57a]" />

                    <p className="mx-auto mt-8 max-w-2xl text-[15px] leading-8 text-[#6b5b3e] md:text-lg">
                      Dengan memohon rahmat dan ridho Allah SWT,
                      kami bermaksud mengundang Bapak / Ibu /
                      Saudara/i untuk hadir dalam acara
                      pernikahan kami dan memberikan doa restu.
                    </p>

                    <p className="mx-auto mt-8 max-w-xl text-sm italic leading-7 text-[#8a7350] md:text-base">
                      “Dan di antara tanda-tanda (kebesaran)-Nya ialah
                      Dia menciptakan pasangan-pasangan untukmu dari
                      jenismu sendiri.”
                    </p>

                    <p className="mt-4 text-[11px] uppercase tracking-[4px] text-[#b28a4a] md:text-xs">
                      QS. Ar-Rum : 21
                    </p>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ================= THE BRIDE & GROOM + LOVE STORY ================= */}
            <section
              ref={coupleRef}
              className="relative z-10 px-4 pt-20"
            >
              <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.85fr]">
                {/* ================= BRIDE & GROOM ================= */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="relative overflow-hidden rounded-[34px] border border-[#d9c4a3]/30 bg-[#f8f5ef]/90 shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl"
                >
                  <Image
                    src="/images/walpaper6.jpg"
                    alt="Background"
                    fill
                    className="object-cover opacity-[0.07]"
                  />

                  {/* Ornament */}
                  <div className="absolute left-0 top-1/3 z-10 h-32 w-20 opacity-80">
                    <Image
                      src="/images/icon3.png"
                      alt="Flower"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="absolute bottom-20 right-0 z-10 h-32 w-20 opacity-80">
                    <Image
                      src="/images/icon3.png"
                      alt="Flower"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="relative z-20 px-5 py-10 md:px-8 md:py-12">
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-[5px] text-[#b28a4a]">
                        The Wedding Of
                      </p>

                      <h2 className="mt-3 font-cormorant text-4xl text-[#9d7b46] md:text-5xl">
                        Bride & Groom
                      </h2>
                    </div>

                    {/* Desktop */}
                    <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-5">
                      
                      {/* BRIDE */}
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="mt-10 text-center"
                      >
                        <div className="relative mx-auto h-[220px] w-[180px] overflow-hidden rounded-[120px] border-[4px] border-[#d8b57a] shadow-xl">
                          <Image
                            src="/images/testfoto2.jpg"
                            alt="Bride"
                            fill
                            className="object-cover"
                          />
                        </div>

                        <h3 className="mt-6 font-cormorant text-[28px] leading-tight text-[#b18239]">
                          Erika Putri Damayanti, SM
                        </h3>

                        <p className="mt-4 text-[15px] leading-7 text-[#7b6a52]">
                          Putri dari <br />
                          Bapak Serma (Purn) Dwi Yanto
                          <br />& Ibu Endang Suwarsih
                        </p>

                        <div className="mt-5 flex justify-center">
                          <a
                            href="#"
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#a9772f] text-white shadow-md transition hover:scale-110"
                          >
                            <FaInstagram size={14} />
                          </a>
                        </div>
                      </motion.div>

                      {/* AMPERSAND */}
                      <div className="mt-6 flex justify-center">
                        <span className="font-cormorant text-6xl text-[#b18239]">
                          &
                        </span>
                      </div>

                      {/* GROOM */}
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="mt-10 text-center"
                      >
                        <div className="relative mx-auto h-[220px] w-[180px] overflow-hidden rounded-[120px] border-[4px] border-[#d8b57a] shadow-xl">
                          <Image
                            src="/images/testfoto2.jpg"
                            alt="Groom"
                            fill
                            className="object-cover"
                          />
                        </div>

                        <h3 className="mt-6 font-cormorant text-[28px] leading-tight text-[#b18239]">
                          Yogi Pratikno, S.Tr.Pra
                        </h3>

                        <p className="mt-4 text-[15px] leading-7 text-[#7b6a52]">
                          Putra dari <br />
                          Bapak Aipda Johny Sjamsudin
                          <br />& Ibu Ani Sulistiyawati
                        </p>

                        <div className="mt-5 flex justify-center">
                          <a
                            href="#"
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#a9772f] text-white shadow-md transition hover:scale-110"
                          >
                            <FaInstagram size={14} />
                          </a>
                        </div>
                      </motion.div>
                    </div>

                    {/* Mobile */}
                    <div className="lg:hidden">
                      
                      {/* BRIDE */}
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="mt-10 text-center"
                      >
                        <div className="relative mx-auto h-[210px] w-[170px] overflow-hidden rounded-[120px] border-[4px] border-[#d8b57a] shadow-xl">
                          <Image
                            src="/images/testfoto2.jpg"
                            alt="Bride"
                            fill
                            className="object-cover"
                          />
                        </div>

                        <h3 className="mt-6 font-cormorant text-[28px] leading-tight text-[#b18239]">
                          Erika Putri Damayanti, SM
                        </h3>

                        <p className="mt-4 text-[15px] leading-7 text-[#7b6a52]">
                          Putri dari <br />
                          Bapak Serma (Purn) Dwi Yanto
                          <br />& Ibu Endang Suwarsih
                        </p>

                        <div className="mt-5 flex justify-center">
                          <a
                            href="#"
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#a9772f] text-white shadow-md transition hover:scale-110"
                          >
                            <FaInstagram size={14} />
                          </a>
                        </div>
                      </motion.div>

                      <div className="my-8 flex justify-center">
                        <span className="font-cormorant text-6xl text-[#b18239]">
                          &
                        </span>
                      </div>

                      {/* GROOM */}
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="text-center"
                      >
                        <div className="relative mx-auto h-[210px] w-[170px] overflow-hidden rounded-[120px] border-[4px] border-[#d8b57a] shadow-xl">
                          <Image
                            src="/images/testfoto2.jpg"
                            alt="Groom"
                            fill
                            className="object-cover"
                          />
                        </div>

                        <h3 className="mt-6 font-cormorant text-[28px] leading-tight text-[#b18239]">
                          Yogi Pratikno, S.Tr.Pra
                        </h3>

                        <p className="mt-4 text-[15px] leading-7 text-[#7b6a52]">
                          Putra dari <br />
                          Bapak Aipda Johny Sjamsudin
                          <br />& Ibu Ani Sulistiyawati
                        </p>

                        <div className="mt-5 flex justify-center">
                          <a
                            href="#"
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#a9772f] text-white shadow-md transition hover:scale-110"
                          >
                            <FaInstagram size={14} />
                          </a>
                        </div>
                      </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* ================= LOVE STORY ================= */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative overflow-hidden rounded-[34px] border border-[#d9c4a3]/30 bg-[#f8f5ef]/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-8"
            >
              {/* Background */}
              <Image
                src="/images/walpaper6.jpg"
                alt="Background"
                fill
                className="object-cover opacity-[0.05]"
              />

              {/* Glow */}
              <motion.div
                animate={{
                  opacity: [0.2, 0.35, 0.2],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#d8b57a]/20 blur-3xl"
              />

              {/* Flowers */}
              <motion.img
                src="/images/icon3.png"
                alt="Flower Left"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="absolute left-0 top-0 z-10 w-24 opacity-60"
              />

              <motion.img
                src="/images/icon3.png"
                alt="Flower Right"
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="absolute bottom-0 right-0 z-10 w-24 opacity-60"
              />

              <div className="relative z-20">
                {/* Heading */}
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[5px] text-[#b28a4a]">
                    Journey Of Love
                  </p>

                  <h2 className="mt-3 font-cormorant text-4xl text-[#9d7b46] md:text-5xl">
                    Love Story
                  </h2>

                  <div className="mx-auto mt-4 h-[1px] w-24 bg-[#d8b57a]" />
                </div>

                {/* Timeline */}
                <div className="relative mt-12 border-l border-[#d8b57a]/40 pl-6">
                  
                  {/* ITEM */}
                  {[
                    {
                      title: "Awal Pertemuan",
                      desc:  `Tidak ada yang kebetulan di dunia ini. Semua sudah tersusun
                        rapi oleh sang maha kuasa. Kami bertemu pada tahun 2021,
                        tepatnya saat berada di lingkungan pekerjaan yang sama dan
                        mulai mengenal satu sama lain.`,
                    },
                    {
                      title: "Lamaran",
                      desc:  `Setelah perjalanan panjang yang penuh cerita, kami memutuskan
                        untuk melangkah ke hubungan yang lebih serius. Dengan restu
                        kedua orang tua dan keluarga besar, acara lamaran dilangsungkan
                        dengan penuh haru dan kebahagiaan. `,
                    },
                    {
                      title: "Pernikahan",
                      desc:  `Dan di tahun ini, kami memutuskan untuk mengikat janji suci
                        dalam pernikahan. Semoga langkah baru ini menjadi awal dari
                        kehidupan yang penuh cinta, keberkahan, dan kebahagiaan
                        selamanya. `,
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                      whileHover={{ x: 6 }}
                      className="relative mb-10"
                    >
                      {/* Dot */}
                      <div className="absolute -left-[31px] top-2 h-4 w-4 rounded-full border-4 border-[#f8f5ef] bg-[#b18239]" />

                      <h3 className="font-cormorant text-[28px] text-[#b18239]">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-[15px] leading-7 text-[#7b6a52]">
                        {item.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
            </section>
            
            {/* ================= COUNTDOWN ================= */}
            <section className="relative z-10 py-12">
              {/* FULL IMAGE */}
              <div className="relative mx-auto h-[500px] w-full overflow-hidden">
                <Image
                  src="/images/testfoto2.jpg"
                  alt="Wedding Countdown"
                  fill
                  className="object-cover"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/45" />

                {/* CONTENT */}
                <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
                  <p className="text-sm uppercase tracking-[5px] text-[#f4e7d0]">
                    Save Our Date
                  </p>

                  <h3 className="mt-5 font-cormorant text-5xl text-white md:text-7xl">
                    Countdown To Happiness
                  </h3>

                  {/* SMALLER COUNTDOWN BOX */}
                  <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      {
                        label: "Days",
                        value: timeLeft.days,
                      },
                      {
                        label: "Hours",
                        value: timeLeft.hours,
                      },
                      {
                        label: "Minutes",
                        value: timeLeft.minutes,
                      },
                      {
                        label: "Seconds",
                        value: timeLeft.seconds,
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -4 }}
                        className="min-w-[85px] border border-white/20 bg-white/10 px-4 py-4 backdrop-blur-md md:min-w-[95px]"
                      >
                        <h4 className="text-3xl font-light text-white md:text-4xl">
                          {item.value}
                        </h4>

                        <p className="mt-2 text-[10px] uppercase tracking-[3px] text-white/80">
                          {item.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ================= GALLERY ================= */}
            <section
              ref={galleryRef}
              className="relative z-10 overflow-hidden px-6 pt-10"
            >
              {/* BACKGROUND GLOW */}
              <div className="absolute left-1/2 top-20 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#d8b57a]/10 blur-3xl" />

              <div className="relative mx-auto max-w-6xl">
                
                {/* ================= TITLE ================= */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="text-center"
                >
                  <motion.p
                    initial={{ letterSpacing: "2px", opacity: 0 }}
                    whileInView={{ letterSpacing: "5px", opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    className="text-sm uppercase tracking-[5px] text-[#b28a4a]"
                  >
                    Our Memories
                  </motion.p>

                  <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mt-4 font-cormorant text-5xl text-[#9d7b46] md:text-6xl"
                  >
                    Wedding Gallery
                  </motion.h2>

                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: 100 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="mx-auto mt-6 h-px bg-[#d8b57a]"
                  />
                </motion.div>

                {/* ================= GALLERY GRID ================= */}
                <div className="mt-16 grid auto-rows-[170px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4">
                  
                  {/* ================= BIG IMAGE ================= */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{
                      scale: 1.015,
                    }}
                    className="group relative col-span-2 row-span-2 cursor-pointer overflow-hidden rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.12)]"
                  >
                    <Image
                      src="/images/testfoto2.jpg"
                      alt="Gallery"
                      fill
                      className="object-cover transition duration-[1800ms] ease-out group-hover:scale-110"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-90 transition duration-700" />

                    {/* SHINE EFFECT */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute -left-[120%] top-0 h-full w-[60%] rotate-12 bg-white/10 blur-2xl transition-all duration-[1800ms] group-hover:left-[130%]" />
                    </div>

                    {/* TEXT */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="absolute bottom-6 left-6 text-white"
                    >
                      <p className="text-[11px] uppercase tracking-[4px] text-white/80">
                        Wedding Moment
                      </p>

                      <h3 className="mt-2 font-cormorant text-3xl md:text-4xl">
                        Erika & Yogi
                      </h3>
                    </motion.div>
                  </motion.div>

                  {/* ================= SMALL IMAGES ================= */}
                  {[
                    "/images/testfoto2.jpg",
                    "/images/testfoto2.jpg",
                    "/images/testfoto2.jpg",
                    "/images/testfoto2.jpg",
                  ].map((img, index) => (
                    <motion.div
                      key={index}
                      initial={{
                        opacity: 0,
                        y: 30,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.9,
                        delay: index * 0.15,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{
                        y: -4,
                        scale: 1.02,
                      }}
                      className="group relative cursor-pointer overflow-hidden rounded-[26px] shadow-[0_10px_35px_rgba(0,0,0,0.08)]"
                    >
                      <Image
                        src={img}
                        alt="Gallery"
                        fill
                        className="object-cover transition duration-[1600ms] ease-out group-hover:scale-110"
                      />

                      {/* DARK OVERLAY */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 transition duration-500 group-hover:opacity-100" />

                      {/* SHINE */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -left-[120%] top-0 h-full w-[50%] rotate-12 bg-white/10 blur-xl transition-all duration-[1500ms] group-hover:left-[130%]" />
                      </div>
                    </motion.div>
                  ))}

                  {/* ================= WIDE IMAGE ================= */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      delay: 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{
                      scale: 1.015,
                    }}
                    className="group relative col-span-2 cursor-pointer overflow-hidden rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
                  >
                    <Image
                      src="/images/testfoto2.jpg"
                      alt="Gallery"
                      fill
                      className="object-cover transition duration-[1800ms] ease-out group-hover:scale-110"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent opacity-70" />

                    {/* SHINE */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute -left-[120%] top-0 h-full w-[50%] rotate-12 bg-white/10 blur-2xl transition-all duration-[1800ms] group-hover:left-[130%]" />
                    </div>
                  </motion.div>

                  {/* ================= LAST IMAGES ================= */}
                  {[
                    "/images/testfoto2.jpg",
                    "/images/testfoto2.jpg",
                  ].map((img, index) => (
                    <motion.div
                      key={index}
                      initial={{
                        opacity: 0,
                        y: 30,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.9,
                        delay: index * 0.2,
                      }}
                      whileHover={{
                        y: -4,
                        scale: 1.02,
                      }}
                      className="group relative cursor-pointer overflow-hidden rounded-[26px] shadow-[0_10px_35px_rgba(0,0,0,0.08)]"
                    >
                      <Image
                        src={img}
                        alt="Gallery"
                        fill
                        className="object-cover transition duration-[1600ms] ease-out group-hover:scale-110"
                      />

                      {/* OVERLAY */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 transition duration-500 group-hover:opacity-100" />

                      {/* SHINE */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -left-[120%] top-0 h-full w-[50%] rotate-12 bg-white/10 blur-xl transition-all duration-[1500ms] group-hover:left-[130%]" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ================= EVENT ================= */}
            <section ref={eventRef} className="relative z-10 px-6 pt-24">
              <div className="mx-auto max-w-5xl">
                {/* TITLE */}
                <div className="text-center">
                  <p className="text-sm uppercase tracking-[5px] text-[#b28a4a]">
                    Wedding Event
                  </p>

                  <h2 className="mt-4 font-cormorant text-5xl text-[#9d7b46]">
                    Save The Date
                  </h2>
                </div>

                {/* EVENT LIST */}
                <div
                  className={`mt-14 grid gap-6 ${
                    EVENTS.length === 1
                      ? "mx-auto max-w-xl"
                      : "md:grid-cols-2"
                  }`}
                >
                  {EVENTS.map((event, index) => {
                    const isFlipped = flippedCards.includes(index);

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, rotateY: -90 }}
                        whileInView={{ opacity: 1, rotateY: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                          duration: 1,
                          delay: index * 0.2,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                          transformStyle: "preserve-3d",
                          perspective: 2000,
                        }}
                        className="relative h-[560px]"
                      >
                        {/* FLIP CARD */}
                        <motion.div
                          animate={{
                            rotateY: isFlipped ? 180 : 0,
                          }}
                          transition={{
                            duration: 0.9,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          style={{
                            transformStyle: "preserve-3d",
                          }}
                          className="relative h-full w-full cursor-pointer"
                          onClick={() => toggleFlip(index)}
                        >
                          {/* FRONT CARD */}
                          <div
                            style={{
                              backfaceVisibility: "hidden",
                            }}
                            className="absolute inset-0 overflow-hidden rounded-[35px] shadow-[0_20px_80px_rgba(0,0,0,0.08)]"
                          >
                            {/* BACKGROUND */}
                            <Image
                              src="/images/walpaper6.jpg"
                              alt="Wedding Background"
                              fill
                              quality={100}
                              className="object-cover opacity-20 transition-transform duration-[4000ms]"
                            />

                            {/* OVERLAY */}
                            <div className="absolute inset-0 bg-white/65 backdrop-blur-[1px]" />

                            {/* BORDER */}
                            <div className="absolute inset-0 rounded-[35px] border border-white/20" />

                            {/* FLOWER TOP LEFT */}
                            <motion.div
                              animate={{
                                y: [0, -8, 0],
                                rotate: [0, 2, 0],
                              }}
                              transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="absolute left-0 top-0 z-10"
                            >
                              <Image
                                src="/images/icon3.png"
                                alt="Flower"
                                width={120}
                                height={120}
                                quality={100}
                                className="opacity-90"
                              />
                            </motion.div>

                            {/* FLOWER BOTTOM RIGHT */}
                            <motion.div
                              animate={{
                                y: [0, 8, 0],
                                rotate: [0, -2, 0],
                              }}
                              transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="absolute bottom-0 right-0 z-10 rotate-180"
                            >
                              <Image
                                src="/images/icon3.png"
                                alt="Flower"
                                width={120}
                                height={120}
                                quality={100}
                                className="opacity-90"
                              />
                            </motion.div>

                            {/* CONTENT */}
                            <div className="relative z-20 flex h-full flex-col items-center justify-center p-10 text-center">
                              {/* ICON */}
                              <motion.div
                                animate={{
                                  scale: [1, 1.05, 1],
                                }}
                                transition={{
                                  duration: 4,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                                className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/30 shadow-lg backdrop-blur-md"
                              >
                                <Calendar
                                  size={38}
                                  className="text-[#9d7b46]"
                                />
                              </motion.div>

                              {/* TITLE */}
                              <h3 className="mt-7 font-cormorant text-5xl text-[#8a6836]">
                                {event.title}
                              </h3>

                              {/* DATE */}
                              <p className="mt-6 leading-8 text-[#5f4d32]">
                                {event.date}
                                <br />
                                {event.time}
                              </p>

                              {/* LOCATION */}
                              <div className="mt-6 flex items-center justify-center gap-2 text-[#8a6836]">
                                <MapPin size={18} />
                                <span>{event.location}</span>
                              </div>

                              {/* CLICK TEXT */}
                              <motion.p
                                animate={{
                                  opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                }}
                                className="mt-8 text-xs tracking-[4px] text-[#9d7b46]"
                              >
                                CLICK TO FLIP
                              </motion.p>
                            </div>
                          </div>

                          {/* BACK CARD */}
                          <div
                            style={{
                              transform: "rotateY(180deg)",
                              backfaceVisibility: "hidden",
                            }}
                            className="absolute inset-0 overflow-hidden rounded-[35px] bg-[#f8f3ea] shadow-[0_20px_80px_rgba(0,0,0,0.08)]"
                          >
                            {/* BACKGROUND */}
                            <Image
                              src="/images/walpaper6.jpg"
                              alt="Wedding Background"
                              fill
                              quality={100}
                              className="object-cover opacity-10"
                            />

                            {/* OVERLAY */}
                            <div className="absolute inset-0 bg-[#fffaf3]/90 backdrop-blur-sm" />

                            {/* FLOWER */}
                            <div className="absolute left-0 top-0">
                              <Image
                                src="/images/icon3.png"
                                alt="Flower"
                                width={80}
                                height={80}
                                quality={100}
                                className="opacity-90"
                              />
                            </div>

                            <div className="absolute bottom-0 right-0 rotate-180">
                              <Image
                                src="/images/icon3.png"
                                alt="Flower"
                                width={80}
                                height={80}
                                quality={100}
                                className="opacity-90"
                              />
                            </div>

                            {/* CONTENT */}
                            <div className="relative z-20 flex h-full flex-col items-center justify-center px-10 text-center">
                              {/* TITLE */}
                              <h3 className="font-cormorant text-5xl text-[#9d7b46]">
                                {event.title}
                              </h3>

                              <div className="mt-8 h-[1px] w-24 bg-[#d6b98c]" />

                              {/* HOUSE ICON */}
                              <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#d8b57a]/40 bg-white/70 shadow-lg backdrop-blur-sm">
                                <Home
                                  size={34}
                                  className="text-[#9d7b46]"
                                />
                              </div>

                              {/* FAMILY TITLE */}
                              <h4 className="mt-5 font-cormorant text-3xl text-[#8a6836]">
                                {event.title === "Akad Nikah"
                                  ? "Mempelai Wanita"
                                  : "Mempelai Pria"}
                              </h4>

                              {/* ADDRESS */}
                              <p className="mt-4 max-w-md leading-8 text-[#6b5738]">
                                {event.address}
                              </p>

                              {/* BUTTON */}
                              {event.mapUrl && (
                                <a
                                  href={event.mapUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block"
                                >
                                  <motion.button
                                    whileHover={{
                                      scale: 1.05,
                                    }}
                                    whileTap={{
                                      scale: 0.96,
                                    }}
                                    className="mt-10 rounded-full bg-[#9d7b46] px-8 py-3 text-sm tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-[#7c5c2f]"
                                  >
                                    Lihat Lokasi
                                  </motion.button>
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ================= WEDDING GIFT ================= */}
            <section className="relative z-10 px-6 pt-24">
              <div className="mx-auto max-w-6xl">
                {/* TITLE */}
                <div className="text-center">
                  <p className="text-sm uppercase tracking-[5px] text-[#b28a4a]">
                    Wedding Gift
                  </p>

                  <h2 className="mt-4 font-cormorant text-5xl text-[#9d7b46]">
                    Send Your Gift
                  </h2>

                  <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#6b5b3e]">
                    Doa restu Anda merupakan karunia yang sangat
                    berarti bagi kami.
                  </p>
                </div>

                {/* TOGGLE BUTTON */}
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => setShowGift(!showGift)}
                    className="flex items-center gap-3 rounded-full bg-[#9d7b46] px-8 py-4 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#86642f]"
                  >
                    <Gift size={18} />

                    {showGift
                      ? "Sembunyikan Gift"
                      : "Tampilkan Gift"}
                  </button>
                </div>

                {/* GIFT CONTENT */}
                <AnimatePresence>
                  {showGift && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ duration: 0.5 }}
                      className="mt-14"
                    >
                      {/* WRAPPER */}
                      <div className="relative mx-auto max-w-7xl">

                        {/* SCROLL AREA */}
                        <div
                          ref={scrollRef}
                          className="
                            flex snap-x snap-mandatory justify-start
                            gap-6 overflow-x-auto scroll-smooth

                            /* padding responsive */
                            px-4 sm:px-10 pb-4

                            /* penting untuk center snap mobile */
                            scroll-px-4 sm:scroll-px-10

                            [-ms-overflow-style:none]
                            [scrollbar-width:none]
                            [&::-webkit-scrollbar]:hidden
                          "
                        >
                          {GIFT_LIST.map((gift, index) => (
                            <motion.div
                              key={gift.id}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ y: -6 }}
                              className="
                                snap-center
                                flex-shrink-0

                                /* responsive width */
                                w-[85%] sm:w-full
                                max-w-[340px]
                                min-w-[260px]

                                rounded-[35px]
                                border border-[#d9c4a3]/30
                                bg-white/80
                                p-8
                                backdrop-blur
                              "
                            >
                              {/* TOP */}
                              <div className="flex items-center justify-between">
                                <h3 className="font-cormorant text-3xl text-[#9d7b46]">
                                  {gift.bank}
                                </h3>

                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6efe4]">
                                  <Gift className="text-[#b28a4a]" />
                                </div>
                              </div>

                              {/* LABEL */}
                              <p className="mt-8 text-xs tracking-[4px] text-[#b28a4a]">
                                {gift.label}
                              </p>

                              {/* NUMBER */}
                              <h4 className="mt-3 break-all text-2xl text-[#6b5b3e]">
                                {gift.number}
                              </h4>

                              {/* NAME */}
                              <p className="mt-4 text-[#7b6a52]">
                                A/N {gift.name}
                              </p>

                              {/* COPY BUTTON */}
                              <button
                                onClick={() => handleCopy(gift.number, gift.id)}
                                className="
                                  mt-8 flex w-full items-center justify-center gap-2
                                  rounded-full bg-[#9d7b46]
                                  px-6 py-3 text-white
                                  transition-all duration-300
                                  hover:scale-[1.02] hover:bg-[#86642f]
                                "
                              >
                                {copied === gift.id ? (
                                  <Check size={18} />
                                ) : (
                                  <Copy size={18} />
                                )}

                                {copied === gift.id ? "Tersalin" : "Copy"}
                              </button>
                            </motion.div>
                          ))}
                        </div>

                        {/* NAVIGATION */}
                        {GIFT_LIST.length > 3 && (
                          <div className="mt-8 flex items-center justify-center gap-4">

                            {/* LEFT */}
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={scrollLeft}
                              className="
                                flex h-14 w-14 items-center justify-center
                                rounded-full border border-[#d9c4a3]/40
                                bg-white/80 shadow-lg backdrop-blur
                                transition-all duration-300
                                hover:bg-[#9d7b46] hover:text-white
                              "
                            >
                              <ChevronLeft size={24} />
                            </motion.button>

                            {/* RIGHT */}
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={scrollRight}
                              className="
                                flex h-14 w-14 items-center justify-center
                                rounded-full border border-[#d9c4a3]/40
                                bg-white/80 shadow-lg backdrop-blur
                                transition-all duration-300
                                hover:bg-[#9d7b46] hover:text-white
                              "
                            >
                              <ChevronRight size={24} />
                            </motion.button>

                          </div>
                        )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* ================= UCAPAN & DOA ================= */}
            <section className="relative z-10 px-6 pt-24">
              <div className="mx-auto max-w-4xl">
                {/* TITLE */}
                <div className="text-center">
                  <p className="text-sm uppercase tracking-[5px] text-[#b28a4a]">
                    Wedding Wishes
                  </p>

                  <h2 className="mt-4 font-cormorant text-5xl text-[#9d7b46] md:text-6xl">
                    Ucapan & Doa
                  </h2>

                  <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#6b5b3e]">
                    Berikan ucapan terbaik dan doa restu untuk kedua mempelai.
                  </p>
                </div>

                {/* FORM */}
                <div className="mt-14 rounded-[40px] border border-[#d9c4a3]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-12">
                  <div className="grid gap-5">
                    {/* NAME */}
                    <div>
                      <label className="mb-3 block text-[11px] uppercase tracking-[4px] text-[#b28a4a]">
                        Nama
                      </label>

                      <input
                        type="text"
                        placeholder="Masukkan nama"
                        className="w-full rounded-2xl border border-[#e5d4b4] bg-white/70 px-5 py-4 text-[#6b5b3e] outline-none transition focus:border-[#b28a4a]"
                      />
                    </div>

                    {/* STATUS */}
                    <div>
                      <label className="mb-3 block text-[11px] uppercase tracking-[4px] text-[#b28a4a]">
                        Konfirmasi Kehadiran
                      </label>

                      <select className="w-full rounded-2xl border border-[#e5d4b4] bg-white/70 px-5 py-4 text-[#6b5b3e] outline-none transition focus:border-[#b28a4a]">
                        <option>Hadir</option>
                        <option>Masih Diusahakan</option>
                        <option>Tidak Hadir</option>
                      </select>
                    </div>

                    {/* MESSAGE */}
                    <div>
                      <label className="mb-3 block text-[11px] uppercase tracking-[4px] text-[#b28a4a]">
                        Ucapan & Doa
                      </label>

                      <textarea
                        rows={5}
                        placeholder="Tulis ucapan dan doa..."
                        className="w-full rounded-2xl border border-[#e5d4b4] bg-white/70 px-5 py-4 text-[#6b5b3e] outline-none transition focus:border-[#b28a4a]"
                      />
                    </div>

                    {/* BUTTON */}
                    <button className="mt-2 rounded-full bg-[#9d7b46] px-8 py-4 text-white transition hover:scale-[1.02] hover:bg-[#86642f]">
                      Kirim Ucapan
                    </button>
                  </div>
                </div>

                {/* LIST UCAPAN */}
                <div
                  className="
                    mt-12
                    max-h-[700px]
                    overflow-y-auto
                    rounded-[35px]
                    border border-[#d9c4a3]/20
                    bg-white/20
                    p-2
                    scrollbar-thin
                    scrollbar-thumb-[#d4b483]
                    scrollbar-track-transparent
                  "
                >
                  <div className="grid gap-5 pr-2">
                    {/* ITEM */}
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="rounded-[30px] border border-[#d9c4a3]/30 bg-white/80 p-6 shadow-lg backdrop-blur"
                    >
                      {/* HEADER */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-[#9d7b46]">
                            Putra Sangaji
                          </h3>

                          <div className="mt-2 flex items-center gap-3">
                            <p className="text-xs uppercase tracking-[3px] text-[#b28a4a]">
                              Hadir
                            </p>

                            {/* TIME */}
                            <span className="text-[11px] text-[#9f8b6d]">
                              • 19 Mei 2026, 10:45 WIB
                            </span>
                          </div>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f6efe4]">
                          <MessageCircleHeart
                            size={22}
                            className="text-[#b28a4a]"
                          />
                        </div>
                      </div>

                      {/* MESSAGE */}
                      <p className="mt-5 leading-8 text-[#6b5b3e]">
                        Selamat menempuh hidup baru untuk Erika dan
                        Yogi. Semoga menjadi keluarga yang sakinah,
                        mawaddah, warahmah dan selalu diberikan
                        kebahagiaan.
                      </p>
                    </motion.div>

                    {/* ITEM */}
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="rounded-[30px] border border-[#d9c4a3]/30 bg-white/80 p-6 shadow-lg backdrop-blur"
                    >
                      {/* HEADER */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-[#9d7b46]">
                            Amanda Putri
                          </h3>

                          <div className="mt-2 flex items-center gap-3">
                            <p className="text-xs uppercase tracking-[3px] text-[#b28a4a]">
                              Hadir
                            </p>

                            {/* TIME */}
                            <span className="text-[11px] text-[#9f8b6d]">
                              • 19 Mei 2026, 11:20 WIB
                            </span>
                          </div>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f6efe4]">
                          <MessageCircleHeart
                            size={22}
                            className="text-[#b28a4a]"
                          />
                        </div>
                      </div>

                      {/* MESSAGE */}
                      <p className="mt-5 leading-8 text-[#6b5b3e]">
                        Happy wedding! Semoga lancar sampai hari H dan
                        menjadi pasangan terbaik sampai selamanya 🤍
                      </p>
                    </motion.div>

                    {/* ITEM */}
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="rounded-[30px] border border-[#d9c4a3]/30 bg-white/80 p-6 shadow-lg backdrop-blur"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-[#9d7b46]">
                            Rizky Ramadhan
                          </h3>

                          <div className="mt-2 flex items-center gap-3">
                            <p className="text-xs uppercase tracking-[3px] text-[#b28a4a]">
                              Tidak Hadir
                            </p>

                            <span className="text-[11px] text-[#9f8b6d]">
                              • 19 Mei 2026, 12:15 WIB
                            </span>
                          </div>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f6efe4]">
                          <MessageCircleHeart
                            size={22}
                            className="text-[#b28a4a]"
                          />
                        </div>
                      </div>

                      <p className="mt-5 leading-8 text-[#6b5b3e]">
                        Mohon maaf belum bisa hadir, semoga acaranya
                        berjalan lancar dan menjadi keluarga yang penuh
                        cinta dan keberkahan.
                      </p>
                    </motion.div>

                    {/* ITEM */}
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="rounded-[30px] border border-[#d9c4a3]/30 bg-white/80 p-6 shadow-lg backdrop-blur"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-[#9d7b46]">
                            Nadia Aulia
                          </h3>

                          <div className="mt-2 flex items-center gap-3">
                            <p className="text-xs uppercase tracking-[3px] text-[#b28a4a]">
                              Hadir
                            </p>

                            <span className="text-[11px] text-[#9f8b6d]">
                              • 19 Mei 2026, 13:05 WIB
                            </span>
                          </div>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f6efe4]">
                          <MessageCircleHeart
                            size={22}
                            className="text-[#b28a4a]"
                          />
                        </div>
                      </div>

                      <p className="mt-5 leading-8 text-[#6b5b3e]">
                        MasyaAllah tabarakallah 🤍 Semoga pernikahannya
                        selalu dipenuhi cinta, rezeki, dan kebahagiaan.
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ================= MUSIC BUTTON ================= */}
      <AnimatePresence>
        {opened && !heroInView && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{
              duration: 0.35,
            }}
            onClick={toggleMusic}
            className="
              fixed
              cursor-pointer
              bottom-[110px]
              left-[calc(50%-150px)]
              z-[60]
              flex
              h-[38px]
              w-[38px]
              items-center
              justify-center
              rounded-full
              bg-[#a36d05]
              text-white
            "
          >
            <motion.div
              animate={
                isPlaying
                  ? { scale: [1, 1.08, 1] }
                  : { scale: 1 }
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              {isPlaying ? (
                <Pause
                  size={18}
                  fill="white"
                />
              ) : (
                <Play
                  size={18}
                  fill="white"
                  className="ml-[2px]"
                />
              )}
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ================= BOTTOM NAV ================= */}
      <AnimatePresence>
        {opened && !heroInView &&  (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          >
            <div className="flex items-center gap-8 rounded-full border border-white/20 bg-white/80 px-8 py-4 shadow-2xl backdrop-blur-xl">
              {/* HOME */}
              <button
                onClick={handleBackHome}
                className="flex flex-col cursor-pointer items-center text-[#9d7b46] transition hover:scale-110"
              >
                <Home size={22} />

                <span className="mt-1 text-[10px] tracking-[2px]">
                  HOME
                </span>
              </button>

              {/* COUPLE */}
              <button
                onClick={() =>
                  scrollToSection(coupleRef)
                }
                className="flex flex-col cursor-pointer items-center text-[#9d7b46] transition hover:scale-110"
              >
                <Heart size={22} />

                <span className="mt-1 text-[10px] tracking-[2px]">
                  COUPLE
                </span>
              </button>

              {/* GALLERY */}
              <button
                onClick={() =>
                  scrollToSection(galleryRef)
                }
                className="flex flex-col cursor-pointer items-center text-[#9d7b46] transition hover:scale-110"
              >
                <ImageIcon size={22} />

                <span className="mt-1 text-[10px] tracking-[2px]">
                  GALLERY
                </span>
              </button>

              {/* EVENT */}
              <button
                onClick={() =>
                  scrollToSection(eventRef)
                }
                className="flex flex-col cursor-pointer items-center text-[#9d7b46] transition hover:scale-110"
              >
                <Calendar size={22} />

                <span className="mt-1 text-[10px] tracking-[2px]">
                  EVENT
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}