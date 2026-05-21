"use client";
import { useParams } from 'next/navigation';
import PlansSharedPage from '../../../../shared/client/plans-shared/page'; // Path shared component Anda
import { TaskData } from '@/models/task';

export default function EditTaskPage() {
  const params = useParams();
  
  // 1. Ambil ID dari URL dan konversi menjadi angka (Number) agar sinkron dengan tipe data backend/model
  const idParam = params?.id;
  const taskId = idParam ? Number(idParam) : 0; 

  // 2. Buat objek data lama dengan tipe data ID yang sudah valid
  const dataPlanLama: TaskData = {
    id: taskId, 
    task_name: "Fitting Kebaya Resepsi",
    category: "Pakaian",
    deadline: "2026-08-20", // Format YYYY-MM-DD sudah pas untuk input type="date"
    notes: "Konten vendor: Sanggar Busana Fitri (0812345678)"
  };

  // 3. Kirim data langsung ke prop initialData
  return <PlansSharedPage initialData={dataPlanLama} />;
}