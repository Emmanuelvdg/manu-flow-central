
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  FileText, 
  ClipboardList, 
  ShoppingCart, 
  Receipt,
  FlaskConical,
  Warehouse,
  Home
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'RFQs', href: '/rfqs', icon: FileText },
    { name: 'Quotes', href: '/quotes', icon: ClipboardList },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Invoices', href: '/invoices', icon: Receipt },
    { name: 'Recipes', href: '/recipes', icon: FlaskConical },
    { name: 'Resources', href: '/resources', icon: Warehouse },
  ];

  return (
    <div className={`${open ? 'fixed inset-0 z-40 md:relative md:inset-auto' : 'hidden'} flex-shrink-0 bg-sidebar border-r md:block`}>
      <div className="h-full flex flex-col w-64">
        <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-primary bg-opacity-10">
          <div className="flex items-center">
            <span className="text-xl font-bold text-primary">MMRP System</span>
          </div>
          <button 
            type="button" 
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 flex flex-col overflow-y-auto py-4">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-primary hover:bg-opacity-10'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary'
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
