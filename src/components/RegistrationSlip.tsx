import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Course } from '@/components/types';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10 },
  header: { marginBottom: 12, textAlign: 'center', fontWeight: 'bold', fontSize: 14 },
  infoRow: { display: 'flex', flexDirection: 'row', marginBottom: 6 },
  infoLabel: { width: '25%', fontWeight: 'bold' },
  infoValue: { width: '75%' },
  table: { display: 'flex', flexDirection: 'column', border: '1px solid #000', marginTop: 8 },
  row: { display: 'flex', flexDirection: 'row', borderBottom: '1px solid #000' },
  cell: { padding: 6, textAlign: 'left', borderRight: '1px solid #000' },
  sn: { width: '8%' },
  code: { width: '20%' },
  title: { width: '52%' },
  cu: { width: '20%', textAlign: 'center' },
  summary: { marginTop: 8, textAlign: 'right', fontWeight: 'bold' },
});

interface SlipProps {
  studentName: string;
  matric?: string;
  session: string;
  semester: string;
  courses: Course[];
}

const RegistrationSlip: React.FC<SlipProps> = ({ studentName, matric, session, semester, courses }) => {
  const totalCredits = courses.reduce((s, c) => s + (c.creditUnits || 0), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>COURSE REGISTRATION SLIP</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{studentName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Matric:</Text>
          <Text style={styles.infoValue}>{matric || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Session:</Text>
          <Text style={styles.infoValue}>{session}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Semester:</Text>
          <Text style={styles.infoValue}>{semester}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.row, { backgroundColor: '#eee', fontWeight: 'bold' }]}>
            <Text style={[styles.cell, styles.sn]}>S/N</Text>
            <Text style={[styles.cell, styles.code]}>Code</Text>
            <Text style={[styles.cell, styles.title]}>Course Title</Text>
            <Text style={[styles.cell, styles.cu]}>Credits</Text>
          </View>

          {courses.map((c, i) => (
            <View key={c.id || c.code || i} style={styles.row}>
              <Text style={[styles.cell, styles.sn]}>{i + 1}</Text>
              <Text style={[styles.cell, styles.code]}>{c.code}</Text>
              <Text style={[styles.cell, styles.title]}>{c.title}</Text>
              <Text style={[styles.cell, styles.cu]}>{c.creditUnits ?? '-'}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.summary}>Total Courses: {courses.length}   Total Credits: {totalCredits}</Text>
      </Page>
    </Document>
  );
};

export default RegistrationSlip;
