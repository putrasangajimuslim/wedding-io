"use client";
import { useParams } from 'next/navigation';
import PlansSharedPage from '../../../../shared/client/plans-shared/page'; // Path shared component Anda
import { TaskData } from '@/models/task';

export default function EditTaskPage() {
  const params = useParams();
  const id = params?.id; // Mengambil ID dari URL parameter [id]

  // Karena data statis, langsung buat objeknya di sini tanpa useState & useEffect
  const dataPlanLama: TaskData = {
    id: (id as string) || "123", // Menggunakan ID dari URL, cadangan ke "123" jika kosong
    title: "Fitting Kebaya Resepsi",
    category: "Pakaian",
    deadline: "2026-08-20",
    notes: "Konten vendor: Sanggar Busana Fitri (0812345678)"
  };

  // Kirim data langsung ke prop initialData
  return <PlansSharedPage initialData={dataPlanLama} />;
}