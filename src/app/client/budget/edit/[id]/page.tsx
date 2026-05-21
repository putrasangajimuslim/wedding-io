"use client";
import { useParams } from 'next/navigation';

export default function EditBudgetPage() {
  const params = useParams();
  const id = params?.id; // Mengambil ID dari URL parameter [id]
}