/**
 * APEX COLLEGE LANDING PAGE - VISUAL STRUCTURE GUIDE
 * 
 * This file provides a visual representation of the landing page structure,
 * data flow, and component hierarchy.
 */

/**
 * LANDING PAGE STRUCTURE (Visual Layout)
 * 
 * ┌─────────────────────────────────────────────┐
 * │          STICKY NAVIGATION                  │
 * │  [Logo]  [Links]  [Apply Now CTA]          │
 * └─────────────────────────────────────────────┘
 *                      ▼
 * ┌─────────────────────────────────────────────┐
 * │                                             │
 * │           HERO SECTION                      │
 * │  ✨ Animated Gradient Background            │
 * │                                             │
 * │     [Headline with gradient text]           │
 * │  [Subheading about accreditation]           │
 * │   [Apply Now]  [Learn More]                 │
 * │     📖 Scroll down...                       │
 * │                                             │
 * └─────────────────────────────────────────────┘
 *                      ▼
 * ┌─────────────────────────────────────────────┐
 * │         ABOUT SECTION                       │
 * │                                             │
 * │  ┌──────────────┐  ┌──────────────┐         │
 * │  │Mission Vision│  │Statistics    │         │
 * │  │             │  │20+ years   ⬆│         │
 * │  │Core Values  │  │5000+ grads ⬆│         │
 * │  │             │  │98% employed  │         │
 * │  │             │  │8 programs    │         │
 * │  └──────────────┘  └──────────────┘         │
 * │                                             │
 * └─────────────────────────────────────────────┘
 *                      ▼
 * ┌─────────────────────────────────────────────┐
 * │       PROGRAMS SECTION (Grid)               │
 * │                                             │
 * │  [Nursing]    [Lab Science]  [Community]   │
 * │  [Pharmacy]   [Environment]  [HIM]         │
 * │                                             │
 * │  Each has: Icon, Title, Description,        │
 * │  NBTE Badge, Learn More link                │
 * │                                             │
 * └─────────────────────────────────────────────┘
 *                      ▼
 * ┌─────────────────────────────────────────────┐
 * │    WHY CHOOSE US (6 Differentiators)       │
 * │                                             │
 * │  [Award]      [Users]      [Lightning]     │
 * │  NBTE         Experienced  Modern          │
 * │                                             │
 * │  [TrendUp]    [Book]       [Handshake]    │
 * │  98% Employ   Practical    Industry        │
 * │                                             │
 * │  + Student Testimonial Highlight           │
 * │                                             │
 * └─────────────────────────────────────────────┘
 *                      ▼
 * ┌─────────────────────────────────────────────┐
 * │   EVENTS & ANNOUNCEMENTS (Tabbed)          │
 * │                                             │
 * │  [Events] [Announcements]                  │
 * │                                             │
 * │  ┌─ Events Tab ────────────┐               │
 * │  │ 1. Orientation Day       │               │
 * │  │ 2. Health Fair           │               │
 * │  │ 3. Guest Lectures        │               │
 * │  │ 4. Matriculation         │               │
 * │  └──────────────────────────┘               │
 * │         or                                  │
 * │  ┌─ Announcements Tab ──────┐              │
 * │  │ 1. App Deadline Extended │               │
 * │  │ 2. Exam Schedule Released│               │
 * │  │ 3. New Program Launch    │               │
 * │  │ 4. Holiday Schedule      │               │
 * │  └──────────────────────────┘               │
 * │                                             │
 * │        [View All]                           │
 * │                                             │
 * └─────────────────────────────────────────────┘
 *                      ▼
 * ┌─────────────────────────────────────────────┐
 * │      FACILITIES CAROUSEL                    │
 * │                                             │
 * │  ◄  [Image1] [Image2] [Image3]  ►          │
 * │                                             │
 * │  Facilities: Lab | Classroom | Library     │
 * │              Clinic | Simulation | General │
 * │                                             │
 * │  • Navigation arrows                        │
 * │  • Dot indicators                           │
 * │  • Modal view for details                   │
 * │                                             │
 * └─────────────────────────────────────────────┘
 *                      ▼
 * ┌─────────────────────────────────────────────┐
 * │    TESTIMONIALS CAROUSEL                    │
 * │                                             │
 * │    ◄  [Testimonial 1]  [Testimonial 2]  ►  │
 * │                                             │
 * │  Each has:                                  │
 * │  • Student photo & name                     │
 * │  • Course & graduation year                 │
 * │  • Quote                                    │
 * │  • Star rating                              │
 * │                                             │
 * │  ○ ● ○ ○  (Pagination)                     │
 * │                                             │
 * │  Outcomes: 98% Employment, 5000+ Grads     │
 * │                                             │
 * └─────────────────────────────────────────────┘
 *                      ▼
 * ┌─────────────────────────────────────────────┐
 * │      ADMISSIONS SECTION                     │
 * │                                             │
 * │   Process: ① → ② → ③ → ④                   │
 * │  Submit    Exam    Merit    Enroll         │
 * │                                             │
 * │  [Academic Req.] [App Process]             │
 * │  [Documents]     [Important Dates]         │
 * │                                             │
 * │  Duration: 3 years                          │
 * │  Certification: Diploma awarded             │
 * │                                             │
 * │  [Apply Now]  [Schedule Tour]              │
 * │                                             │
 * └─────────────────────────────────────────────┘
 *                      ▼
 * ┌─────────────────────────────────────────────┐
 * │           FOOTER                            │
 * │                                             │
 * │  [Logo]      [Quick Links]  [Academic]     │
 * │  College     About          Nursing        │
 * │  Info        Programs       Lab Science    │
 * │              Admissions     etc.           │
 * │              Contact                       │
 * │                                             │
 * │  🔗 Facebook 🔗 Twitter 🔗 Instagram       │
 * │                                             │
 * │  ✉️ Plot 5, Health Park Avenue, Lagos     │
 * │  📞 +234 (0) 701-234-5678                  │
 * │  📧 admissions@apexcollege.edu.ng          │
 * │                                             │
 * │  © 2026 Apex College. All rights reserved. │
 * │                                             │
 * └─────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────┐
 * │  [Back to Top ↑] [Scroll Progress: ════]   │
 * └─────────────────────────────────────────────┘
 */

/**
 * COMPONENT HIERARCHY
 * 
 * ApexCollegeLanding (Main Container)
 * │
 * ├── ScrollProgressBar
 * │   └── Progress indicator bar
 * │
 * ├── Navigation
 * │   ├── Logo
 * │   ├── Desktop Menu (links)
 * │   ├── Mobile Menu (hamburger)
 * │   └── Apply CTA
 * │
 * ├── HeroSection
 * │   ├── Background (animated)
 * │   ├── Badge
 * │   ├── Headline (with gradient)
 * │   ├── Subheading
 * │   ├── CTA Buttons (2)
 * │   └── Scroll Indicator
 * │
 * ├── AboutSection
 * │   ├── Title & subtitle
 * │   ├── Mission/Vision Cards (2)
 * │   ├── Stats Grid
 * │   │   ├── Counter 1 (20+ years)
 * │   │   ├── Counter 2 (5000+ grads)
 * │   │   ├── Counter 3 (98% employment)
 * │   │   └── Counter 4 (8 programs)
 * │   └── Values Section (3 values)
 * │
 * ├── ProgramsSection
 * │   ├── Title & subtitle
 * │   └── Programs Grid
 * │       ├── Program Card 1 (Nursing)
 * │       ├── Program Card 2 (Lab Science)
 * │       ├── Program Card 3 (Community Health)
 * │       ├── Program Card 4 (Pharmacy)
 * │       ├── Program Card 5 (Environment)
 * │       └── Program Card 6 (HIM)
 * │       + Features Info Grid (3 items)
 * │
 * ├── WhyChooseUsSection
 * │   ├── Title & subtitle
 * │   ├── Differentiators Grid
 * │   │   ├── Card 1 (NBTE)
 * │   │   ├── Card 2 (Faculty)
 * │   │   ├── Card 3 (Facilities)
 * │   │   ├── Card 4 (Employment)
 * │   │   ├── Card 5 (Training)
 * │   │   └── Card 6 (Industry)
 * │   └── Testimonial Highlight
 * │
 * ├── EventsAnnouncementsSection
 * │   ├── Title & subtitle
 * │   ├── Tab Buttons (2)
 * │   ├── Events Tab Content
 * │   │   ├── Event Card 1
 * │   │   ├── Event Card 2
 * │   │   ├── Event Card 3
 * │   │   └── Event Card 4
 * │   ├── Announcements Tab Content
 * │   │   ├── Announcement Card 1
 * │   │   ├── Announcement Card 2
 * │   │   ├── Announcement Card 3
 * │   │   └── Announcement Card 4
 * │   └── View All Button
 * │
 * ├── FacilitiesSection
 * │   ├── Title & subtitle
 * │   ├── Carousel Container
 * │   │   ├── Facility Image 1
 * │   │   ├── Facility Image 2
 * │   │   └── Facility Image 3 (visible)
 * │   ├── Navigation
 * │   │   ├── Previous Button
 * │   │   ├── Indicators (dots)
 * │   │   └── Next Button
 * │   ├── Features Grid (4 items)
 * │   └── Modal (for details)
 * │
 * ├── TestimonialsSection
 * │   ├── Title & subtitle
 * │   ├── Testimonials Carousel
 * │   │   ├── Testimonial Card 1
 * │   │   └── Testimonial Card 2 (visible)
 * │   ├── Navigation
 * │   │   ├── Previous Button
 * │   │   ├── Indicators (dots)
 * │   │   └── Next Button
 * │   └── Statistics Section (3 stats)
 * │
 * ├── AdmissionsSection
 * │   ├── Title & subtitle
 * │   ├── Process Steps (4)
 * │   ├── Requirements Section
 * │   │   ├── Tab Buttons (4)
 * │   │   └── Content Display
 * │   ├── Info Cards (3)
 * │   └── CTA Buttons (2)
 * │
 * ├── Footer
 * │   ├── Logo & Branding
 * │   ├── Link Sections (3)
 * │   ├── Contact Info
 * │   ├── Social Icons (4)
 * │   └── Legal Links & Copyright
 * │
 * └── BackToTop
 *     └── Scroll to top button
 */

/**
 * DATA FLOW DIAGRAM
 * 
 *  landingConstants.ts (Central Data)
 *         │
 *         ├── COLLEGE_INFO ──────→ Navigation, Footer
 *         ├── HERO_CONTENT ──────→ HeroSection
 *         ├── ABOUT_CONTENT ─────→ AboutSection
 *         ├── PROGRAMS ──────────→ ProgramsSection
 *         ├── WHY_CHOOSE_US ─────→ WhyChooseUsSection
 *         ├── EVENTS ───────────→ EventsAnnouncementsSection
 *         ├── ANNOUNCEMENTS ────→ EventsAnnouncementsSection
 *         ├── FACILITIES ──────→ FacilitiesSection
 *         ├── TESTIMONIALS ────→ TestimonialsSection
 *         └── ADMISSIONS ──────→ AdmissionsSection
 * 
 *  landing.ts (TypeScript Types)
 *         │
 *         └── Provides Type Safety for all data
 */

/**
 * ANIMATION TRIGGERS
 * 
 * ON PAGE LOAD:
 * ├── Navigation: fade-in, slide-down
 * ├── Hero: background blobs animate, headline gradient appears
 * └── Scroll indicator: bounce animation
 * 
 * ON SCROLL:
 * ├── About stats: counters count up
 * ├── Programs: stagger entrance
 * ├── Why Choose: cards scale in
 * ├── Events/Announcements: tab transitions
 * ├── Facilities: carousel smooth scroll
 * ├── Testimonials: carousel fade
 * └── Admissions: requirement tabs animate
 * 
 * ON HOVER/INTERACTION:
 * ├── Navigation links: color change
 * ├── CTA buttons: scale up, shadow enhance
 * ├── Program cards: elevation, icon rotate
 * ├── Differentiator cards: scale up
 * ├── Event cards: slide right
 * ├── Facility images: overlay appears
 * ├── Testimonial cards: shadow enhance
 * └── Back to top: appear/disappear with fade
 * 
 * CONTINUOUS:
 * ├── Hero background blobs: floating up/down
 * ├── Scroll progress: updating
 * └── Scroll indicator: bounce
 */

/**
 * SECTION HEIGHTS & SPACING
 * 
 * Navigation:     fixed (64px)
 * Hero:           100vh (viewport height)
 * About:          120-150vh (content dependent)
 * Programs:       130-150vh (grid layout)
 * Why Choose:     120-140vh (content dependent)
 * Events/Ann:     100-120vh (tabbed interface)
 * Facilities:     110-130vh (carousel + info)
 * Testimonials:   100-120vh (carousel + stats)
 * Admissions:     140-160vh (process + tabs + CTA)
 * Footer:         80-100vh (content + spacing)
 * 
 * TOTAL PAGE HEIGHT: ~1200-1400vh (viewport-dependent)
 * ESTIMATED SCROLL TIME: 5-10 seconds (smooth)
 */

/**
 * RESPONSIVE BREAKPOINTS
 * 
 * MOBILE (320px - 639px):
 * ├── Single column layouts
 * ├── Hamburger menu
 * ├── Full-width cards
 * ├── Reduced padding (16px → 8px)
 * ├── Reduced margins
 * └── Stacked buttons
 * 
 * TABLET (640px - 1023px):
 * ├── Two-column grids
 * ├── Compact navigation
 * ├── Medium padding (24px)
 * ├── Balanced spacing
 * └── Improved touch targets
 * 
 * DESKTOP (1024px - 1279px):
 * ├── Three-column grids
 * ├── Full navigation
 * ├── Normal padding (32px)
 * ├── Hover effects enabled
 * └── Advanced animations
 * 
 * LARGE (1280px+):
 * ├── Four-column grids (where applicable)
 * ├── Max-width container (1280px)
 * ├── Full spacing
 * ├── All animations enabled
 * └── Optimized for desktop viewing
 */

/**
 * COLOR SCHEME
 * 
 * GRADIENTS:
 * ├── Primary: from-blue-600 to-teal-600
 * ├── Hero Background: from-blue-900 via-blue-600 to-teal-600
 * ├── Secondary: from-blue-50 to-teal-50
 * └── Accent: Various program-specific gradients
 * 
 * SEMANTIC COLORS:
 * ├── Success: Green (#10b981)
 * ├── Info: Blue (#0284C7)
 * ├── Warning: Orange (#f97316)
 * └── Alert: Red (#ef4444)
 * 
 * PROGRAM COLORS:
 * ├── Nursing: Red → Pink
 * ├── Lab Science: Blue → Cyan
 * ├── Community Health: Green → Emerald
 * ├── Pharmacy: Purple → Indigo
 * ├── Environmental: Yellow → Orange
 * └── HIM: Teal → Cyan
 * 
 * NEUTRAL PALETTE:
 * ├── Text: Gray-900 (dark)
 * ├── Muted: Gray-600 (medium)
 * ├── Light: Gray-100-200 (backgrounds)
 * └── White: #ffffff (cards)
 */

/**
 * FILE DEPENDENCY GRAPH
 * 
 *          App.tsx
 *            │
 *            └── ApexCollegeLanding.tsx
 *                 │
 *         ┌───────┼──────────────┬──────────────┐
 *         │       │              │              │
 *    Navigation  HeroSection  AboutSection  ProgramsSection
 *         │       │              │              │
 *         └───────┼──────────────┴──────────────┘
 *                 │
 *         ┌───────┼──────────────┬──────────────┐
 *         │       │              │              │
 *   WhyChooseUs Events/Ann  FacilitiesSection  Testimonials
 *         │       │              │              │
 *         └───────┼──────────────┴──────────────┘
 *                 │
 *         ┌───────┼──────────────┬──────────────┐
 *         │       │              │              │
 *   AdmissionsSection  Footer  ScrollProgressBar  BackToTop
 *         │       │              │              │
 *         └───────┼──────────────┴──────────────┘
 *                 │
 *         ┌───────┴──────────┐
 *         │                  │
 *   landing.ts (types)  landingConstants.ts (data)
 *         │                  │
 *         └───────┬──────────┘
 *                 │
 *            All Components
 */

/**
 * PERFORMANCE OPTIMIZATION STRATEGY
 * 
 * RENDERING:
 * ├── Viewport-based animation triggers (only animate when visible)
 * ├── Lazy component loading with React.lazy()
 * ├── Memoization for expensive components
 * └── Efficient re-render prevention
 * 
 * ANIMATIONS:
 * ├── GPU-accelerated transforms (translate, scale, opacity)
 * ├── Will-change CSS optimization
 * ├── Frame rate targeting (60fps)
 * └── Animation delays for staggering
 * 
 * IMAGES:
 * ├── Unsplash CDN (optimized delivery)
 * ├── Responsive sizes (srcset)
 * ├── Lazy loading attributes
 * └── WebP format consideration
 * 
 * CODE SPLITTING:
 * ├── Components in separate files
 * ├── Constants in shared file
 * ├── Types in shared file
 * └── Dynamic imports where appropriate
 */

export default {
  // This file is for documentation/reference only
  description: 'Visual structure guide for Apex College Landing Page',
  version: '1.0.0',
};
