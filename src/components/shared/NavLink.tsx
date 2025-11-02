// src/components/shared/NavLink.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, className, onClick }) => {
  const location = useLocation();
  const path = to.startsWith('/#') ? to.substring(2) : '';
  const isHome = location.pathname === '/';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick();
    }

   if (isHome && path) {
      e.preventDefault(); 
      const element = document.getElementById(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <Link 
      to={to}
      className={className} 
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;