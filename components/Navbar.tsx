
import React, { useState, useEffect, useRef } from 'react';

interface NavbarProps {
  onShowRankModal: () => void; // Keep for settings page access
  currentPage: string;
}

const NavLink: React.FC<{ href: string; currentPath: string; children: React.ReactNode; onClick?: () => void }> = ({ href, currentPath, children, onClick }) => {
  const isActive = href === `#${currentPath}` || (currentPath === '/' && href === '#/dashboard');
  return (
    <a
      href={href}
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                  ${isActive ? 'bg-sky-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                  md:ml-4`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  );
};


const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);


  const navItems = [
    { href: '#/dashboard', label: 'Dashboard' },
    { href: '#/quests', label: 'Quests' },
    { href: '#/field-ops', label: 'Field Ops' },
    { href: '#/stats-inventory', label: 'Stats & Inv.' },
    { href: '#/roadmap', label: 'Roadmap' },
    { href: '#/settings', label: 'Settings' },
  ];

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
        ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <nav className="bg-slate-850 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#/dashboard" className="font-bold text-xl text-sky-400">Project Ascend</a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {navItems.map(item => (
              <NavLink key={item.href} href={item.href} currentPath={currentPage}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              ref={buttonRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden" ref={menuRef}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
               <NavLink 
                  key={item.href} 
                  href={item.href} 
                  currentPath={currentPage} 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
