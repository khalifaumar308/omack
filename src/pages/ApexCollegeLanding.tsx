import React, { useState } from 'react';
import Navigation from '@/components/landing/Navigation';
import HeroSection from '@/components/landing/HeroSection';
import AboutSection from '@/components/landing/AboutSection';
import ProgramsSection from '@/components/landing/ProgramsSection';
import WhyChooseUsSection from '@/components/landing/WhyChooseUsSection';
import EventsAnnouncementsSection from '@/components/landing/EventsAnnouncementsSection';
import FacilitiesSection from '@/components/landing/FacilitiesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import AdmissionsSection from '@/components/landing/AdmissionsSection';
import Footer from '@/components/landing/Footer';
import ScrollProgressBar from '@/components/landing/ScrollProgressBar';
import BackToTop from '@/components/landing/BackToTop';
import useSEO from '@/hooks/useSEO';
import { useStructuredData, generateOrganizationSchema, generateLocalBusinessSchema } from '@/hooks/useStructuredData';

export default function ApexCollegeLanding() {
  const [isScrolled, setIsScrolled] = useState(false);

  // SEO Metadata
  useSEO({
    title: 'Apex College of Health Science and Technology | Nursing, Lab Science & Healthcare Programs',
    description: 'Apex College of Health Science and Technology in Lagos offers accredited nursing, laboratory science, community health, pharmacy, and healthcare programs. NBTE-accredited institution with 20+ years of excellence.',
    keywords: 'nursing college Lagos, health science education Nigeria, laboratory science programs, community health, pharmacy technician, NBTE accredited, healthcare education, medical programs Lagos',
    ogTitle: 'Apex College of Health Science and Technology',
    ogDescription: 'Leading health science institution with 20+ years of excellence in nursing, laboratory science, and healthcare education. NBTE accredited.',
    ogImage: 'https://images.unsplash.com/photo-1579154204601-01d82e5e9e75?w=1200&h=630&fit=crop',
    ogUrl: 'https://apexcollege.edu.ng',
    canonical: 'https://apexcollege.edu.ng',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Apex College - Health Science Excellence',
    twitterDescription: 'Professional healthcare education in Nigeria',
    twitterImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=630&fit=crop',
    author: 'Apex College of Health Science and Technology',
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    language: 'en-NG',
  });

  // Organization Schema
  useStructuredData(
    generateOrganizationSchema({
      name: 'Apex College of Health Science and Technology',
      url: 'https://apexcollege.edu.ng',
      logo: 'https://apexcollege.edu.ng/logo.png',
      description: 'Leading health science and technology institution offering accredited nursing, laboratory science, community health, pharmacy, and healthcare information management programs.',
      sameAs: [
        'https://www.facebook.com/apexcollegeng',
        'https://twitter.com/apexcollege',
        'https://www.instagram.com/apexcollege',
        'https://www.linkedin.com/company/apex-college',
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plot 45, Health District Road',
        addressLocality: 'Lagos',
        addressRegion: 'Lagos',
        postalCode: '100001',
        addressCountry: 'NG',
      },
      contact: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        telephone: '+234-800-XXX-XXXX',
        email: 'info@apexcollege.edu.ng',
      },
    })
  );

  // Local Business Schema
  useStructuredData(
    generateLocalBusinessSchema({
      name: 'Apex College of Health Science and Technology',
      address: 'Plot 45, Health District Road',
      city: 'Lagos',
      state: 'Lagos',
      postalCode: '100001',
      phone: '+234-800-XXX-XXXX',
      url: 'https://apexcollege.edu.ng',
      email: 'info@apexcollege.edu.ng',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '17:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '09:00',
          closes: '14:00',
        },
      ],
    })
  );

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <ScrollProgressBar />
      <Navigation isScrolled={isScrolled} />
      
      <main>
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <WhyChooseUsSection />
        <EventsAnnouncementsSection />
        <FacilitiesSection />
        <TestimonialsSection />
        <AdmissionsSection />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
