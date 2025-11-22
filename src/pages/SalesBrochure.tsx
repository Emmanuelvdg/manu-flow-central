import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Factory, TrendingUp, Shield, Clock, DollarSign, Package, BarChart3, Truck, FileText } from "lucide-react";

export default function SalesBrochure() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print button - only shows on screen, not in print */}
      <div className="fixed top-4 right-4 no-print z-50">
        <Button onClick={handlePrint} size="lg">
          Download as PDF
        </Button>
      </div>

      <div className="brochure-container bg-background text-foreground">
        {/* Cover Page */}
        <section className="brochure-page flex flex-col justify-center items-center text-center px-16 py-20">
          <div className="max-w-4xl">
            <Factory className="w-24 h-24 mx-auto mb-8 text-primary" />
            <h1 className="text-6xl font-bold mb-6 text-primary">
              Labamu Manufacturing
            </h1>
            <p className="text-3xl mb-8 text-muted-foreground">
              Complete Manufacturing Resource Planning Platform
            </p>
            <div className="w-32 h-1 bg-primary mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground">
              Manufacturing Excellence, Simplified
            </p>
          </div>
        </section>

        {/* Overview */}
        <section className="brochure-page px-16 py-12">
          <h2 className="text-4xl font-bold mb-8 text-primary border-b-4 border-primary pb-4">
            Transform Your Manufacturing Operations
          </h2>
          
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">The Challenge</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-destructive font-bold">×</span>
                  <span>Disconnected systems and manual processes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive font-bold">×</span>
                  <span>No real-time visibility into production</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive font-bold">×</span>
                  <span>Inventory shortages and overstocking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive font-bold">×</span>
                  <span>Lost quotes and missed delivery dates</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive font-bold">×</span>
                  <span>Unknown true manufacturing costs</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-4">The Solution</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span>One integrated platform for everything</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span>Real-time production tracking and visibility</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span>Intelligent inventory management with FIFO/FEFO</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span>Automated quote-to-order conversion</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span>Complete cost visibility and analytics</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-primary/10 rounded-lg p-8 border-2 border-primary">
            <h3 className="text-2xl font-bold mb-4 text-center">Typical Results in Year One</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">80%</div>
                <div className="text-sm text-muted-foreground">Reduction in manual data entry</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">30-40%</div>
                <div className="text-sm text-muted-foreground">Lower inventory carrying costs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">25%</div>
                <div className="text-sm text-muted-foreground">Better on-time delivery</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features - Page 1 */}
        <section className="brochure-page px-16 py-12">
          <h2 className="text-4xl font-bold mb-8 text-primary border-b-4 border-primary pb-4">
            Complete Feature Set
          </h2>
          
          <div className="grid grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <FileText className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Sales Workflow</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    From inquiry to invoice, streamline your entire sales process
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>RFQ management and tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Automated quote generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Order processing and tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Invoice generation and management</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Conversion tracking and analytics</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Factory className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Manufacturing Intelligence</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Know exactly how each product is made and what it costs
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Recipe and BOM management</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Routing stages and production planning</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Real-time production progress tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Resource allocation optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Automatic cost calculation</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Package className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Inventory Control</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Never run out, never overstock with intelligent tracking
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Batch tracking with FIFO/FEFO</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Automatic material reservation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Purchase order management</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Low stock alerts and forecasting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>ABC classification and expiry tracking</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Truck className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Logistics & Shipping</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Streamline export documentation and container management
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Container management (20', 40', 40HC)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Incoterms support (FOB, CIF, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Export documentation automation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Shipment tracking and status</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Port and carrier information</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Features - Page 2 */}
        <section className="brochure-page px-16 py-12">
          <div className="grid grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <BarChart3 className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Analytics & Reporting</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Real-time insights to make better business decisions
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Financial KPIs and gross margin analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Inventory composition insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Order processing metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>RFQ conversion tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Multi-currency and FX management</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <DollarSign className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Financing Integration</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Access capital to grow without straining cash flow
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Domestic financing (PO & invoices)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>International trade financing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Invoice insurance options</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Streamlined application process</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Application status tracking</span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="bg-primary/5 rounded-lg p-8 border border-primary/20">
            <h3 className="text-2xl font-bold mb-6 text-center">Why Choose Labamu?</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <Factory className="w-12 h-12 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Built FOR Manufacturers</h4>
                <p className="text-sm text-muted-foreground">Not a generic system adapted for manufacturing</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Proven Results</h4>
                <p className="text-sm text-muted-foreground">ROI typically within 3-6 months</p>
              </div>
              <div className="text-center">
                <Clock className="w-12 h-12 text-primary mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Real-Time Intelligence</h4>
                <p className="text-sm text-muted-foreground">Know what's happening right now</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="brochure-page px-16 py-12">
          <h2 className="text-4xl font-bold mb-8 text-primary border-b-4 border-primary pb-4">
            Flexible Pricing Plans
          </h2>
          
          <div className="grid grid-cols-3 gap-6 mb-12">
            <Card className="p-6 border-2">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Startup</h3>
                <div className="text-4xl font-bold text-primary mb-2">Contact Us</div>
                <p className="text-sm text-muted-foreground">For growing manufacturers</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Up to 10 users</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Core features included</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Email support</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Basic reporting</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Implementation support</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-4 border-primary relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <div className="text-4xl font-bold text-primary mb-2">Contact Us</div>
                <p className="text-sm text-muted-foreground">For established operations</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Up to 50 users</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>All features included</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Custom workflows</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-2">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-primary mb-2">Custom</div>
                <p className="text-sm text-muted-foreground">For large-scale operations</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Unlimited users</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>All features + custom development</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Dedicated support team</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>On-premise options available</span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="bg-primary/10 rounded-lg p-6 border-2 border-primary">
            <h3 className="text-xl font-bold mb-4 text-center">What's Included in All Plans</h3>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Comprehensive training</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Implementation assistance</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Regular updates</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Data migration help</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>99.9% uptime SLA</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>GDPR compliant</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Mobile access</span>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="brochure-page px-16 py-12">
          <h2 className="text-4xl font-bold mb-8 text-primary border-b-4 border-primary pb-4">
            Trusted by Manufacturers Worldwide
          </h2>
          
          <div className="grid gap-8">
            <Card className="p-8 bg-primary/5">
              <div className="flex items-start gap-6">
                <div className="bg-primary/20 rounded-full p-4 shrink-0">
                  <Factory className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg mb-4 italic">
                    "Labamu transformed how we manage production. We finally have visibility into everything - from raw materials to finished goods. Our on-time delivery improved from 75% to 95% in just six months."
                  </p>
                  <div className="font-semibold">Sarah Chen</div>
                  <div className="text-sm text-muted-foreground">CEO, Precision Manufacturing Inc.</div>
                  <div className="text-sm text-muted-foreground">Electronics Manufacturing • 200 employees</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-primary/5">
              <div className="flex items-start gap-6">
                <div className="bg-primary/20 rounded-full p-4 shrink-0">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg mb-4 italic">
                    "We reduced our inventory carrying costs by 35% while simultaneously improving our stock availability. The FIFO batch tracking and automated reservation system have been game-changers for us."
                  </p>
                  <div className="font-semibold">Michael Rodriguez</div>
                  <div className="text-sm text-muted-foreground">Operations Manager, Pacific Furniture Co.</div>
                  <div className="text-sm text-muted-foreground">Furniture Manufacturing • 150 employees</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-primary/5">
              <div className="flex items-start gap-6">
                <div className="bg-primary/20 rounded-full p-4 shrink-0">
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg mb-4 italic">
                    "We had no idea which products were actually profitable until we started using Labamu. The recipe costing showed us that three of our 'best sellers' were actually losing money. We adjusted our pricing and improved our gross margin by 18%."
                  </p>
                  <div className="font-semibold">James Liu</div>
                  <div className="text-sm text-muted-foreground">CFO, TechComponents Ltd.</div>
                  <div className="text-sm text-muted-foreground">Component Manufacturing • 300 employees</div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-primary/5">
              <div className="flex items-start gap-6">
                <div className="bg-primary/20 rounded-full p-4 shrink-0">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg mb-4 italic">
                    "We're processing 3x more orders with the same administrative staff. The automated quote generation, order processing, and export documentation have freed up our team to focus on customer relationships instead of paperwork."
                  </p>
                  <div className="font-semibold">Amanda Foster</div>
                  <div className="text-sm text-muted-foreground">COO, Global Export Manufacturing</div>
                  <div className="text-sm text-muted-foreground">Export Manufacturing • 250 employees</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-12 bg-primary text-primary-foreground rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Join Hundreds of Manufacturers</h3>
            <p className="text-lg">Who have transformed their operations with Labamu Manufacturing</p>
          </div>
        </section>

        {/* Security & Support */}
        <section className="brochure-page px-16 py-12">
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary">Enterprise-Grade Security</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Bank-Level Encryption</h3>
                    <p className="text-sm text-muted-foreground">All data encrypted in transit and at rest using industry-standard protocols</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">99.9% Uptime SLA</h3>
                    <p className="text-sm text-muted-foreground">Built on enterprise infrastructure with redundancy and failover</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Regular Backups</h3>
                    <p className="text-sm text-muted-foreground">Automated daily backups with point-in-time recovery</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Role-Based Access</h3>
                    <p className="text-sm text-muted-foreground">Granular permissions and audit trails for compliance</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">GDPR Compliant</h3>
                    <p className="text-sm text-muted-foreground">Full compliance with international data protection regulations</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary">Implementation & Support</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Dedicated Onboarding</h3>
                    <p className="text-sm text-muted-foreground">Personal implementation manager guides your setup</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Data Migration</h3>
                    <p className="text-sm text-muted-foreground">We help import your existing products, materials, and recipes</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Comprehensive Training</h3>
                    <p className="text-sm text-muted-foreground">Live sessions, video tutorials, and detailed documentation</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Ongoing Support</h3>
                    <p className="text-sm text-muted-foreground">Email, phone, and chat support with quick response times</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Regular Updates</h3>
                    <p className="text-sm text-muted-foreground">Continuous improvements and new features at no extra cost</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary">
            <h3 className="text-2xl font-bold mb-4 text-center">Typical Implementation Timeline</h3>
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">Week 1-2</div>
                <div className="font-semibold mb-2">Setup & Migration</div>
                <p className="text-sm text-muted-foreground">Import data, configure processes, user training</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">Week 3-4</div>
                <div className="font-semibold mb-2">Parallel Operation</div>
                <p className="text-sm text-muted-foreground">Run alongside existing systems, validate accuracy</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">Week 5-6</div>
                <div className="font-semibold mb-2">Full Transition</div>
                <p className="text-sm text-muted-foreground">Complete cutover, monitor performance</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">Ongoing</div>
                <div className="font-semibold mb-2">Optimization</div>
                <p className="text-sm text-muted-foreground">Continuous improvement and support</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="brochure-page flex flex-col justify-center items-center px-16 py-20">
          <div className="max-w-3xl text-center">
            <h2 className="text-5xl font-bold mb-6 text-primary">
              Ready to Transform Your Manufacturing?
            </h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Join hundreds of manufacturers who have streamlined their operations and improved profitability with Labamu Manufacturing.
            </p>
            
            <div className="bg-primary/10 rounded-lg p-8 mb-8 border-2 border-primary">
              <h3 className="text-2xl font-bold mb-6">Get Started Today</h3>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">1</div>
                  <p className="text-sm">Schedule a demo</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">2</div>
                  <p className="text-sm">Free 30-day trial</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">3</div>
                  <p className="text-sm">Go live in 4-6 weeks</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-12">
              <div className="flex items-center justify-center gap-3 text-lg">
                <Check className="w-6 h-6 text-primary" />
                <span>No credit card required for trial</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-lg">
                <Check className="w-6 h-6 text-primary" />
                <span>Cancel anytime during trial</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-lg">
                <Check className="w-6 h-6 text-primary" />
                <span>Full implementation support included</span>
              </div>
            </div>

            <div className="border-t-2 border-primary pt-8">
              <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
              <div className="space-y-2 text-lg">
                <p><strong>Email:</strong> sales@labamu.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Website:</strong> www.labamu.com</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .brochure-page {
            page-break-after: always;
            page-break-inside: avoid;
          }
          
          .brochure-page:last-child {
            page-break-after: auto;
          }
        }
        
        @media screen {
          .brochure-container {
            max-width: 1200px;
            margin: 0 auto;
            box-shadow: 0 0 40px rgba(0,0,0,0.1);
          }
          
          .brochure-page {
            min-height: 100vh;
            border-bottom: 2px solid hsl(var(--border));
          }
        }
        
        @page {
          size: A4;
          margin: 0;
        }
      `}</style>
    </>
  );
}
