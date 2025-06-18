
# MRP System User Guide

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Navigation](#navigation)
4. [Products Management](#products-management)
5. [Sales Management](#sales-management)
6. [Manufacturing](#manufacturing)
7. [Inventory Management](#inventory-management)
8. [Analytics & Reporting](#analytics--reporting)
9. [Administration](#administration)
10. [Public Site Features](#public-site-features)
11. [Troubleshooting](#troubleshooting)

## Overview

This MRP (Manufacturing Resource Planning) system is a comprehensive web application designed to manage the entire production workflow from customer requests to final delivery. The system handles:

- Product catalog management
- Request for Quotes (RFQs) 
- Quote generation and management
- Order processing
- Manufacturing recipes and resource planning
- Inventory and materials management
- Shipment tracking
- Invoice generation
- Reporting and analytics

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- User account with appropriate permissions

### Accessing the System
1. Navigate to the application URL
2. Log in with your credentials
3. You'll be directed to the main dashboard

## Navigation

The system uses a sidebar navigation organized into logical categories:

### PRODUCTS
- **Products**: Manage your product catalog
- **Recipes**: Create and manage manufacturing recipes

### SALES
- **RFQs**: Handle Request for Quotes
- **Quotes**: Manage price quotations
- **Orders**: Process customer orders
- **Invoices**: Generate and track invoices

### MANUFACTURING
- **Shipments**: Track shipments and delivery
- **Recipes Dashboard**: Overview of all recipes

### INVENTORY
- **Resources**: Manage materials, personnel, and machinery

### ANALYTICS
- **Reporting**: View comprehensive reports and analytics

### ADMINISTRATION
- **User Management**: Manage user accounts and permissions
- **Public Site Config**: Configure public-facing website

## Products Management

### Adding New Products
1. Navigate to **Products** from the sidebar
2. Click **"Add Product"** button
3. Fill in product details:
   - Product name
   - Description
   - Category
   - Base price
   - Images
4. Set up product variants if needed:
   - Define variant types (size, color, material, etc.)
   - Set specific attributes for each variant
   - Configure variant-specific pricing
5. Click **"Save Product"**

### Managing Product Variants
- Products can have multiple variants (e.g., different sizes, colors)
- Each variant can have its own pricing and specifications
- Use the variant manager to:
  - Add new variant types
  - Define variant attributes
  - Set pricing for each variant combination

### Bulk Upload
- Use the bulk upload feature to import multiple products at once
- Prepare your data in the required format
- Upload via the bulk upload dialog

## Sales Management

### Request for Quotes (RFQs)

#### Creating RFQs
1. Go to **RFQs** in the sidebar
2. Click **"New RFQ"**
3. Fill in customer information:
   - Customer name (required)
   - Email address
   - Phone number
   - Company name
   - Location
   - Notes
4. Add products (comma-separated list)
5. Click **"Create RFQ"**

#### Managing RFQs
- View all RFQs in the main list
- Click on any RFQ to view details
- Edit RFQ information as needed
- Accept RFQs and create quotes directly

#### RFQ Status Flow
- **New**: Recently created RFQ
- **Reviewing**: Under review by sales team
- **Quoted**: Quote has been generated
- **Processed**: RFQ has been fully processed

### Quotes Management

#### Creating Quotes from RFQs
1. In the RFQ list, find RFQs with status "new" or "reviewing"
2. Click **"Accept & Create Quote"** button
3. The system will pre-populate quote details from the RFQ
4. Review and adjust pricing, terms, and conditions
5. Add custom products if needed
6. Save the quote

#### Quote Features
- **Product Selection**: Choose from existing products or add custom items
- **Pricing Management**: Set individual item prices and discounts
- **Terms & Conditions**: Define payment terms, delivery conditions
- **Legal Information**: Add legal terms and conditions
- **Risk Assessment**: System calculates risk levels automatically
- **Analytics**: View conversion metrics and price comparisons

#### Quote Status Management
- **Draft**: Quote is being prepared
- **Sent**: Quote has been sent to customer
- **Accepted**: Customer has accepted the quote
- **Rejected**: Customer has declined the quote
- **Expired**: Quote has passed its validity period

### Orders Management

#### Creating Orders
Orders are typically created from accepted quotes:
1. Accept a quote to automatically generate an order
2. Use **"Sync Orders"** to create orders from all accepted quotes
3. Manually create orders if needed

#### Order Processing
1. **Order Details**: View customer information, products, quantities
2. **Sync Products**: Link order items to your product catalog
3. **Recipe Mapping**: Associate products with manufacturing recipes
4. **Production Planning**: Track manufacturing progress through routing stages
5. **Material Requirements**: View and allocate required materials
6. **Progress Tracking**: Monitor production progress by stage

#### Order Status Tracking
- **New**: Recently created order
- **In Production**: Manufacturing in progress
- **Ready to Ship**: Production completed
- **Shipped**: Order has been dispatched
- **Delivered**: Order received by customer

### Invoice Management

#### Generating Invoices
1. Navigate to **Invoices**
2. Click **"New Invoice"** or create from an existing order
3. Fill in invoice details:
   - Customer information
   - Invoice items and quantities
   - Pricing and taxes
   - Payment terms
4. Save and send to customer

## Manufacturing

### Recipes Management

#### Creating Manufacturing Recipes
1. Go to **Recipes** → **Create Recipe**
2. Select or create the product this recipe is for
3. Define recipe components:
   - **Materials**: Raw materials and quantities needed
   - **Personnel**: Required staff and labor hours
   - **Machinery**: Equipment needed and operation time
   - **Routing Stages**: Step-by-step production process

#### Recipe Components

**Materials Section**:
- Add required raw materials
- Specify quantities needed
- Set material costs
- Define material specifications

**Personnel Section**:
- Assign required personnel types
- Set labor hours needed
- Define skill requirements
- Calculate labor costs

**Machinery Section**:
- Select required equipment
- Set operation times
- Define setup and cleanup times
- Calculate machine costs

**Routing Stages**:
- Create sequential production steps
- Assign personnel and machinery to each stage
- Set duration and dependencies
- Define quality checkpoints

### Production Planning
- View recipe requirements for active orders
- Track progress through routing stages
- Monitor resource utilization
- Identify bottlenecks and capacity issues

## Inventory Management

### Resources Overview
The Resources section manages all production inputs:

#### Materials Management
1. Navigate to **Resources**
2. Use the **Inventory** tab to manage materials
3. Features include:
   - **Material Catalog**: View all available materials
   - **Stock Levels**: Monitor current inventory
   - **Reorder Points**: Set automatic reorder triggers
   - **Purchase Orders**: Create orders to replenish stock
   - **Batch Tracking**: Track material batches and expiry dates

#### Material Operations
- **Add New Materials**: Create material records with specifications
- **Edit Materials**: Update material information and costs
- **Create Purchase Orders**: Order materials from suppliers
- **Bulk Upload**: Import multiple materials via spreadsheet

#### Batch Allocation
- Use the **Allocations** tab to manage material allocations
- Reserve materials for specific orders
- Track batch usage and remaining quantities
- Monitor material freshness and expiry dates

#### Personnel Management
- Track available personnel and their skills
- Assign staff to production stages
- Monitor labor capacity and utilization

#### Machinery Management
- Maintain equipment records
- Track machine availability and capacity
- Schedule equipment maintenance
- Monitor machine utilization rates

## Analytics & Reporting

### Reporting Dashboard
Access comprehensive reports via **Reporting** in the sidebar:

#### Financial Reports
- **Revenue Analysis**: Track sales performance over time
- **Gross Margin Analysis**: Monitor profitability by product
- **Cost Analysis**: Analyze manufacturing costs
- **Aging Reports**: Track outstanding invoices and payments

#### Inventory Reports
- **Stock Levels**: Current inventory status
- **Material Usage**: Track material consumption
- **Reorder Reports**: Items needing replenishment
- **Batch Reports**: Expiry and freshness tracking

#### RFQ Conversion Reports
- **Conversion Rates**: RFQ to Quote to Order conversion
- **Sales Funnel**: Track opportunities through the sales process
- **Customer Analysis**: Customer behavior and preferences

### Key Performance Indicators (KPIs)
Monitor important metrics:
- Order fulfillment rates
- Production efficiency
- Customer satisfaction
- Inventory turnover
- Financial performance

## Administration

### User Management
Administrators can manage system users and permissions:

1. Navigate to **User Management**
2. **User Groups**: Create and manage user groups
3. **Permissions**: Assign specific permissions to groups
4. **Access Matrix**: Define what each group can access
5. **User Assignment**: Add users to appropriate groups

#### Permission System
The system uses role-based access control:
- **Administrators**: Full system access
- **Sales Team**: Access to RFQs, quotes, orders
- **Production Team**: Access to recipes, orders, resources
- **Inventory Team**: Access to materials and inventory
- **Finance Team**: Access to invoices and financial reports

### Public Site Configuration
Configure the public-facing website:
1. Go to **Public Site Config**
2. Configure:
   - **General Settings**: Site name, description, contact info
   - **Color Scheme**: Brand colors and styling
   - **Navigation**: Menu structure and pages
   - **Banner Settings**: Homepage banner content
   - **Social Media**: Links to social media profiles

## Public Site Features

The system includes a public-facing website for customers:

### Public Product Catalog
- Customers can browse available products
- View product details and specifications
- See product variants and options
- Access product images and documentation

### Quote Requests
Customers can submit quote requests directly:
1. Browse products on the public site
2. Add items to their cart
3. Fill in contact information
4. Submit quote request
5. System automatically creates RFQ for internal processing

### Features for Customers
- **Product Search**: Find products by category or keyword
- **Product Filtering**: Filter by specifications, price, etc.
- **Cart Management**: Add/remove items, adjust quantities
- **Quote Submission**: Request pricing for selected items
- **Thank You Page**: Confirmation after quote submission

## Troubleshooting

### Common Issues and Solutions

#### RFQ Creation Issues
- **Blank screen on /rfqs/create**: Ensure you're navigating to the correct URL
- **Error loading RFQ**: Check that RFQ ID is valid (not "create")
- **Validation errors**: Ensure all required fields are filled

#### Order Sync Issues
- **Products not appearing**: Use "Sync Product" button in order details
- **Recipe mapping problems**: Ensure products have associated recipes
- **Material allocation issues**: Check material availability and batch status

#### Performance Issues
- **Slow loading**: Check network connection and browser performance
- **Large data sets**: Use filtering and pagination features
- **Memory issues**: Close unused browser tabs

#### Data Issues
- **Missing shipments**: Use "Sync Orders" to update shipment links
- **Incorrect calculations**: Verify recipe costs and material pricing
- **Permission denied**: Contact administrator to check user permissions

### Getting Help
- Check console logs for detailed error messages
- Verify user permissions for the feature you're trying to access
- Contact system administrator if issues persist
- Refer to the troubleshooting documentation for technical issues

### Best Practices

#### Data Management
- Regularly backup important data
- Keep product catalogs up to date
- Monitor inventory levels and reorder points
- Review and update recipes as processes change

#### Workflow Optimization
- Process RFQs promptly to improve customer satisfaction
- Keep quotes current and follow up on pending ones
- Monitor order progress and address bottlenecks quickly
- Maintain accurate inventory records

#### System Maintenance
- Regular user permission reviews
- Keep material costs updated
- Monitor system performance
- Train users on new features

## Conclusion

This MRP system provides comprehensive functionality for managing the entire manufacturing and sales process. By following this guide, users can effectively utilize all features to streamline operations, improve efficiency, and enhance customer satisfaction.

For technical support or additional training, please contact your system administrator.
