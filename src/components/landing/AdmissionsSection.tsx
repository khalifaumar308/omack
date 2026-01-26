import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, Clock, Users } from 'lucide-react';

const AdmissionsSection: React.FC = () => {
  const [selectedRequirement, setSelectedRequirement] = useState(0);

  const requirements = [
    {
      title: 'Academic Qualification',
      items: [
        'West African School Certificate (WASC) or equivalent',
        'Minimum Grade: C6 in English and Mathematics',
        'O\'Level results in relevant science subjects',
      ],
    },
    {
      title: 'Application Process',
      items: [
        'Complete online application form',
        'Submit scanned documents (certified copies)',
        'Pay non-refundable application fee',
        'Attend entrance examination',
      ],
    },
    {
      title: 'Required Documents',
      items: [
        'Birth certificate (original or certified)',
        'Educational transcripts',
        'Medical fitness certificate',
        'Character reference letter',
      ],
    },
    {
      title: 'Important Dates',
      items: [
        'Applications Open: 1st January 2026',
        'Applications Close: 28th February 2026',
        'Entrance Exam: March 2026',
        'Admission Results: April 2026',
      ],
    },
  ];

  const admissionSteps = [
    { number: 1, title: 'Submit Application', description: 'Fill out and submit online form with required documents' },
    { number: 2, title: 'Entrance Exam', description: 'Sit for entrance examination in chosen location' },
    { number: 3, title: 'Merit List', description: 'Wait for official merit list announcement' },
    { number: 4, title: 'Enrollment', description: 'Complete enrollment and register for courses' },
  ];

  return (
    <section id="admissions" className="py-20 md:py-32 bg-white">
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
            Admissions Information
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Start Your Journey to a Rewarding Healthcare Career
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-600 mx-auto"></div>
        </motion.div>

        {/* Admission Process Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Application Process
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {admissionSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connector Line */}
                {index < admissionSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-300 -ml-1/2"></div>
                )}

                <div className="bg-white border-2 border-blue-600 rounded-xl p-6 relative z-10">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-teal-600 text-white font-bold text-lg mb-4 mx-auto">
                    {step.number}
                  </div>
                  <h4 className="font-bold text-gray-900 text-center mb-2">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 text-sm text-center">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Requirements and Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
        >
          {/* Requirement Tabs */}
          <div className="lg:col-span-1 space-y-3">
            {requirements.map((req, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedRequirement(index)}
                whileHover={{ x: 5 }}
                className={`w-full text-left p-4 rounded-lg font-semibold transition-all ${
                  selectedRequirement === index
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {req.title}
              </motion.button>
            ))}
          </div>

          {/* Requirement Details */}
          <div className="lg:col-span-2">
            <motion.div
              key={selectedRequirement}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {requirements[selectedRequirement].title}
              </h3>
              <ul className="space-y-4">
                {requirements[selectedRequirement].items.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Key Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {[
            {
              icon: <Clock className="w-8 h-8" />,
              title: 'Program Duration',
              description: '3 years full-time program with internships and clinical placements',
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: 'Class Size',
              description: 'Limited enrollment to ensure quality education and personalized attention',
            },
            {
              icon: <FileText className="w-8 h-8" />,
              title: 'Certification',
              description: 'Diploma awarded upon successful completion of all program requirements',
            },
          ].map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all text-center"
            >
              <div className="flex justify-center mb-4 text-blue-600">
                {info.icon}
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{info.title}</h4>
              <p className="text-gray-600 text-sm">{info.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Begin Your Healthcare Journey?
          </h3>
          <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
            Don't miss this opportunity to receive world-class education in health
            sciences. Applications are now open for the 2026/2027 academic session.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg bg-white text-blue-600 font-bold text-lg hover:shadow-lg transition-shadow"
            >
              Apply Online Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg bg-white/20 text-white font-bold text-lg border-2 border-white hover:bg-white/30 transition-all backdrop-blur-md"
            >
              Schedule Campus Tour
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AdmissionsSection;
