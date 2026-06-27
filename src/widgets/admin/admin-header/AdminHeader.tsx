"use client";

import { useState } from "react";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-3 sm:h-16 sm:px-6">
      {/* Left side */}
      <div className="flex items-center gap-2">
        {/* Hamburger — mobile only */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>

        {/* Search */}
        <div className="hidden items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 sm:flex">
          <SearchIcon />
          <input
            type="text"
            placeholder="Type to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-40 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 md:w-64"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile search button */}
        <button type="button" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 sm:hidden">
          <SearchIcon />
        </button>

        <button type="button" className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <BellIcon />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="hidden h-8 w-px bg-gray-200 sm:block" />

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-gray-800">Admin</p>
            <p className="text-[11px] text-gray-400">Super Admin</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600 sm:h-9 sm:w-9 sm:text-sm">
            A
          </div>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
