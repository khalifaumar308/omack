import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

// Styles for the PDF transcript
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.1,
  },
  headerSection: {
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  lastUpdated: {
    fontSize: 8,
    color: '#666',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  matricHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  studentInfoSection: {
    marginBottom: 20,
  },
  studentInfo: {
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid black',
    borderBottomWidth: 0,
  },
  infoColumn: {
    flex: 1,
    borderRight: '1px solid black',
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid black',
    padding: 4,
  },
  infoLabel: {
    width: '50%',
    fontWeight: 'bold',
    paddingLeft: 4,
  },
  infoValue: {
    width: '50%',
    paddingLeft: 4,
    paddingRight: 4,
  },
  transcriptTable: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid black',
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid black',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    padding: 4,
    textAlign: 'center',
  },
  tableCell: {
    padding: 4,
    textAlign: 'center',
    borderRight: '1px solid black',
  },
  sessionCol: { width: '12%' },
  semesterCol: { width: '8%' },
  tcuCol: { width: '8%' },
  tgpCol: { width: '8%' },
  gpaCol: { width: '8%' },
  cumTcuCol: { width: '8%' },
  cumTgpCol: { width: '8%' },
  cgpaCol: { width: '10%' },
  remarkCol: { width: '20%' },
});

// Interfaces
export interface StudentData {
  lastUpdated: string;
  matric: string;
  name: string;
  programme: string;
  department: string;
  level: string;
  faculty: string;
  approvalStatus: string;
}

export interface TranscriptProps {
  studentData: StudentData;
  summaries: {
    id: string;
    session: string;
    semester: string;
    TCU: number;
    TGP: number;
    GPA: number;
    cumulativeTCU: number;
    cumulativeTGP: number;
    CGPA: number;
  }[];
}

const getClassification = (cgpa: number): string => {
  if (cgpa >= 4.5) return 'DISTINCTION';
  if (cgpa >= 3.5) return 'VERY GOOD';
  if (cgpa >= 2.5) return 'GOOD';
  if (cgpa >= 1.5) return 'PASS';
  return 'FAIL';
};

const TranscriptTemplate: React.FC<TranscriptProps> = ({ studentData, summaries }) => {
  const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.lastUpdated}>Last Updated {currentDate}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.title}>TRANSCRIPT</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={styles.matricHeader}>Matric {studentData.matric}</Text>
          </View>
        </View>

        {/* Student Info Section */}
        <View style={styles.studentInfoSection}>
          <View style={styles.studentInfo}>
            {/* Left Column */}
            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{studentData.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Programme</Text>
                <Text style={styles.infoValue}>{studentData.programme}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>{studentData.department}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Faculty</Text>
                <Text style={styles.infoValue}>{studentData.faculty}</Text>
              </View>
            </View>
            {/* Right Column */}
            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Matric</Text>
                <Text style={styles.infoValue}>{studentData.matric}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Level</Text>
                <Text style={styles.infoValue}>{studentData.level}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Approval Status</Text>
                <Text style={styles.infoValue}>{studentData.approvalStatus}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Transcript Table */}
        <View style={styles.transcriptTable}>
          {/* Headers */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, styles.sessionCol]}>Session</Text>
            <Text style={[styles.tableHeader, styles.semesterCol]}>Semester</Text>
            <Text style={[styles.tableHeader, styles.tcuCol]}>TCU</Text>
            <Text style={[styles.tableHeader, styles.tgpCol]}>TGP</Text>
            <Text style={[styles.tableHeader, styles.gpaCol]}>GPA</Text>
            <Text style={[styles.tableHeader, styles.cumTcuCol]}>Cum. TCU</Text>
            <Text style={[styles.tableHeader, styles.cumTgpCol]}>Cum. TGP</Text>
            <Text style={[styles.tableHeader, styles.cgpaCol]}>CGPA</Text>
            <Text style={[styles.tableHeader, styles.remarkCol]}>Classification</Text>
          </View>
          {/* Rows */}
          {summaries.map((summary) => (
            <View key={summary.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.sessionCol]}>{summary.session}</Text>
              <Text style={[styles.tableCell, styles.semesterCol]}>{summary.semester}</Text>
              <Text style={[styles.tableCell, styles.tcuCol]}>{summary.TCU}</Text>
              <Text style={[styles.tableCell, styles.tgpCol]}>{summary.TGP.toFixed(1)}</Text>
              <Text style={[styles.tableCell, styles.gpaCol]}>{summary.GPA.toFixed(2)}</Text>
              <Text style={[styles.tableCell, styles.cumTcuCol]}>{summary.cumulativeTCU}</Text>
              <Text style={[styles.tableCell, styles.cumTgpCol]}>{summary.cumulativeTGP.toFixed(1)}</Text>
              <Text style={[styles.tableCell, styles.cgpaCol]}>{summary.CGPA.toFixed(2)}</Text>
              <Text style={[styles.tableCell, styles.remarkCol]}>{getClassification(summary.CGPA)}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default TranscriptTemplate;