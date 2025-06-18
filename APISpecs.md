
# MRP System API Specifications

## Table of Contents
1. [RFQ (Request for Quote) API](#rfq-request-for-quote-api)
2. [Quote API](#quote-api)
3. [Order API](#order-api)
4. [Invoice API](#invoice-api)
5. [Shipment API](#shipment-api)
6. [Common Data Types](#common-data-types)
7. [Error Responses](#error-responses)

---

## RFQ (Request for Quote) API

### RFQ Data Structure
```json
{
  "id": "uuid",
  "rfq_number": "string",
  "customer_name": "string",
  "customer_email": "string|null",
  "customer_phone": "string|null",
  "company_name": "string|null",
  "location": "string|null",
  "products": [
    {
      "name": "string",
      "quantity": "number",
      "specifications": "string|null"
    }
  ],
  "status": "new|reviewing|quoted|processed",
  "notes": "string|null",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Endpoints

#### GET /api/rfqs
Get all RFQs with optional filtering
```json
{
  "query_parameters": {
    "status": "string|optional",
    "customer_name": "string|optional",
    "date_from": "date|optional",
    "date_to": "date|optional",
    "limit": "number|optional",
    "offset": "number|optional"
  },
  "response": {
    "data": "RFQ[]",
    "total": "number",
    "limit": "number",
    "offset": "number"
  }
}
```

#### GET /api/rfqs/{id}
Get specific RFQ by ID
```json
{
  "response": {
    "data": "RFQ",
    "quotes": "Quote[]|optional"
  }
}
```

#### POST /api/rfqs
Create new RFQ
```json
{
  "request": {
    "customer_name": "string|required",
    "customer_email": "string|optional",
    "customer_phone": "string|optional",
    "company_name": "string|optional",
    "location": "string|optional",
    "products": [
      {
        "name": "string|required",
        "quantity": "number|required",
        "specifications": "string|optional"
      }
    ],
    "notes": "string|optional"
  },
  "response": {
    "data": "RFQ",
    "message": "RFQ created successfully"
  }
}
```

#### PUT /api/rfqs/{id}
Update existing RFQ
```json
{
  "request": {
    "customer_name": "string|optional",
    "customer_email": "string|optional",
    "customer_phone": "string|optional",
    "company_name": "string|optional",
    "location": "string|optional",
    "products": "array|optional",
    "status": "string|optional",
    "notes": "string|optional"
  },
  "response": {
    "data": "RFQ",
    "message": "RFQ updated successfully"
  }
}
```

---

## Quote API

### Quote Data Structure
```json
{
  "id": "uuid",
  "quote_number": "string",
  "rfq_id": "uuid|null",
  "customer_name": "string",
  "customer_email": "string|null",
  "company_name": "string|null",
  "products": [
    {
      "id": "string",
      "name": "string",
      "quantity": "number",
      "unit_price": "number",
      "total_price": "number",
      "specifications": "string|null"
    }
  ],
  "total": "number",
  "currency": "string",
  "status": "draft|sent|accepted|rejected|expired",
  "payment_terms": "string|null",
  "deposit_percentage": "number|null",
  "shipping_method": "string|null",
  "incoterms": "string|null",
  "estimated_delivery": "string|null",
  "risk_level": "low|medium|high|null",
  "performance_guarantees": "string|null",
  "late_payment_penalties": "string|null",
  "dispute_resolution_method": "string|null",
  "governing_law": "string|null",
  "force_majeure_terms": "string|null",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Endpoints

#### GET /api/quotes
Get all quotes with optional filtering
```json
{
  "query_parameters": {
    "status": "string|optional",
    "customer_name": "string|optional",
    "rfq_id": "uuid|optional",
    "date_from": "date|optional",
    "date_to": "date|optional",
    "limit": "number|optional",
    "offset": "number|optional"
  },
  "response": {
    "data": "Quote[]",
    "total": "number",
    "limit": "number",
    "offset": "number"
  }
}
```

#### GET /api/quotes/{id}
Get specific quote by ID
```json
{
  "response": {
    "data": "Quote",
    "rfq": "RFQ|optional",
    "orders": "Order[]|optional"
  }
}
```

#### POST /api/quotes
Create new quote
```json
{
  "request": {
    "rfq_id": "uuid|optional",
    "customer_name": "string|required",
    "customer_email": "string|optional",
    "company_name": "string|optional",
    "products": [
      {
        "id": "string|required",
        "name": "string|required",
        "quantity": "number|required",
        "unit_price": "number|required"
      }
    ],
    "currency": "string|optional",
    "payment_terms": "string|optional",
    "deposit_percentage": "number|optional",
    "shipping_method": "string|optional",
    "incoterms": "string|optional",
    "estimated_delivery": "string|optional"
  },
  "response": {
    "data": "Quote",
    "message": "Quote created successfully"
  }
}
```

#### PUT /api/quotes/{id}
Update existing quote
```json
{
  "request": {
    "customer_name": "string|optional",
    "customer_email": "string|optional",
    "company_name": "string|optional",
    "products": "array|optional",
    "total": "number|optional",
    "status": "string|optional",
    "payment_terms": "string|optional",
    "shipping_method": "string|optional"
  },
  "response": {
    "data": "Quote",
    "message": "Quote updated successfully"
  }
}
```

#### POST /api/quotes/{id}/accept
Accept a quote and create order
```json
{
  "response": {
    "data": {
      "quote": "Quote",
      "order": "Order"
    },
    "message": "Quote accepted and order created"
  }
}
```

---

## Order API

### Order Data Structure
```json
{
  "id": "uuid",
  "order_number": "string",
  "quote_id": "uuid|null",
  "customer_name": "string",
  "products": [
    {
      "id": "string",
      "name": "string",
      "quantity": "number",
      "unit_price": "number",
      "total_price": "number"
    }
  ],
  "total": "number",
  "status": "created|in_production|ready_to_ship|shipped|delivered",
  "parts_status": "not_booked|booked|in_progress|completed",
  "order_date": "timestamp",
  "shipping_address": "string|null",
  "deposit_paid": "boolean",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Order Product Details
```json
{
  "id": "uuid",
  "order_id": "uuid",
  "product_id": "string",
  "recipe_id": "uuid|null",
  "quantity": "number",
  "unit": "string",
  "status": "pending|in_progress|completed",
  "materials_status": "not_booked|booked|allocated|consumed",
  "materials_progress": "number",
  "personnel_progress": "number",
  "machines_progress": "number",
  "notes": "string|null",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Endpoints

#### GET /api/orders
Get all orders with optional filtering
```json
{
  "query_parameters": {
    "status": "string|optional",
    "parts_status": "string|optional",
    "customer_name": "string|optional",
    "quote_id": "uuid|optional",
    "date_from": "date|optional",
    "date_to": "date|optional",
    "limit": "number|optional",
    "offset": "number|optional"
  },
  "response": {
    "data": "Order[]",
    "total": "number",
    "limit": "number",
    "offset": "number"
  }
}
```

#### GET /api/orders/{id}
Get specific order by ID
```json
{
  "response": {
    "data": "Order",
    "order_products": "OrderProduct[]",
    "quote": "Quote|optional",
    "shipments": "Shipment[]|optional",
    "invoices": "Invoice[]|optional"
  }
}
```

#### POST /api/orders
Create new order
```json
{
  "request": {
    "quote_id": "uuid|optional",
    "customer_name": "string|required",
    "products": [
      {
        "id": "string|required",
        "name": "string|required",
        "quantity": "number|required",
        "unit_price": "number|required"
      }
    ],
    "shipping_address": "string|optional"
  },
  "response": {
    "data": "Order",
    "message": "Order created successfully"
  }
}
```

#### PUT /api/orders/{id}
Update existing order
```json
{
  "request": {
    "status": "string|optional",
    "parts_status": "string|optional",
    "shipping_address": "string|optional",
    "deposit_paid": "boolean|optional"
  },
  "response": {
    "data": "Order",
    "message": "Order updated successfully"
  }
}
```

#### POST /api/orders/{id}/sync-products
Sync order products with product catalog
```json
{
  "response": {
    "data": {
      "order": "Order",
      "synced_products": "OrderProduct[]"
    },
    "message": "Products synchronized successfully"
  }
}
```

---

## Invoice API

### Invoice Data Structure
```json
{
  "id": "uuid",
  "invoice_number": "string",
  "order_id": "uuid|null",
  "amount": "number",
  "status": "draft|sent|paid|overdue",
  "due_date": "timestamp|null",
  "paid": "boolean",
  "payment_date": "timestamp|null",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Detailed Invoice Structure
```json
{
  "id": "uuid",
  "invoice_number": "string",
  "order_id": "uuid|null",
  "customer_info": {
    "name": "string",
    "email": "string|null",
    "company": "string|null",
    "address": "string|null"
  },
  "items": [
    {
      "description": "string",
      "quantity": "number",
      "unit_price": "number",
      "total": "number"
    }
  ],
  "subtotal": "number",
  "tax_rate": "number",
  "tax_amount": "number",
  "total_amount": "number",
  "currency": "string",
  "payment_terms": "string|null",
  "due_date": "timestamp|null",
  "status": "draft|sent|paid|overdue",
  "paid": "boolean",
  "payment_date": "timestamp|null",
  "notes": "string|null",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Endpoints

#### GET /api/invoices
Get all invoices with optional filtering
```json
{
  "query_parameters": {
    "status": "string|optional",
    "paid": "boolean|optional",
    "order_id": "uuid|optional",
    "date_from": "date|optional",
    "date_to": "date|optional",
    "limit": "number|optional",
    "offset": "number|optional"
  },
  "response": {
    "data": "Invoice[]",
    "total": "number",
    "limit": "number",
    "offset": "number"
  }
}
```

#### GET /api/invoices/{id}
Get specific invoice by ID
```json
{
  "response": {
    "data": "DetailedInvoice",
    "order": "Order|optional"
  }
}
```

#### POST /api/invoices
Create new invoice
```json
{
  "request": {
    "order_id": "uuid|optional",
    "customer_info": {
      "name": "string|required",
      "email": "string|optional",
      "company": "string|optional",
      "address": "string|optional"
    },
    "items": [
      {
        "description": "string|required",
        "quantity": "number|required",
        "unit_price": "number|required"
      }
    ],
    "tax_rate": "number|optional",
    "currency": "string|optional",
    "payment_terms": "string|optional",
    "due_date": "timestamp|optional",
    "notes": "string|optional"
  },
  "response": {
    "data": "DetailedInvoice",
    "message": "Invoice created successfully"
  }
}
```

#### PUT /api/invoices/{id}
Update existing invoice
```json
{
  "request": {
    "status": "string|optional",
    "paid": "boolean|optional",
    "payment_date": "timestamp|optional",
    "due_date": "timestamp|optional",
    "notes": "string|optional"
  },
  "response": {
    "data": "DetailedInvoice",
    "message": "Invoice updated successfully"
  }
}
```

#### POST /api/invoices/{id}/mark-paid
Mark invoice as paid
```json
{
  "request": {
    "payment_date": "timestamp|optional"
  },
  "response": {
    "data": "DetailedInvoice",
    "message": "Invoice marked as paid"
  }
}
```

---

## Shipment API

### Shipment Data Structure
```json
{
  "id": "uuid",
  "order_id": "uuid|null",
  "quote_id": "uuid|null",
  "rfq_id": "uuid|null",
  "invoice_id": "uuid|null",
  "tracking_number": "string|null",
  "carrier": "string|null",
  "status": "pending|shipped|in_transit|delivered",
  "ship_date": "timestamp|null",
  "delivery_date": "timestamp|null",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Detailed Shipment Structure
```json
{
  "id": "uuid",
  "order_id": "uuid|null",
  "quote_id": "uuid|null",
  "rfq_id": "uuid|null",
  "invoice_id": "uuid|null",
  "tracking_number": "string|null",
  "carrier": "string|null",
  "status": "pending|shipped|in_transit|delivered",
  "ship_date": "timestamp|null",
  "delivery_date": "timestamp|null",
  "shipping_address": {
    "name": "string|null",
    "company": "string|null",
    "address_line1": "string|null",
    "address_line2": "string|null",
    "city": "string|null",
    "state": "string|null",
    "postal_code": "string|null",
    "country": "string|null"
  },
  "items": [
    {
      "product_name": "string",
      "quantity": "number",
      "weight": "number|null",
      "dimensions": {
        "length": "number|null",
        "width": "number|null",
        "height": "number|null"
      }
    }
  ],
  "documents": [
    {
      "id": "uuid",
      "document_type": "packing_list|export_declaration|commercial_invoice|other",
      "file_name": "string",
      "file_path": "string",
      "status": "pending|completed"
    }
  ],
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Endpoints

#### GET /api/shipments
Get all shipments with optional filtering
```json
{
  "query_parameters": {
    "status": "string|optional",
    "carrier": "string|optional",
    "order_id": "uuid|optional",
    "tracking_number": "string|optional",
    "date_from": "date|optional",
    "date_to": "date|optional",
    "limit": "number|optional",
    "offset": "number|optional"
  },
  "response": {
    "data": "Shipment[]",
    "total": "number",
    "limit": "number",
    "offset": "number"
  }
}
```

#### GET /api/shipments/{id}
Get specific shipment by ID
```json
{
  "response": {
    "data": "DetailedShipment",
    "order": "Order|optional",
    "quote": "Quote|optional"
  }
}
```

#### POST /api/shipments
Create new shipment
```json
{
  "request": {
    "order_id": "uuid|optional",
    "quote_id": "uuid|optional",
    "rfq_id": "uuid|optional",
    "tracking_number": "string|optional",
    "carrier": "string|optional",
    "shipping_address": {
      "name": "string|optional",
      "company": "string|optional",
      "address_line1": "string|optional",
      "city": "string|optional",
      "country": "string|optional"
    },
    "items": [
      {
        "product_name": "string|required",
        "quantity": "number|required",
        "weight": "number|optional"
      }
    ]
  },
  "response": {
    "data": "DetailedShipment",
    "message": "Shipment created successfully"
  }
}
```

#### PUT /api/shipments/{id}
Update existing shipment
```json
{
  "request": {
    "status": "string|optional",
    "tracking_number": "string|optional",
    "carrier": "string|optional",
    "ship_date": "timestamp|optional",
    "delivery_date": "timestamp|optional"
  },
  "response": {
    "data": "DetailedShipment",
    "message": "Shipment updated successfully"
  }
}
```

#### POST /api/shipments/{id}/documents
Upload shipping documents
```json
{
  "request": {
    "document_type": "packing_list|export_declaration|commercial_invoice|other",
    "file": "binary|required",
    "content": "object|optional"
  },
  "response": {
    "data": {
      "document": "ShippingDocument",
      "shipment": "DetailedShipment"
    },
    "message": "Document uploaded successfully"
  }
}
```

---

## Common Data Types

### Timestamp Format
```json
{
  "format": "ISO 8601",
  "example": "2024-01-15T10:30:00Z"
}
```

### Currency Codes
```json
{
  "supported_currencies": ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"],
  "default": "USD"
}
```

### Status Enums

#### RFQ Status
- `new`: Newly created RFQ
- `reviewing`: Under review by sales team
- `quoted`: Quote has been generated
- `processed`: RFQ fully processed

#### Quote Status
- `draft`: Quote being prepared
- `sent`: Quote sent to customer
- `accepted`: Customer accepted the quote
- `rejected`: Customer declined the quote
- `expired`: Quote validity period expired

#### Order Status
- `created`: Order created from quote
- `in_production`: Manufacturing in progress
- `ready_to_ship`: Production completed
- `shipped`: Order dispatched
- `delivered`: Order received by customer

#### Invoice Status
- `draft`: Invoice being prepared
- `sent`: Invoice sent to customer
- `paid`: Payment received
- `overdue`: Payment past due date

#### Shipment Status
- `pending`: Shipment being prepared
- `shipped`: Package dispatched
- `in_transit`: Package in transit
- `delivered`: Package delivered

---

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object|optional",
    "timestamp": "timestamp"
  }
}
```

### Common Error Codes
- `400`: Bad Request - Invalid request data
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `409`: Conflict - Resource already exists
- `422`: Unprocessable Entity - Validation errors
- `500`: Internal Server Error - Server error

### Validation Error Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "field_name": ["Error message 1", "Error message 2"]
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## Authentication

All API endpoints require authentication via Bearer token:
```
Authorization: Bearer <your_jwt_token>
```

## Rate Limiting

- Standard endpoints: 100 requests per minute
- Bulk operations: 10 requests per minute
- File uploads: 5 requests per minute

## Pagination

For endpoints that support pagination:
```json
{
  "query_parameters": {
    "limit": "number|default:20|max:100",
    "offset": "number|default:0"
  },
  "response_format": {
    "data": "array",
    "total": "number",
    "limit": "number",
    "offset": "number",
    "has_more": "boolean"
  }
}
```

