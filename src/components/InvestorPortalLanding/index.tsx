'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  BarChart4, 
  Calendar, 
  Clock, 
  Shield, 
  Wallet, 
  BadgePercent, 
  ArrowRight, 
  CheckCircle2, 
  Search,
  Building,
  Users,
  Mail
} from 'lucide-react';

export default function InvestorPortalLanding() {
  const [activeProperty, setActiveProperty] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setActiveProperty((prev) => (prev + 1) % featuredProperties.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const featuredProperties = [
    {
      id: 1,
      name: "Azure Heights",
      location: "Victoria Island, Lagos",
      price: "₦25M",
      roi: "32%",
      image: "/api/placeholder/600/400",
      occupancy: "70%",
    },
    {
      id: 2,
      name: "Serene Gardens",
      location: "Ikoyi, Lagos",
      price: "₦32M",
      roi: "28%",
      image: "/api/placeholder/600/400",
      occupancy: "75%",
    },
    {
      id: 3,
      name: "Royal Residences",
      location: "Lekki Phase 1, Lagos",
      price: "₦20M",
      roi: "35%",
      image: "/api/placeholder/600/400",
      occupancy: "80%",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Real Estate Investor",
      quote: "T.O.B.I has revolutionized my investment strategy. The platform's analytics and ROI calculator helped me make confident investment decisions.",
      image: "/api/placeholder/80/80"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Property Portfolio Manager",
      quote: "The transparency and detailed property analysis on T.O.B.I is unmatched. I've significantly grown my clients' portfolios since using this platform.",
      image: "/api/placeholder/80/80"
    },
    {
      id: 3,
      name: "Oluwaseun Adebayo",
      role: "First-time Investor",
      quote: "As someone new to property investment, T.O.B.I made the process straightforward and less intimidating. The returns have exceeded my expectations!",
      image: "/api/placeholder/80/80"
    }
  ];

  // Fade in animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      } 
    }
  };

  const calculateInvestment = (amount: number): string => {
    return (amount * 1.6).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeIn}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                Unlock <span className="text-blue-700">High-Yield</span> Property Investment Opportunities
              </h1>
              <p className="text-lg text-gray-600">
                Discover exclusive one-bedroom properties with exceptional returns. T.O.B.I connects you with premium real estate investments tailored for maximum ROI.
              </p>
              <div className="pt-4 flex space-x-4">
                <button className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium flex items-center">
                  Explore Investments
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="bg-white text-blue-700 px-6 py-3 rounded-lg border border-blue-700 hover:bg-blue-50 transition-colors duration-200 font-medium">
                  How It Works
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="relative h-64">
                  <img 
                    src={featuredProperties[activeProperty].image} 
                    alt="Featured property" 
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-bold">{featuredProperties[activeProperty].name}</h3>
                      <p className="flex items-center">
                        <span>{featuredProperties[activeProperty].location}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Investment</p>
                      <p className="text-xl font-bold text-blue-700">{featuredProperties[activeProperty].price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expected ROI</p>
                      <p className="text-xl font-bold text-green-600">{featuredProperties[activeProperty].roi}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Occupancy Rate</p>
                      <p className="text-xl font-bold text-blue-700">{featuredProperties[activeProperty].occupancy}</p>
                    </div>
                  </div>
                  <button className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium">
                    View Property Details
                  </button>
                </div>
              </div>
              
              {/* Property indicator dots */}
              <div className="flex justify-center mt-4 space-x-2">
                {featuredProperties.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveProperty(index)}
                    className={`w-3 h-3 rounded-full ${index === activeProperty ? 'bg-blue-700' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              T.O.B.I transforms property investment with data-driven tools, transparent processes, and high-yield opportunities in premium locations.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Building2 className="h-12 w-12 text-blue-700" />,
                title: "Curated Properties",
                description: "Access exclusive one-bedroom properties in premium locations with high rental demand and growth potential."
              },
              {
                icon: <TrendingUp className="h-12 w-12 text-blue-700" />,
                title: "ROI-Focused Analysis",
                description: "Make informed decisions with our comprehensive financial metrics, market trends, and neighborhood safety data."
              },
              {
                icon: <Wallet className="h-12 w-12 text-blue-700" />,
                title: "Flexible Investment Options",
                description: "Choose between outright purchase or our installment plan with 60% initial payment and the balance over 2 years."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Calculate Your Investment Returns</h2>
              <p className="text-lg text-gray-600">
                See how your investment can grow with our properties. Our calculator gives you transparent projections based on real market data.
              </p>
              
              <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount (₦)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      defaultValue="20,000,000" 
                      className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    <Wallet className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investment Timeline (Years)</label>
                  <select className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option selected>2</option>
                    <option>3</option>
                    </select>
                </div>
                
                <button className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium">
                  Calculate Returns
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="bg-blue-700 p-6 text-white">
                <h3 className="text-xl font-bold">Your Projected Returns</h3>
                <p className="text-blue-100">Based on average performance of similar properties</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Initial Investment</p>
                    <p className="text-2xl font-bold text-gray-900">₦20,000,000</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-700" />
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Projected Return</p>
                    <p className="text-2xl font-bold text-green-600">₦32,000,000</p>
                  </div>
                  <BadgePercent className="h-8 w-8 text-green-600" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Monthly Cash Flow (Est.)</p>
                    <p className="text-2xl font-bold text-blue-700">₦250,000</p>
                  </div>
                  <BarChart4 className="h-8 w-8 text-blue-700" />
                </div>
                
                <div className="pt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Expected ROI: 60% over 2 years</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Investment Opportunities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Investment Opportunities</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our handpicked selection of high-yield properties in prime locations
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-blue-700 text-white text-sm font-bold px-2 py-1 rounded">
                    {property.roi} ROI
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{property.name}</h3>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Investment</p>
                      <p className="text-lg font-bold text-blue-700">{property.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expected Return</p>
                      <p className="text-lg font-bold text-green-600">₦{calculateInvestment(parseInt(property.price.replace(/[^\d]/g, '')) / 1000000)}M</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-blue-700" />
                      <span>2-year investment period</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield className="h-4 w-4 mr-2 text-blue-700" />
                      <span>High neighborhood safety rating</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-blue-700" />
                      <span>{property.occupancy} average occupancy rate</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium flex justify-center items-center">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button className="bg-white text-blue-700 px-6 py-3 rounded-lg border border-blue-700 hover:bg-blue-50 transition-colors duration-200 font-medium inline-flex items-center">
              View All Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* How to Partner With Us */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">How to Partner With Us</h2>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Join T.O.B.I in just a few simple steps and start your investment journey with us
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Create an Account",
                description: "Sign up and complete your investor profile to get started.",
                icon: <Users className="h-10 w-10 text-blue-300" />
              },
              {
                step: "02",
                title: "Explore Properties",
                description: "Browse our curated selection of high-yield investment opportunities.",
                icon: <Search className="h-10 w-10 text-blue-300" />
              },
              {
                step: "03",
                title: "Due Diligence",
                description: "Access detailed property documents and schedule viewings.",
                icon: <Building className="h-10 w-10 text-blue-300" />
              },
              {
                step: "04",
                title: "Secure Your Investment",
                description: "Complete the payment process and start tracking your returns.",
                icon: <CheckCircle2 className="h-10 w-10 text-blue-300" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-blue-800 rounded-xl p-6 relative"
              >
                <div className="absolute -top-4 -left-4 bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-blue-100">{item.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mt-16"
          >
            <button className="bg-white text-blue-700 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-bold text-lg">
              Start Your Investment Journey
            </button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Investors Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from investors who have transformed their portfolios with T.O.B.I
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md relative"
              >
                <div className="text-5xl font-serif text-blue-200 absolute top-4 right-6">"</div>
                <p className="text-gray-600 mb-6 relative z-10">{testimonial.quote}</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover" 
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-12 flex flex-col justify-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold text-gray-900">Ready to Grow Your Investment Portfolio?</h2>
                  <p className="text-lg text-gray-600">
                    Join T.O.B.I today and discover high-yield property investments that align with your financial goals.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium">
                      Create Account
                    </button>
                    <button className="bg-white text-blue-700 px-6 py-3 rounded-lg border border-blue-700 hover:bg-blue-50 transition-colors duration-200 font-medium">
                      Schedule a Consultation
                    </button>
                  </div>
                </motion.div>
              </div>
              <div className="relative">
                <img 
                  src="/api/placeholder/600/400" 
                  alt="Luxury apartment" 
                  className="h-full w-full object-cover" 
                />
                <div className="absolute inset-0 bg-blue-900/30 flex items-center justify-center">
                  <div className="bg-white/90 p-6 rounded-xl max-w-xs text-center">
                    <h3 className="text-xl font-bold text-blue-700 mb-2">Premium Membership</h3>
                    <p className="text-gray-600 mb-4">Join our exclusive Gold or Platinum membership for early access to prime properties</p>
                    <button className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium text-sm">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};