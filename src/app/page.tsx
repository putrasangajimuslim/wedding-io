import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/auth');
  
  // Baris ini tidak akan pernah dieksekusi
  return null;
}