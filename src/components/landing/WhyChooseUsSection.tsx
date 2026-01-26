import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Users,
  Zap,
  TrendingUp,
  BookOpen,
  Handshake,
} from 'lucide-react';

interface DifferentiatorCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const DifferentiatorCard: React.FC<DifferentiatorCardProps> = ({
  icon,
  title,
  description,
  color,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all"
    >
      <motion.div
        className={`w-14 h-14 rounded-lg ${color} text-white flex items-center justify-center mb-4`}
        whileHover={{ rotate: 20, scale: 1.1 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

const WhyChooseUsSection: React.FC = () => {
  const differentiators: DifferentiatorCardProps[] = [
    {
      icon: <Award className="w-7 h-7" />,
      title: 'NBTE Accreditation',
      description:
        'All programs are officially accredited by the National Board for Technical Education, ensuring quality and recognition.',
      color: 'bg-gradient-to-br from-blue-600 to-blue-700',
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: 'Experienced Faculty',
      description:
        'Learn from seasoned healthcare professionals with industry experience and advanced certifications.',
      color: 'bg-gradient-to-br from-green-600 to-green-700',
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: 'Modern Facilities',
      description:
        'Access state-of-the-art laboratories, simulation centers, and learning resources.',
      color: 'bg-gradient-to-br from-purple-600 to-purple-700',
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: '98% Graduate Employment',
      description:
        'Our graduates are highly sought after by hospitals, clinics, and healthcare organizations nationwide.',
      color: 'bg-gradient-to-br from-orange-600 to-orange-700',
    },
    {
      icon: <BookOpen className="w-7 h-7" />,
      title: 'Practical Training',
      description:
        'Combination of classroom learning and hands-on clinical experience in partnered healthcare facilities.',
      color: 'bg-gradient-to-br from-red-600 to-red-700',
    },
    {
      icon: <Handshake className="w-7 h-7" />,
      title: 'Industry Partnerships',
      description:
        'Strong relationships with hospitals and healthcare organizations for placements and collaborations.',
      color: 'bg-gradient-to-br from-teal-600 to-teal-700',
    },
  ];

  return (
    <section id="why-choose" className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Apex College?
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Excellence, Innovation, and Student Success at Every Step
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-600 mx-auto"></div>
        </motion.div>

        {/* Differentiators Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {differentiators.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <DifferentiatorCard {...item} />
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonial Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-600 rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <blockquote className="text-xl md:text-2xl font-semibold mb-4">
            "Apex College gave me not just education, but a professional
            foundation that prepared me to make a real difference in healthcare.
            The facilities, mentors, and practical experience were exceptional."
          </blockquote>
          <p className="font-semibold mb-1">Chioma Okafor</p>
          <p className="text-blue-100">BSN 2023 | Registered Nurse at Lagos State Hospital</p>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
