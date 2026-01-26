import React from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (href: string) => {
    const elementId = href.replace('#', '');
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { label: 'About Us', href: '#about' },
        { label: 'Programs', href: '#programs' },
        { label: 'Why Choose Us', href: '#why-choose' },
        { label: 'Contact Us', href: '#footer' },
      ],
    },
    {
      title: 'Academics',
      links: [
        { label: 'Nursing', href: '#programs' },
        { label: 'Medical Laboratory Science', href: '#programs' },
        { label: 'Community Health', href: '#programs' },
        { label: 'Other Programs', href: '#programs' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Portal Login', href: '#' },
        { label: 'Library Access', href: '#' },
        { label: 'Student Services', href: '#' },
        { label: 'FAQ', href: '#' },
      ],
    },
  ];

  return (
    <footer
      id="footer"
      className="bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* College Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-teal-400">
                <span className="text-gray-900 font-bold text-lg">AC</span>
              </div>
              <div>
                <p className="font-bold text-lg">Apex College</p>
                <p className="text-xs text-gray-400">Health Sciences</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Accredited excellence in healthcare education since 2006.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Linkedin, label: 'LinkedIn' },
              ].map((social, ) => (
                <motion.a
                  key={social.label}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (sectionIndex + 1) * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <motion.button
                      onClick={() => scrollToSection(link.href)}
                      whileHover={{ x: 5 }}
                      className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                    >
                      {link.label}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gray-800 rounded-xl p-6 mb-12"
        >
          <h3 className="font-bold text-lg mb-6">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                label: 'Address',
                value: 'Plot 5, Health Park Avenue, Lagos, Nigeria 100001',
              },
              {
                icon: Phone,
                label: 'Phone',
                value: '+234 (0) 701-234-5678',
              },
              {
                icon: Mail,
                label: 'Email',
                value: 'admissions@apexcollege.edu.ng',
              },
            ].map((contact, index) => (
              <motion.div
                key={contact.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-3"
              >
                <contact.icon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-sm">{contact.label}</p>
                  <p className="text-gray-300 text-sm">{contact.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 mb-8"
        />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Apex College of Health Science and Technology.
            All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
              Sitemap
            </a>
          </div>
        </motion.div>
      </div>

      {/* Floating accent elements */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-10 right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-20 left-10 w-40 h-40 bg-teal-600/10 rounded-full blur-3xl"
      />
    </footer>
  );
};

export default Footer;
