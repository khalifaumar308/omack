import React from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Microscope,
  Users,
  Pill,
  Leaf,
  Database,
} from 'lucide-react';

interface ProgramCardProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  accreditation?: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  icon,
  title,
  description,
  color,
  accreditation,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group`}
    >
      <div className={`h-2 bg-gradient-to-r ${color}`}></div>
      <div className="p-8">
        {/* Icon */}
        <motion.div
          className={`w-16 h-16 rounded-lg ${color} bg-gradient-to-br text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
          whileHover={{ rotate: 10, scale: 1.1 }}
        >
          {icon}
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>

        {/* Accreditation Badge */}
        {accreditation && (
          <div className="mb-4 inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
            {accreditation}
          </div>
        )}

        {/* Learn More Link */}
        <motion.button
          whileHover={{ x: 5 }}
          className="text-blue-600 font-semibold flex items-center gap-2 hover:text-blue-700 transition-colors"
        >
          Learn More
          <span>→</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

const ProgramsSection: React.FC = () => {
  const programs: ProgramCardProps[] = [
    {
      id: 'mlt',
      icon: <Microscope className="w-8 h-8" />,
      title: 'Medical Laboratory Technicians',
      description:
        'Master laboratory techniques and diagnostic procedures essential for disease detection and patient care.',
      color: 'from-blue-500 to-cyan-500',
      accreditation: 'NBTE Accredited',
    },
    {
      id: 'community-health',
      icon: <Users className="w-8 h-8" />,
      title: 'Community Health',
      description:
        'Develop skills in public health management and community-based healthcare delivery programs.',
      color: 'from-green-500 to-emerald-500',
      accreditation: 'NBTE Accredited',
    },
    {
      id: 'environmental-health',
      icon: <Leaf className="w-8 h-8" />,
      title: 'Environmental Health',
      description:
        'Protect public health through environmental monitoring, sanitation, and health safety management.',
      color: 'from-yellow-500 to-orange-500',
      accreditation: 'NBTE Accredited',
    },
    {
      id: 'health-records',
      icon: <Database className="w-8 h-8" />,
      title: 'Health Information Management',
      description:
        'Manage medical records and health information systems with modern digital technologies.',
      color: 'from-teal-500 to-cyan-500',
      accreditation: 'NBTE Accredited',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section id="programs" className="py-20 md:py-32 bg-white">
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
            Our Programs
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            NBTE-Accredited Health Sciences Programs Designed for Your Success
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-600 mx-auto"></div>
        </motion.div>

        {/* Programs Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {programs.map((program) => (
            <ProgramCard key={program.id} {...program} />
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            All Programs Feature:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔬',
                text: 'Modern Laboratory Facilities',
              },
              {
                icon: '👨‍🏫',
                text: 'Experienced Faculty Members',
              },
              {
                icon: '🏥',
                text: 'Clinical Placements & Internships',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-gray-700 font-medium">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgramsSection;
