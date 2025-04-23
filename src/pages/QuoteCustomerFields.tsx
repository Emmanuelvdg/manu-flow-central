
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface QuoteCustomerFieldsProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  locationField: string;
  setLocationField: (location: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

export const QuoteCustomerFields: React.FC<QuoteCustomerFieldsProps> = ({
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
  customerPhone,
  setCustomerPhone,
  companyName,
  setCompanyName,
  locationField,
  setLocationField,
  notes,
  setNotes,
}) => (
  <>
    <Input
      label="Customer Name"
      placeholder="Customer Name"
      value={customerName}
      onChange={(e) => setCustomerName(e.target.value)}
      required
    />
    <Input
      type="email"
      label="Customer Email"
      placeholder="Customer Email"
      value={customerEmail}
      onChange={(e) => setCustomerEmail(e.target.value)}
    />
    <Input
      label="Customer Phone"
      placeholder="Customer Phone"
      value={customerPhone}
      onChange={(e) => setCustomerPhone(e.target.value)}
    />
    <Input
      label="Company Name"
      placeholder="Company Name"
      value={companyName}
      onChange={(e) => setCompanyName(e.target.value)}
    />
    <Input
      label="Location"
      placeholder="Location"
      value={locationField}
      onChange={(e) => setLocationField(e.target.value)}
    />
    <Textarea
      label="Notes"
      placeholder="Additional Notes"
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
    />
  </>
);
