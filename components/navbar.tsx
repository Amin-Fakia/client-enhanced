
'use client'
import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from "@nextui-org/navbar";
import { useState } from 'react';
import Link from "next/link";

export const NavBar = () => {
  const [activeItem, setActiveItem] = useState('/mitarbeiter');
 
  return (
   <>
   <Navbar  classNames={{
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
          "data-[active=true]:after:bg-primary",
        ],
      }}>
    <NavbarContent className="w-full hidden sm:flex gap-5" justify="center">
        <NavbarItem  isActive={activeItem === '/events'}> 
          <Link color="foreground" href="/events"  onClick={() => setActiveItem('/events')}>
            Events
          </Link>
        </NavbarItem>
        <NavbarItem isActive={activeItem === '/mitarbeiter'}>
          <Link aria-current="page" href="/mitarbeiter" onClick={() => setActiveItem('/mitarbeiter')}>
            Mitarbeiter
          </Link>
        </NavbarItem>
        <NavbarItem isActive={activeItem === '/objects'}>
          <Link color="foreground" href="/objects" onClick={() => setActiveItem('/objects')}>
            Gegenstände
          </Link>
        </NavbarItem>
      </NavbarContent>

   </Navbar>
   
   </>
  );
};
