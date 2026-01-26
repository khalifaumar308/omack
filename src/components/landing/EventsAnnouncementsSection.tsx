import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Bell, MapPin, Clock, ChevronRight } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  location?: string;
  color: string;
}

interface Announcement {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  color: string;
}

const EventCard: React.FC<{ event: Event; index: number }> = ({ event, index }) => {
  const parseDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-NG', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ x: 5 }}
      className={`bg-white rounded-lg border-l-4 border-${event.color}-500 p-5 hover:shadow-lg transition-shadow`}
    >
      <div className="flex gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-${event.color}-100 flex items-center justify-center`}>
          <Calendar className={`w-6 h-6 text-${event.color}-600`} />
        </div>
        <div className="flex-grow">
          <h4 className="font-bold text-gray-900 mb-2">{event.title}</h4>
          <div className="space-y-1 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{parseDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-700">{event.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const AnnouncementCard: React.FC<{ announcement: Announcement; index: number }> = ({
  announcement,
  index,
}) => {
  const parseDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ x: -5 }}
      className={`bg-white rounded-lg border-r-4 border-${announcement.color}-500 p-5 hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-${announcement.color}-100 flex items-center justify-center`}>
          <Bell className={`w-6 h-6 text-${announcement.color}-600`} />
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-gray-900">{announcement.title}</h4>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-${announcement.color}-100 text-${announcement.color}-700`}>
              {announcement.category}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-3">{parseDate(announcement.date)}</p>
          <p className="text-sm text-gray-700">{announcement.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const EventsAnnouncementsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'announcements'>('events');

  const events: Event[] = [
    {
      id: 'orientation',
      title: 'Orientation Day',
      date: '2026-02-15',
      time: '09:00 AM',
      description: 'Welcome orientation for all new students. Meet faculty, explore campus, receive course materials.',
      location: 'Main Auditorium',
      color: 'blue',
    },
    {
      id: 'health-fair',
      title: 'Health Awareness Fair',
      date: '2026-03-10',
      time: '10:00 AM',
      description: 'Health screening, wellness workshops, and community health education activities.',
      location: 'College Grounds',
      color: 'green',
    },
    {
      id: 'guest-lecture',
      title: 'Guest Lecture Series',
      date: '2026-03-22',
      time: '02:00 PM',
      description: 'Industry experts share insights on latest developments in healthcare and professional practice.',
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

  const announcements: Announcement[] = [
    {
      id: 'admission-deadline',
      title: 'Application Deadline Extended',
      date: '2026-01-20',
      description: 'Applications for 2026/2027 academic session are now open until February 28, 2026.',
      category: 'Admissions',
      color: 'red',
    },
    {
      id: 'exam-schedule',
      title: 'Examination Timetable Released',
      date: '2026-01-18',
      description: 'First semester examination schedule is now available on the portal. Please check your courses.',
      category: 'Academics',
      color: 'blue',
    },
    {
      id: 'new-program',
      title: 'New Program Launch',
      date: '2026-01-15',
      description: 'We are excited to announce our new Advanced Nursing Practice program starting February 2026.',
      category: 'Program',
      color: 'green',
    },
    {
      id: 'holiday-notice',
      title: 'Holiday Schedule',
      date: '2026-01-10',
      description: 'College will be closed for public holidays from March 1-7. Normal operations resume March 8.',
      category: 'Notice',
      color: 'purple',
    },
  ];

  return (
    <section id="events" className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
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
            Events & Announcements
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Stay Updated with Latest News and Upcoming Events
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-600 mx-auto"></div>
        </motion.div>

        {/* Tab Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600'
            }`}
          >
            <Calendar className="inline w-5 h-5 mr-2" />
            Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'announcements'
                ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600'
            }`}
          >
            <Bell className="inline w-5 h-5 mr-2" />
            Announcements
          </button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 mb-8"
            >
              {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </motion.div>
          )}

          {activeTab === 'announcements' && (
            <motion.div
              key="announcements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 mb-8"
            >
              {announcements.map((announcement, index) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors">
            View All {activeTab === 'events' ? 'Events' : 'Announcements'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsAnnouncementsSection;
