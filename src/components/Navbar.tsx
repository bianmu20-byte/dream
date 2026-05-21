import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Home, Package } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Navbar() {
  const { cart, user } = useAppContext();
  const location = useLocation();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const links = [
    { name: '市集', path: '/', icon: Home },
    { name: '购物车', path: '/cart', icon: ShoppingBag, badge: cartItemCount },
    { name: '我的', path: '/profile', icon: UserIcon },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/30 border-b border-white/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-youth-primary flex items-center justify-center text-white overflow-hidden group-hover:scale-105 transition-transform">
              <Package size={18} />
            </div>
            <span className="font-serif font-bold text-lg text-youth-heading tracking-wide italic">
              售卖青春.
            </span>
          </Link>

          <div className="flex space-x-1 sm:space-x-4">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors uppercase tracking-widest",
                    isActive ? "text-youth-primary" : "text-youth-text opacity-70 hover:opacity-100 hover:text-youth-primary"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 border-b-2 border-youth-primary rounded-none -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={18} />
                  <span className="hidden sm:inline">{link.name}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="absolute top-1 right-1 sm:-top-1 sm:-right-2 bg-youth-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
