/**
 * APEX COLLEGE LANDING PAGE - INTEGRATION EXAMPLES
 * 
 * This file shows practical examples of how to use and integrate
 * the landing page components in your application.
 */

// ============================================
// EXAMPLE 1: Basic Integration in App.tsx
// ============================================

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApexCollegeLanding from '@/pages/ApexCollegeLanding';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page as home */}
        <Route path="/" element={<ApexCollegeLanding />} />

        {/* Or as a separate route */}
        <Route path="/landing" element={<ApexCollegeLanding />} />

        {/* Other routes... */}
      </Routes>
    </Router>
  );
}

export default App;

// ============================================
// EXAMPLE 2: Using Landing Page Constants
// ============================================

// ...existing code...
import { COLLEGE_INFO, PROGRAMS, EVENTS, TESTIMONIALS, FACILITIES, HERO_CONTENT } from '@/constants/landingConstants';

// Display college name
console.log(COLLEGE_INFO.name);
// Output: "Apex College of Health Science and Technology"

// Get first program
const firstProgram = PROGRAMS[0];
console.log(firstProgram.title); // "Nursing"

// Filter programs by color
// const redPrograms = PROGRAMS.filter(p => p.color.includes('red'));

// Get all events (example only)
// const allEvents = EVENTS;
// const upcomingEvents = allEvents.slice(0, 3);

// ============================================
// EXAMPLE 3: Customizing Content
// ============================================

// Update mission statement
// const updatedAbout = {
//   ...ABOUT_CONTENT,
//   mission: 'Your custom mission statement here',
// };

// Add a new differentiator
// const additionalDifferentiator = {
//   icon: 'Award',
//   title: 'New Achievement',
//   description: 'Description of new achievement',
//   color: 'bg-gradient-to-br from-pink-600 to-pink-700',
// };

// Access admission requirements
// const academicReqs = ADMISSIONS.academicRequirements;
// const appProcess = ADMISSIONS.applicationProcess;

// ============================================
// EXAMPLE 4: Component Composition
// ============================================

import HeroSection from '@/components/landing/HeroSection';
import ProgramsSection from '@/components/landing/ProgramsSection';
import Footer from '@/components/landing/Footer';

// Create custom landing page combining specific sections
const CustomLanding = () => {
  return (
    <div>
      <HeroSection />
      <ProgramsSection />
      {/* Other sections */}
      <Footer />
    </div>
  );
};

// ============================================
// EXAMPLE 5: Handling Navigation
// ============================================

// Scroll to specific section
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Usage in a component
const NavigationExample = () => {
  return (
    <button onClick={() => scrollToSection('programs')}>
      View Programs
    </button>
  );
};

// ============================================
// EXAMPLE 6: Data Fetching Integration
// ============================================

// useEffect and useState imported at top

// Mock API response matching landing page structure
interface LandingData {
  programs: typeof PROGRAMS;
  events: typeof EVENTS;
  testimonials: typeof TESTIMONIALS;
}

const LandingWithData = () => {
  const [, setData] = useState<LandingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/landing-data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching landing data:', error);
        // Use default data from constants
        setData({
          programs: PROGRAMS,
          events: EVENTS,
          testimonials: TESTIMONIALS,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Render with fetched or default data */}
    </div>
  );
};

// ============================================
// EXAMPLE 7: Form Integration
// ============================================

import { motion } from 'framer-motion';

interface ApplicationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  program: string;
}

const ApplicationForm = () => {
  const [formData, setFormData] = useState<ApplicationForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    program: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Success handling
        alert('Application submitted successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          program: '',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <motion.form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) =>
          setFormData({ ...formData, firstName: e.target.value })
        }
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
        required
      />
      <select
        value={formData.program}
        onChange={(e) =>
          setFormData({ ...formData, program: e.target.value })
        }
        required
      >
        <option value="">Select Program</option>
        {PROGRAMS.map((program) => (
          <option key={program.id} value={program.id}>
            {program.title}
          </option>
        ))}
      </select>
      <button type="submit">Submit Application</button>
    </motion.form>
  );
};

// ============================================
// EXAMPLE 8: Analytics Integration
// ============================================

// Track page views
const trackPageView = (sectionName: string) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: `/landing/${sectionName}`,
      page_title: `Apex College - ${sectionName}`,
    });
  }
};

// Track CTA clicks
const trackCTAClick = (buttonName: string) => {
  if (window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'engagement',
      event_label: buttonName,
      value: 1,
    });
  }
};

// Usage in components
const AnalyticsButton = () => {
  const handleClick = () => {
    trackCTAClick('apply-now');
    // Navigate or perform action
  };

  return <button onClick={handleClick}>Apply Now</button>;
};

// ============================================
// EXAMPLE 9: Theming & Customization
// ============================================

interface ThemeConfig {
  primaryGradient: string;
  secondaryGradient: string;
  primaryColor: string;
  fontFamily: string;
}

const defaultTheme: ThemeConfig = {
  primaryGradient: 'from-blue-600 to-teal-600',
  secondaryGradient: 'from-blue-50 to-teal-50',
  primaryColor: '#0284C7', // blue-600
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

// Create themed landing page
const ThemedLanding = ({ theme = defaultTheme }) => {
  return (
    <div style={{ '--primary-gradient': theme.primaryGradient } as React.CSSProperties}>
      <ApexCollegeLanding />
    </div>
  );
};

// ============================================
// EXAMPLE 10: Mobile Menu Customization
// ============================================

import { Menu, X } from 'lucide-react';

const CustomMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Programs', href: '#programs' },
    { label: 'Admissions', href: '#admissions' },
    { label: 'Contact', href: '#footer' },
  ];

  return (
    <nav>
      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6">
        {navItems.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="block p-4">
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

// ============================================
// EXAMPLE 11: Event Management
// ============================================

interface EventFilter {
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

const getFilteredEvents = (filter: EventFilter) => {
  return EVENTS.filter((event) => {
    const eventDate = new Date(event.date);
    
    if (filter.dateFrom && eventDate < filter.dateFrom) return false;
    if (filter.dateTo && eventDate > filter.dateTo) return false;
    
    return true;
  });
};

// Get upcoming events (next 30 days)
const getUpcomingEvents = () => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return getFilteredEvents({
    dateFrom: now,
    dateTo: futureDate,
  });
};

// ============================================
// EXAMPLE 12: Export Statistics
// ============================================

const getCollegeStatistics = () => {
  return {
    yearsFounded: new Date().getFullYear() - COLLEGE_INFO.foundedYear,
    totalPrograms: PROGRAMS.length,
    upcomingEvents: EVENTS.length,
    totalTestimonials: TESTIMONIALS.length,
    totalFacilities: FACILITIES.length,
  };
};

// Usage
const stats = getCollegeStatistics();
console.log(`Founded ${stats.yearsFounded} years ago`);
console.log(`${stats.totalPrograms} programs available`);

// ============================================
// EXAMPLE 13: SEO Integration
// ============================================

import { Helmet } from 'react-helmet';

const SEOWrapper = () => {
  return (
    <>
      <Helmet>
        <title>Apex College of Health Science and Technology - NBTE Accredited</title>
        <meta
          name="description"
          content={HERO_CONTENT.subheading}
        />
        <meta name="keywords" content="health sciences, nursing, medical laboratory, Nigeria" />
        <meta property="og:title" content="Apex College of Health Science and Technology" />
        <meta
          property="og:description"
          content={HERO_CONTENT.subheading}
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <ApexCollegeLanding />
    </>
  );
};

// ============================================
// EXAMPLE 14: Email Template Integration
// ============================================

const getApplicationConfirmationEmail = (applicantName: string, program: string) => {
  return `
    <html>
      <body>
        <h1>Application Received!</h1>
        <p>Dear ${applicantName},</p>
        <p>Thank you for applying to our <strong>${program}</strong> program at Apex College of Health Science and Technology.</p>
        <p>We have received your application and will review it shortly.</p>
        <p>Best regards,<br/>Apex College Admissions Team</p>
        <p>
          <small>
            ${COLLEGE_INFO.contact.address}<br/>
            ${COLLEGE_INFO.contact.phone}<br/>
            ${COLLEGE_INFO.contact.email}
          </small>
        </p>
      </body>
    </html>
  `;
};

// ============================================
// EXPORT ALL EXAMPLES
// ============================================

export {
  App,
  CustomLanding,
  NavigationExample,
  LandingWithData,
  ApplicationForm,
  AnalyticsButton,
  ThemedLanding,
  CustomMobileMenu,
  getFilteredEvents,
  getUpcomingEvents,
  getCollegeStatistics,
  SEOWrapper,
  getApplicationConfirmationEmail,
  trackPageView,
  trackCTAClick,
};
