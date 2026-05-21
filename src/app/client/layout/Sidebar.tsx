"use client";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, CheckCircle2, Wallet, MessageSquare, LogOut, X, Mail } from 'lucide-react';
import Cookies from 'js-cookie';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { href: '/client/dashboard', label: 'Rencana Saya', icon: <Heart size={20}/> },
    { href: '/client/plan', label: 'Checklist', icon: <CheckCircle2 size={20}/> },
    { href: '/client/budget', label: 'Anggaran', icon: <Wallet size={20}/> },
    { href: '/client/invitation', label: 'Undangan Digital', icon: <Mail size={20}/> },
    // { href: '/client/chat', label: 'Chat Vendor', icon: <MessageSquare size={20}/> },
  ];

  const handleLogout = () => {
    setTimeout(() => {
        Cookies.remove('auth');
        router.push('/auth');
    }, 500);
  };

  // Fungsi pengecekan keaktifan menu secara dinamis
  const isItemActive = (itemHref: string) => {
    if (itemHref === '/client/dashboard') {
      return pathname === itemHref;
    }
    return pathname.startsWith(itemHref);
  };

  return (
    <>
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-pink-100 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:block
      `}>
        <div className="h-full flex flex-col">
          <div className="px-6 py-8 border-b border-pink-50 flex justify-between items-center">
            <span className="text-2xl font-serif font-bold text-pink-500">OurWedding</span>
            <button onClick={onClose} className="lg:hidden text-pink-300">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <NavItem 
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={isItemActive(item.href)}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-pink-50">
            <button 
              onClick={handleLogout} 
              className="flex items-center w-full px-4 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors group"
            >
              <LogOut size={18} className="mr-3 group-hover:-translate-x-1 transition-transform" /> 
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div className="fixed inset-0 bg-rose-900/20 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}
    </>
  );
}

function NavItem({ icon, label, href, active }: { icon: React.ReactNode; label: string; href: string; active: boolean }) {
  return (
    <Link href={href} className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all ${
      active 
        ? 'bg-pink-500 text-white shadow-md shadow-pink-200' 
        : 'text-gray-500 hover:bg-pink-50 hover:text-pink-600'
    }`}>
      <span className="mr-3">{icon}</span> {label}
    </Link>
  );
}