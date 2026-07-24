'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Dumbbell, Image as ImageIcon, Star, LogOut, Loader2, MessageSquare, Settings, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Simple client-side auth check
  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsChecking(false);
      return;
    }

    // Check if cookie exists. Note: document.cookie might not show httpOnly cookies.
    // Instead we rely on an API call to test if we are logged in, or just let API calls fail.
    // Let's do a quick check via an API that requires auth.
    fetch('/api/admin/check-auth')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        setIsChecking(false);
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#040404] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard / Leads', icon: MessageSquare, path: '/admin' },
    { name: 'Gym Settings', icon: Settings, path: '/admin/settings' },
    { name: 'Memberships', icon: Dumbbell, path: '/admin/memberships' },
    { name: 'Trainers', icon: Users, path: '/admin/trainers' },
    { name: 'Media / Hero', icon: ImageIcon, path: '/admin/media' },
    { name: 'Reviews', icon: Star, path: '/admin/reviews' },
  ];

  return (
    <div className="min-h-screen bg-[#040404] text-white flex font-sans">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a] border-b border-white/10 z-20 flex items-center justify-between px-4">
        <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-amber-500">
          Power House
        </h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-white">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 z-10" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col fixed h-full z-30 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 top-0 left-0`}>
        <div className="p-6 border-b border-white/10 hidden md:block">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-amber-500">
            Power House <span className="text-white">Admin</span>
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-16 md:mt-0">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                  isActive 
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen bg-[#040404] pt-20 md:pt-8 w-full">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
