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


interface SchoolInfo {
	name: string;
	address: string;
	phone?: string;
	email: string;
	logo?: string;
}

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
	image?: string;
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
	schoolInfo: SchoolInfo;
}

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
		marginTop: 7,
	},
	courseTable: {
		display: 'flex',
		flexDirection: 'column',
		border: '1px solid black',
		borderBottomWidth: 0,
		margin: 10,
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
		fontSize: "10px"
	},
	courseCell: {
		padding: 2,
		textAlign: 'center',
		borderRight: '1px solid black',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: "10px"
	},
	snCol: { width: '5%', borderRight: '1px solid black', },
	codeCol: { width: '12%', borderRight: '1px solid black', },
	titleCol: { width: '33%', borderRight: '1px solid black', textAlign: "left" },
	creditsCol: { width: '5%', borderRight: '1px solid black', },
	totalCol: { width: '10%', borderRight: '1px solid black', },
	gradeCol: { width: '10%', borderRight: '1px solid black', },
	gradePointCol: { width: '10%', borderRight: '1px solid black', },
	remarkCol: { width: '15%' },
	summarySection: {
		marginTop: 5,
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
		fontSize: "10px"
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
		fontSize: "10px",
	},
	summaryValue: {
		width: '50%',
		padding: 4,
		textAlign: 'center',
		fontSize: "10px",
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
		right: 50,
		bottom: 0,
	}
});

const NewResultTemplate = (data: PDFProps) => {
	// add department, faculty, level, and session to one object 
	const studentInfoT = {
		department: data.studentData.department,
		faculty: data.studentData.faculty,
		level: data.studentData.level,
		session: data.studentData.session,
	};

	return (
		<Document>
			<Page style={{ display: "flex", flexDirection: "row", width: "100%", height: "100%", }}>
				<View style={{ width: "75%", height: "100%" }}>
					<View style={{ width: "100%", height: "15%", backgroundColor: "#002C4B", display: "flex", flexDirection: "row", alignItems: "center" }}>
						{data.schoolInfo.logo && <Image
							src={data.schoolInfo.logo}
							style={{ width: 100, height: 100, margin: 10 }}
						/>}
						<View style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "80%" }}>
							<Text style={{ color: "white", fontSize: 20, width: "85%", textAlign: "center" }}>O'MARK SCHOOL OF HEALTH TECHNOLOGY</Text>
							<Text style={{ color: "#E0E8EF", fontSize: 8, width: "70%", textAlign: "center", marginTop: "2px" }}>{data.schoolInfo.address}</Text>
							<View style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "center", width: "100%", marginTop: "10px", gap: "20px" }}>
								<View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "5px" }}>
									<Image src="/icons8-phone-100.png" style={{ width: "10px", height: "10px" }} />
									<Text style={{ color: "#E0E8EF", fontSize: 8, textAlign: "center" }}>{data.schoolInfo.phone}</Text>
								</View>
								<View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "5px" }}>
									<Image src="/icons8-email-100.png" style={{ width: "10px", height: "10px" }} />
									<Text style={{ color: "#E0E8EF", fontSize: 8, textAlign: "center" }}>{data.schoolInfo.email}</Text>
								</View>
							</View>
						</View>
					</View>
					<View style={{ backgroundColor: "#fff" }}>
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
							{data.courses.map((course) => (
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
					</View>
					{/* Summary Section */}
					<View style={{}}>
						<Text style={styles.summaryTitle}>RESULT SUMMARY</Text>
						<View style={styles.summaryTable}>
							{/* Previous */}
							<View style={styles.summaryColumn}>
								<Text style={styles.summaryHeader}>PREVIOUS</Text>
								<View style={styles.summaryRow}>
									<Text style={styles.summaryLabel}>LTCU</Text>
									<Text style={styles.summaryValue}>{data.summary.previous.ltcu}</Text>
								</View>
								<View style={styles.summaryRow}>
									<Text style={styles.summaryLabel}>LTCA</Text>
									<Text style={styles.summaryValue}>{data.summary.previous.ltca}</Text>
								</View>
								<View style={styles.summaryRow}>
									<Text style={styles.summaryLabel}>LTGP</Text>
									<Text style={styles.summaryValue}>{data.summary.previous.ltgp}</Text>
								</View>
								<View style={styles.summaryRow}>
									<Text style={styles.summaryLabel}>LCGPA</Text>
									<Text style={styles.summaryValue}>{data.summary.previous.lcgpa}</Text>
								</View>
							</View>

							{/* Current */}
							<View style={styles.summaryColumn}>
								<Text style={styles.summaryHeader}>CURRENT</Text>
								<View style={styles.summaryRow}>
									<Text style={styles.summaryLabel}>TUC</Text>
									<Text style={styles.summaryValue}>{data.summary.current.tcu}</Text>
								</View>
								<View style={styles.summaryRow}>
									<Text style={styles.summaryLabel}>TCA</Text>
									<Text style={styles.summaryValue}>{data.summary.current.tca}</Text>
								</View>
								<View style={styles.summaryRow}>
									<Text style={styles.summaryLabel}>TGP</Text>
									<Text style={styles.summaryValue}>{data.summary.current.tgp}</Text>
								</View>
								<View style={styles.summaryRow}>
									<Text style={styles.summaryLabel}>GPA</Text>
									<Text style={styles.summaryValue}>{data.summary.current.gpa.toFixed(2)}</Text>
								</View>
							</View>

							{/* Cumulative */}
							<View style={styles.summaryColumn}>
								<Text style={styles.summaryHeader}>CUMULATIVE</Text>
								<View style={styles.summaryRow}>
									<Text style={styles.summaryLabel}>TCU</Text>
									<Text style={styles.summaryValue}>{data.summary.cumulative.tcu}</Text>
								</View>
								<View style={styles.summaryRow}>
									<Text style={styles.summaryLabel}>TCA</Text>
									<Text style={styles.summaryValue}>{data.summary.cumulative.tca}</Text>
								</View>
								<View style={styles.summaryRow}>
									<Text style={styles.summaryLabel}>TGP</Text>
									<Text style={styles.summaryValue}>{data.summary.cumulative.tgp}</Text>
								</View>
								<View style={styles.summaryRow}>
									<Text style={styles.summaryLabel}>CGPA</Text>
									<Text style={styles.summaryValue}>{data.summary.cumulative.cgpa.toFixed(2)}</Text>
								</View>
							</View>
						</View>
						<Text style={styles.remarkText}>REMARK: {data.summary.current.remark}</Text>
						<View style={styles.dateAndStamp}>
							<Text style={styles.dateText}></Text>
							<Image style={styles.stamp} src="/approval.png" />
						</View>
					</View>
				</View>
				<View style={{ width: "25%", height: "100%", backgroundColor: "#E0E8EF" }}>
					<Image
						src={data.studentData?.image}
						style={{ width: "80%", height: "auto", margin: "10% 10% 0 10%", borderRadius: "5px", objectFit: "cover" }}
					/>
					<Text style={{ fontSize: 10, color: "#2268AC", textAlign: "center", marginTop: "10px" }}>{data.studentData.name}</Text>
					<Text style={{ fontSize: 10, textAlign: "center", marginTop: "5px" }}>{data.studentData.matric}</Text>
					<View style={{ width: "100%", height: "auto", marginTop: "20px", padding: "0 10px", display: "flex", flexDirection: "column", gap: "5px" }}>
						<View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
							<Text style={{ fontSize: 10, color: "#2268AC" }}>Department:</Text>
							<Text style={{ fontSize: 12 }}>{studentInfoT.department}</Text>
						</View>
						<View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
							<Text style={{ fontSize: 10, color: "#2268AC" }}>Faculty:</Text>
							<Text style={{ fontSize: 12 }}>{studentInfoT.faculty}</Text>
						</View>
						<View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
							<Text style={{ fontSize: 10, color: "#2268AC" }}>Level:</Text>
							<Text style={{ fontSize: 12 }}>{studentInfoT.level}</Text>
						</View>
						<View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
							<Text style={{ fontSize: 10, color: "#2268AC" }}>Session:</Text>
							<Text style={{ fontSize: 12 }}>{studentInfoT.session}</Text>
						</View>
						<View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
							<Text style={{ fontSize: 10, color: "#2268AC" }}>Semester:</Text>
							<Text style={{ fontSize: 12 }}>{data.studentData.semester}</Text>
						</View>
					</View>
				</View>
			</Page>
		</Document>
	)
}


// const data = {
// 	"studentData": {
// 		"lastUpdated": "2025-09-30 10:09:44",
// 		"matric": "OSHT/NUA24/0189",
// 		"name": "ORODJE ONOME FAVOUR",
// 		"session": "2024/2025",
// 		"programme": "Nursing Assistant",
// 		"semester": "First",
// 		"department": "Nursing Assistant",
// 		"image": "https://res.cloudinary.com/dgnadeoc2/image/upload/v1758145247/n1pbi5ttghcvrmlbs7sh.jpg",
// 		"level": "100",
// 		"approvalStatus": "approved",
// 		"faculty": "School of Health Technology"
// 	},
// 	"courses": [
// 		{
// 			"sn": 1,
// 			"code": "COM 111",
// 			"title": "Introduction To Computer",
// 			"credits": 2,
// 			"total": 44,
// 			"grade": "F",
// 			"gradePoint": 0,
// 			"remark": "FAILED"
// 		},
// 		{
// 			"sn": 2,
// 			"code": "CTZ 111",
// 			"title": "CITZENSHIP",
// 			"credits": 2,
// 			"total": 63,
// 			"grade": "B",
// 			"gradePoint": 6,
// 			"remark": "PASSED"
// 		},
// 		{
// 			"sn": 3,
// 			"code": "BCH 111",
// 			"title": "Introduction to Physical Chemistry",
// 			"credits": 2,
// 			"total": 53,
// 			"grade": "C",
// 			"gradePoint": 4,
// 			"remark": "PASSED"
// 		},
// 		{
// 			"sn": 4,
// 			"code": "EHT 111",
// 			"title": "Introduction To Environmental Health",
// 			"credits": 2,
// 			"total": 66,
// 			"grade": "AB",
// 			"gradePoint": 7,
// 			"remark": "PASSED"
// 		},
// 		{
// 			"sn": 5,
// 			"code": "CHE 116",
// 			"title": "Introduction to Primary Health Care",
// 			"credits": 2,
// 			"total": 61,
// 			"grade": "B",
// 			"gradePoint": 6,
// 			"remark": "PASSED"
// 		},
// 		{
// 			"sn": 6,
// 			"code": "CHE 112",
// 			"title": "Anatomy and Physiology 1",
// 			"credits": 3,
// 			"total": 57,
// 			"grade": "BC",
// 			"gradePoint": 7.5,
// 			"remark": "PASSED"
// 		},
// 		{
// 			"sn": 7,
// 			"code": "GNS-102",
// 			"title": "Communication in English",
// 			"credits": 2,
// 			"total": 63,
// 			"grade": "B",
// 			"gradePoint": 6,
// 			"remark": "PASSED"
// 		},
// 		{
// 			"sn": 8,
// 			"code": "HET 103",
// 			"title": "Health Education",
// 			"credits": 3,
// 			"total": 68,
// 			"grade": "AB",
// 			"gradePoint": 10.5,
// 			"remark": "PASSED"
// 		},
// 		{
// 			"sn": 9,
// 			"code": "HET 103",
// 			"title": "Health Education",
// 			"credits": 3,
// 			"total": 68,
// 			"grade": "AB",
// 			"gradePoint": 10.5,
// 			"remark": "PASSED"
// 		},
// 		{
// 			"sn": 10,
// 			"code": "HET 103",
// 			"title": "Health Education",
// 			"credits": 3,
// 			"total": 68,
// 			"grade": "AB",
// 			"gradePoint": 10.5,
// 			"remark": "PASSED"
// 		},
// 		{
// 			"sn": 11,
// 			"code": "HET 103",
// 			"title": "Health Education",
// 			"credits": 3,
// 			"total": 68,
// 			"grade": "AB",
// 			"gradePoint": 10.5,
// 			"remark": "PASSED"
// 		},
// 		{
// 			"sn": 12,
// 			"code": "HET 103",
// 			"title": "Health Education",
// 			"credits": 3,
// 			"total": 68,
// 			"grade": "AB",
// 			"gradePoint": 10.5,
// 			"remark": "PASSED"
// 		},
// 		{
// 			"sn": 13,
// 			"code": "HET 103",
// 			"title": "Health Education",
// 			"credits": 3,
// 			"total": 68,
// 			"grade": "AB",
// 			"gradePoint": 10.5,
// 			"remark": "PASSED"
// 		},
// 		{
// 			"sn": 14,
// 			"code": "HET 103",
// 			"title": "Health Education",
// 			"credits": 3,
// 			"total": 68,
// 			"grade": "AB",
// 			"gradePoint": 10.5,
// 			"remark": "PASSED"
// 		}
// 	],
// 	"summary": {
// 		"current": {
// 			"tcu": 18,
// 			"tca": 18,
// 			"tgp": 47,
// 			"gpa": 2.611111111111111,
// 			"remark": "Lower Credit"
// 		},
// 		"previous": {
// 			"ltcu": "0",
// 			"ltca": "0",
// 			"ltgp": "0",
// 			"lcgpa": "0.00"
// 		},
// 		"cumulative": {
// 			"tcu": 18,
// 			"tca": 18,
// 			"tgp": 47,
// 			"cgpa": 2.611111111111111
// 		}
// 	},
// 	"schoolInfo": {
// 		"name": "O'MARK SCHOOL OF HEALTH TECHNOLOGY",
// 		"address": "OMARKBUS-STOP,ISHERIRD,EGAN-IGANDO,LAGOS",
// 		"phone": "08012345678",
// 		"email": "info@omarkschool.edu.ng",
// 		"logo": "https://example.com/logo.png"
// 	}
// }

export default NewResultTemplate