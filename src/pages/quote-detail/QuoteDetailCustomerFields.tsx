
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface QuoteDetailCustomerFieldsProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  rfqId?: string | undefined;
  customerPhone?: string;
  setCustomerPhone?: (phone: string) => void;
  locationField?: string;
  setLocationField?: (location: string) => void;
  notes?: string;
  setNotes?: (notes: string) => void;
}

export const QuoteDetailCustomerFields: React.FC<QuoteDetailCustomerFieldsProps> = ({
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
  companyName,
  setCompanyName,
  rfqId,
  customerPhone,
  setCustomerPhone,
  locationField,
  setLocationField,
  notes,
  setNotes,
}) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="customerName">Customer Name</Label>
      <Input
        id="customerName"
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        required
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="customerEmail">Customer Email</Label>
      <Input
        id="customerEmail"
        type="email"
        placeholder="Customer Email"
        value={customerEmail}
        onChange={(e) => setCustomerEmail(e.target.value)}
      />
    </div>

    {customerPhone !== undefined && setCustomerPhone && (
      <div className="space-y-2">
        <Label htmlFor="customerPhone">Customer Phone</Label>
        <Input
          id="customerPhone"
          placeholder="Customer Phone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />
      </div>
    )}

    <div className="space-y-2">
      <Label htmlFor="companyName">Company Name</Label>
      <Input
        id="companyName"
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
    </div>

    {locationField !== undefined && setLocationField && (
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="Location"
          value={locationField}
          onChange={(e) => setLocationField(e.target.value)}
        />
      </div>
    )}

    {notes !== undefined && setNotes && (
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Additional Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    )}

    {rfqId && (
      <div className="text-sm text-gray-500">
        <span>Linked to RFQ ID: {rfqId}</span>
      </div>
    )}
  </div>
);
