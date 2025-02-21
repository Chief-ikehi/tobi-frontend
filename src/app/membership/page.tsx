import React from 'react';
//import { Twitter, Facebook, Instagram } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
}

interface MembershipTierProps {
  name: string;
  price: number;
  features: string[];
  buttonText: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-12 h-12 bg-gray-200 rounded-full mb-4" />
    <p className="text-gray-700 mb-2">"{quote}"</p>
    <p className="font-medium">{author}</p>
  </div>
);

const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className="flex flex-col items-center text-center">
    <div className="mb-4">{icon}</div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const MembershipTier: React.FC<MembershipTierProps> = ({ name, price, features, buttonText }) => (
  <div className={`p-6 rounded-lg ${name === 'Premium' ? 'bg-gray-900 text-white' : 'bg-white'}`}>
    <h3 className="text-xl font-semibold mb-2">{name}</h3>
    <p className="text-3xl font-bold mb-4">
      ${price.toLocaleString()}<span className="text-sm font-normal">/year</span>
    </p>
    <ul className="mb-6 space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    <button className={`w-full py-2 px-4 rounded ${
      name === 'Premium'
        ? 'bg-white text-gray-900'
        : 'bg-gray-900 text-white'
    } font-medium`}>
      {buttonText}
    </button>
  </div>
);

export default function MembershipPage() {
  const features = [
    {
      icon: <div className="w-12 h-12 bg-gray-200 rounded-full" />,
      title: "Early Access",
      description: "Be the first to book exclusive properties"
    },
    {
      icon: <div className="w-12 h-12 bg-gray-200 rounded-full" />,
      title: "Concierge Support",
      description: "24/7 dedicated assistance"
    },
    {
      icon: <div className="w-12 h-12 bg-gray-200 rounded-full" />,
      title: "Guaranteed Bookings",
      description: "Your reservation is always secured"
    }
  ];

  const testimonials = [
    {
      quote: "The exclusive access to luxury properties has transformed my travel experience.",
      author: "Sarah Johnson"
    },
    {
      quote: "Concierge service is exceptional. They handle everything perfectly.",
      author: "Michael Chen"
    },
    {
      quote: "Best investment for luxury travel. The properties are outstanding.",
      author: "Emma Davis"
    }
  ];

  const tiers = [
    {
      name: "Basic",
      price: 1000,
      features: ["Early Access", "Basic Support", "5 Bookings/Year"],
      buttonText: "Select Basic"
    },
    {
      name: "Premium",
      price: 2500,
      features: ["Priority Access", "24/7 Concierge", "15 Bookings/Year"],
      buttonText: "Select Premium"
    },
    {
      name: "Elite",
      price: 5000,
      features: ["VIP Access", "Dedicated Concierge", "Unlimited Bookings"],
      buttonText: "Select Elite"
    }
  ];

  return (
      <>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      

      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Exclusive Private Members Program</h1>
          <p className="text-lg mb-8">Luxury, Comfort and Privacy - Where Access Awaits You</p>
          <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium">
            Join Now
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Members Say</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>

      {/* Membership Tiers Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Membership Tiers</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <MembershipTier key={index} {...tier} />
          ))}
        </div>
      </div>
    </div>
    </>
  );
}