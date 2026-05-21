"use client";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20}/> },
    { href: '/admin/plan', label: 'Clients', icon: <Users size={20}/> },
    { href: '/admin/calendar', label: 'Events', icon: <Calendar size={20}/> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings size={20}/> },
  ];

  const handleLogout = () => {
     setTimeout(() => {
        Cookies.remove('auth');
        router.push('/auth');
    }, 500);
  };


  return (
    <>
      <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:static lg:block
        `}>
            <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
                <span className="text-xl font-bold text-pink-600 tracking-tight">Wedding.IO</span>
                <button onClick={onClose} className="lg:hidden text-gray-500">
                <X size={24} />
                </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {menuItems.map((item) => (
              <NavItem 
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href}
              />
            ))}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-gray-100">
                <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                <LogOut size={20} className="mr-3" />
                Keluar
                </button>
            </div>
            </div>
        </aside>
    </>
  );
}

function NavItem({ icon, label, href, active }: { icon: React.ReactNode; label: string; href: string; active: boolean }) {
  return (
    <Link href={href} className={
    `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all 
    ${active ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
    `}>
      <span className="mr-3">{icon}</span> {label}
    </Link>
  );
}