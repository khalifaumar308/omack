// Landing page constants and utilities
// Usage: Import and use in components to manage content

export const COLLEGE_INFO = {
  name: 'Apex College of Health Science and Technology',
  shortName: 'Apex College',
  location: 'Lagos, Nigeria',
  foundedYear: 2006,
  contact: {
    address: 'Plot 5, Health Park Avenue, Lagos, Nigeria 100001',
    phone: '+234 (0) 701-234-5678',
    email: 'admissions@apexcollege.edu.ng',
    website: 'www.apexcollege.edu.ng',
  },
  socialMedia: {
    facebook: 'https://facebook.com/apexcollegeng',
    twitter: 'https://twitter.com/apexcollegeng',
    instagram: 'https://instagram.com/apexcollegeng',
    linkedin: 'https://linkedin.com/company/apexcollegeng',
  },
};

export const HERO_CONTENT = {
  badge: '🎓 Accredited Excellence in Healthcare Education',
  headline: 'Shape the Future of Healthcare',
  subheading:
    'Apex College of Health Science and Technology - NBTE Accredited Programs in Nursing, Medical Laboratory Science, and more. Your gateway to professional excellence in Nigeria\'s dynamic healthcare sector.',
  primaryCta: 'Apply Now',
  secondaryCta: 'Learn More',
};

export const ABOUT_CONTENT = {
  title: 'About Apex College',
  subtitle: 'Committed to Excellence in Health Sciences Education',
  mission:
    'To develop skilled healthcare professionals who contribute meaningfully to Nigeria\'s healthcare system and beyond.',
  vision:
    'To be a recognized center of excellence in health sciences education, innovation, and community impact.',
  stats: [
    { value: '20', label: 'Years of Excellence', suffix: '+' },
    { value: '5000', label: 'Graduates', suffix: '+' },
    { value: '98', label: 'Employment Rate', suffix: '%' },
    { value: '8', label: 'Accredited Programs' },
  ],
  coreValues: [
    {
      icon: '🎯',
      title: 'Excellence',
      description:
        'We pursue the highest standards in education, research, and service delivery.',
    },
    {
      icon: '❤️',
      title: 'Compassion',
      description:
        'We foster empathy and care as fundamental to healthcare practice.',
    },
    {
      icon: '🔬',
      title: 'Innovation',
      description:
        'We embrace modern methodologies and technology in healthcare education.',
    },
  ],
};

export const PROGRAMS = [
  {
    id: 'nursing',
    title: 'Nursing',
    description:
      'Train to become a compassionate nurse with comprehensive clinical skills and patient care expertise.',
    icon: 'Heart',
    color: 'from-red-500 to-pink-500',
    accreditation: 'NBTE Accredited',
  },
  {
    id: 'medical-laboratory-science',
    title: 'Medical Laboratory Science',
    description:
      'Master laboratory techniques and diagnostic procedures essential for disease detection and patient care.',
    icon: 'Microscope',
    color: 'from-blue-500 to-cyan-500',
    accreditation: 'NBTE Accredited',
  },
  {
    id: 'community-health',
    title: 'Community Health',
    description:
      'Develop skills in public health management and community-based healthcare delivery programs.',
    icon: 'Users',
    color: 'from-green-500 to-emerald-500',
    accreditation: 'NBTE Accredited',
  },
  {
    id: 'pharmacy-technician',
    title: 'Pharmacy Technician',
    description:
      'Specialize in pharmaceutical compounding, dispensing, and medication management.',
    icon: 'Pill',
    color: 'from-purple-500 to-indigo-500',
    accreditation: 'NBTE Accredited',
  },
  {
    id: 'environmental-health',
    title: 'Environmental Health',
    description:
      'Protect public health through environmental monitoring, sanitation, and health safety management.',
    icon: 'Leaf',
    color: 'from-yellow-500 to-orange-500',
    accreditation: 'NBTE Accredited',
  },
  {
    id: 'health-information-management',
    title: 'Health Information Management',
    description:
      'Manage medical records and health information systems with modern digital technologies.',
    icon: 'Database',
    color: 'from-teal-500 to-cyan-500',
    accreditation: 'NBTE Accredited',
  },
];

export const WHY_CHOOSE_US = [
  {
    icon: 'Award',
    title: 'NBTE Accreditation',
    description:
      'All programs are officially accredited by the National Board for Technical Education, ensuring quality and recognition.',
    color: 'bg-gradient-to-br from-blue-600 to-blue-700',
  },
  {
    icon: 'Users',
    title: 'Experienced Faculty',
    description:
      'Learn from seasoned healthcare professionals with industry experience and advanced certifications.',
    color: 'bg-gradient-to-br from-green-600 to-green-700',
  },
  {
    icon: 'Zap',
    title: 'Modern Facilities',
    description:
      'Access state-of-the-art laboratories, simulation centers, and learning resources.',
    color: 'bg-gradient-to-br from-purple-600 to-purple-700',
  },
  {
    icon: 'TrendingUp',
    title: '98% Graduate Employment',
    description:
      'Our graduates are highly sought after by hospitals, clinics, and healthcare organizations nationwide.',
    color: 'bg-gradient-to-br from-orange-600 to-orange-700',
  },
  {
    icon: 'BookOpen',
    title: 'Practical Training',
    description:
      'Combination of classroom learning and hands-on clinical experience in partnered healthcare facilities.',
    color: 'bg-gradient-to-br from-red-600 to-red-700',
  },
  {
    icon: 'Handshake',
    title: 'Industry Partnerships',
    description:
      'Strong relationships with hospitals and healthcare organizations for placements and collaborations.',
    color: 'bg-gradient-to-br from-teal-600 to-teal-700',
  },
];

export const EVENTS = [
  {
    id: 'orientation-day',
    title: 'Orientation Day',
    date: '2026-02-15',
    time: '09:00 AM',
    description:
      'Welcome orientation for all new students. Meet faculty, explore campus, receive course materials.',
    location: 'Main Auditorium',
    color: 'blue',
  },
  {
    id: 'health-fair',
    title: 'Health Awareness Fair',
    date: '2026-03-10',
    time: '10:00 AM',
    description:
      'Health screening, wellness workshops, and community health education activities.',
    location: 'College Grounds',
    color: 'green',
  },
  {
    id: 'guest-lecture',
    title: 'Guest Lecture Series',
    date: '2026-03-22',
    time: '02:00 PM',
    description:
      'Industry experts share insights on latest developments in healthcare and professional practice.',
    location: 'Lecture Hall A',
    color: 'purple',
  },
  {
    id: 'matriculation',
    title: 'Matriculation Ceremony',
    date: '2026-04-05',
    time: '03:00 PM',
    description: 'Official admission ceremony where students take the matriculation oath.',
    location: 'Main Auditorium',
    color: 'red',
  },
];

export const ANNOUNCEMENTS = [
  {
    id: 'admission-deadline',
    title: 'Application Deadline Extended',
    date: '2026-01-20',
    description:
      'Applications for 2026/2027 academic session are now open until February 28, 2026.',
    category: 'Admissions',
    color: 'red',
  },
  {
    id: 'exam-schedule',
    title: 'Examination Timetable Released',
    date: '2026-01-18',
    description:
      'First semester examination schedule is now available on the portal. Please check your courses.',
    category: 'Academics',
    color: 'blue',
  },
  {
    id: 'new-program',
    title: 'New Program Launch',
    date: '2026-01-15',
    description:
      'We are excited to announce our new Advanced Nursing Practice program starting February 2026.',
    category: 'Program',
    color: 'green',
  },
  {
    id: 'holiday-notice',
    title: 'Holiday Schedule',
    date: '2026-01-10',
    description:
      'College will be closed for public holidays from March 1-7. Normal operations resume March 8.',
    category: 'Notice',
    color: 'purple',
  },
];

export const TESTIMONIALS = [
  {
    id: 'chioma-okafor',
    name: 'Chioma Okafor',
    course: 'Nursing - 2023',
    text: 'Apex College gave me not just education, but a professional foundation. The hands-on training and supportive faculty prepared me perfectly for my role as a Registered Nurse. I am now working at Lagos State Hospital.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    year: 2023,
    rating: 5,
  },
  {
    id: 'emeka-chukwu',
    name: 'Emeka Chukwu',
    course: 'Medical Laboratory Science - 2022',
    text: 'The laboratory facilities and experienced instructors at Apex College are outstanding. I received a job offer even before graduation. The practical skills I gained are directly applicable to my work.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    year: 2022,
    rating: 5,
  },
  {
    id: 'zainab-mohammed',
    name: 'Zainab Mohammed',
    course: 'Community Health - 2023',
    text: 'What impressed me most was the community engagement aspect of our program. We learned not just theory but how to make a real difference in people\'s lives. Apex College truly shaped my career path.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    year: 2023,
    rating: 5,
  },
  {
    id: 'nkechi-eze',
    name: 'Nkechi Eze',
    course: 'Health Information Management - 2021',
    text: 'The modern computing facilities and practical training in health IT systems were exactly what employers were looking for. I completed an internship at a major hospital and was hired permanently.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    year: 2021,
    rating: 5,
  },
];

export const FACILITIES = [
  {
    id: 'laboratory',
    name: 'Modern Laboratory Complex',
    description: 'Fully-equipped clinical and research laboratories',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=400&fit=crop',
    fullDescription:
      'Our state-of-the-art laboratory facilities feature advanced diagnostic equipment, safety protocols, and spacious workstations where students gain hands-on experience with real-world laboratory procedures.',
  },
  {
    id: 'classroom',
    name: 'Interactive Learning Spaces',
    description: 'Modern classrooms with multimedia technology',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f70fc504e?w=500&h=400&fit=crop',
    fullDescription:
      'Classrooms equipped with projectors, smart boards, and modern AV systems create an engaging learning environment. Small class sizes ensure personalized attention from instructors.',
  },
  {
    id: 'library',
    name: 'Comprehensive Library',
    description: 'Extensive collection of medical and health science resources',
    image: 'https://images.unsplash.com/photo-1507842217343-583f7270bfbb?w=500&h=400&fit=crop',
    fullDescription:
      'Access thousands of textbooks, journals, research papers, and digital resources. Our library provides quiet study areas, group study rooms, and online databases for comprehensive learning.',
  },
  {
    id: 'clinic',
    name: 'Teaching Clinic',
    description: 'Hands-on clinical training environment',
    image: 'https://images.unsplash.com/photo-1631217314830-eed0feb74d15?w=500&h=400&fit=crop',
    fullDescription:
      'Our on-campus clinic provides realistic clinical experience under professional supervision. Students practice patient care, communication, and clinical decision-making in a controlled environment.',
  },
  {
    id: 'simulation',
    name: 'Simulation Center',
    description: 'Advanced mannequins and simulation equipment',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=400&fit=crop',
    fullDescription:
      'High-fidelity human patient simulators allow students to practice critical procedures and emergency response scenarios in a safe, repeatable environment before working with real patients.',
  },
  {
    id: 'facilities',
    name: 'Modern Facilities',
    description: 'Cafeteria, recreational areas, and student lounges',
    image: 'https://images.unsplash.com/photo-1600618528822-529e9f6b1fae?w=500&h=400&fit=crop',
    fullDescription:
      'Beyond academics, we provide a supportive environment with a well-appointed cafeteria, sports facilities, recreational areas, and comfortable student lounges for studying and socializing.',
  },
];

export const ADMISSIONS = {
  academicRequirements: [
    'West African School Certificate (WASC) or equivalent',
    "Minimum Grade: C6 in English and Mathematics",
    "O'Level results in relevant science subjects",
  ],
  applicationProcess: [
    'Complete online application form',
    'Submit scanned documents (certified copies)',
    'Pay non-refundable application fee',
    'Attend entrance examination',
  ],
  requiredDocuments: [
    'Birth certificate (original or certified)',
    'Educational transcripts',
    'Medical fitness certificate',
    'Character reference letter',
  ],
  importantDates: [
    'Applications Open: 1st January 2026',
    'Applications Close: 28th February 2026',
    'Entrance Exam: March 2026',
    'Admission Results: April 2026',
  ],
  programDuration: '3 years full-time program with internships and clinical placements',
  certification:
    'Diploma awarded upon successful completion of all program requirements',
};

export const FOOTER_CONTENT = {
  quickLinks: [
    { label: 'About Us', href: '#about' },
    { label: 'Programs', href: '#programs' },
    { label: 'Why Choose Us', href: '#why-choose' },
    { label: 'Contact Us', href: '#footer' },
  ],
  academicLinks: [
    { label: 'Nursing', href: '#programs' },
    { label: 'Medical Laboratory Science', href: '#programs' },
    { label: 'Community Health', href: '#programs' },
    { label: 'Other Programs', href: '#programs' },
  ],
  resourceLinks: [
    { label: 'Portal Login', href: '#' },
    { label: 'Library Access', href: '#' },
    { label: 'Student Services', href: '#' },
    { label: 'FAQ', href: '#' },
  ],
};

// Utility function to format dates in Nigerian format
export const formatDateNigerian = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Utility function to format time
export const formatTime = (timeString: string): string => {
  return timeString; // Already formatted in data
};

// Utility function for scroll to section
export const scrollToSection = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
