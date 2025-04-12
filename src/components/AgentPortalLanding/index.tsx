'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
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
  Mail,
  FileCheck,
  Home,
  DollarSign,
  BarChart,
  Globe,
  Settings,
  Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AgentPortalLanding() {
  const [activeProperty, setActiveProperty] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  
  // Commission calculator state
  const [propertyPrice, setPropertyPrice] = useState("35,000");
  const [commissionRate, setCommissionRate] = useState(15);
  const [bookingsPerMonth, setBookingsPerMonth] = useState(10);
  const [calculatedResults, setCalculatedResults] = useState({
    perBooking: 5250,
    monthly: 157500,
    annual: 1890000,
    percentage: 75
  });
  const [hasCalculated, setHasCalculated] = useState(false);

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
      name: "Lakeside Villa",
      location: "Victoria Island, Lagos",
      price: "₦135,000",
      commission: "10%",
      image: "/images/VI.jpg",
      status: "Available",
    },
    {
      id: 2,
      name: "Ocean View Apartment",
      location: "Ikoyi, Lagos",
      price: "₦120,000",
      commission: "12%",
      image: "/images/IKOYI1.jpg",
      status: "Available",
    },
    {
      id: 3,
      name: "Modern Studio",
      location: "Ikoyi, Lagos",
      price: "₦128,000",
      commission: "15%",
      image: "/images/IKOYI.jpg",
      status: "Available",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Ikehi Michael",
      role: "Real Estate Agent",
      quote: "The T.O.B.I platform has transformed how I manage properties. The streamlined verification process and easy-to-use interface have helped me increase my client base by 40% in just 3 months.",
      image: "/api/placeholder/80/80"
    },
    {
      id: 2,
      name: "Abigail Uraih",
      role: "Property Manager",
      quote: "As a property manager handling multiple listings, T.O.B.I's commission tracking and automated payments have saved me countless hours of administrative work. The platform is truly a game-changer!",
      image: "/api/placeholder/80/80"
    },
    {
      id: 3,
      name: "Karl Idowu",
      role: "Independent Agent",
      quote: "The ability to showcase my properties to both short-let customers and investors through one platform has dramatically increased my conversion rates. T.O.B.I connects me with serious clients.",
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

  // Calculation function for commission
  const calculateCommission = () => {
    try {
      console.log("Calculate function called");
      console.log("Inputs:", { propertyPrice, commissionRate, bookingsPerMonth });
      
      // Parse the property price (removing commas)
      const price = parseFloat(propertyPrice.replace(/,/g, ''));
      
      if (isNaN(price) || price <= 0) {
        toast.error("Please enter a valid property price");
        return;
      }
      
      // Calculate commission per booking
      const perBookingCommission = (price * commissionRate) / 100;
      
      // Calculate monthly commission (based on average bookings)
      const monthlyCommission = perBookingCommission * bookingsPerMonth;
      
      // Calculate annual commission
      const annualCommission = monthlyCommission * 12;
      
      // Calculate percentage comparison (just for UI purposes)
      // Assuming average agent earnings on other platforms is around 40% less
      const percentageHigher = 75;
      
      console.log("Calculation results:", {
        perBooking: perBookingCommission,
        monthly: monthlyCommission,
        annual: annualCommission
      });
      
      setCalculatedResults({
        perBooking: perBookingCommission,
        monthly: monthlyCommission,
        annual: annualCommission,
        percentage: percentageHigher
      });
      
      setHasCalculated(true);
      toast.success("Commission calculated successfully!");
    } catch (error) {
      console.error("Calculation error:", error);
      toast.error("Error calculating commission");
    }
  };
  
  // Format number as currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Format input for price (adding commas)
  const formatPriceInput = (value: string): string => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Convert to number and format with commas
    const number = parseInt(digits, 10);
    if (isNaN(number)) return "";
    
    return number.toLocaleString("en-US");
  };
  
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 dark:from-gray-900 dark:to-gray-950 dark:text-gray-100">

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
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-gray-100">
                List & Manage <span className="text-blue-700 dark:text-blue-500">Premium Properties</span> With Ease
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Join T.O.B.I's agent network to showcase your properties to a targeted audience of renters and investors. Manage listings, track performance, and earn competitive commissions all in one place.
              </p>
              <div className="pt-4 flex space-x-4">
                <button 
                  onClick={() => router.push('/auth/signup')}
                  className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium flex items-center dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Become an Agent
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button 
                  onClick={() => router.push('/agent')}
                  className="bg-white text-blue-700 px-6 py-3 rounded-lg border border-blue-700 hover:bg-blue-50 transition-colors duration-200 font-medium dark:bg-transparent dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/30"
                >
                  Agent Dashboard
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
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
                <div className="p-6 bg-white dark:bg-gray-800">
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price Per Night</p>
                      <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{featuredProperties[activeProperty].price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Commission</p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">{featuredProperties[activeProperty].commission}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{featuredProperties[activeProperty].status}</p>
                    </div>
                  </div>
                  <button onClick={() => router.push('/agent/properties/new')}
                  className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium dark:bg-blue-600 dark:hover:bg-blue-700">
                    List Similar Property
                  </button>
                </div>
              </div>
              
              {/* Property indicator dots */}
              <div className="flex justify-center mt-4 space-x-2">
                {featuredProperties.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveProperty(index)}
                    className={`w-3 h-3 rounded-full ${index === activeProperty ? 'bg-blue-700 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What We Offer Agents</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              T.O.B.I provides agents with powerful tools to list, manage, and maximize returns on premium properties in Lagos's most prestigious locations.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Home className="h-12 w-12 text-blue-700 dark:text-blue-400" />,
                title: "Property Listing Platform",
                description: "Showcase your premium properties to targeted audiences of both short-let customers and serious investors."
              },
              {
                icon: <Wallet className="h-12 w-12 text-blue-700 dark:text-blue-400" />,
                title: "Commission Management",
                description: "Earn competitive commissions on bookings and investments, with transparent tracking and automated payments."
              },
              {
                icon: <BarChart className="h-12 w-12 text-blue-700 dark:text-blue-400" />,
                title: "Performance Analytics",
                description: "Access detailed insights on your property performance, helping you optimize listings and maximize revenue."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Calculator Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Calculate Your Commission Potential</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          See how much you can earn by listing your properties on T.O.B.I. Our commission structure rewards quality listings and successful transactions.
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property Price Per Night (₦)</label>
            <div className="relative">
              <input 
                type="text" 
                value={propertyPrice}
                onChange={(e) => {
                  const formatted = formatPriceInput(e.target.value);
                  setPropertyPrice(formatted);
                }}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
              />
              <Wallet className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Commission Rate (%)</label>
            <select 
              value={commissionRate}
              onChange={(e) => setCommissionRate(parseInt(e.target.value, 10))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
            >
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="15">15</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Average Bookings Per Month</label>
            <div className="relative">
              <input 
                type="number" 
                value={bookingsPerMonth}
                onChange={(e) => setBookingsPerMonth(parseInt(e.target.value, 10) || 0)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          
          <button 
            onClick={calculateCommission}
            className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Calculate Earnings
          </button>
        </div>
      </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              animate={hasCalculated ? { scale: [1, 1.02, 1] } : {}}
            >
              <div className="bg-blue-700 dark:bg-blue-800 p-6 text-white">
                <h3 className="text-xl font-bold">Your Projected Earnings</h3>
                <p className="text-blue-100">Based on average occupancy rates and booking patterns</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Per Booking Commission</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(calculatedResults.perBooking)}</p>
                  </div>
                  <BadgePercent className="h-8 w-8 text-blue-700 dark:text-blue-400" />
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Earnings (Est.)</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(calculatedResults.monthly)}</p>
                  </div>
                  <BarChart4 className="h-8 w-8 text-green-600" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Annual Earnings (Est.)</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{formatCurrency(calculatedResults.annual)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-700 dark:text-blue-400" />
                </div>
                {/*
                <div className="pt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" 
                      style={{ width: `${calculatedResults.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {calculatedResults.percentage}% higher than average agent earnings on other platforms
                  </p>
                </div>
                */}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-blue-700 dark:bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Agent Benefits</h2>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              T.O.B.I provides agents with unique advantages that help you stand out in the premium property market
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Award className="h-10 w-10 text-yellow-300" />,
                title: "Verified Agent Status",
                description: "Gain a competitive edge with our verified badge, building trust with clients and increasing your conversion rates."
              },
              {
                icon: <Shield className="h-10 w-10 text-green-300" />,
                title: "Secure Payment Processing",
                description: "Never worry about payments again. Our secure system ensures you receive your commissions promptly and reliably."
              },
              {
                icon: <Users className="h-10 w-10 text-blue-300" />,
                title: "Targeted Client Matching",
                description: "Connect with clients specifically looking for premium properties in your listed areas."
              },
              {
                icon: <Wallet className="h-10 w-10 text-purple-300" />,
                title: "Built-in Wallet System",
                description: "Track your earnings and withdraw funds easily through our integrated wallet system."
              },
              {
                icon: <Settings className="h-10 w-10 text-orange-300" />,
                title: "Customizable Listings",
                description: "Create detailed property profiles with multiple photos, virtual tours, and comprehensive descriptions."
              },
              {
                icon: <Globe className="h-10 w-10 text-teal-300" />,
                title: "International Exposure",
                description: "Reach international clients looking for premium short-let accommodations and investment opportunities in Lagos."
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariant}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold">{benefit.title}</h3>
                </div>
                <p className="text-blue-100">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How to Become an Agent Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How to Become a T.O.B.I Agent</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join our network of verified agents in just a few simple steps
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 dark:bg-blue-700 transform -translate-x-1/2 hidden md:block"></div>
            
            <div className="space-y-12 relative">
              {[
                {
                  step: "01",
                  title: "Create an Agent Account",
                  description: "Sign up on T.O.B.I and select 'Agent' as your role to get started with the onboarding process.",
                  icon: <Users className="h-8 w-8 text-blue-700 dark:text-blue-400" />
                },
                {
                  step: "02",
                  title: "Complete Verification",
                  description: "Submit your identification, business documentation, and property ownership proofs for our verification process.",
                  icon: <FileCheck className="h-8 w-8 text-blue-700 dark:text-blue-400" />
                },
                {
                  step: "03",
                  title: "List Your Properties",
                  description: "Once verified, you can start adding your premium properties with detailed descriptions, high-quality images, and pricing.",
                  icon: <Building className="h-8 w-8 text-blue-700 dark:text-blue-400" />
                },
                {
                  step: "04",
                  title: "Manage Bookings & Earn",
                  description: "Receive booking requests, manage your calendar, and start earning commissions on successful transactions.",
                  icon: <Wallet className="h-8 w-8 text-blue-700 dark:text-blue-400" />
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex items-center gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="hidden md:flex items-center justify-center w-1/2">
                    <div className="bg-blue-700 dark:bg-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold relative z-10">
                      {step.step}
                    </div>
                  </div>
                  
                  <div className={`bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm md:w-1/2 relative ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                    <div className="md:hidden absolute -left-3 top-1/2 transform -translate-y-1/2 bg-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {step.step}
                    </div>
                    <div className={`flex items-center gap-4 mb-3 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mt-16"
          >
            <button 
              onClick={() => router.push('/auth/signup')}
              className="bg-blue-700 text-white px-8 py-4 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-bold text-lg dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Start Your Agent Journey
            </button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Agents Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from agents who have transformed their business with T.O.B.I
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
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md relative"
              >
                <div className="text-5xl font-serif text-blue-200 dark:text-blue-800 absolute top-4 right-6">"</div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10">{testimonial.quote}</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover" 
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 dark:bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-12 flex flex-col justify-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Ready to Grow Your Real Estate Business?</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Join T.O.B.I today and start listing your premium properties to our network of customers and investors.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button 
                      onClick={() => router.push('/auth/signup')}
                      className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium dark:bg-blue-600 dark:hover:bg-blue-700">
                      Create Agent Account
                    </button>
                    <button 
                      onClick={() => router.push('/agent/verify')}
                      className="bg-white text-blue-700 px-6 py-3 rounded-lg border border-blue-700 hover:bg-blue-50 transition-colors duration-200 font-medium dark:bg-transparent dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/30">
                      Verify Existing Account
                    </button>
                  </div>
                </motion.div>
              </div>
              <div className="relative">
                <img 
                  src="/images/IKOYI.jpg" 
                  alt="Luxury apartment" 
                  className="h-full w-full object-cover" 
                />
                <div className="absolute inset-0 bg-blue-900/30 flex items-center justify-center">
                  <div className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-xl max-w-xs text-center">
                    <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-2">Verified Agent Status</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Get verified to access premium features and earn higher commission rates</p>
                    <button 
                      onClick={() => router.push('/agent')}
                      className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium text-sm dark:bg-blue-600 dark:hover:bg-blue-700">
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
}