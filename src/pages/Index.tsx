
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3, Package, ShoppingCart, TrendingUp, Wrench, Users, DollarSign, CheckCircle2, ArrowRight, Play, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const features = [
    {
      icon: <Package className="h-6 w-6" />,
      title: "Product Management",
      description: "Complete catalog with variants, recipes, and BOM tracking"
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Sales Workflow",
      description: "RFQ to Quote to Order with automated conversions"
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      title: "Manufacturing Intelligence",
      description: "Production recipes, routing stages, and real-time tracking"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Inventory Control",
      description: "FIFO batch tracking, automated reservations, and stock alerts"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Analytics & Reporting",
      description: "Real-time dashboards for financials, orders, and production"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Financial Management",
      description: "Multi-currency support with automated FX conversion"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Operations Director",
      company: "Pacific Manufacturing Co.",
      content: "Labamu transformed our production planning. We reduced order processing time by 60% and eliminated material stockouts.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "CEO",
      company: "Precision Parts Ltd.",
      content: "The recipe management and real-time tracking features gave us visibility we never had before. Game changer for our business.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Supply Chain Manager",
      company: "Global Exports Inc.",
      content: "Managing international orders with multiple currencies used to be a nightmare. Labamu made it seamless and automated.",
      rating: 5
    }
  ];

  const benefits = [
    "Reduce order processing time by up to 60%",
    "Eliminate manual data entry errors",
    "Real-time visibility into production status",
    "Automated material reservations and FIFO tracking",
    "Multi-currency support with live FX rates",
    "Seamless integration across all departments"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send to an API/database
    console.log('Form submitted:', formData);
    
    toast({
      title: "Thank you for your interest!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: '', email: '', company: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-primary/20">
                  Enterprise Manufacturing Platform
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                Transform Your Manufacturing Operations
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                End-to-end MRP platform that streamlines everything from RFQs to production tracking, inventory management, and international logistics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate('/auth')} className="text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-video rounded-lg border bg-muted/50 shadow-2xl overflow-hidden" id="demo-video">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                      <Play className="h-10 w-10 text-primary ml-1" />
                    </div>
                    <p className="text-muted-foreground">
                      Product demo video
                      <br />
                      <span className="text-sm">(8-10 minutes)</span>
                    </p>
                  </div>
                  {/* Replace this div with actual video embed: */}
                  {/* <iframe 
                    className="w-full h-full" 
                    src="YOUR_VIDEO_URL" 
                    title="Product Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.slice(0, 3).map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive tools to manage your entire manufacturing workflow from sales to shipping
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Benefits Section */}
      <section className="py-20 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Built for Manufacturing Excellence
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Labamu integrates every aspect of your manufacturing operation into one unified platform, delivering measurable results from day one.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-base">{benefit}</p>
                  </div>
                ))}
              </div>
              <Button size="lg" className="mt-8" onClick={() => navigate('/auth')}>
                Start Your Free Trial
              </Button>
            </div>
            
            <div className="relative">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Platform Highlights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Order Processing Speed</span>
                      <span className="text-sm text-primary font-bold">+60%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Error Reduction</span>
                      <span className="text-sm text-primary font-bold">-85%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Production Visibility</span>
                      <span className="text-sm text-primary font-bold">Real-time</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Trusted by Manufacturing Leaders
            </h2>
            <p className="text-xl text-muted-foreground">
              See how companies are transforming their operations with Labamu
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/20 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl lg:text-4xl mb-4">
                  Ready to Transform Your Manufacturing?
                </CardTitle>
                <CardDescription className="text-lg">
                  Get in touch with our team for a personalized demo and see how Labamu can streamline your operations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Smith"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      placeholder="Your Company Inc."
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Tell us about your needs</Label>
                    <Textarea
                      id="message"
                      placeholder="What challenges are you looking to solve?"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full text-lg">
                    Request a Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <p className="text-sm text-center text-muted-foreground">
                    By submitting this form, you agree to our privacy policy. We'll never share your information.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Start Your Manufacturing Transformation Today</h3>
              <p className="text-muted-foreground">Join leading manufacturers already using Labamu</p>
            </div>
            <Button size="lg" onClick={() => navigate('/auth')}>
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
