"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const AboutUs = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // You can integrate form submission logic here, like sending data to your API or a mailing list service.
    setTimeout(() => {
      setLoading(false);
      alert("Thank you for reaching out!");
    }, 2000);
  };

  return (
    <section className="about-us-section py-20">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-[400px] mb-20" style={{ backgroundImage: "url('/images/hero-image.jpg')" }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white">
          <motion.h1
            className="text-5xl font-extrabold mb-4"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Welcome to Our Company
          </motion.h1>
          <p className="text-lg mb-8">Your trusted partner in property investments and management</p>
          <motion.a
            href="#contact"
            className="inline-block bg-primary text-white px-6 py-3 rounded-md text-xl font-medium transition-transform transform hover:scale-105"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Contact Us
          </motion.a>
        </div>
      </div>

      {/* Company Overview */}
      <div className="container mx-auto px-4 text-center mb-20">
        <motion.h2
          className="text-4xl font-semibold mb-6"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Who We Are
        </motion.h2>
        <p className="text-xl text-gray-700 mb-8">
          We are a leading real estate company focused on providing innovative investment solutions and property management services to help you grow your wealth.
        </p>
        <motion.div
          className="flex justify-center gap-10"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="w-1/3">
            <h3 className="text-2xl font-semibold mb-3">Our Mission</h3>
            <p>To deliver exceptional real estate services that create long-term value for our clients.</p>
          </div>
          <div className="w-1/3">
            <h3 className="text-2xl font-semibold mb-3">Our Vision</h3>
            <p>To become a globally recognized leader in real estate investments and management, making a positive impact on communities.</p>
          </div>
          <div className="w-1/3">
            <h3 className="text-2xl font-semibold mb-3">Our Values</h3>
            <p>Integrity, innovation, and excellence guide everything we do, ensuring trust and satisfaction in our services.</p>
          </div>
        </motion.div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center mb-20">
          <motion.h2
            className="text-4xl font-semibold mb-6"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Meet Our Team
          </motion.h2>
          <p className="text-xl text-gray-700 mb-8">Our team is dedicated to ensuring your success in every project we undertake.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Team Members */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <Image src="/images/team/member1.jpg" alt="Team Member 1" width={300} height={300} className="rounded-full mx-auto mb-4" />
              <h4 className="text-xl font-semibold">John Doe</h4>
              <p className="text-gray-500">CEO & Founder</p>
              <p className="text-gray-700 mt-4">John leads the company with over 20 years of experience in real estate investments and management.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <Image src="/images/team/member2.jpg" alt="Team Member 2" width={300} height={300} className="rounded-full mx-auto mb-4" />
              <h4 className="text-xl font-semibold">Jane Smith</h4>
              <p className="text-gray-500">Head of Operations</p>
              <p className="text-gray-700 mt-4">Jane manages day-to-day operations, ensuring everything runs smoothly and efficiently.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <Image src="/images/team/member3.jpg" alt="Team Member 3" width={300} height={300} className="rounded-full mx-auto mb-4" />
              <h4 className="text-xl font-semibold">Mark Johnson</h4>
              <p className="text-gray-500">Lead Developer</p>
              <p className="text-gray-700 mt-4">Mark is responsible for the technical infrastructure of our real estate platform, ensuring it's user-friendly and secure.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-4 text-center mb-20">
        <motion.h2
          className="text-4xl font-semibold mb-6"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Our Services
        </motion.h2>
        <p className="text-xl text-gray-700 mb-8">We offer a wide range of services to help you manage your property investments effectively.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4">Property Management</h3>
            <p>We take care of all aspects of property management, from marketing to maintenance, ensuring your investment runs smoothly.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4">Investment Opportunities</h3>
            <p>Explore lucrative real estate investment opportunities and grow your wealth with our expertly curated portfolio.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4">Consulting Services</h3>
            <p>Our experienced consultants provide personalized guidance to help you make informed property investment decisions.</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl font-semibold mb-6"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Get In Touch
          </motion.h2>
          <p className="text-xl text-gray-700 mb-8">We would love to hear from you. Get in touch with us for any inquiries or assistance.</p>

          <form onSubmit={handleFormSubmit} className="max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="border rounded-lg px-4 py-2 w-full mb-4"
              required
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;