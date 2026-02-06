// Configuration and Setup Guide for Apex College Landing Page

/**
 * SETUP INSTRUCTIONS
 * 
 * 1. INSTALL DEPENDENCIES
 * -----------------------
 * If not already installed, run:
 * npm install framer-motion lucide-react
 * 
 * 2. VERIFY TAILWIND CSS
 * ----------------------
 * Ensure tailwind.config.ts has:
 * - content: ['./src/**\/*.{js,ts,jsx,tsx}']
 * - All color extensions in tailwind.config.js
 * 
 * 3. ADD ROUTE TO YOUR ROUTER
 * ---------------------------
 * In your App.tsx or routing file:
 * 
 *   import ApexCollegeLanding from './pages/ApexCollegeLanding';
 *   
 *   // Add to your routes:
 *   <Route path="/landing" element={<ApexCollegeLanding />} />
 *   // or
 *   <Route path="/" element={<ApexCollegeLanding />} /> // if it's the main page
 * 
 * 4. TEST THE LANDING PAGE
 * ------------------------
 * npm run dev
 * Navigate to http://localhost:5173/landing (or your configured path)
 * 
 * 5. BUILD FOR PRODUCTION
 * ----------------------
 * npm run build
 * npm run preview
 */

// TAILWIND CONFIGURATION REFERENCE
// Add this to your tailwind.config.js if not present:

/*
export default {
  content: ['./src/**\/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Add any custom colors if needed
      },
      animation: {
        // Custom animations can be added here
      },
      backgroundImage: {
        // Custom gradients if needed
      },
    },
  },
  plugins: [],
}
*/

// COMPONENT IMPORT STRUCTURE
// All components are in: src/components/landing/

export const LANDING_COMPONENTS = {
  MAIN: 'ApexCollegeLanding.tsx',
  NAVIGATION: 'Navigation.tsx',
  HERO: 'HeroSection.tsx',
  ABOUT: 'AboutSection.tsx',
  PROGRAMS: 'ProgramsSection.tsx',
  WHY_CHOOSE: 'WhyChooseUsSection.tsx',
  EVENTS: 'EventsAnnouncementsSection.tsx',
  FACILITIES: 'FacilitiesSection.tsx',
  TESTIMONIALS: 'TestimonialsSection.tsx',
  ADMISSIONS: 'AdmissionsSection.tsx',
  FOOTER: 'Footer.tsx',
  SCROLL_PROGRESS: 'ScrollProgressBar.tsx',
  BACK_TO_TOP: 'BackToTop.tsx',
};

// TYPE DEFINITIONS
// Import from: src/types/landing.ts

export interface LandingPageTypes {
  Program: {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    accreditation?: string;
  };
  Event: {
    id: string;
    title: string;
    date: string;
    time: string;
    description: string;
    location?: string;
    color: string;
  };
  Announcement: {
    id: string;
    title: string;
    date: string;
    description: string;
    category: string;
    color: string;
  };
  Testimonial: {
    id: string;
    name: string;
    course: string;
    text: string;
    image: string;
    year: number;
  };
}

// CUSTOMIZATION EXAMPLES

// 1. CHANGE HERO BACKGROUND COLOR
// In HeroSection.tsx, update:
// from-blue-900 via-blue-600 to-teal-600 (current)
// to your desired colors

// 2. ADD MORE PROGRAMS
// In ProgramsSection.tsx, add to programs array:
/*
{
  id: 'midwifery',
  icon: <HeartHandshake className="w-8 h-8" />,
  title: 'Midwifery',
  description: 'Comprehensive training in maternal and neonatal care.',
  color: 'from-pink-500 to-rose-500',
  accreditation: 'NBTE Accredited',
}
*/

// 3. MODIFY EVENTS AND ANNOUNCEMENTS
// In EventsAnnouncementsSection.tsx, edit:
export const events = [
  {
    id: 'your-event',
    title: 'Event Title',
    date: 'YYYY-MM-DD',
    time: 'HH:MM AM/PM',
    description: 'Event description',
    location: 'Venue',
    color: 'your-color', // blue, green, red, purple, etc.
  },
];

// 4. UPDATE CONTACT INFORMATION
// In Footer.tsx, modify:
export const contactInfo = {
  address: 'Your Address, City, State, Country',
  phone: '+234 XXX-XXX-XXXX',
  email: 'your.email@apexcollege.edu.ng',
  website: 'www.apexcollege.edu.ng',
};

// 5. CHANGE SOCIAL MEDIA LINKS
// In Footer.tsx, update the social media href attributes

// ANIMATION CUSTOMIZATION

// To make animations faster:
// Change transition={{ duration: 0.8 }} to duration: 0.4

// To make animations slower:
// Change transition={{ duration: 0.8 }} to duration: 1.5

// To disable animations for a component:
// Wrap in <div> without motion component
// Or set transition={{ duration: 0 }}

// TROUBLESHOOTING

/*
1. Components not rendering?
   - Check import paths are correct
   - Verify all components are exported as default
   - Check for TypeScript errors

2. Styles not applying?
   - Verify Tailwind CSS is installed and configured
   - Check tailwind.config.ts includes correct content paths
   - Clear build cache: rm -rf .next or dist/

3. Animations not smooth?
   - Check if GPU acceleration is enabled (check browser DevTools)
   - Ensure Framer Motion is latest version
   - Reduce animation complexity on slower devices

4. Images not loading?
   - The demo uses Unsplash URLs
   - Replace with your own image URLs in component data
   - Ensure CORS headers are set correctly

5. Mobile layout issues?
   - Check responsive classes (sm:, md:, lg:, xl:)
   - Test in actual mobile browser, not just dev tools
   - Verify viewport meta tag in HTML
*/

// PERFORMANCE TIPS

/*
1. Use Next.js Image component for image optimization
2. Lazy load components with React.lazy() and Suspense
3. Memoize components with React.memo() if needed
4. Profile with React DevTools Profiler
5. Monitor Lighthouse scores regularly
6. Use Next.js or Vite for code splitting
*/

// TESTING

/*
1. Unit tests:
   - Test each component renders correctly
   - Use React Testing Library
   - Mock Framer Motion for tests

2. Integration tests:
   - Test navigation between sections
   - Test scroll behavior
   - Test form submissions

3. Visual tests:
   - Test on multiple screen sizes
   - Test on different browsers
   - Verify animations smoothness
*/

// DEPLOYMENT CHECKLIST

export const DEPLOYMENT_CHECKLIST = [
  '✓ All links are working',
  '✓ Contact information is correct',
  '✓ Images are optimized and loading',
  '✓ All animations perform smoothly',
  '✓ Mobile responsive design verified',
  '✓ Lighthouse score is 90+',
  '✓ No console errors or warnings',
  '✓ Social media links work',
  '✓ CTA buttons link to correct pages',
  '✓ Analytics tracking is set up',
  '✓ SEO meta tags are configured',
  '✓ Sitemap.xml is created',
  '✓ robots.txt is configured',
];

// ENVIRONMENT VARIABLES

/*
If you need environment variables, add to .env.local:

VITE_COLLEGE_NAME=Apex College of Health Science and Technology
VITE_COLLEGE_EMAIL=admissions@apexcollege.edu.ng
VITE_COLLEGE_PHONE=+234 (0) 701-234-5678
VITE_COLLEGE_ADDRESS=Plot 5, Health Park Avenue, Lagos, Nigeria

Then access in components:
const collegeEmail = import.meta.env.VITE_COLLEGE_EMAIL;
*/
