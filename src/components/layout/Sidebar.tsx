import React, { useState } from "react";
import {
  Package2Icon,
  DollarSignIcon,
  Factory,
  PackageIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to?: string;
  expanded: boolean;
  dropdown?: { label: string; to: string }[];
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  to,
  expanded,
  dropdown,
}) => {
  const location = useLocation();
  const isActive = to ? location.pathname === to : false;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <li>
      {to ? (
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
      ) : (
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-between w-full gap-3 py-2 px-3 rounded-md transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground"
        >
          <div className="flex items-center gap-3">
            {icon}
            {expanded && <span>{label}</span>}
          </div>
          {expanded && (
            <span>{isDropdownOpen ? <ChevronLeft /> : <ChevronRight />}</span>
          )}
        </button>
      )}

      {dropdown && expanded && isDropdownOpen && (
        <ul className="ml-4 space-y-1">
          {dropdown.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 py-2 px-3 rounded-md transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground ml-2",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
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

        <div className="flex-1 overflow-y-auto py-2 space-y-1">
          {/* Products */}
          <SidebarItem
            icon={<Package2Icon />}
            label="Products"
            to="/products"
            expanded={expanded}
            dropdown={[
              { label: "Catalog", to: "/products" },
              { label: "Categories", to: "/product-categories" },
            ]}
          />

          {/* Sales */}
          <SidebarItem
            icon={<DollarSignIcon />}
            label="Sales"
            expanded={expanded}
            dropdown={[
              { label: "RFQs", to: "/rfqs" },
              { label: "Quotes", to: "/quotes" },
              { label: "Orders", to: "/orders" },
              { label: "Invoices", to: "/invoices" },
            ]}
          />

          {/* Manufacturing */}
          <SidebarItem
            icon={<Factory />}
            label="Manufacturing"
            expanded={expanded}
            dropdown={[
              { label: "Recipes", to: "/recipes" },
              { label: "Resources", to: "/resources" },
            ]}
          />

          {/* Inventory */}
          <SidebarItem
            icon={<PackageIcon />}
            label="Inventory"
            expanded={expanded}
            dropdown={[
              { label: "Shipments", to: "/shipments" },
            ]}
          />

          {/* Administration */}
          <SidebarItem
            icon={<Settings />}
            label="Administration"
            expanded={expanded}
            dropdown={[
              { label: "User Management", to: "/user-management" },
              { label: "Public Site Config", to: "/public-site-config" },
            ]}
          />
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
