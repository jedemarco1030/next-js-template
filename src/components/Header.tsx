import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

function Header() {
  const { toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: { target: any; }) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg">My Site</h1>
        <div ref={menuRef}>
          <button
            className="md:hidden block"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            Menu
          </button>
          <nav>
            <ul className={`md:flex md:space-x-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
        </div>
        <button onClick={toggleTheme} className="bg-gray-200 text-gray-800 px-3 py-1 rounded">
          Toggle Theme
        </button>
      </div>
    </header>
  );
}

export default Header;

