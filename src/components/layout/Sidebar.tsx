
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  FileText,
  ShoppingCart,
  Factory,
  TruckIcon,
  BarChart2,
  Receipt,
  Users,
  Settings,
  Globe
} from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  // Menu structure with categories
  const menuCategories = [
    {
      name: '',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> }
      ]
    },
    {
      name: 'PRODUCTS',
      items: [
        { name: 'Products', path: '/products', icon: <Package size={18} /> }
      ]
    },
    {
      name: 'SALES',
      items: [
        { name: 'Quotes', path: '/quotes', icon: <FileText size={18} /> },
        { name: 'RFQs', path: '/rfqs', icon: <ClipboardList size={18} /> },
        { name: 'Invoices', path: '/invoices', icon: <Receipt size={18} /> }
      ]
    },
    {
      name: 'MANUFACTURING',
      items: [
        { name: 'Work Orders', path: '/orders', icon: <ShoppingCart size={18} /> },
        { name: 'Bill of Materials', path: '/recipes', icon: <ClipboardList size={18} /> },
        { name: 'Orders', path: '/shipments', icon: <TruckIcon size={18} /> }
      ]
    },
    {
      name: 'INVENTORY',
      items: [
        { name: 'Resources', path: '/resources', icon: <Factory size={18} /> }
      ]
    },
    {
      name: 'ANALYTICS',
      items: [
        { name: 'Reports & Analytics', path: '/reporting', icon: <BarChart2 size={18} /> }
      ]
    },
    {
      name: 'ADMINISTRATION',
      items: [
        { name: 'User Management', path: '/user-management', icon: <Users size={18} /> },
        { name: 'FX Management', path: '/fx-management', icon: <Settings size={18} /> },
        { name: 'Public Site Config', path: '/public-site-config', icon: <Settings size={18} /> },
        { name: 'Public Storefront', path: '/public', icon: <Globe size={18} /> }
      ]
    }
  ];

  return (
    <aside className="flex flex-col h-full bg-white border-r w-64 shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Labamu MRP</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {menuCategories.map((category, index) => (
          <div key={index} className="mb-4">
            {category.name && (
              <h3 className="text-xs font-medium text-gray-500 text-left pl-3">{category.name}</h3>
            )}
            <ul className="space-y-1 mt-1">
              {category.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm ${
                      isActive(item.path)
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};
