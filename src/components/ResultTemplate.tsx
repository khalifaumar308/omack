import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';
import times from "@/times.ttf"
// Register Times New Roman font
Font.register({
  family: 'Times New Roman',
  fonts: [
    { src: times },
    // { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/times-new-roman@1.0.4/Times New Roman Bold.ttf', fontWeight: 'bold' }
  ]
});

// Styles for the PDF to match the provided layout
const styles = StyleSheet.create({
	page: {
		padding: 30,
		fontFamily: 'Times New Roman',
		fontSize: 10,
		lineHeight: 1.2,
	},
	headerSection: {
		marginBottom: 15,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottom: '2px solid #000',
		paddingBottom: 10,
	},
	headerLeft: {
		width: 80,
		height: 80,
	},
	headerCenter: {
		flex: 1,
		textAlign: 'center',
		marginHorizontal: 10,
	},
	headerRight: {
		width: 80,
		height: 80,
	},
	schoolName: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#00008B',
		marginBottom: 5,
	},
	schoolAddress: {
		fontSize: 8,
		color: '#666',
	},
	studentImage: {
		width: 80,
		height: 80,
		objectFit: 'cover',
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
	courseGradingTitle: {
		fontSize: 12,
		fontWeight: 'bold',
		marginBottom: 5,
		textAlign: 'center',
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
		minHeight: 25,
	},
	courseHeader: {
		backgroundColor: '#f0f0f0',
		fontWeight: 'bold',
		padding: 4,
		textAlign: 'center',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	courseCell: {
		padding: 4,
		textAlign: 'center',
		borderRight: '1px solid black',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	snCol: { width: '5%' },
	codeCol: { width: '10%' },
	titleCol: { width: '35%' },
	creditsCol: { width: '5%' },
	totalCol: { width: '8%' },
	gradeCol: { width: '8%' },
	gradePointCol: { width: '12%' },
	remarkCol: { width: '17%' },
	summarySection: {
		marginTop: 20,
	},
	summaryTitle: {
		fontSize: 12,
		fontWeight: 'bold',
		marginBottom: 5,
		textAlign: 'center',
	},
	summaryTable: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 20,
	},
	summaryColumn: {
		border: '1px solid black',
		width: '25%',
	},
	summaryHeader: {
		backgroundColor: '#f0f0f0',
		fontWeight: 'bold',
		padding: 6,
		textAlign: 'center',
		borderBottom: '1px solid black',
	},
	summaryRow: {
		display: 'flex',
		flexDirection: 'row',
		borderBottom: '1px solid black',
	},
	summaryLabel: {
		width: '50%',
		padding: 4,
		borderRight: '1px solid black',
		textAlign: 'center',
	},
	summaryValue: {
		width: '50%',
		padding: 4,
		textAlign: 'center',
	},
	remarkText: {
		marginTop: 10,
		textAlign: 'center',
		fontSize: 12,
		fontWeight: 'bold',
	},
	dateAndStamp: {
		marginTop: 20,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
	},
	dateText: {
		fontSize: 10,
	},
	stamp: {
		width: 100,
		height: 100,
		position: 'absolute',
		right: 50,
		bottom: 30,
		opacity: 0.8,
	}
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
				<Image 
					src="/logo.png"
					style={styles.headerLeft}
				/>
				<View style={styles.headerCenter}>
					<Text style={styles.schoolName}>O'MARK SCHOOL OF HEALTH TECHNOLOGY</Text>
					<Text style={styles.schoolAddress}>O'MARK BUS-STOP, ISHERI RD., EGBEDA, LAGOS</Text>
					<Text style={styles.schoolAddress}>📱 Phone: 09153638063 📧 Email: Omarkhealthgmail.com</Text>
				</View>
				<Image 
					src={`/images/students/${studentData.matric}.jpg`}
					style={styles.studentImage}
				/>
			</View>

			{/* Student Info Section */}
			<View style={{marginBottom: 10}}>
				<View style={{marginBottom: 5}}>
					<Text style={{fontWeight: 'bold'}}>{studentData.name}</Text>
					<Text style={{fontWeight: 'bold'}}>{studentData.matric}</Text>
				</View>
				<View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
					<Text>PROGRAMME: {studentData.programme}</Text>
					<Text>DEPARTMENT: {studentData.department}</Text>
				</View>
				<View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
					<Text>FACULTY: {studentData.faculty}</Text>
					<Text>SESSION: {studentData.session}</Text>
				</View>
				<View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
					<Text>SEMESTER: {studentData.semester}</Text>
					<Text>LEVEL: {studentData.level}</Text>
					<Text>APPROVAL STATUS: {studentData.approvalStatus}</Text>
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
			<Text style={styles.courseGradingTitle}>COURSE GRADING</Text>
			<View style={styles.courseTable}>
				{/* Headers */}
				<View style={styles.courseRow}>
					<Text style={[styles.courseHeader, styles.snCol]}>S/N</Text>
					<Text style={[styles.courseHeader, styles.codeCol]}>CODE</Text>
					<Text style={[styles.courseHeader, styles.titleCol]}>COURSE TITLE</Text>
					<Text style={[styles.courseHeader, styles.creditsCol]}>CU</Text>
					<Text style={[styles.courseHeader, styles.totalCol]}>TOTAL</Text>
					<Text style={[styles.courseHeader, styles.gradeCol]}>GRADE</Text>
					<Text style={[styles.courseHeader, styles.gradePointCol]}>GRADE POINT</Text>
					<Text style={[styles.courseHeader, styles.remarkCol]}>REMARK</Text>
				</View>
				{/* Rows */}
				{courses.map((course) => (
					<View key={course.sn} style={styles.courseRow}>
						<Text style={[styles.courseCell, styles.snCol]}>{course.sn}</Text>
						<Text style={[styles.courseCell, styles.codeCol]}>{course.code}</Text>
						<Text style={[styles.courseCell, styles.titleCol]}>{course.title}</Text>
						<Text style={[styles.courseCell, styles.creditsCol]}>{course.credits}</Text>
						<Text style={[styles.courseCell, styles.totalCol]}>{course.total}</Text>
						<Text style={[styles.courseCell, styles.gradeCol]}>{course.grade}</Text>
						<Text style={[styles.courseCell, styles.gradePointCol]}>{course.gradePoint}</Text>
						<Text style={[styles.courseCell, styles.remarkCol]}>{course.remark}</Text>
					</View>
				))}
			</View>

			{/* Summary Section */}
			<View style={styles.summarySection}>
				<Text style={styles.summaryTitle}>RESULT SUMMARY</Text>
				<View style={styles.summaryTable}>
					{/* Previous */}
					<View style={styles.summaryColumn}>
						<Text style={styles.summaryHeader}>PREVIOUS</Text>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>LTCU</Text>
							<Text style={styles.summaryValue}>{summary.previous.ltcu}</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>LTCA</Text>
							<Text style={styles.summaryValue}>{summary.previous.ltca}</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>LTGP</Text>
							<Text style={styles.summaryValue}>{summary.previous.ltgp}</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>LCGPA</Text>
							<Text style={styles.summaryValue}>{summary.previous.lcgpa}</Text>
						</View>
					</View>

					{/* Current */}
					<View style={styles.summaryColumn}>
						<Text style={styles.summaryHeader}>CURRENT</Text>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>TUC</Text>
							<Text style={styles.summaryValue}>{summary.current.tcu}</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>TCA</Text>
							<Text style={styles.summaryValue}>{summary.current.tca}</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>TGP</Text>
							<Text style={styles.summaryValue}>{summary.current.tgp}</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>GPA</Text>
							<Text style={styles.summaryValue}>{summary.current.gpa.toFixed(2)}</Text>
						</View>
					</View>

					{/* Cumulative */}
					<View style={styles.summaryColumn}>
						<Text style={styles.summaryHeader}>CUMULATIVE</Text>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>TCU</Text>
							<Text style={styles.summaryValue}>{summary.cumulative.tcu}</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>TCA</Text>
							<Text style={styles.summaryValue}>{summary.cumulative.tca}</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>TGP</Text>
							<Text style={styles.summaryValue}>{summary.cumulative.tgp}</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>CGPA</Text>
							<Text style={styles.summaryValue}>{summary.cumulative.cgpa.toFixed(2)}</Text>
						</View>
					</View>
				</View>
				<Text style={styles.remarkText}>REMARK: {summary.current.remark}</Text>
			</View>

			{/* Date and Stamp */}
			<View style={styles.dateAndStamp}>
				<Text style={styles.dateText}>Date: {studentData.lastUpdated}</Text>
				<Image style={styles.stamp} src="/stamp.png" />
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