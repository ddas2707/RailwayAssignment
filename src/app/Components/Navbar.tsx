"use client";
import Image from "next/image";
import React from "react";
import { FaSearch } from "react-icons/fa";

const Navbar: React.FC = () => {
  return (
    <>
      <nav className="bg-blue-500 p-4 flex items-center justify-between text-white fixed top-0 left-0 w-full z-50">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image src="/icon.webp" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-semibold">Railway Id Card</span>
        </div>
        <div>
          <button
            aria-label="Help"
            className="p-2 rounded-full hover:bg-blue-600 transition"
          >
            Help
          </button>
        </div>
      </nav>
      {/* Scrolling Text */}
      <div className="relative mt-16 bg-black text-white fixed pb-7 pt-4 overflow-hidden">
        <div className="absolute whitespace-nowrap animate-marquee">
          <p className="text-center text-lg font-semibold">
            Enter  the  details  in  the  form  and  verify  your  Number
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
