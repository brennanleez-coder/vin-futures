'use client'
import React from 'react';
import { Grape, Home, Wine, User } from "lucide-react";
import Link from "next/link";
import { useGlobalContext } from '@/context/GlobalContext';

const navItems = [
  {
    link: "/",
    icon: <Home className="h-5 w-5 mr-3 text-blue-600" />,
    title: "Home",
    requiresAuth: false
  },
  {
    link: "/portfolio",
    icon: <Grape className="h-5 w-5 mr-3 text-blue-600" />,
    title: "Portfolio",
    requiresAuth: true
  },
  {
    link: "/profile",
    icon: <User className="h-5 w-5 mr-3 text-blue-600" />,
    title: "Profile",
    requiresAuth: true
  }
];

const LeftSideNavBar = () => {
  const { user } = useGlobalContext();

  return (
    <>
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Wine className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-800">Vin Futures</span>
        </div>
        <nav className="mt-6">
          {navItems
            .filter((item) => (item.requiresAuth ? user : true)) // Show item if requiresAuth is false or user is logged in
            .map((item, index) => (
              <Link key={index} href={item.link} className="flex items-center px-6 py-2 text-gray-700 hover:bg-blue-50">
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
        </nav>
      </aside>
    </>
  );
};

export default LeftSideNavBar;
