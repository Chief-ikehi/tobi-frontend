'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FaPlay, FaNewspaper, FaBook, FaQuestion, FaSearch, FaFilter, FaArrowRight, FaDownload, 
         FaExternalLinkAlt, FaCalendarAlt, FaClock, FaEye, FaShare, FaBookmark, FaTags, FaRegBookmark } from 'react-icons/fa';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

// Video resource type
interface VideoResource {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  date: string;
  tags: string[];
  views: number;
  featured?: boolean;
}

// Newsletter resource type
interface NewsletterResource {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  pdfUrl: string;
  date: string;
  tags: string[];
  featured?: boolean;
}

// Guide resource type
interface GuideResource {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  url: string;
  type: 'article' | 'pdf' | 'external';
  date: string;
  tags: string[];
  readTime: string;
  featured?: boolean;
}

// FAQ type
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// User Testimonial type
interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  comment: string;
  resourceType: 'video' | 'newsletter' | 'guide';
  resourceId: string;
}

// Enhanced videos data
const videos: VideoResource[] = [
  {
    id: '1',
    title: 'How to Book a Property on TOBI',
    description: 'A step-by-step guide on how to search, select, and book a property on TOBI. Learn how to use filters, compare properties, and complete the booking process with ease.',
    thumbnailUrl: '/images/resources/video-booking.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=k1hp5Feb1VM',
    duration: '3:45',
    date: 'June 15, 2023',
    tags: ['Booking', 'Tutorial', 'Beginner'],
    views: 12453,
    featured: true,
  },
  {
    id: '2',
    title: 'Investing in Properties with TOBI',
    description: 'Learn how to invest in properties and earn passive income through TOBI. This comprehensive guide covers investment strategies, risk assessment, and portfolio management.',
    thumbnailUrl: '/images/resources/video-investing.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    duration: '5:20',
    date: 'July 22, 2023',
    tags: ['Investment', 'Finance', 'Advanced'],
    views: 8921,
  },
  {
    id: '3',
    title: 'How to Gift a Stay to Friends and Family',
    description: "A tutorial on using TOBI's gifting feature to surprise your loved ones. Learn how to select the perfect property, customize your gift, and schedule the perfect surprise.",
    thumbnailUrl: '/images/resources/video-gifting.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    duration: '4:10',
    date: 'August 5, 2023',
    tags: ['Gifting', 'Tutorial', 'Intermediate'],
    views: 6287,
    featured: true,
  },
  {
    id: '4',
    title: 'Maximizing Your TOBI Membership Benefits',
    description: 'Discover all the perks and benefits of being a TOBI member. This video explains how to access exclusive properties, earn loyalty points, and enjoy member-only discounts.',
    thumbnailUrl: '/images/resources/video-membership.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
    duration: '6:30',
    date: 'September 12, 2023',
    tags: ['Membership', 'Benefits', 'All Levels'],
    views: 9345,
  },
  {
    id: '5',
    title: 'Property Owner Guide: Listing Your Property on TOBI',
    description: 'A comprehensive guide for property owners on how to list their properties on TOBI, set competitive rates, and attract quality bookings.',
    thumbnailUrl: '/images/resources/video-listing.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example5',
    duration: '8:15',
    date: 'October 18, 2023',
    tags: ['Property Owner', 'Listing', 'Advanced'],
    views: 7652,
  },
  {
    id: '6',
    title: 'TOBI Mobile App Tutorial',
    description: 'Learn how to use all the features of the TOBI mobile app for seamless property booking and management on the go.',
    thumbnailUrl: '/images/resources/video-app.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=example6',
    duration: '4:50',
    date: 'November 3, 2023',
    tags: ['Mobile App', 'Tutorial', 'Beginner'],
    views: 11245,
  },
];

// Enhanced newsletters data
const newsletters: NewsletterResource[] = [
  {
    id: '1',
    title: 'TOBI Monthly - January 2023',
    description: 'Market trends, new properties, and investment opportunities for the new year. Featuring exclusive interviews with real estate experts and property showcases.',
    thumbnailUrl: '/images/resources/newsletter-jan.jpg',
    pdfUrl: '/newsletters/tobi-monthly-jan-2023.pdf',
    date: 'January 5, 2023',
    tags: ['Market Trends', 'Investment', 'Property Showcase'],
    featured: true,
  },
  {
    id: '2',
    title: 'TOBI Monthly - February 2023',
    description: "Valentine's special: romantic getaways and investment insights. Discover the most romantic properties in our portfolio and learn about couple-friendly amenities.",
    thumbnailUrl: '/images/resources/newsletter-feb.jpg',
    pdfUrl: '/newsletters/tobi-monthly-feb-2023.pdf',
    date: 'February 5, 2023',
    tags: ['Seasonal', 'Romance', 'Investment'],
  },
  {
    id: '3',
    title: 'TOBI Monthly - March 2023',
    description: 'Spring break destinations and property market analysis. Find the perfect family getaway and stay informed about seasonal market fluctuations.',
    thumbnailUrl: '/images/resources/newsletter-mar.jpg',
    pdfUrl: '/newsletters/tobi-monthly-mar-2023.pdf',
    date: 'March 5, 2023',
    tags: ['Seasonal', 'Family', 'Market Analysis'],
  },
  {
    id: '4',
    title: 'TOBI Monthly - April 2023',
    description: 'Easter holiday specials and investment portfolio diversification strategies. Learn how to balance your real estate investments for optimal returns.',
    thumbnailUrl: '/images/resources/newsletter-apr.jpg',
    pdfUrl: '/newsletters/tobi-monthly-apr-2023.pdf',
    date: 'April 5, 2023',
    tags: ['Seasonal', 'Investment', 'Portfolio Management'],
    featured: true,
  },
  {
    id: '5',
    title: 'TOBI Monthly - May 2023',
    description: 'Summer preparation guide and emerging property market trends. Get ready for the busiest booking season with our expert tips and predictions.',
    thumbnailUrl: '/images/resources/newsletter-may.jpg',
    pdfUrl: '/newsletters/tobi-monthly-may-2023.pdf',
    date: 'May 5, 2023',
    tags: ['Seasonal', 'Market Trends', 'Summer'],
  },
  {
    id: '6',
    title: 'TOBI Monthly - June 2023',
    description: 'Summer vacation special and mid-year investment review. Analyze your portfolio performance and discover the hottest summer destinations.',
    thumbnailUrl: '/images/resources/newsletter-jun.jpg',
    pdfUrl: '/newsletters/tobi-monthly-jun-2023.pdf',
    date: 'June 5, 2023',
    tags: ['Seasonal', 'Investment Review', 'Summer'],
  },
];

// Enhanced guides data
const guides: GuideResource[] = [
  {
    id: '1',
    title: 'First-Time Investor Guide',
    description: 'Everything you need to know before making your first property investment. This comprehensive guide covers investment basics, risk assessment, and long-term planning.',
    thumbnailUrl: '/images/resources/guide-investing.jpg',
    url: '/guides/first-time-investor.pdf',
    type: 'pdf',
    date: 'March 10, 2023',
    tags: ['Investment', 'Beginner', 'Finance'],
    readTime: '15 min',
    featured: true,
  },
  {
    id: '2',
    title: 'Property Maintenance Tips',
    description: 'Best practices for maintaining your property and maximizing its value. Learn about preventive maintenance, seasonal care, and cost-effective improvements.',
    thumbnailUrl: '/images/resources/guide-maintenance.jpg',
    url: '/guides/property-maintenance.pdf',
    type: 'pdf',
    date: 'April 22, 2023',
    tags: ['Maintenance', 'Property Owner', 'All Levels'],
    readTime: '12 min',
  },
  {
    id: '3',
    title: 'Tax Benefits of Property Investment',
    description: 'Understanding the tax advantages of investing in real estate. This guide explains deductions, depreciation, and strategies to minimize your tax burden legally.',
    thumbnailUrl: '/images/resources/guide-tax.jpg',
    url: 'https://example.com/tax-benefits',
    type: 'external',
    date: 'May 15, 2023',
    tags: ['Tax', 'Investment', 'Advanced'],
    readTime: '20 min',
  },
  {
    id: '4',
    title: 'Hosting Guide for Property Owners',
    description: 'Tips and tricks for providing an exceptional guest experience. From welcome packages to communication strategies, learn how to earn 5-star reviews consistently.',
    thumbnailUrl: '/images/resources/guide-hosting.jpg',
    url: '/guides/hosting-guide.pdf',
    type: 'pdf',
    date: 'June 8, 2023',
    tags: ['Hosting', 'Property Owner', 'Customer Service'],
    readTime: '18 min',
    featured: true,
  },
  {
    id: '5',
    title: 'Vacation Rental Market Trends 2023',
    description: 'An in-depth analysis of the current vacation rental market, emerging trends, and predictions for the future of the industry.',
    thumbnailUrl: '/images/resources/guide-trends.jpg',
    url: '/guides/market-trends-2023.pdf',
    type: 'pdf',
    date: 'July 12, 2023',
    tags: ['Market Trends', 'Analysis', 'All Levels'],
    readTime: '25 min',
  },
  {
    id: '6',
    title: 'Property Photography Guide',
    description: 'Learn how to take stunning photos of your property that attract potential guests and showcase its best features.',
    thumbnailUrl: '/images/resources/guide-photography.jpg',
    url: '/guides/property-photography.pdf',
    type: 'pdf',
    date: 'August 20, 2023',
    tags: ['Photography', 'Property Owner', 'Marketing'],
    readTime: '10 min',
  },
];

// Enhanced FAQs data with more categories
const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I book a property on TOBI?',
    answer: "To book a property, browse our listings, select a property, choose your dates, and complete the payment process. You'll receive a confirmation email with all the details.",
    category: 'Booking',
  },
  {
    id: '2',
    question: 'What is the cancellation policy?',
    answer: "Our standard cancellation policy allows for a full refund if cancelled 7 days before check-in. Between 7 days and 24 hours, you'll receive a 50% refund. No refund is provided for cancellations within 24 hours of check-in.",
    category: 'Booking',
  },
  {
    id: '3',
    question: 'Can I modify my booking dates after confirmation?',
    answer: 'Yes, you can modify your booking dates subject to availability. Go to your account dashboard, find the booking, and select "Modify Booking". Changes made less than 7 days before check-in may incur modification fees.',
    category: 'Booking',
  },
  {
    id: '4',
    question: 'How do I invest in a property?',
    answer: 'To invest, browse our investment properties, select one that interests you, review the investment details, and complete the investment process. Our team will contact you with further information.',
    category: 'Investment',
  },
  {
    id: '5',
    question: 'What returns can I expect from my investment?',
    answer: 'Investment returns vary based on the property, location, and market conditions. Our properties typically offer annual returns between 8-15%. Each property listing includes projected ROI details.',
    category: 'Investment',
  },
  {
    id: '6',
    question: 'Is there a minimum investment amount?',
    answer: 'Yes, our standard minimum investment is $25,000, but this can vary by property. Some premium properties may have higher minimums, while our fractional ownership program allows investments starting at $10,000.',
    category: 'Investment',
  },
  {
    id: '7',
    question: 'How does the gifting feature work?',
    answer: "You can gift a stay by selecting a property, choosing dates, and selecting 'Gift this stay' during checkout. Enter the recipient's email, add a personal message, and complete payment. They'll receive a gift notification with instructions.",
    category: 'Gifting',
  },
  {
    id: '8',
    question: 'Can I purchase a gift card instead of a specific stay?',
    answer: 'Yes, TOBI offers gift cards in various denominations that recipients can use toward any property booking. Gift cards are valid for 12 months from the date of purchase and can be personalized with a custom message.',
    category: 'Gifting',
  },
  {
    id: '9',
    question: 'What are the benefits of TOBI membership?',
    answer: 'TOBI membership offers benefits like discounted bookings, early access to new properties, exclusive investment opportunities, and personalized recommendations. Different tiers (Silver, Gold, Platinum) offer increasing levels of benefits.',
    category: 'Membership',
  },
  {
    id: '10',
    question: 'How do I upgrade my membership tier?',
    answer: 'You can upgrade your membership tier in your account settings. Upgrading is based on a combination of booking frequency, investment amount, and annual membership fees. Each tier upgrade offers enhanced benefits and services.',
    category: 'Membership',
  },
  {
    id: '11',
    question: 'How do I list my property on TOBI?',
    answer: "To list your property, create an owner account, click on 'Add New Property,' and follow the step-by-step guide. You'll need to provide property details, high-quality photos, amenities, availability, and pricing information.",
    category: 'Property Owner',
  },
  {
    id: '12',
    question: 'What fees does TOBI charge property owners?',
    answer: 'TOBI charges a 3% platform fee on each booking and a 5% service fee for property management (if you opt for our management services). There are no upfront or monthly listing fees.',
    category: 'Property Owner',
  },
];

// Sample testimonials
const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: '/images/testimonials/sarah.jpg',
    role: 'Property Investor',
    comment: 'The First-Time Investor Guide was incredibly helpful. It answered all my questions and gave me the confidence to make my first property investment with TOBI.',
    resourceType: 'guide',
    resourceId: '1',
  },
  {
    id: '2',
    name: 'Michael Chang',
    avatar: '/images/testimonials/michael.jpg',
    role: 'Property Owner',
    comment: 'After watching the Property Owner Guide video, I was able to optimize my listing and saw a 40% increase in bookings within the first month!',
    resourceType: 'video',
    resourceId: '5',
  },
  {
    id: '3',
    name: 'Emily Williams',
    avatar: '/images/testimonials/emily.jpg',
    role: 'TOBI Member',
    comment: 'The monthly newsletters have become my go-to resource for market trends and investment opportunities. The April edition helped me diversify my portfolio effectively.',
    resourceType: 'newsletter',
    resourceId: '4',
  },
];

// All possible tags for filtering
const allTags = [
  'Booking', 'Tutorial', 'Beginner', 'Investment', 'Finance', 'Advanced', 'Gifting', 
  'Intermediate', 'Membership', 'Benefits', 'All Levels', 'Property Owner', 'Listing',
  'Mobile App', 'Market Trends', 'Property Showcase', 'Seasonal', 'Romance', 'Family',
  'Market Analysis', 'Portfolio Management', 'Summer', 'Investment Review', 'Maintenance',
  'Tax', 'Hosting', 'Customer Service', 'Analysis', 'Photography', 'Marketing'
];

// All FAQ categories
const faqCategories = ['All', 'Booking', 'Investment', 'Gifting', 'Membership', 'Property Owner'];

export default function Resources() {
  const [activeTab, setActiveTab] = useState('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState('All');
  const [activeVideoDialog, setActiveVideoDialog] = useState<string | null>(null);
  const [savedResources, setSavedResources] = useState<string[]>([]);
  
  // Filter functions
  const filterVideos = () => {
    return videos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           video.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => video.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  };
  
  const filterNewsletters = () => {
    return newsletters.filter(newsletter => {
      const matchesSearch = newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           newsletter.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => newsletter.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  };
  
  const filterGuides = () => {
    return guides.filter(guide => {
      const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           guide.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => guide.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  };
  
  const filterFaqs = () => {
    return faqs.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedFaqCategory === 'All' || faq.category === selectedFaqCategory;
      return matchesSearch && matchesCategory;
    });
  };
  
  // Toggle saving a resource
  const toggleSaveResource = (id: string) => {
    if (savedResources.includes(id)) {
      setSavedResources(savedResources.filter(resourceId => resourceId !== id));
    } else {
      setSavedResources([...savedResources, id]);
    }
  };
  
  // Get featured resources for the featured section
  const getFeaturedResources = () => {
    const featuredVideos = videos.filter(video => video.featured).slice(0, 2);
    const featuredGuides = guides.filter(guide => guide.featured).slice(0, 2);
    const featuredNewsletters = newsletters.filter(newsletter => newsletter.featured).slice(0, 2);
    
    return [...featuredVideos.map(v => ({...v, type: 'video' as const})), 
            ...featuredGuides.map(g => ({...g, type: 'guide' as const})), 
            ...featuredNewsletters.map(n => ({...n, type: 'newsletter' as const}))];
  };
  
  // Apply theme to placeholders based on resource type
  const getPlaceholderStyle = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 dark:bg-blue-900';
      case 'newsletter':
        return 'bg-green-100 dark:bg-green-900';
      case 'guide':
        return 'bg-amber-100 dark:bg-amber-900';
      default:
        return 'bg-gray-100 dark:bg-gray-900';
    }
  };
  
  // Get appropriate icon for resource type
  const getResourceIcon = (type: string, className: string = '') => {
    switch (type) {
      case 'video':
        return <FaPlay className={`text-blue-500 ${className}`} />;
      case 'newsletter':
        return <FaNewspaper className={`text-green-500 ${className}`} />;
      case 'guide':
        return <FaBook className={`text-amber-500 ${className}`} />;
      default:
        return null;
    }
  };
  
  // Get appropriate badge color for resource type
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'newsletter':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'guide':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section with Search */}
        <div className="relative mb-16 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-10"></div>
          <div className="absolute inset-0 bg-[url('/images/hero-background.jpg')] bg-cover bg-center opacity-40"></div>
          <div className="relative z-20 py-16 px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">TOBI Knowledge Center</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Explore our collection of educational resources to make the most of your TOBI experience and enhance your property investment journey.
            </p>
            <div className="flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
              <div className="relative flex-grow">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for resources..." 
                  className="w-full px-10 py-3 rounded-md border border-white/20 bg-white/10 text-white placeholder-white/70 backdrop-blur-sm focus:ring-2 focus:ring-white/50 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative inline-block">
                <Select onValueChange={(value) => {
                  if (value === 'clear') {
                    setSelectedTags([]);
                  } else {
                    setSelectedTags(prevTags => 
                      prevTags.includes(value) ? prevTags : [...prevTags, value]
                    );
                  }
                }}>
                  <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white backdrop-blur-sm">
                    <SelectValue placeholder="Filter by tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clear">Clear filters</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Active filters */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {selectedTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    {tag}
                    <button 
                      className="ml-2" 
                      onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                <Button 
                  variant="link" 
                  onClick={() => setSelectedTags([])} 
                  className="text-white/80 hover:text-white"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Featured Resources Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Resources</h2>
            <Button variant="outline" className="group">
              <span>View all</span>
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFeaturedResources().map((resource) => (
              <Card key={`featured-${resource.type}-${resource.id}`} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative h-48 w-full">
                  {resource.type === 'video' && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-primary text-white rounded-full p-3 hover:bg-primaryho transition-colors">
                        <FaPlay />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className={getBadgeStyle(resource.type)}>
                      {resource.type === 'video' ? 'Video' : 
                       resource.type === 'newsletter' ? 'Newsletter' : 'Guide'}
                    </Badge>
                  </div>
                  <div className="h-full w-full relative overflow-hidden">
                    <div className={`absolute inset-0 ${getPlaceholderStyle(resource.type)} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                      {getResourceIcon(resource.type, 'text-4xl opacity-20')}
                    </div>
                  </div>
                </div>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <button 
                      onClick={() => toggleSaveResource(`${resource.type}-${resource.id}`)}
                      className="text-gray-400 hover:text-primary"
                    >
                      {savedResources.includes(`${resource.type}-${resource.id}`) ? 
                        <FaBookmark className="text-primary" /> : 
                        <FaRegBookmark />
                      }
                    </button>
                  </div>
                  <CardDescription className="text-xs flex items-center gap-1 text-gray-500">
                    <FaCalendarAlt size={12} />
                    <span>{resource.date}</span>
                    {resource.type === 'video' && (
                      <>
                        <span className="mx-1">•</span>
                        <FaClock size={12} />
                        <span>{resource.duration}</span>
                      </>
                    )}
                    {resource.type === 'guide' && (
                      <>
                        <span className="mx-1">•</span>
                        <FaClock size={12} />
                        <span>{resource.readTime}</span>
                      </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                    {resource.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      {resource.type === 'video' ? 'Watch Video' : 
                       resource.type === 'newsletter' ? 'Read Newsletter' : 'View Guide'}
                    </Button>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      {resource.type === 'video' && 
                        <>
                          <FaEye size={12} />
                          <span>{(resource as any).views.toLocaleString()}</span>
                        </>
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Tabs Section */}
        <Tabs defaultValue="videos" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="videos" className="flex items-center gap-2 py-3">
                <FaPlay className="text-primary" />
                <span>How-to Videos</span>
              </TabsTrigger>
              <TabsTrigger value="newsletters" className="flex items-center gap-2 py-3">
                <FaNewspaper className="text-primary" />
                <span>Newsletters</span>
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center gap-2 py-3">
                <FaBook className="text-primary" />
                <span>Guides</span>
              </TabsTrigger>
              <TabsTrigger value="faqs" className="flex items-center gap-2 py-3">
                <FaQuestion className="text-primary" />
                <span>FAQs</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filterVideos().map((video) => (
                    <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="relative h-48 w-full">
                        <div 
                          className="absolute inset-0 bg-black/20 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={() => setActiveVideoDialog(video.id)}
                        >
                          <div className="bg-primary text-white rounded-full p-3 hover:bg-primaryho transition-colors">
                            <FaPlay />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
                          {video.duration}
                        </div>
                        <div className="h-full w-full relative">
                          {/* Placeholder for video thumbnail */}
                          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <FaPlay className="text-4xl text-blue-200 dark:text-blue-800" />
                          </div>
                        </div>
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{video.title}</CardTitle>
                          <button 
                            onClick={() => toggleSaveResource(`video-${video.id}`)}
                            className="text-gray-400 hover:text-primary"
                          >
                            {savedResources.includes(`video-${video.id}`) ? 
                              <FaBookmark className="text-primary" /> : 
                              <FaRegBookmark />
                            }
                          </button>
                        </div>
                        <CardDescription className="text-xs flex items-center gap-1 text-gray-500">
                          <FaCalendarAlt size={12} />
                          <span>{video.date}</span>
                          <span className="mx-1">•</span>
                          <FaEye size={12} />
                          <span>{video.views.toLocaleString()} views</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                          {video.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {video.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary hover:text-primary/80"
                            onClick={() => setActiveVideoDialog(video.id)}
                          >
                            Watch Video
                          </Button>
                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                              <FaShare size={14} className="text-gray-500 hover:text-primary" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Video Dialog */}
            {videos.map(video => (
              <Dialog key={video.id} open={activeVideoDialog === video.id} onOpenChange={() => setActiveVideoDialog(null)}>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>{video.title}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2 text-sm">
                      <FaCalendarAlt size={12} />
                      <span>{video.date}</span>
                      <span className="mx-1">•</span>
                      <FaClock size={12} />
                      <span>{video.duration}</span>
                      <span className="mx-1">•</span>
                      <FaEye size={12} />
                      <span>{video.views.toLocaleString()} views</span>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <FaPlay className="text-4xl text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Video player would appear here</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {video.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {video.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
            
            {filterVideos().length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No videos found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  We couldn't find any videos matching your search criteria. Try adjusting your filters or search terms.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Newsletters Tab */}
          <TabsContent value="newsletters">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filterNewsletters().map((newsletter) => (
                    <Card key={newsletter.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="relative h-48 w-full">
                        <div className="h-full w-full relative">
                          {/* Placeholder for newsletter cover */}
                          <div className="absolute inset-0 bg-green-100 dark:bg-green-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <FaNewspaper className="text-4xl text-green-200 dark:text-green-800" />
                          </div>
                        </div>
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{newsletter.title}</CardTitle>
                          <button 
                            onClick={() => toggleSaveResource(`newsletter-${newsletter.id}`)}
                            className="text-gray-400 hover:text-primary"
                          >
                            {savedResources.includes(`newsletter-${newsletter.id}`) ? 
                              <FaBookmark className="text-primary" /> : 
                              <FaRegBookmark />
                            }
                          </button>
                        </div>
                        <CardDescription className="text-xs flex items-center gap-1 text-gray-500">
                          <FaCalendarAlt size={12} />
                          <span>{newsletter.date}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                          {newsletter.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {newsletter.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <Link 
                            href={newsletter.pdfUrl} 
                            className="text-primary hover:text-primaryho text-sm font-medium flex items-center gap-1"
                          >
                            <FaNewspaper size={14} />
                            <span>Read Newsletter</span>
                          </Link>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                            <FaDownload size={14} className="text-gray-500 hover:text-primary" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            
            {filterNewsletters().length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No newsletters found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  We couldn't find any newsletters matching your search criteria. Try adjusting your filters or search terms.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filterGuides().map((guide) => (
                    <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="relative h-48 w-full">
                        <div className="absolute top-2 left-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-2 py-1 rounded text-xs z-10">
                          {guide.type === 'pdf' ? 'PDF' : 
                           guide.type === 'article' ? 'Article' : 
                           'External Link'}
                        </div>
                        <div className="h-full w-full relative">
                          {/* Placeholder for guide cover */}
                          <div className="absolute inset-0 bg-amber-100 dark:bg-amber-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <FaBook className="text-4xl text-amber-200 dark:text-amber-800" />
                          </div>
                        </div>
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{guide.title}</CardTitle>
                          <button 
                            onClick={() => toggleSaveResource(`guide-${guide.id}`)}
                            className="text-gray-400 hover:text-primary"
                          >
                            {savedResources.includes(`guide-${guide.id}`) ? 
                              <FaBookmark className="text-primary" /> : 
                              <FaRegBookmark />
                            }
                          </button>
                        </div>
                        <CardDescription className="text-xs flex items-center gap-1 text-gray-500">
                          <FaCalendarAlt size={12} />
                          <span>{guide.date}</span>
                          <span className="mx-1">•</span>
                          <FaClock size={12} />
                          <span>{guide.readTime}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                          {guide.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {guide.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <Link 
                            href={guide.url} 
                            className="text-primary hover:text-primaryho text-sm font-medium flex items-center gap-1"
                            target={guide.type === 'external' ? '_blank' : undefined}
                            rel={guide.type === 'external' ? 'noopener noreferrer' : undefined}
                          >
                            {guide.type === 'external' ? 
                              <FaExternalLinkAlt size={14} /> : 
                              guide.type === 'pdf' ? 
                                <FaDownload size={14} /> : 
                                <FaBook size={14} />
                            }
                            <span>
                              {guide.type === 'pdf' ? 'Download PDF' : 
                               guide.type === 'article' ? 'Read Article' : 
                               'Visit Resource'}
                            </span>
                          </Link>
                          <span className="text-xs text-gray-500">{guide.type.toUpperCase()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            
            {filterGuides().length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No guides found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  We couldn't find any guides matching your search criteria. Try adjusting your filters or search terms.
                </p>
              </div>
            )}
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs">
            <div className="max-w-4xl mx-auto">
              {/* FAQ category selector */}
              <div className="flex justify-center mb-8">
                <div className="flex gap-2 flex-wrap">
                  {faqCategories.map(category => (
                    <Button
                      key={category}
                      variant={selectedFaqCategory === category ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => setSelectedFaqCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Accordion type="single" collapsible className="space-y-4">
                    {filterFaqs().map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg overflow-hidden">
                        <AccordionTrigger className="px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-start gap-3 text-left">
                            <FaQuestion className="text-primary mt-1 flex-shrink-0" />
                            <div>
                              <span className="text-lg font-medium">{faq.question}</span>
                              <Badge className="ml-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                {faq.category}
                              </Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 text-gray-600 dark:text-gray-300">
                          <div className="ml-8">
                            <p>{faq.answer}</p>
                            <div className="mt-4 flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                Was this helpful?
                              </Button>
                              <Button variant="ghost" size="sm" className="text-primary">
                                Related Resources
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              </AnimatePresence>
              
              {filterFaqs().length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FaSearch className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No FAQs found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    We couldn't find any FAQs matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Testimonials Section */}
        <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white dark:bg-gray-900 border-none shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                      <div className="w-10 h-10 rounded-full bg-primary/20"></div>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic mb-4">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      {testimonial.resourceType === 'video' ? 
                        <FaPlay size={10} className="text-blue-500" /> : 
                        testimonial.resourceType === 'guide' ? 
                          <FaBook size={10} className="text-amber-500" /> : 
                          <FaNewspaper size={10} className="text-green-500" />
                      }
                      <span>{
                        testimonial.resourceType === 'video' ? 
                          videos.find(v => v.id === testimonial.resourceId)?.title : 
                          testimonial.resourceType === 'guide' ? 
                            guides.find(g => g.id === testimonial.resourceId)?.title : 
                            newsletters.find(n => n.id === testimonial.resourceId)?.title
                      }</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-gradient-to-r from-primary/90 to-primary/70 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Stay Updated with TOBI Resources</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest resources, property listings, and investment opportunities directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-2 rounded-md border bg-white/10 border-white/20 placeholder-white/70 backdrop-blur-sm text-white"
            />
            <Button className="bg-white text-primary hover:bg-white/90 border-none">
              Subscribe
            </Button>
          </div>
          <p className="text-white/70 text-xs mt-3">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
        
        {/* Resource Request Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Didn't Find What You Need?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            We're constantly adding new resources. Let us know what you'd like to see, and our team will consider it for future content.
          </p>
          <Button className="bg-primary hover:bg-primaryho text-white">
            Request a Resource
          </Button>
        </div>
      </div>
    </section>
  );
}