/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import type { Applicant } from '@/lib/api/types';

// Register nice fonts if needed, for now we use standard Helvetica
// Font.register({
//   family: 'Open Sans',
//   fonts: [
//     { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
//     { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 }
//   ]
// });

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#333'
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#2563EB', // Blue-600
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerLeft: {
        flexDirection: 'column'
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 5
    },
    collegeName: {
        fontSize: 16,
        color: '#1E40AF', // Blue-800
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    address: {
        fontSize: 9,
        color: '#6B7280'
    },
    slipTitle: {
        fontSize: 14,
        color: '#0891B2', // Cyan-600
        fontWeight: 'bold',
        marginTop: 5,
        textTransform: 'uppercase'
    },
    section: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#F8FAFC', // Slate-50
        borderRadius: 4
    },
    sectionTitle: {
        fontSize: 12,
        color: '#1E40AF',
        fontWeight: 'bold',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#CBD5E1',
        paddingBottom: 4,
        textTransform: 'uppercase'
    },
    row: {
        flexDirection: 'row',
        marginBottom: 6
    },
    col: {
        flex: 1
    },
    label: {
        fontSize: 9,
        color: '#64748B', // Slate-500
        marginBottom: 2,
        fontWeight: 'bold'
    },
    value: {
        fontSize: 10,
        color: '#0F172A', // Slate-900
        fontWeight: 'bold'
    },
    passportBox: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    passportText: {
        fontSize: 8,
        color: '#94A3B8'
    },
    table: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginTop: 5,
        borderRadius: 2,
        overflow: 'hidden'
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tableHeader: {
        backgroundColor: '#F1F5F9',
        color: '#1E40AF',
        fontWeight: 'bold',
    },
    tableCell: {
        paddingVertical: 6,
        paddingHorizontal: 8,
        fontSize: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: 8,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingTop: 10
    },
    signatureArea: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    signatureLine: {
        width: '40%',
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 5,
        textAlign: 'center',
        fontSize: 9
    }
});

export default function ApplicationSlip({ applicant }: { applicant: Applicant }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.collegeName}>APEX COLLEGE OF HEALTH</Text>
                        <Text style={styles.collegeName}>SCIENCES AND TECHNOLOGY</Text>
                        <Text style={styles.address}>Wukari, Taraba State, Nigeria</Text>
                        <Text style={styles.slipTitle}>ADMISSION APPLICATION SLIP</Text>
                    </View>
                    <View style={styles.passportBox}>
                        {applicant.passportPhoto ? (
                            <Image src={{ uri: applicant.passportPhoto }} style={{ width: '100%', height: '100%' }} />
                        ) : (
                            <Text style={styles.passportText}>PASSPORT</Text>
                        )}
                    </View>
                </View>

                {/* Application Info */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Application ID</Text>
                            <Text style={styles.value}>{applicant.applicantId}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Date Applied</Text>
                            <Text style={styles.value}>{new Date(applicant.createdAt).toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Session</Text>
                            <Text style={styles.value}>2025/2026</Text>
                        </View>
                    </View>
                </View>

                {/* Personal Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Surname</Text>
                            <Text style={styles.value}>{applicant.surname}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>First Name</Text>
                            <Text style={styles.value}>{applicant.firstName}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Middle Name</Text>
                            <Text style={styles.value}>{applicant.middleName || '-'}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Date of Birth</Text>
                            <Text style={styles.value}>{new Date(applicant.dateOfBirth).toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Gender</Text>
                            <Text style={styles.value}>{applicant.gender}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Marital Status</Text>
                            <Text style={styles.value}>{applicant.maritalStatus}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>State of Origin</Text>
                            <Text style={styles.value}>{applicant.stateOfOrigin}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>LGA</Text>
                            <Text style={styles.value}>{applicant.lga}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Residential Address</Text>
                            <Text style={styles.value}>{applicant.residentialAddress}</Text>
                        </View>
                    </View>
                </View>

                {/* Contact & Next of Kin */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact & Next of Kin</Text>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Email Address</Text>
                            <Text style={styles.value}>{applicant.email}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Phone Number</Text>
                            <Text style={styles.value}>{applicant.phoneNumber}</Text>
                        </View>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#E2E8F0', marginVertical: 8 }} />
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Next of Kin Name</Text>
                            <Text style={styles.value}>{applicant.nokFullName}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Relationship</Text>
                            <Text style={styles.value}>{applicant.nokRelationship}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Next of Kin Phone</Text>
                            <Text style={styles.value}>{applicant.nokPhoneNumber}</Text>
                        </View>
                    </View>
                </View>

                {/* Academic Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Program Choice & JAMB</Text>
                    <View style={styles.row}>
                        <View style={{ flex: 2 }}>
                            <Text style={styles.label}>First Choice Program</Text>
                            <Text style={styles.value}>{applicant.firstChoice}</Text>
                        </View>
                        <View style={{ flex: 2 }}>
                            <Text style={styles.label}>Second Choice Program</Text>
                            <Text style={styles.value}>{applicant.secondChoice}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>JAMB Reg. No</Text>
                            <Text style={styles.value}>{applicant.jambRegNumber}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>JAMB Score</Text>
                            <Text style={styles.value}>{applicant.jambScore}</Text>
                        </View>
                    </View>
                </View>

                {/* O-Level Detailed Results */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>O-Level Results</Text>
                    <View style={styles.row}>
                        {/* First Sitting */}
                        <View style={[styles.col, { marginRight: applicant.secondSitting ? 10 : 0 }]}>
                            <Text style={styles.label}>
                                FIRST SITTING: {applicant.firstSitting.examType} ({applicant.firstSitting.examYear})
                            </Text>
                            <Text style={{ fontSize: 8, marginBottom: 4, color: '#64748B' }}>
                                Exam Number: {applicant.firstSitting.examNumber}
                            </Text>
                            <View style={styles.table}>
                                <View style={[styles.tableRow, styles.tableHeader]}>
                                    <View style={[styles.tableCell, { flex: 3 }]}><Text style={{ fontWeight: 'bold' }}>Subject</Text></View>
                                    <View style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}><Text style={{ fontWeight: 'bold' }}>Grade</Text></View>
                                </View>
                                {applicant.firstSitting.subjects.map((s, i) => (
                                    <View key={i} style={[styles.tableRow, { borderTopWidth: 1, borderTopColor: '#E2E8F0' }]}>
                                        <View style={[styles.tableCell, { flex: 3 }]}><Text>{s.subject}</Text></View>
                                        <View style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}><Text>{s.grade}</Text></View>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Second Sitting */}
                        {applicant.secondSitting ? (
                            <View style={styles.col}>
                                <Text style={styles.label}>
                                    SECOND SITTING: {applicant.secondSitting.examType} ({applicant.secondSitting.examYear})
                                </Text>
                                <Text style={{ fontSize: 8, marginBottom: 4, color: '#64748B' }}>
                                    Exam Number: {applicant.secondSitting.examNumber}
                                </Text>
                                <View style={styles.table}>
                                    <View style={[styles.tableRow, styles.tableHeader]}>
                                        <View style={[styles.tableCell, { flex: 3 }]}><Text style={{ fontWeight: 'bold' }}>Subject</Text></View>
                                        <View style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}><Text style={{ fontWeight: 'bold' }}>Grade</Text></View>
                                    </View>
                                    {applicant.secondSitting.subjects.map((s, i) => (
                                        <View key={i} style={[styles.tableRow, { borderTopWidth: 1, borderTopColor: '#E2E8F0' }]}>
                                            <View style={[styles.tableCell, { flex: 3 }]}><Text>{s.subject}</Text></View>
                                            <View style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}><Text>{s.grade}</Text></View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ) : (
                            !applicant.secondSitting && <View style={styles.col} />
                        )}
                    </View>
                </View>

                {/* Payment Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Information</Text>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Status</Text>
                            <Text style={{ ...styles.value, color: applicant.paymentStatus === 'paid' ? '#16A34A' : '#DC2626' }}>
                                {applicant.paymentStatus.toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Reference</Text>
                            <Text style={styles.value}>{'N/A'}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Amount</Text>
                            <Text style={styles.value}>N5,000</Text>
                        </View>
                    </View>
                </View>

                {/* Declaration */}
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 9, fontStyle: 'italic', color: '#666', textAlign: 'justify' }}>
                        I hereby attest that the information provided above is true and accurate. I understand that any false information may lead to the disqualification of my application and forfeiture of any fees paid.
                    </Text>
                </View>

                {/* Signatures */}
                <View style={styles.signatureArea}>
                    <View style={styles.signatureLine}>
                        <Text>Applicant's Signature & Date</Text>
                    </View>
                    <View style={styles.signatureLine}>
                        <Text>Registrar's Signature & Date</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()} | Apex College of Health Sciences and Technology</Text>
                    <Text>This is a computer generated document and valid without a seal.</Text>
                </View>
            </Page>
        </Document>
    );
}
