
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  Clipboard,
  CreditCard,
  FileBox,
  FileQuestion,
  FileText,
  Layers,
  Package2,
  Ruler,
  TruckIcon,
  User,
  Users,
} from "lucide-react";

const items = [
  {
    title: "Manufacturing",
    links: [
      { href: "/orders", label: "Orders", icon: Package2 },
      { href: "/recipes", label: "Bill of Materials", icon: Ruler },
      { href: "/shipments", label: "Shipments", icon: TruckIcon },
    ],
  },
  {
    title: "Sales",
    links: [
      { href: "/quotes", label: "Quotes", icon: FileText },
      { href: "/rfqs", label: "RFQs", icon: FileQuestion },
      { href: "/invoices", label: "Invoices", icon: CreditCard },
    ],
  },
  {
    title: "Inventory",
    links: [{ href: "/resources", label: "Resources", icon: Layers }],
  },
  {
    title: "Products",
    links: [
      { href: "/products", label: "Products", icon: Package2 },
    ],
  },
  {
    title: "Administration",
    links: [
      { href: "/user-management", label: "User Management", icon: Users },
    ],
  },
];

export function Sidebar() {
  return (
    <div className="grid gap-2 text-sm">
      {items.map((item, i) => (
        <div key={i} className="grid gap-1">
          <h3 className="text-xs font-medium text-muted-foreground px-2 py-1">
            {item.title}
          </h3>
          <div className="grid grid-flow-row auto-rows-max gap-0.5">
            {item.links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted",
                    isActive ? "bg-muted font-medium text-foreground" : "text-muted-foreground"
                  )
                }
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
