'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaBus, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '@/lib/auth';

export default function Header({ userType = 'student' }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const handle_logout = () => {
    logout();
  };

  const studentLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: FaBus },
    { href: '/book-ticket', label: 'Book Ticket', icon: FaBus },
    { href: '/my-ticket', label: 'My Ticket', icon: FaUser },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: FaBus },
    { href: '/admin/approvals', label: 'Approvals', icon: FaUser },
    { href: '/admin/announce-bus', label: 'Announce Bus', icon: FaBus },
    { href: '/admin/buses', label: 'Buses', icon: FaBus },
  ];

  const links = userType === 'admin' ? adminLinks : studentLinks;

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={userType === 'admin' ? '/admin' : '/dashboard'} className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
            <FaBus className="text-2xl" />
            <span className="text-xl font-bold">BusQueue</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-white text-blue-600 font-semibold'
                      : 'text-white hover:bg-blue-700'
                  }`}
                >
                  <Icon className="text-sm" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={handle_logout}
              className="text-white hover:text-blue-200 transition-colors"
              title="Logout"
            >
              <FaSignOutAlt className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <nav className="md:hidden bg-blue-700 px-4 py-2">
        <div className="flex space-x-2 overflow-x-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-blue-600 font-semibold'
                    : 'text-white hover:bg-blue-600'
                }`}
              >
                <Icon className="text-xs" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
