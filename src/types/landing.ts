export interface LandingPageTypes {
  // Hero Section
  Hero: {
    headline: string;
    subheading: string;
    primaryCta: string;
    secondaryCta: string;
  };

  // Program Card
  Program: {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    accreditation?: string;
  };

  // Event/Announcement
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

  // Testimonial
  Testimonial: {
    id: string;
    name: string;
    course: string;
    text: string;
    image: string;
    year: number;
  };

  // Statistic
  Statistic: {
    value: string;
    label: string;
    suffix?: string;
  };

  // Differentiator
  Differentiator: {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
  };

  // Facility
  Facility: {
    id: string;
    name: string;
    description: string;
    image: string;
  };
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  website: string;
}
