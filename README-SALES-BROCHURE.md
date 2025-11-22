# Labamu Manufacturing - Sales Brochure

## Overview

The Sales Brochure is a professionally designed, print-optimized document that showcases Labamu Manufacturing's complete feature set, pricing tiers, and customer testimonials. It's designed to be shared with prospects after sales meetings.

## Accessing the Brochure

The sales brochure is available at: **`/sales-brochure`**

For example: `https://yourdomain.com/sales-brochure`

## How to Generate PDF

### Method 1: Browser Print Function (Recommended)

1. Navigate to `/sales-brochure` in your web browser
2. Click the **"Download as PDF"** button in the top-right corner
3. This will open the browser's print dialog
4. Select "Save as PDF" as the destination
5. Configure settings:
   - **Layout:** Portrait
   - **Paper Size:** A4 (or Letter)
   - **Margins:** None (or Minimum)
   - **Options:** Enable "Background graphics" to include colors and styling
6. Click "Save" to download the PDF

### Method 2: Direct Print Dialog

1. Navigate to `/sales-brochure`
2. Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac)
3. Follow steps 4-6 above

## Features

The sales brochure includes:

### 📄 Page 1 - Cover Page
- Professional title page with Labamu branding
- Company tagline and positioning statement

### 📄 Page 2 - Overview
- Challenge vs. Solution comparison
- Key results and metrics (80% reduction in manual work, 30-40% inventory savings, etc.)
- Value proposition highlights

### 📄 Pages 3-4 - Complete Feature Set
- **Sales Workflow:** RFQ management, quote generation, order processing, invoicing
- **Manufacturing Intelligence:** Recipe/BOM management, routing stages, production tracking
- **Inventory Control:** Batch tracking, FIFO/FEFO, purchase orders, ABC classification
- **Logistics & Shipping:** Container management, Incoterms, export documentation
- **Analytics & Reporting:** Financial KPIs, conversion tracking, multi-currency
- **Financing Integration:** Access to working capital and trade finance

### 📄 Page 5 - Pricing Plans
- **Startup Plan:** For growing manufacturers (up to 10 users)
- **Professional Plan:** Most popular, for established operations (up to 50 users)
- **Enterprise Plan:** Custom solution for large-scale operations (unlimited users)
- What's included in all plans

### 📄 Page 6 - Customer Testimonials
- Four detailed testimonials from different manufacturing sectors
- Real results: cost savings, delivery improvements, profitability gains
- Includes company names, roles, and industry context

### 📄 Page 7 - Security & Support
- Enterprise-grade security features (encryption, uptime SLA, backups, compliance)
- Implementation and support details
- Typical 4-6 week implementation timeline

### 📄 Page 8 - Call to Action
- Clear next steps for prospects
- Contact information
- Free 30-day trial offer
- Implementation timeline overview

## Customization

To customize the brochure content:

1. Open `src/pages/SalesBrochure.tsx`
2. Update content sections as needed:
   - **Pricing:** Modify the pricing tier cards with actual pricing
   - **Contact Info:** Update email, phone, website in the final page
   - **Testimonials:** Replace with actual customer testimonials
   - **Features:** Add/remove/modify feature descriptions
   - **Metrics:** Update ROI statistics based on actual customer data

## Styling

The brochure uses:
- **Design System:** Semantic tokens from `index.css` for consistent branding
- **Print Optimization:** Dedicated CSS for print media to ensure proper page breaks
- **Responsive Design:** Looks good on screen and optimized for print
- **Professional Layout:** Clean, corporate aesthetic with proper hierarchy

## Best Practices

### Before Sending to Prospects:

1. **Review Content:** Ensure all information is current and accurate
2. **Update Pricing:** Confirm pricing tiers match current offerings
3. **Check Contact Info:** Verify email, phone, and website are correct
4. **Test PDF Generation:** Generate a test PDF to ensure formatting is correct
5. **File Size:** Aim for <5MB for easy email transmission

### Customization for Specific Prospects:

For high-value prospects, consider creating customized versions:
- Add their industry-specific examples
- Include relevant case studies from similar companies
- Highlight features most relevant to their pain points
- Add a personalized cover letter page

### Distribution:

- **Email:** Attach PDF in follow-up emails after meetings
- **Print:** Print professional copies for in-person meetings
- **Share Link:** Send direct link for prospects to review online
- **Proposal Inclusion:** Include as part of formal proposals

## Technical Details

- **Technology:** React component with TypeScript
- **Styling:** Tailwind CSS with print-optimized styles
- **Icons:** Lucide React icon library
- **Page Breaks:** Automatic page breaks for print using CSS
- **Accessibility:** Semantic HTML with proper heading hierarchy

## File Locations

- **Brochure Component:** `src/pages/SalesBrochure.tsx`
- **Route Definition:** `src/App.tsx`
- **This Documentation:** `README-SALES-BROCHURE.md`

## Troubleshooting

### PDF Colors Look Washed Out
- Enable "Background graphics" in print settings
- Check that browser is set to print in color

### Page Breaks in Wrong Places
- This is optimized for A4/Letter size
- Avoid changing zoom levels before printing
- Use browser's native print function, not third-party PDF generators

### Button Visible in PDF
- The "Download as PDF" button has `no-print` class and should not appear in PDF
- If it appears, check your browser's print settings

### Large File Size
- Reduce image quality if needed (currently uses SVG icons which are small)
- Consider compressing the final PDF if over 10MB

## Version History

- **v1.0** (Current): Initial professional sales brochure with 8 pages of content

## Support

For technical issues with the brochure or customization requests, contact the development team.

For sales-related questions or to update brochure content based on marketing strategy, contact the marketing/sales team.
