
import React from 'react';
import { Link } from 'react-router-dom';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/bca2590c-b286-4921-9c95-52a4a7306fcd.png" 
                alt="Labamu Manufacturing" 
                className="h-8 w-auto"
              />
              <span className="ml-3 text-xl font-medium text-gray-900">Labamu Manufacturing</span>
            </div>
            <nav className="ml-10 flex items-center space-x-4">
              <Link to="/public" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Products
              </Link>
              <Link to="/public/quote" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Request Quote
              </Link>
              <Link to="/" className="bg-primary text-white px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Labamu Manufacturing. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
