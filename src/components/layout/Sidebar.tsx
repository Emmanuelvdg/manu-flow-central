
import React, { useState } from "react";
import {
  Package2Icon,
  DollarSignIcon,
  Factory,
  PackageIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText,
  ClipboardList,
  Receipt,
  Truck,
  Layers,
  Users,
  Cog,
  BarChart3,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  expanded: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  to,
  expanded,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 py-2 px-3 rounded-md transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground"
          )
        }
      >
        {icon}
        {expanded && <span>{label}</span>}
      </NavLink>
    </li>
  );
};

interface SidebarCategoryProps {
  title: string;
  expanded: boolean;
  children: React.ReactNode;
}

const SidebarCategory: React.FC<SidebarCategoryProps> = ({ title, expanded, children }) => {
  return (
    <div className="mb-4">
      {expanded && (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-1">
          {title}
        </div>
      )}
      <ul className="space-y-1">{children}</ul>
    </div>
  );
};

export const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <aside
      className={`${expanded ? "w-64" : "w-[70px]"} bg-sidebar border-r border-border h-screen transition-all duration-300 ease-in-out relative`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between py-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/lovable-uploads/bca2590c-b286-4921-9c95-52a4a7306fcd.png"
              alt="Labamu Manufacturing"
              className="h-8 w-auto"
            />
            {expanded && (
              <span className="text-lg font-bold text-sidebar-foreground">
                Labamu
              </span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2">
          {/* Products Category */}
          <SidebarCategory title="Products" expanded={expanded}>
            <SidebarItem 
              icon={<Package2Icon className="h-5 w-5" />} 
              label="Products" 
              to="/products" 
              expanded={expanded} 
            />
          </SidebarCategory>

          {/* Sales Category */}
          <SidebarCategory title="Sales" expanded={expanded}>
            <SidebarItem 
              icon={<FileText className="h-5 w-5" />} 
              label="Quotes" 
              to="/quotes" 
              expanded={expanded} 
            />
            <SidebarItem 
              icon={<ClipboardList className="h-5 w-5" />} 
              label="RFQs" 
              to="/rfqs" 
              expanded={expanded} 
            />
            <SidebarItem 
              icon={<Receipt className="h-5 w-5" />} 
              label="Invoices" 
              to="/invoices" 
              expanded={expanded} 
            />
          </SidebarCategory>

          {/* Manufacturing Category */}
          <SidebarCategory title="Manufacturing" expanded={expanded}>
            <SidebarItem 
              icon={<PackageIcon className="h-5 w-5" />} 
              label="Orders" 
              to="/orders" 
              expanded={expanded} 
            />
            <SidebarItem 
              icon={<Layers className="h-5 w-5" />} 
              label="Bill of Materials" 
              to="/recipes" 
              expanded={expanded} 
            />
            <SidebarItem 
              icon={<Truck className="h-5 w-5" />} 
              label="Shipments" 
              to="/shipments" 
              expanded={expanded} 
            />
          </SidebarCategory>

          {/* Inventory Category */}
          <SidebarCategory title="Inventory" expanded={expanded}>
            <SidebarItem 
              icon={<PackageIcon className="h-5 w-5" />} 
              label="Resources" 
              to="/resources" 
              expanded={expanded} 
            />
          </SidebarCategory>

          {/* Analytics Category - New! */}
          <SidebarCategory title="Analytics" expanded={expanded}>
            <SidebarItem 
              icon={<BarChart3 className="h-5 w-5" />} 
              label="Reports & Analytics" 
              to="/reporting" 
              expanded={expanded} 
            />
          </SidebarCategory>

          {/* Administration Category */}
          <SidebarCategory title="Administration" expanded={expanded}>
            <SidebarItem 
              icon={<Users className="h-5 w-5" />} 
              label="User Management" 
              to="/user-management" 
              expanded={expanded} 
            />
            <SidebarItem 
              icon={<Cog className="h-5 w-5" />} 
              label="Public Site Config" 
              to="/public-site-config" 
              expanded={expanded} 
            />
          </SidebarCategory>
        </div>

        <div className="py-3 px-4 mt-auto border-t border-border">
          <p className="text-sm text-sidebar-foreground">
            Logged in as: <span className="font-semibold">Admin</span>
          </p>
          <Link
            to="/logout"
            className="text-sm text-primary hover:underline block mt-1"
          >
            Logout
          </Link>
        </div>
      </div>
    </aside>
  );
};
