/**
 * SEO Configuration for Apex College Landing Page
 * Comprehensive SEO settings for search engine optimization
 * Last Updated: January 25, 2026
 */

export const SEO_CONFIG = {
  // Site Information
  site: {
    name: 'Apex College of Health Science and Technology',
    url: 'https://apexcollege.edu.ng',
    domain: 'apexcollege.edu.ng',
    description: 'Leading health science and technology institution offering accredited nursing, laboratory science, community health, pharmacy, and healthcare information management programs.',
    language: 'en-NG',
    country: 'NG',
    locale: 'en_NG',
  },

  // Contact Information
  contact: {
    phone: '+234-800-XXX-XXXX',
    email: 'info@apexcollege.edu.ng',
    address: 'Plot 45, Health District Road, Lagos, Lagos 100001, Nigeria',
  },

  // Social Media Profiles
  social: {
    facebook: 'https://www.facebook.com/apexcollegeng',
    twitter: 'https://twitter.com/apexcollege',
    instagram: 'https://www.instagram.com/apexcollege',
    linkedin: 'https://www.linkedin.com/company/apex-college',
    youtube: 'https://www.youtube.com/apexcollegeng',
  },

  // Keywords Strategy
  keywords: {
    primary: [
      'nursing college Lagos',
      'health science education Nigeria',
      'NBTE accredited nursing',
      'laboratory science programs',
      'healthcare education',
    ],
    secondary: [
      'community health nursing',
      'pharmacy technician Nigeria',
      'health information management',
      'medical programs Lagos',
      'nursing school Nigeria',
      'accredited health science',
    ],
    long_tail: [
      'best nursing college in Lagos Nigeria',
      'health science programs with accreditation',
      'affordable healthcare education in Nigeria',
      'nursing diploma programs in Lagos',
      'laboratory science certification Nigeria',
    ],
  },

  // Main Pages SEO
  pages: {
    home: {
      title: 'Apex College of Health Science and Technology | Nursing, Lab Science & Healthcare Programs',
      description: 'Apex College of Health Science and Technology in Lagos offers accredited nursing, laboratory science, community health, pharmacy, and healthcare programs. NBTE-accredited institution with 20+ years of excellence.',
      keywords: 'nursing college Lagos, health science education Nigeria, laboratory science programs, community health, pharmacy technician, NBTE accredited, healthcare education, medical programs Lagos',
      canonical: 'https://apexcollege.edu.ng',
    },
    about: {
      title: 'About Apex College - Mission, Vision & History',
      description: 'Learn about Apex College\'s 20+ years of excellence in health science education. Our mission, vision, and commitment to healthcare professionals.',
      keywords: 'about Apex College, health science institution, nursing education, healthcare excellence, NBTE accreditation',
      canonical: 'https://apexcollege.edu.ng/about',
    },
    programs: {
      title: 'Health Science Programs - Nursing, Lab Science & More',
      description: 'Explore 6 accredited health science programs including nursing, laboratory science, community health, pharmacy, environmental health, and health information management.',
      keywords: 'health science programs, nursing programs, laboratory science, pharmacy technician, community health, NBTE accredited programs',
      canonical: 'https://apexcollege.edu.ng/programs',
    },
    admissions: {
      title: 'Admissions - How to Apply to Apex College',
      description: 'Application process, requirements, important dates, and how to apply to Apex College of Health Science and Technology.',
      keywords: 'admission Apex College, how to apply, admission requirements, UTME, nursing admission, health science programs',
      canonical: 'https://apexcollege.edu.ng/admissions',
    },
    apply: {
      title: 'Apply Now - Apex College Admission Form',
      description: 'Apply online to Apex College. Complete the admission form and submit your application for health science programs.',
      keywords: 'apply Apex College, admission form, online application, nursing application, health science',
      canonical: 'https://apexcollege.edu.ng/apply',
    },
  },

  // Image SEO
  images: {
    hero: {
      src: 'https://images.unsplash.com/photo-1579154204601-01d82e5e9e75?w=1200&h=600&fit=crop',
      alt: 'Apex College - Health Science Education',
      title: 'Apex College of Health Science and Technology',
    },
    logo: {
      src: '/hmslogo.jpeg',
      alt: 'Apex College Logo',
      title: 'Apex College of Health Science and Technology',
    },
  },

  // Open Graph Settings
  openGraph: {
    type: 'website',
    image: 'https://images.unsplash.com/photo-1579154204601-01d82e5e9e75?w=1200&h=630&fit=crop',
    imageAlt: 'Apex College Campus',
    imageType: 'image/jpeg',
    imageWidth: '1200',
    imageHeight: '630',
  },

  // Twitter Card Settings
  twitter: {
    card: 'summary_large_image',
    creator: '@apexcollege',
    site: '@apexcollege',
  },

  // Structured Data
  structuredData: {
    organizationType: 'EducationalOrganization',
    areaServed: 'NG',
    educationalLevel: 'Diploma, Higher National Diploma',
  },

  // Performance & Core Web Vitals Targets
  performance: {
    targetLCP: 2500, // Largest Contentful Paint (ms)
    targetFID: 100, // First Input Delay (ms)
    targetCLS: 0.1, // Cumulative Layout Shift
    targetPageSize: 2048, // KB (uncompressed)
  },

  // Robots & Crawling
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noarchive: false,
    noimageindex: false,
    noodp: false,
    nosnippet: false,
    maxSnippet: -1,
    maxImagePreview: 'large',
    maxVideoPreview: -1,
  },

  // Sitemap Configuration
  sitemap: {
    enabled: true,
    url: 'https://apexcollege.edu.ng/sitemap.xml',
    changefreq: 'weekly',
    priority: 1.0,
  },

  // RSS Feed (if applicable)
  rss: {
    enabled: false,
    url: 'https://apexcollege.edu.ng/feed.xml',
  },

  // Analytics & Tracking
  analytics: {
    googleAnalyticsId: 'G-XXXXXXXXXX', // Replace with actual ID
    googleSearchConsoleVerification: 'xxxxxxxxxxxxxxxxxxxxx', // Replace with actual verification code
    bingWebmasterTools: 'xxxxxxxxxxxxxxxxxxxxx', // Replace with actual ID
  },

  // Search Console Verification
  searchConsole: {
    google: {
      verificationCode: 'xxxxxxxxxxxxxxxxxxxxx',
      method: 'html_meta_tag', // or 'html_file' or 'dns'
    },
    bing: {
      verificationCode: 'xxxxxxxxxxxxxxxxxxxxx',
    },
  },

  // Structured Data - Schema.org
  schema: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'Apex College of Health Science and Technology',
      url: 'https://apexcollege.edu.ng',
      logo: 'https://apexcollege.edu.ng/logo.png',
      description: 'Leading health science and technology institution with 20+ years of excellence.',
      sameAs: [
        'https://www.facebook.com/apexcollegeng',
        'https://twitter.com/apexcollege',
        'https://www.instagram.com/apexcollege',
        'https://www.linkedin.com/company/apex-college',
      ],
    },
  },

  // Local Business Settings (for Google My Business)
  localBusiness: {
    businessType: 'EducationalOrganization',
    address: 'Plot 45, Health District Road, Lagos, Lagos 100001, Nigeria',
    phoneNumber: '+234-800-XXX-XXXX',
    email: 'info@apexcollege.edu.ng',
    hours: {
      monday: '08:00-17:00',
      tuesday: '08:00-17:00',
      wednesday: '08:00-17:00',
      thursday: '08:00-17:00',
      friday: '08:00-17:00',
      saturday: '09:00-14:00',
      sunday: 'closed',
    },
  },

  // Backlink Strategy
  backlinkTargets: [
    'nigerian-education-directory.org',
    'nbte.gov.ng',
    'naesn.org',
    'health-science-colleges-ng.com',
    'nigerian-universities.edu.ng',
  ],

  // Content Strategy
  contentGuidelines: {
    minimumWordCount: 300,
    optimalWordCount: 1500,
    maximumWordCount: 3000,
    headingHierarchy: 'H1 > H2 > H3 (no skipping levels)',
    imageAltTextRequired: true,
    internalLinksPerPage: '5-10',
    externalLinksPerPage: '2-5',
  },

  // Mobile Optimization
  mobile: {
    viewportWidth: 'device-width',
    viewportInitialScale: 1.0,
    viewportMaximumScale: 5.0,
    responsiveDesign: true,
    mobileFirstDesign: true,
    touchFriendly: true,
  },

  // Accessibility (WCAG 2.1 AA)
  accessibility: {
    wcagLevel: 'AA',
    colorContrast: 4.5, // For normal text
    colorContrastLarge: 3, // For large text
    focusVisible: true,
    ariaLabels: true,
    altTextForImages: true,
  },

  // Common SEO Issues & Fixes
  commonIssues: {
    duplicateContent: 'Use canonical tags',
    missingMetaTags: 'Add all required meta tags in index.html',
    poorLoadTime: 'Optimize images, use CDN, enable compression',
    notMobile: 'Implement responsive design',
    lowQualityBacklinks: 'Focus on high-quality, relevant backlinks',
  },

  // Links for submission
  submissions: {
    googleSearchConsole: 'https://search.google.com/search-console',
    bingWebmasterTools: 'https://www.bing.com/webmasters',
    googleMyBusiness: 'https://www.google.com/business',
    yandex: 'https://webmaster.yandex.com',
  },
};

export default SEO_CONFIG;
