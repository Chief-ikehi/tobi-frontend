"use client";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State to manage mobile menu
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push('/auth/signin');
    };

  // Ensures component is mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handles scroll event to add/remove classes
  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // If the component is not mounted, prevent rendering
  if (!mounted) {
    return null;
  }

  // Toggle the mobile menu visibility
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav id="header" className={`fixed w-full z-30 top-0 bg-white shadow ${scrolling ? 'bg-white shadow' : ''} text-white`}>
      <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
        {/* Logo Section */}
        <div className="pl-4 flex items-center">
          <Link href="/" aria-label="TobiFrontend Logo" className="text-decoration-none">
            <img
              src="https://i.ibb.co/kgb8ngMP/Logo.png"
              alt="TobiFrontend Logo"
              className="w-20 h-auto rounded-full transition-transform duration-300 ease-in-out hover:scale-110"
            />
          </Link>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="block lg:hidden pr-4">
          <button
            id="nav-toggle"
            onClick={toggleMenu}  // Toggle menu visibility on click
            className="flex items-center p-1 text-pink-800 hover:text-gray-900 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            <svg
              className="fill-current h-6 w-6"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div
          className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden mt-2 lg:mt-0 bg-white lg:bg-transparent text-black p-4 lg:p-0 z-20"
          id="nav-content"
        >

          <ul className="list-reset lg:flex justify-end flex-1 items-center">
            <li className="mr-3">
              <Link className="inline-block text-black no-underline hover:text-gray-800 hover:underline py-2 px-4" href="/">
                Dashboard
              </Link>
            </li>
            <li className="mr-3">
              <Link className="inline-block text-black no-underline hover:text-gray-800 hover:underline py-2 px-4" href="#">
                Bookings
              </Link>
            </li>
            <li className="mr-3">
              <Link className="inline-block text-black no-underline hover:text-gray-800 hover:underline py-2 px-4" href="#">
                Favorites
              </Link>
            </li>
            <li className="mr-3">
              <Link className="inline-block text-black no-underline hover:text-gray-800 hover:underline py-2 px-4" href="#">
                Settings
              </Link>
            </li>
            <li className="mr-3"></li>
            <li className="mr-3"></li>
            <li className="mr-3"></li>
            <li className="mr-3"></li>
            <li className="mr-3"></li>
          </ul>

          {/* Auth Buttons */}
          <button onClick={handleGoToDashboard} className="bg-white text-gray-800 font-bold rounded-full py-2 px-6 shadow-md hover:bg-gray-100 transform transition hover:scale-105 duration-300 ease-in-out">
            Sign In
          </button>
          <button className="bg-black text-white font-bold rounded-full py-2 px-6 shadow-md hover:bg-blue-900 transform transition hover:scale-105 duration-300 ease-in-out">
            <Link href="/dashboard">Register</Link>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`w-full flex-grow lg:hidden bg-white text-black p-4 lg:p-0 z-20 ${menuOpen ? 'block' : 'hidden'}`}>
          <ul className="space-y-4">
          <li><Link href="/" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
          <li><Link href="/" onClick={() => setMenuOpen(false)}>Bookings</Link></li>
          <li><Link href="/" onClick={() => setMenuOpen(false)}>Favorites</Link></li>
          <li><Link href="/" onClick={() => setMenuOpen(false)}>Settings</Link></li>
        </ul>

          {/* Auth Buttons for Mobile */}
          <button onClick={() => setMenuOpen(false)} className="mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full mt-4 lg:mt-0 py-4 px-8 shadow opacity-75 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
            <Link href="/">Sign In</Link>
          </button>
          <button onClick={() => setMenuOpen(false)} className="mx-auto lg:mx-0 hover:underline bg-black text-white font-bold rounded-full mt-4 lg:mt-0 py-4 px-8 shadow opacity-75 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
            <Link href="/">Register</Link>
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-b border-gray-100 opacity-25 my-0 py-0" />
    </nav>
  );
}
