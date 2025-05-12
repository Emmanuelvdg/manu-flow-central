
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Box,
  FileText,
  FileQuestion,
  CreditCard,
  Package2,
  Ruler,
  TruckIcon,
  Layers,
  Users,
} from "lucide-react";

const items = [
  {
    title: "PRODUCTS",
    links: [
      { href: "/products", label: "Products", icon: Box },
    ],
  },
  {
    title: "SALES",
    links: [
      { href: "/quotes", label: "Quotes", icon: FileText },
      { href: "/rfqs", label: "RFQs", icon: FileQuestion },
      { href: "/invoices", label: "Invoices", icon: CreditCard },
    ],
  },
  {
    title: "MANUFACTURING",
    links: [
      { href: "/orders", label: "Orders", icon: Package2 },
      { href: "/recipes", label: "Bill of Materials", icon: Ruler },
      { href: "/shipments", label: "Shipments", icon: TruckIcon },
    ],
  },
  {
    title: "INVENTORY",
    links: [
      { href: "/resources", label: "Resources", icon: Layers },
    ],
  },
  {
    title: "ADMINISTRATION",
    links: [
      { href: "/user-management", label: "User Management", icon: Users },
    ],
  },
];

export function Sidebar() {
  return (
    <div className="h-full w-64 overflow-y-auto bg-white border-r border-gray-200 py-4">
      <div className="px-3 mb-2">
        <div className="font-medium text-lg text-gray-800 px-2">
          Labamu Manufacturing
        </div>
      </div>
      <div className="space-y-4 px-3">
        {items.map((item, i) => (
          <div key={i} className="space-y-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-1">
              {item.title}
            </h3>
            <div className="space-y-1">
              {item.links.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive 
                        ? "bg-gray-100 text-primary font-medium" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )
                  }
                >
                  <link.icon className="h-4 w-4 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
