
import { Order } from "@/types/order";

// Parts Status constants
export type PartsStatus =
  | "Not booked"
  | "Not enough"
  | "Requested"
  | "Expected"
  | "Delayed"
  | "Received";

// Define transition events
export type PartsStatusEvent =
  | "PartsReserved"
  | "POCreated"
  | "DelaysOccur"
  | "OnTimeDelivery"
  | "InsufficientStock";

// Map valid transitions based on business rules
const partsStatusFlow: Record<
  PartsStatus,
  Partial<Record<PartsStatusEvent, PartsStatus>>
> = {
  "Not booked": {
    PartsReserved: "Requested",
    InsufficientStock: "Not enough",
  },
  "Requested": {
    POCreated: "Expected",
  },
  "Expected": {
    DelaysOccur: "Delayed",
    OnTimeDelivery: "Received",
  },
  "Delayed": {},
  "Received": {},
  "Not enough": {},
};

// Helper to get next status based on current status and event
export function getNextPartsStatus(
  currentStatus: PartsStatus,
  event: PartsStatusEvent
): PartsStatus | undefined {
  return partsStatusFlow[currentStatus]?.[event];
}

export const mockOrders: Order[] = [
  {
    number: "MO00199",
    groupName: "Food: Finished goods",
    partNo: "PFP_5L",
    partDescription: "Packaged Food Product, 5L Canister",
    quantity: "10 pcs",
    status: "Scheduled",
    partsStatus: "Not booked",
    partsStatusColor: "bg-red-100 text-red-500",
    statusColor: "text-orange-500",
    editable: true,
    checked: false,
  },
  {
    number: "MO00198",
    groupName: "Food: Finished goods",
    partNo: "PFP_5L",
    partDescription: "Packaged Food Product, 5L Canister",
    quantity: "200 pcs",
    status: "Scheduled",
    partsStatus: "Not enough",
    partsStatusColor: "bg-yellow-100 text-yellow-700",
    statusColor: "text-orange-500",
    editable: true,
    checked: false,
  },
  {
    number: "MO00197",
    groupName: "Food: Half-products",
    partNo: "BBFP",
    partDescription: "Base Bulk Food Product",
    quantity: "1000 kg",
    status: "Scheduled",
    partsStatus: "Requested",
    partsStatusColor: "bg-orange-100 text-orange-600",
    statusColor: "",
    editable: true,
    checked: false,
  },
  {
    number: "MO00196",
    groupName: "Mechanical: Finished goods",
    partNo: "FA",
    partDescription: "Final assembly",
    quantity: "10 pcs",
    status: "Scheduled",
    partsStatus: "Delayed",
    partsStatusColor: "bg-pink-100 text-pink-600",
    statusColor: "",
    editable: true,
    checked: false,
  },
  {
    number: "MO00195",
    groupName: "Food: Half-products",
    partNo: "BBFP",
    partDescription: "Base Bulk Food Product",
    quantity: "100 kg",
    status: "Done",
    partsStatus: "Expected",
    partsStatusColor: "bg-sky-100 text-sky-600",
    statusColor: "text-blue-800",
    editable: true,
    checked: false,
  },
  {
    number: "MO00192",
    groupName: "Tables: Finished goods",
    partNo: "WT",
    partDescription: "Wooden Table",
    quantity: "200 pcs",
    status: "Done",
    partsStatus: "Received",
    partsStatusColor: "bg-green-100 text-green-600",
    statusColor: "text-blue-800",
    editable: true,
    checked: true,
  },
  {
    number: "MO00191",
    groupName: "Tables: Finished goods",
    partNo: "WT",
    partDescription: "Wooden Table",
    quantity: "100 pcs",
    status: "Done",
    partsStatus: "Received",
    partsStatusColor: "bg-green-100 text-green-600",
    statusColor: "text-blue-800",
    editable: true,
    checked: true,
  },
];

export const columnHeaders = [
  { key: "number", label: "Number", className: "pl-4 w-24" },
  { key: "groupName", label: "Group name" },
  { key: "partNo", label: "Part No." },
  { key: "partDescription", label: "Part description" },
  { key: "quantity", label: "Quantity" },
  { key: "status", label: "Status" },
  { key: "partsStatus", label: "Parts status" },
  { key: "actions", label: "" },
  { key: "select", label: "", className: "pr-4 text-center w-8" },
];
