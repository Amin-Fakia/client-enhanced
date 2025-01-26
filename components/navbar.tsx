'use client';

import { Navbar, NavbarContent, NavbarItem, Link } from "@nextui-org/react";
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  return (
    <Navbar
      isBordered
      variant="sticky"
      className="bg-gray-900 shadow-md"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-blue-500",
        ],
      }}
    >
      <NavbarContent justify="center" className="space-x-6">
        <NavLink
          href="/"
          active={activeItem === '/'}
          label="Home"
          onClick={() => router.push('/')}
        />
        <NavLink
          href="/events"
          active={activeItem === '/events'}
          label="Events"
          onClick={() => router.push('/events')}
        />
        <NavLink
          href="/objects"
          active={activeItem === '/objects'}
          label="Equipments"
          onClick={() => router.push('/objects')}
        />
        <NavLink
          href="/mitarbeiter"
          active={activeItem === '/mitarbeiter'}
          label="Mitarbeiter"
          onClick={() => router.push('/mitarbeiter')}
        />
      </NavbarContent>
    </Navbar>
  );
};

// Reusable NavLink Component
const NavLink = ({ href, active, label, onClick }) => {
  return (
    <NavbarItem
      isActive={active}
      className={`text-sm font-medium transition-colors px-3 py-2 ${
        active ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'
      }`}
      onClick={onClick}
    >
      <Link href={href}>{label}</Link>
    </NavbarItem>
  );
};
