/**
 * SEO Best Practices & Optimization Utilities
 * Comprehensive collection of SEO functions and best practices
 */

/**
 * Metadata Guidelines
 */
export const METADATA_GUIDELINES = {
  // Title Tag
  title: {
    minLength: 30,
    optimalLength: 50,
    maxLength: 60,
    format: 'Primary Keyword | Brand Name',
    examples: [
      'Nursing Programs Lagos | Apex College - NBTE Accredited',
      'Laboratory Science Degree | Apex College Health Science',
      'Healthcare Education Nigeria | Apex College',
    ],
    tips: [
      'Include primary keyword near the beginning',
      'Include brand/college name at the end',
      'Use pipe (|) or dash (-) as separator',
      'Avoid keyword stuffing',
      'Make it compelling and clickable',
      'Use power words (Best, Top, Free, etc.)',
    ],
  },

  // Meta Description
  description: {
    minLength: 120,
    optimalLength: 155,
    maxLength: 160,
    format: 'College name + unique value + CTA',
    examples: [
      'Apex College offers accredited nursing & health science programs in Lagos. NBTE certified. 20+ years, 5000+ graduates, 98% employment. Apply now!',
      'Top-rated health science college in Nigeria. Nursing, lab science, pharmacy programs. Expert faculty, modern facilities. Enroll today.',
      'Leading healthcare education institution. Accredited by NBTE. Small class sizes, hands-on training, 100% job placement. Start your career.',
    ],
    tips: [
      'Include primary keyword naturally',
      'Mention unique benefits',
      'Include call-to-action (Apply, Learn More, Enroll)',
      'Write for users first, search engines second',
      'Include location (Lagos) for local SEO',
      'Highlight social proof (years, graduates, employment rate)',
    ],
  },

  // Meta Keywords
  keywords: {
    optimal: 5,
    maxCount: 10,
    minLength: 2,
    maxLength: 25,
    tips: [
      'Focus on user search intent',
      'Mix broad and specific keywords',
      'Include location (Lagos, Nigeria)',
      'Include variations and synonyms',
      'Research competitor keywords',
      'Update based on analytics data',
    ],
  },
};

/**
 * On-Page SEO Elements
 */
export const ON_PAGE_SEO = {
  // Headers
  headers: {
    h1: {
      count: 1, // Only one H1 per page
      tips: [
        'Include primary keyword',
        'Make it descriptive and compelling',
        'Don\'t make it too long (max 65 characters)',
        'Avoid keyword stuffing',
        'Match or closely relate to title tag',
      ],
    },
    h2: {
      maxCount: 5,
      tips: [
        'Organize content logically',
        'Include related keywords',
        'Use for main section breaks',
        'Make them descriptive',
      ],
    },
    h3: {
      maxCount: 10,
      tips: [
        'Subsection organization',
        'Support main H2 topics',
        'Include keyword variations',
      ],
    },
  },

  // Content
  content: {
    minWords: 300,
    optimalWords: 1500,
    maxWords: 3000,
    tips: [
      'Write naturally, don\'t force keywords',
      'Aim for 1-2% keyword density',
      'Use shorter paragraphs (3-5 lines)',
      'Include internal links (5-10)',
      'Use lists and bullet points',
      'Include images with alt text',
      'Update content regularly (monthly)',
    ],
  },

  // Images
  images: {
    altText: {
      tips: [
        'Describe image content accurately',
        'Include keywords naturally',
        'Keep under 125 characters',
        'Avoid "image of" or "picture of"',
        'Be descriptive and specific',
      ],
      examples: [
        'GOOD: "Nursing students in clinical laboratory at Apex College"',
        'GOOD: "State-of-the-art medical simulation center with patient mannequins"',
        'BAD: "image.jpg"',
        'BAD: "photo"',
      ],
    },
    fileName: {
      tips: [
        'Use hyphens to separate words',
        'Be descriptive',
        'Include relevant keywords',
        'Use lowercase letters',
        'Keep under 75 characters',
      ],
      examples: [
        'GOOD: "apex-college-nursing-program.jpg"',
        'GOOD: "health-science-classroom-lab.jpg"',
        'BAD: "IMG_12345.jpg"',
        'BAD: "photo_123_final.jpg"',
      ],
    },
    optimization: {
      tips: [
        'Compress images (PNG/WebP/JPEG)',
        'Use appropriate dimensions',
        'Implement lazy loading',
        'Add srcset for responsive images',
        'Target max 100KB per image',
        'Use modern formats (WebP)',
      ],
    },
  },

  // Internal Links
  internalLinks: {
    optimal: 7,
    minCount: 5,
    maxCount: 10,
    tips: [
      'Link to relevant, related pages',
      'Use descriptive anchor text',
      'Include keywords in anchor text',
      'Avoid "click here" anchors',
      'Link from high to low authority pages',
      'Create natural link placement',
    ],
    anchorTextExamples: [
      'GOOD: "Learn more about our nursing programs"',
      'GOOD: "Explore health science programs"',
      'BAD: "Click here"',
      'BAD: "Read more"',
    ],
  },

  // External Links
  externalLinks: {
    minCount: 0,
    optimalCount: 3,
    maxCount: 5,
    targets: [
      'NBTE official website',
      'Nigerian health organizations',
      'Government health departments',
      'Academic associations',
      'Health science forums',
    ],
    tips: [
      'Link to high-authority sites only',
      'Ensure relevance to content',
      'Use descriptive anchor text',
      'Set target="_blank" for external links',
      'Check links regularly for updates',
    ],
  },

  // URL Structure
  urlStructure: {
    tips: [
      'Use hyphens to separate words',
      'Keep URLs short (under 75 characters)',
      'Use descriptive, keyword-rich URLs',
      'Avoid special characters',
      'Use lowercase letters',
      'Avoid parameters when possible',
      'Keep structure simple and logical',
    ],
    examples: [
      'GOOD: "/programs/nursing-diploma"',
      'GOOD: "/about/our-mission"',
      'BAD: "/page1?id=123"',
      'BAD: "/service-we-offer-in-our-college"',
    ],
  },
};

/**
 * Technical SEO Elements
 */
export const TECHNICAL_SEO = {
  // Core Web Vitals
  coreWebVitals: {
    LCP: {
      name: 'Largest Contentful Paint',
      target: 2500, // milliseconds
      how: [
        'Optimize images and videos',
        'Minify CSS and JavaScript',
        'Leverage browser caching',
        'Use Content Delivery Network (CDN)',
        'Reduce server response time',
      ],
    },
    FID: {
      name: 'First Input Delay',
      target: 100, // milliseconds
      how: [
        'Minimize JavaScript execution',
        'Break long JavaScript tasks',
        'Use Web Workers for heavy tasks',
        'Defer non-critical JavaScript',
        'Optimize event handlers',
      ],
    },
    CLS: {
      name: 'Cumulative Layout Shift',
      target: 0.1,
      how: [
        'Use size attributes for images/videos',
        'Avoid inserting content above existing content',
        'Use transform animations instead of top/left',
        'Set font-display: swap for web fonts',
        'Keep ads/iframes at bottom of page',
      ],
    },
  },

  // SSL/HTTPS
  ssl: {
    importance: 'CRITICAL - Ranking factor',
    implementation: [
      'Install SSL certificate',
      'Redirect HTTP to HTTPS',
      'Update all internal links to HTTPS',
      'Verify SSL installation',
      'Set HSTS header',
    ],
  },

  // Sitemap
  sitemap: {
    importance: 'HIGH - Improves crawlability',
    requirements: [
      'Valid XML format',
      'Include all important pages',
      'Update regularly',
      'Submit to Search Console',
      'Include change frequency',
      'Include priority scores',
      'Max 50,000 URLs per sitemap',
    ],
  },

  // Robots.txt
  robots: {
    importance: 'MEDIUM - Guidelines for crawlers',
    requirements: [
      'Located at: /robots.txt',
      'Allow all important pages',
      'Disallow crawl of duplicate pages',
      'Specify crawl delay',
      'Link to sitemap',
    ],
  },

  // Mobile Friendliness
  mobile: {
    importance: 'CRITICAL - Mobile-first indexing',
    checklist: [
      'Responsive design implemented',
      'Viewport meta tag configured',
      'Readable font sizes (minimum 16px)',
      'Tap-friendly buttons (minimum 48x48px)',
      'No horizontal scrolling',
      'Fast load time on 4G',
      'Optimized for touch',
    ],
  },

  // Structured Data
  structuredData: {
    importance: 'HIGH - Rich snippets in SERP',
    schemas: [
      'Organization',
      'LocalBusiness',
      'EducationalOrganization',
      'Event',
      'BreadcrumbList',
      'FAQPage',
    ],
    implementation: [
      'Use JSON-LD format',
      'Validate with Schema.org validator',
      'Test with Google Rich Results Test',
      'Include in page header',
    ],
  },
};

/**
 * Off-Page SEO (Link Building & Authority)
 */
export const OFF_PAGE_SEO = {
  // Link Building Strategy
  linkBuilding: {
    backlinks: {
      importance: 'CRITICAL - Main ranking factor',
      quality: [
        'High domain authority (DA 30+)',
        'Topically relevant sites',
        'Natural anchor text',
        'Editorial links (not paid)',
        'Diverse link profile',
      ],
      strategies: [
        'Guest posting on health websites',
        'Directory submissions (DMOZ, local)',
        'Press releases to health journals',
        'Partnerships with universities',
        'Educational resource links',
        'Interview features on podcasts',
        'Community involvement links',
      ],
    },
  },

  // Citation Building
  citations: {
    importance: 'HIGH - Local SEO factor',
    nap: 'Name, Address, Phone (must be consistent)',
    directories: [
      'Google My Business',
      'Bing Places for Business',
      'Yellow Pages',
      'Yelp',
      'Apple Maps',
      'Local Nigerian directories',
      'Health organization directories',
    ],
  },

  // Social Signals
  social: {
    importance: 'MEDIUM - Indirect ranking factor',
    strategy: [
      'Regular Facebook posts',
      'Twitter engagement',
      'Instagram visual content',
      'LinkedIn professional updates',
      'YouTube educational content',
      'Community participation',
    ],
  },

  // Brand Building
  brand: {
    importance: 'HIGH - Indirect ranking factor',
    tactics: [
      'Consistent branding across platforms',
      'Professional design',
      'Regular content publishing',
      'Thought leadership articles',
      'Speaking engagements',
      'Media mentions',
      'Award submissions',
    ],
  },
};

/**
 * Local SEO
 */
export const LOCAL_SEO = {
  googleMyBusiness: {
    importance: 'CRITICAL - Local search visibility',
    setup: [
      'Create/claim business profile',
      'Verify location',
      'Add complete information',
      'Add high-quality photos',
      'Write compelling description',
      'Add service areas',
      'Configure opening hours',
    ],
    optimization: [
      'Add 3-4 recent photos monthly',
      'Respond to reviews promptly',
      'Post updates and events',
      'Monitor Q&A section',
      'Track insights and search terms',
    ],
  },

  localKeywords: [
    'nursing college Lagos Nigeria',
    'health science programs near me',
    'NBTE accredited schools in Lagos',
    'affordable nursing education Lagos',
    'best health science college Nigeria',
  ],

  localLinks: [
    'Lagos Chamber of Commerce',
    'Nigeria Health Practitioners Registration Council',
    'NBTE Directory',
    'Lagos State Education Board',
  ],
};

/**
 * Content Strategy
 */
export const CONTENT_STRATEGY = {
  // Blog Topics
  blogTopics: [
    'How to choose a nursing school',
    'Career paths in health science',
    'Student success stories',
    'Campus life and facilities',
    'Admission requirements explained',
    'Scholarship opportunities',
    'Healthcare industry trends',
    'Alumni achievements',
    'Day in the life of a student',
    'Program highlights and specializations',
  ],

  // Content Calendar
  schedule: {
    frequency: 'Weekly or bi-weekly',
    types: [
      'Educational blog posts',
      'Student testimonials',
      'Program updates',
      'Event announcements',
      'Industry news',
      'How-to guides',
      'FAQ content',
    ],
  },

  // Content Optimization
  optimization: {
    readability: [
      'Short paragraphs (2-4 sentences)',
      'Subheadings every 100-200 words',
      'Bullet points and lists',
      'Bold key phrases',
      'Varied sentence length',
      'Active voice preferred',
    ],
    engagement: [
      'Include relevant images',
      'Add videos when appropriate',
      'Call-to-action buttons',
      'Internal links to related content',
      'External links to authority sources',
      'Social sharing buttons',
    ],
  },
};

/**
 * Competitor Analysis
 */
export const COMPETITOR_ANALYSIS = {
  whatToAnalyze: [
    'Top ranking keywords',
    'Backlink profile',
    'Content strategy',
    'Technical SEO implementation',
    'User experience design',
    'Site structure',
    'Page speed',
    'Mobile optimization',
  ],

  tools: [
    'SEMrush',
    'Ahrefs',
    'Moz',
    'SimilarWeb',
    'Google Search Console',
    'Google Analytics',
  ],
};

/**
 * SEO Audit Checklist
 */
export const SEO_AUDIT_CHECKLIST = {
  technical: [
    '✓ HTTPS implemented',
    '✓ No duplicate content',
    '✓ Canonical tags present',
    '✓ Robots.txt optimized',
    '✓ Sitemap.xml created',
    '✓ Site speed optimized',
    '✓ Mobile responsive',
    '✓ Core Web Vitals passing',
  ],

  onPage: [
    '✓ Title tags optimized',
    '✓ Meta descriptions written',
    '✓ H1 tag present and optimized',
    '✓ Header hierarchy correct',
    '✓ Images have alt text',
    '✓ Internal links optimized',
    '✓ Content quality high',
    '✓ No grammar/spelling errors',
  ],

  offPage: [
    '✓ Google My Business claimed',
    '✓ Local citations created',
    '✓ Backlinks analyzed',
    '✓ Social profiles created',
    '✓ Press releases published',
    '✓ Brand mentions tracked',
  ],

  reporting: [
    '✓ Search Console configured',
    '✓ Analytics tracking active',
    '✓ Keyword rankings tracked',
    '✓ Traffic sources analyzed',
    '✓ Conversion tracking enabled',
  ],
};

export default {
  METADATA_GUIDELINES,
  ON_PAGE_SEO,
  TECHNICAL_SEO,
  OFF_PAGE_SEO,
  LOCAL_SEO,
  CONTENT_STRATEGY,
  COMPETITOR_ANALYSIS,
  SEO_AUDIT_CHECKLIST,
};
