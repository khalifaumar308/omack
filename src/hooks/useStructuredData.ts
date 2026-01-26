/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';

interface SchemaOrgData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

/**
 * JSON-LD Structured Data Component
 * Adds Schema.org markup for enhanced rich snippets in search results
 * Supports Organization, EducationalOrganization, LocalBusiness, and Event schemas
 */
export const useStructuredData = (schemaData: SchemaOrgData) => {
  useEffect(() => {
    // Create or update the structured data script
    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script') as HTMLScriptElement;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schemaData);

    return () => {
      // Keep the script - it's good for SEO
    };
  }, [schemaData]);
};

/**
 * Generate Organization Schema
 */
export const generateOrganizationSchema = (data: {
  name: string;
  logo: string;
  url: string;
  sameAs?: string[];
  address?: any;
  contact?: any;
  description?: string;
}): SchemaOrgData => ({
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: data.name,
  url: data.url,
  logo: data.logo,
  description: data.description || 'Leading health science and technology institution',
  sameAs: data.sameAs || [],
  address: data.address,
  contactPoint: data.contact,
});

/**
 * Generate Local Business Schema
 */
export const generateLocalBusinessSchema = (data: {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  url: string;
  email: string;
  openingHoursSpecification?: any[];
}): SchemaOrgData => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: data.name,
  url: data.url,
  email: data.email,
  telephone: data.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: data.address,
    addressLocality: data.city,
    addressRegion: data.state,
    postalCode: data.postalCode,
    addressCountry: 'NG',
  },
  openingHoursSpecification: data.openingHoursSpecification,
});

/**
 * Generate BreadcrumbList Schema
 */
export const generateBreadcrumbSchema = (items: Array<{
  name: string;
  url: string;
}>): SchemaOrgData => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * Generate Event Schema
 */
export const generateEventSchema = (data: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  image?: string;
  url?: string;
}): SchemaOrgData => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: data.name,
  description: data.description,
  startDate: data.startDate,
  endDate: data.endDate,
  location: {
    '@type': 'Place',
    name: data.location,
  },
  image: data.image,
  url: data.url,
});

/**
 * Generate FAQ Schema
 */
export const generateFAQSchema = (faqs: Array<{
  question: string;
  answer: string;
}>): SchemaOrgData => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export default useStructuredData;
