'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isErasmusOpen, setIsErasmusOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAdmin(Boolean(token));
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Team', href: '/team' },
    {
      name: 'Erasmus+',
      href: '/projects',
      children: [
        { name: 'KA1 Projects', href: '/projects/k1' },
        { name: 'KA2 Projects', href: '/projects/k2' },
      ]
    },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/logo.png"
                alt="Kaizen Logo"
                width={50}
                height={50}
                className="w-12 h-12 object-contain"
              />
              <span className="text-sm font-bold text-gray-800 leading-tight"></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              item.children ? (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 inline-flex items-center gap-1"
                  >
                    {item.name}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
              )
            ))}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors duration-200"
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                item.children ? (
                  <div key={item.name} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setIsErasmusOpen(!isErasmusOpen)}
                      className="w-full flex items-center justify-between text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    >
                      <span>{item.name}</span>
                      <svg className={`w-4 h-4 transition-transform ${isErasmusOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isErasmusOpen && (
                      <div className="pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-md transition-colors duration-200"
                            onClick={() => {
                              setIsMenuOpen(false);
                              setIsErasmusOpen(false);
                            }}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="bg-red-600 text-white block px-3 py-2 rounded-md text-base font-semibold hover:bg-red-700 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
