import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Facility {
  id: string;
  name: string;
  description: string;
  image: string;
  fullDescription: string;
}

const FacilitiesSection: React.FC = () => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const facilities: Facility[] = [
    {
      id: 'lab',
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
      id: 'cafeteria',
      name: 'Modern Facilities',
      description: 'Cafeteria, recreational areas, and student lounges',
      image: 'https://images.unsplash.com/photo-1600618528822-529e9f6b1fae?w=500&h=400&fit=crop',
      fullDescription:
        'Beyond academics, we provide a supportive environment with a well-appointed cafeteria, sports facilities, recreational areas, and comfortable student lounges for studying and socializing.',
    },
  ];

  const nextFacility = () => {
    setCurrentIndex((prev) => (prev + 1) % facilities.length);
  };

  const prevFacility = () => {
    setCurrentIndex((prev) => (prev - 1 + facilities.length) % facilities.length);
  };

  const visibleFacilities = [
    facilities[currentIndex],
    facilities[(currentIndex + 1) % facilities.length],
    facilities[(currentIndex + 2) % facilities.length],
  ];

  return (
    <section className="py-20 md:py-32 bg-white">
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
            Our Facilities
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            World-Class Infrastructure for Comprehensive Health Sciences Education
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-600 mx-auto"></div>
        </motion.div>

        {/* Carousel */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {visibleFacilities.map((facility, index) => (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setSelectedFacility(facility)}
                className={`relative rounded-xl overflow-hidden cursor-pointer group ${
                  index === 1 ? 'md:scale-105 md:z-10' : ''
                }`}
              >
                <div className="aspect-video relative">
                  <motion.img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-lg mb-2">
                      {facility.name}
                    </h3>
                    <p className="text-gray-100 text-sm mb-3">
                      {facility.description}
                    </p>
                    <button className="text-blue-300 font-semibold text-sm hover:text-blue-200 flex items-center gap-1">
                      Learn More →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation Arrows */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex justify-center items-center gap-4 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevFacility}
              className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <div className="flex gap-2">
              {facilities.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextFacility}
              className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            { icon: '🔬', text: 'Advanced Laboratory Equipment' },
            { icon: '💻', text: 'Digital Learning Platforms' },
            { icon: '🏥', text: 'Affiliated Healthcare Facilities' },
            { icon: '🛡️', text: 'Safety & Security' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg"
            >
              <span className="text-3xl">{feature.icon}</span>
              <span className="font-semibold text-gray-800">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal for Facility Details */}
      <AnimatePresence>
        {selectedFacility && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedFacility(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedFacility.image}
                  alt={selectedFacility.name}
                  className="w-full h-96 object-cover"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedFacility(null)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </motion.button>
              </div>

              <div className="p-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedFacility.name}
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  {selectedFacility.fullDescription}
                </p>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
                >
                  Schedule a Tour
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FacilitiesSection;
