// app/about/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Users,
  BookOpen,
  Gift,
  PieChart,
  Shield,
  Building,
  Award,
  MapPin,
  Star
} from 'lucide-react';
import { useRouter } from "next/navigation";

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState('mission');
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

    const handleBrowseProperties = () => {
      router.push("/properties");
    };

    const handleBecomeInvestor = () => {
      router.push("/dashboard/investor");
    };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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
    <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-96 flex items-center justify-center bg-gradient-to-r from-blue-900 to-indigo-900 dark:from-blue-950 dark:to-indigo-950 text-white overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-repeat" style={{
            backgroundImage: "url('/api/placeholder/20/20')",
            backgroundSize: "40px"
          }}></div>
        </div>

        <div className="container mx-auto px-6 z-10 text-center">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Welcome to <span className="text-yellow-400">T.O.B.I</span>
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto"
          >
            The One Bedroom Institute: Redefining Premium Short-Let Accommodations & Property Investment
          </motion.p>
        </div>
      </motion.section>

      {/* Mission & Vision Section */}
      <section className="py-20 container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            className="w-full md:w-1/2"
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                <Home className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Our Story</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              T.O.B.I was founded on a simple yet powerful vision: to transform the way people experience, invest in, and interact with premium real estate in Nigeria's most prestigious locations. Starting with a focus on one-bedroom apartments in Ikoyi and Victoria Island, we've created a platform that brings together customers, investors, and agents in a seamless ecosystem.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our journey began with recognizing the untapped potential in Nigeria's premium short-let market and the barriers preventing average investors from participating in lucrative real estate opportunities. Today, T.O.B.I stands as the bridge connecting these worlds, making luxury accommodations accessible and property investment attainable.
            </p>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2"
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-blue-900/10 p-8 h-full">
              <div className="flex mb-6">
                <button
                  onClick={() => setActiveTab('mission')}
                  className={`px-4 py-2 text-sm font-medium rounded-md mr-2 transition-colors ${activeTab === 'mission' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
                >
                  Mission
                </button>
                <button
                  onClick={() => setActiveTab('vision')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'vision' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
                >
                  Vision
                </button>
              </div>

              {activeTab === 'mission' ? (
                <div>
                  <h3 className="text-2xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Our Mission</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    To democratize access to premium real estate by providing a platform where customers can experience luxury accommodations, investors can participate in property ownership with flexible terms, and agents can showcase premium listings to a targeted audience.
                  </p>
                  <div className="mt-6 flex items-center">
                    <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                    <p className="text-gray-700 dark:text-gray-200 font-medium">Built on transparency, trust, and exceptional service</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Our Vision</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    To become Nigeria's leading platform for premium short-let accommodations and real estate investments, setting the standard for modern property transactions and creating wealth-building opportunities for all participants in our ecosystem.
                  </p>
                  <div className="mt-6 flex items-center">
                    <PieChart className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                    <p className="text-gray-700 dark:text-gray-200 font-medium">Transforming real estate investment through innovation</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-blue-50 dark:bg-gray-850 dark:bg-opacity-30">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">What Makes Us Different</h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariant} className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-blue-900/5 p-8 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-6">
                <Building className="h-7 w-7 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Premium Locations Only</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We focus exclusively on high-end one-bedroom apartments in Ikoyi and Victoria Island, ensuring quality and value retention.
              </p>
            </motion.div>

            <motion.div variants={itemVariant} className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-blue-900/5 p-8 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Flexible Investment Model</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our unique 60/40 model allows investors to participate with lower initial capital, paying the remainder over 2-3 years.
              </p>
            </motion.div>

            <motion.div variants={itemVariant} className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-blue-900/5 p-8 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-6">
                <Gift className="h-7 w-7 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Innovative Gifting System</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our platform uniquely allows users to gift stays or property investments, creating memorable experiences and wealth-building opportunities.
              </p>
            </motion.div>

            <motion.div variants={itemVariant} className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-blue-900/5 p-8 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-6">
                <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Member Credits</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Investors receive ₦5M in booking credits, allowing them to experience other premium properties in our network.
              </p>
            </motion.div>

            <motion.div variants={itemVariant} className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-blue-900/5 p-8 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-6">
                <Award className="h-7 w-7 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Premium Membership Tiers</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our Silver, Gold, and Platinum membership tiers provide escalating benefits tailored to different user needs.
              </p>
            </motion.div>

            <motion.div variants={itemVariant} className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-blue-900/5 p-8 transition-transform duration-300 hover:transform hover:scale-105">
              <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-6">
                <Star className="h-7 w-7 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Verified Properties & Agents</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our rigorous verification process ensures all properties and agents meet our high quality and legal standards.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Who We Serve</h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            T.O.B.I brings together a diverse ecosystem of participants, each with unique needs and opportunities within our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="h-20 w-20 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Customers</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Modern travelers and professionals seeking premium short-stay accommodations in Lagos's most prestigious areas, with seamless booking and gifting capabilities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <div className="h-20 w-20 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center mx-auto mb-6">
              <PieChart className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Investors</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Individuals looking to build real estate wealth with flexible investment options, attractive ROI, and the benefits of premium membership status.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <div className="h-20 w-20 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center mx-auto mb-6">
              <Building className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Agents</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Verified real estate professionals who list and manage premium properties, earning commissions and building their professional reputation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 dark:from-blue-950 dark:to-indigo-950 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Prime Locations</h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-blue-100">
              T.O.B.I focuses exclusively on two of Lagos's most prestigious locations, offering unparalleled luxury and investment value.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden"
            >
              <div className="h-64 bg-gray-300 relative">
                <img
                  src="/images/IKOYI.jpg"
                  alt="Ikoyi"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Ikoyi</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3">Ikoyi</h3>
                <p className="text-blue-100 mb-4">
                  Known for its upscale residential areas, diplomatic presence, and prestigious addresses, Ikoyi represents the pinnacle of luxury living in Lagos.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <span>Premium waterfront properties</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <span>Proximity to business districts</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <span>Exclusive gated communities</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden"
            >
              <div className="h-64 bg-gray-300 relative">
                <img
                  src="/images/VI.jpg"
                  alt="Victoria Island"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Victoria Island</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3">Victoria Island</h3>
                <p className="text-blue-100 mb-4">
                  A commercial and financial hub with vibrant nightlife, international hotels, and corporate headquarters, offering both business convenience and leisure options.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <span>Strategic city center location</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <span>Access to entertainment venues</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <span>Proximity to major corporations</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-2xl p-10 md:p-16 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience T.O.B.I?</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Whether you're looking for a luxurious stay, an investment opportunity, or a platform to list premium properties, T.O.B.I is built for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
              onClick={handleBrowseProperties}
              className="bg-white text-blue-700 hover:bg-blue-50 dark:hover:bg-white/90 font-semibold py-3 px-6 md:px-8 rounded-lg transition-colors duration-300"
            >
              Browse Properties
            </button>

            <button
              onClick={handleBecomeInvestor}
              className="bg-transparent border-2 border-white hover:bg-white/10 font-semibold py-3 px-6 md:px-8 rounded-lg transition-colors duration-300"
            >
              Become an Investor
            </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}