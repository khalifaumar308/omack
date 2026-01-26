import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface CounterProps {
  value: string;
  label: string;
  suffix?: string;
}

const Counter: React.FC<CounterProps> = ({ value, label, suffix }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    // Extract numeric value
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    let currentValue = 0;
    const increment = Math.ceil(numericValue / 50);
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= numericValue) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(currentValue.toString());
      }
    }, 30);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
        {displayValue}
        {suffix}
      </div>
      <p className="text-gray-600 text-lg font-medium">{label}</p>
    </motion.div>
  );
};

const AboutSection: React.FC = () => {
  const containerRef = useRef(null);
//   const controls = useAnimation();

  const stats: CounterProps[] = [
    { value: '20', label: 'Years of Excellence', suffix: '+' },
    { value: '5000', label: 'Graduates', suffix: '+' },
    { value: '98', label: 'Employment Rate', suffix: '%' },
    { value: '8', label: 'Accredited Programs' },
  ];

  return (
    <section
      id="about"
      className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white"
    >
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
            About Apex College
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-600 mx-auto"></div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Committed to Excellence in Health Sciences Education
            </h3>
            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              For over two decades, Apex College of Health Science and Technology
              has been a beacon of quality healthcare education in Nigeria. Our
              institution is dedicated to producing competent, compassionate, and
              ethically-grounded healthcare professionals.
            </p>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Accredited by the National Board for Technical Education (NBTE), we
              offer industry-aligned programs that combine rigorous academic
              training with hands-on practical experience in state-of-the-art
              facilities.
            </p>

            {/* Mission & Vision */}
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <h4 className="font-bold text-blue-900 mb-2">Our Mission</h4>
                <p className="text-blue-800">
                  To develop skilled healthcare professionals who contribute
                  meaningfully to Nigeria's healthcare system and beyond.
                </p>
              </div>
              <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded">
                <h4 className="font-bold text-teal-900 mb-2">Our Vision</h4>
                <p className="text-teal-800">
                  To be a recognized center of excellence in health sciences
                  education, innovation, and community impact.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            ref={containerRef}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <Counter {...stat} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Key Values */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Our Core Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
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
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl mb-3">{value.icon}</div>
                <h4 className="text-xl font-bold mb-2">{value.title}</h4>
                <p className="text-gray-100">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
