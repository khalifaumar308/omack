import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 12,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: 8,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 16,
    objectFit: 'contain',
  },
  schoolInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  infoLabel: {
    width: 120,
    color: '#64748b',
    fontWeight: 'bold',
  },
  infoValue: {
    color: '#1e293b',
  },
  table: {
    marginTop: 8,
    border: '1px solid #e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    padding: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb',
    padding: 6,
    fontSize: 11,
  },
  tableCell: {
    flex: 1,
    color: '#334155',
  },
});

// Props for the PDF
export interface CourseRegistrationPDFProps {
  school: {
    name: string;
    address: string;
    logo?: string;
  };
  student: {
    name: string;
    department: string;
    level: string | number;
  };
  registration: {
    session: string;
    semester: string;
    approved: boolean;
    totalCourses: number;
    totalCreditUnits: number;
  };
  courses: Array<{
    code: string;
    title: string;
    creditUnits: number;
  }>;
}

const CourseRegistrationPDF: React.FC<CourseRegistrationPDFProps> = ({ school, student, registration, courses }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header: School Info */}
      <View style={styles.header}>
        {school.logo && (
          <Image src={school.logo} style={styles.logo} />
        )}
        <View style={styles.schoolInfo}>
          <Text style={styles.title}>{school.name}</Text>
          <Text style={styles.subtitle}>{school.address}</Text>
        </View>
      </View>

      {/* Student Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Student Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{student.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Department:</Text>
          <Text style={styles.infoValue}>{student.department}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Level:</Text>
          <Text style={styles.infoValue}>{student.level}</Text>
        </View>
      </View>

      {/* Registration Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Course Registration Summary</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Session:</Text>
          <Text style={styles.infoValue}>{registration.session}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Semester:</Text>
          <Text style={styles.infoValue}>{registration.semester}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Approved:</Text>
          <Text style={styles.infoValue}>{registration.approved ? 'Yes' : 'No'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total Courses:</Text>
          <Text style={styles.infoValue}>{registration.totalCourses}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total Credit Units:</Text>
          <Text style={styles.infoValue}>{registration.totalCreditUnits}</Text>
        </View>
      </View>

      {/* Courses Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Courses</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 1 }]}>Code</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Title</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Credit Units</Text>
          </View>
          {courses.map((course) => (
            <View style={styles.tableRow} key={course.code}>
              <Text style={[styles.tableCell, { flex: 1 }]}>{course.code}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{course.title}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{course.creditUnits}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default CourseRegistrationPDF;
