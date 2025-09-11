import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

// Styles for the PDF to match the provided layout
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
	courseTable: {
		display: 'flex',
		flexDirection: 'column',
		border: '1px solid black',
		borderBottomWidth: 0,
		marginBottom: 20,
	},
	courseRow: {
		display: 'flex',
		flexDirection: 'row',
		borderBottom: '1px solid black',
	},
	courseHeader: {
		backgroundColor: '#f0f0f0',
		fontWeight: 'bold',
		padding: 4,
		textAlign: 'center',
	},
	courseCell: {
		padding: 4,
		textAlign: 'center',
		borderRight: '1px solid black',
	},
	snCol: { width: '5%' },
	codeCol: { width: '8%' },
	titleCol: { width: '30%' },
	creditsCol: { width: '7%' },
	totalCol: { width: '8%' },
	gradeCol: { width: '8%' },
	gradePointCol: { width: '8%' },
	remarkCol: { width: '26%' },
	summaryTable: {
		display: 'flex',
		flexDirection: 'column',
		border: '1px solid black',
		borderBottomWidth: 0,
	},
	summaryRow: {
		display: 'flex',
		flexDirection: 'row',
		borderBottom: '1px solid black',
	},
	summaryHeader: {
		backgroundColor: '#f0f0f0',
		fontWeight: 'bold',
		padding: 4,
		textAlign: 'center',
	},
	summaryCell: {
		padding: 4,
		textAlign: 'center',
		borderRight: '1px solid black',
	},
	summaryCol1: { width: '20%' }, // RESULT SUMMARY
	summaryCol2: { width: '20%' }, // CURRENT
	summaryCol3: { width: '10%' }, // REMARK
	summaryCol4: { width: '20%' }, // PREVIOUS
	summaryCol5: { width: '30%' }, // CUMULATIVE
});

// Interfaces matching the required data structure
interface StudentData {
	lastUpdated: string;
	matric: string;
	name: string;
	session: string;
	programme: string;
	semester: string;
	department: string;
	level: string;
	faculty: string;
	approvalStatus: string;
}

interface Course {
	sn: number;
	code: string;
	title: string;
	credits: number;
	total: number;
	grade: string;
	gradePoint: number;
	remark: string;
}

interface Summary {
	current: { tcu: number; tca: number; tgp: number; gpa: number; remark: string };
	previous: { ltcu: string; ltca: string; ltgp: string; lcgpa: string };
	cumulative: { tcu: number; tca: number; tgp: number; cgpa: number };
}


export interface PDFProps {
	studentData: StudentData;
	courses: Course[];
	summary: Summary;
}

const ResultTemplate: React.FC<PDFProps> = ({ studentData, courses, summary }) => (
	<Document>
		<Page size="A4" style={styles.page}>
			{/* Header Section */}
			<View style={styles.headerSection}>
				<View>
					<Text style={styles.lastUpdated}>Last Updated {studentData.lastUpdated}</Text>
				</View>
				<View style={{ flex: 1, alignItems: 'center' }}>
					<Text style={styles.title}>STUDENT DATA</Text>
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
							<Text style={styles.infoLabel}>Session</Text>
							<Text style={styles.infoValue}>{studentData.session}</Text>
						</View>
						<View style={styles.infoRow}>
							<Text style={styles.infoLabel}>Semester</Text>
							<Text style={styles.infoValue}>{studentData.semester}</Text>
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

			{/* Course Table */}
			<View style={styles.courseTable}>
				{/* Headers */}
				<View style={styles.courseRow}>
					<Text style={[styles.courseHeader, styles.snCol]}>S/N</Text>
					<Text style={[styles.courseHeader, styles.codeCol]}>Code</Text>
					<Text style={[styles.courseHeader, styles.titleCol]}>Course Title</Text>
					<Text style={[styles.courseHeader, styles.creditsCol]}>Credits</Text>
					<Text style={[styles.courseHeader, styles.totalCol]}>Total</Text>
					<Text style={[styles.courseHeader, styles.gradeCol]}>Grade</Text>
					<Text style={[styles.courseHeader, styles.gradePointCol]}>Grade Point</Text>
					<Text style={[styles.courseHeader, styles.remarkCol]}>Remark</Text>
				</View>
				{/* Rows */}
				{courses.map((course) => (
					<View key={course.sn} style={styles.courseRow}>
						<Text style={[styles.courseCell, styles.snCol]}>{course.sn}</Text>
						<Text style={[styles.courseCell, styles.codeCol]}>{course.code}</Text>
						<Text style={[styles.courseCell, styles.titleCol]}>{course.title}</Text>
						<Text style={[styles.courseCell, styles.creditsCol]}>{course.credits}</Text>
						<Text style={[styles.courseCell, styles.totalCol]}>{course.total.toFixed(2)}</Text>
						<Text style={[styles.courseCell, styles.gradeCol]}>{course.grade}</Text>
						<Text style={[styles.courseCell, styles.gradePointCol]}>{course.gradePoint}</Text>
						<Text style={[styles.courseCell, styles.remarkCol]}>{course.remark}</Text>
					</View>
				))}
			</View>

			{/* Summary Table */}
			<View style={styles.summaryTable}>
				{/* Headers */}
				<View style={styles.summaryRow}>
					<Text style={[styles.summaryHeader, styles.summaryCol1]}>RESULT SUMMARY</Text>
					<Text style={[styles.summaryHeader, styles.summaryCol2]}>CURRENT</Text>
					<Text style={[styles.summaryHeader, styles.summaryCol3]}>REMARK</Text>
					<Text style={[styles.summaryHeader, styles.summaryCol4]}>PREVIOUS</Text>
					<Text style={[styles.summaryHeader, styles.summaryCol5]}>CUMULATIVE</Text>
				</View>
				{/* TCU Row */}
				<View style={styles.summaryRow}>
					<Text style={[styles.summaryCell, styles.summaryCol1]}>TCU</Text>
					<Text style={[styles.summaryCell, styles.summaryCol2]}>{summary.current.tcu}</Text>
					<Text style={[styles.summaryCell, styles.summaryCol3]}>{summary.current.remark}</Text>
					<Text style={[styles.summaryCell, styles.summaryCol4]}>LTCU</Text>
					<Text style={[styles.summaryCell, styles.summaryCol5]}>{summary.cumulative.tcu}</Text>
				</View>
				{/* TCA Row */}
				<View style={styles.summaryRow}>
					<Text style={[styles.summaryCell, styles.summaryCol1]}>TCA</Text>
					<Text style={[styles.summaryCell, styles.summaryCol2]}>{summary.current.tca}</Text>
					<Text style={[styles.summaryCell, styles.summaryCol3]} />
					<Text style={[styles.summaryCell, styles.summaryCol4]}>LTCA</Text>
					<Text style={[styles.summaryCell, styles.summaryCol5]}>{summary.cumulative.tca}</Text>
				</View>
				{/* TGP Row */}
				<View style={styles.summaryRow}>
					<Text style={[styles.summaryCell, styles.summaryCol1]}>TGP</Text>
					<Text style={[styles.summaryCell, styles.summaryCol2]}>{summary.current.tgp}</Text>
					<Text style={[styles.summaryCell, styles.summaryCol3]} />
					<Text style={[styles.summaryCell, styles.summaryCol4]}>LTGP</Text>
					<Text style={[styles.summaryCell, styles.summaryCol5]}>{summary.cumulative.tgp}</Text>
				</View>
				{/* GPA Row */}
				<View style={styles.summaryRow}>
					<Text style={[styles.summaryCell, styles.summaryCol1]}>GPA</Text>
					<Text style={[styles.summaryCell, styles.summaryCol2]}>{summary.current.gpa.toFixed(2)}</Text>
					<Text style={[styles.summaryCell, styles.summaryCol3]} />
					<Text style={[styles.summaryCell, styles.summaryCol4]}>LCGPA</Text>
					<Text style={[styles.summaryCell, styles.summaryCol5]} />
				</View>
				{/* CGPA Row */}
				<View style={styles.summaryRow}>
					<Text style={[styles.summaryCell, styles.summaryCol1]} />
					<Text style={[styles.summaryCell, styles.summaryCol2]} />
					<Text style={[styles.summaryCell, styles.summaryCol3]} />
					<Text style={[styles.summaryCell, styles.summaryCol4]} />
					<Text style={[styles.summaryCell, styles.summaryCol5]}>CGPA {summary.cumulative.cgpa.toFixed(2)}</Text>
				</View>
				{/* Previous values rows if needed, but matching image */}
				<View style={styles.summaryRow}>
					<Text style={[styles.summaryCell, styles.summaryCol1]} />
					<Text style={[styles.summaryCell, styles.summaryCol2]} />
					<Text style={[styles.summaryCell, styles.summaryCol3]} />
					<Text style={[styles.summaryCell, styles.summaryCol4]}>{summary.previous.ltcu}</Text>
					<Text style={[styles.summaryCell, styles.summaryCol5]} />
				</View>
				<View style={styles.summaryRow}>
					<Text style={[styles.summaryCell, styles.summaryCol1]} />
					<Text style={[styles.summaryCell, styles.summaryCol2]} />
					<Text style={[styles.summaryCell, styles.summaryCol3]} />
					<Text style={[styles.summaryCell, styles.summaryCol4]}>{summary.previous.ltca}</Text>
					<Text style={[styles.summaryCell, styles.summaryCol5]} />
				</View>
				<View style={styles.summaryRow}>
					<Text style={[styles.summaryCell, styles.summaryCol1]} />
					<Text style={[styles.summaryCell, styles.summaryCol2]} />
					<Text style={[styles.summaryCell, styles.summaryCol3]} />
					<Text style={[styles.summaryCell, styles.summaryCol4]}>{summary.previous.ltgp}</Text>
					<Text style={[styles.summaryCell, styles.summaryCol5]} />
				</View>
				<View style={styles.summaryRow}>
					<Text style={[styles.summaryCell, styles.summaryCol1]} />
					<Text style={[styles.summaryCell, styles.summaryCol2]} />
					<Text style={[styles.summaryCell, styles.summaryCol3]} />
					<Text style={[styles.summaryCell, styles.summaryCol4]}>{summary.previous.lcgpa}</Text>
					<Text style={[styles.summaryCell, styles.summaryCol5]} />
				</View>
			</View>
		</Page>
	</Document>
);

export default ResultTemplate;

// Sample data for testing the template
// const studentData: StudentData = {
// 	lastUpdated: '2025-04-19 12:22:50',
// 	matric: 'OSHT/PHT24/0026',
// 	name: 'AJAKAIYE OLUWATOSIN AJOKE',
// 	session: '2024/2025',
// 	programme: 'PUBLIC HEALTH TECHNICIAN',
// 	semester: 'First',
// 	department: 'PUBLIC HEALTH TECHNICIAN',
// 	level: '100',
// 	faculty: 'PUBLIC HEALTH',
// 	approvalStatus: 'approved',
// };

// const courses: Course[] = [
// 	{ sn: 1, code: 'PSY 101', title: 'General Psychology', credits: 3, total: 60.00, grade: 'B', gradePoint: 12, remark: 'PASSED' },
// 	{ sn: 2, code: 'BIO 101', title: 'General Biology', credits: 3, total: 71.00, grade: 'A', gradePoint: 15, remark: 'PASSED' },
// 	{ sn: 3, code: 'ANA 102', title: 'Anatomy and Physiology I', credits: 3, total: 59.00, grade: 'BC', gradePoint: 10.5, remark: 'PASSED' },
// 	{ sn: 4, code: 'ANA 103', title: 'Anatomy and Physiology (Practical) I', credits: 2, total: 57.00, grade: 'BC', gradePoint: 7, remark: 'PASSED' },
// 	{ sn: 5, code: 'CSC 106', title: 'Introduction to Computer', credits: 3, total: 70.00, grade: 'A', gradePoint: 15, remark: 'PASSED' },
// 	{ sn: 6, code: 'ENG 101', title: 'English Language I', credits: 3, total: 71.00, grade: 'A', gradePoint: 15, remark: 'PASSED' },
// 	{ sn: 7, code: 'MAT 107', title: 'Biostatistics', credits: 3, total: 83.00, grade: 'A', gradePoint: 15, remark: 'PASSED' },
// 	{ sn: 8, code: 'MAT 109', title: 'General Mathematics I', credits: 2, total: 68.00, grade: 'AB', gradePoint: 9, remark: 'PASSED' },
// 	{ sn: 9, code: 'PHE 101', title: 'Physical and Health Education', credits: 2, total: 77.00, grade: 'A', gradePoint: 10, remark: 'PASSED' },
// 	{ sn: 10, code: 'PUB 101', title: 'Introduction to Public Health', credits: 3, total: 60.00, grade: 'B', gradePoint: 12, remark: 'PASSED' },
// 	{ sn: 11, code: 'CUM 101', title: 'Interpersonal Communication', credits: 3, total: 72.00, grade: 'A', gradePoint: 15, remark: 'PASSED' },
// ];

// const summary: Summary = {
// 	current: { tcu: 30, tca: 30, tgp: 140.5, gpa: 4.68, remark: 'DISTINCTION' },
// 	previous: { ltcu: 'NIL', ltca: 'NIL', ltgp: 'NIL', lcgpa: 'NIL' },
// 	cumulative: { tcu: 30, tca: 30, tgp: 140.5, cgpa: 4.68 },
// };

// Example test component (uncomment to use in a page)
// import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
//
// const TestTemplate = () => (
//   <div style={{ width: '100%', height: '800px' }}>
//     <PDFViewer width="100%" height="800px">
//       <ResultTemplate studentData={sampleStudentData} courses={sampleCourses} summary={sampleSummary} />
//     </PDFViewer>
//     <PDFDownloadLink document={<ResultTemplate studentData={sampleStudentData} courses={sampleCourses} summary={sampleSummary} />} fileName="test-result.pdf">
//       {({ loading }) => (loading ? 'Loading...' : 'Download Test PDF')}
//     </PDFDownloadLink>
//   </div>
// );
//
// export { TestTemplate };