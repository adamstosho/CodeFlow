import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Code, LogOut, User, History } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">CodeFlow</span>
          </Link>

          {/* Hamburger for mobile */}
          {user && (
            <button
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}

          {/* Desktop nav */}
          {user && (
            <nav className="hidden md:flex items-center space-x-4">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <History className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/convert"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/convert')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Code className="h-4 w-4" />
                <span>Convert</span>
              </Link>

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                {/* <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div> */}
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          )}
        </div>
        {/* Mobile nav menu */}
        {user && (
          <div
            className={`md:hidden transition-all duration-200 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} bg-white border-b border-gray-200 shadow-sm`}
          >
            <nav className="flex flex-col space-y-1 py-2 px-2">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <History className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/convert"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/convert')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Code className="h-4 w-4" />
                <span>Convert</span>
              </Link>
              <div className="flex items-center space-x-2 px-3 py-2 mt-2 border-t border-gray-100">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); }}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;