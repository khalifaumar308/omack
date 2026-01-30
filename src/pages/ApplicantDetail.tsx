import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    FileText,
    CreditCard,
    Clock,
    Printer,
    UserCheck,
    UserX,
    AlertCircle,
    Loader2,
    RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ApplicationSlip from '../components/admissions/ApplicationSlip';
import { useGetApplicant } from '@/lib/api/queries';

export default function ApplicantDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const { data: applicant, isLoading, isError, error, refetch } = useGetApplicant(id);

    const handleApprove = async () => {
        setIsProcessing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Application approved successfully!');
        setIsProcessing(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <UserCheck className="w-4 h-4" />;
            case 'rejected': return <UserX className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading applicant details...</p>
            </div>
        );
    }

    if (isError || !applicant) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load applicant</h2>
                    <p className="text-gray-500 mb-6">
                        {error instanceof Error ? error.message : "We couldn't find the applicant you're looking for. Please try again."}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => navigate('/admin/applicants')}
                            className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => refetch()}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            {/* Header / Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-xl bg-white/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/applicants')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="h-6 w-px bg-gray-200" />
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Applicant Details</h1>
                            <p className="text-xs text-gray-500 font-mono">ID: {applicant._id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <PDFDownloadLink
                            document={<ApplicationSlip applicant={applicant} />}
                            fileName={`application-slip-${applicant._id}.pdf`}
                        >
                            {({ loading }) => (
                                <button
                                    disabled={loading}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
                                    Download Slip
                                </button>
                            )}
                        </PDFDownloadLink>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Top Overview Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg text-white font-bold text-3xl">
                            {applicant.firstName[0]}{applicant.surname[0]}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{applicant.surname} {applicant.firstName} {applicant.middleName}</h2>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                                <div className="flex items-center gap-1.5">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {applicant.email}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {applicant.phoneNumber}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    {applicant.stateOfOrigin} State
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(applicant.status)}`}>
                            {getStatusIcon(applicant.status)}
                            {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                        </span>
                        <p className="text-sm text-gray-500">
                            Applied on {new Date(applicant.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal & Contact Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-gray-900">Personal & Contact Details</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                                    <p className="font-semibold text-gray-900">{applicant.dateOfBirth}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Gender</p>
                                    <p className="font-semibold text-gray-900">{applicant.gender}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Marital Status</p>
                                    <p className="font-semibold text-gray-900">{applicant.maritalStatus}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Religion</p>
                                    <p className="font-semibold text-gray-900">{applicant.religion}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">LGA</p>
                                    <p className="font-semibold text-gray-900">{applicant.lga}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Residential Address</p>
                                    <p className="font-semibold text-gray-900">{applicant.residentialAddress}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Nationality</p>
                                    <p className="font-semibold text-gray-900">{applicant.nationality}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">NIN</p>
                                    <p className="font-semibold text-gray-900">{applicant.nin}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Academic Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-gray-900">Academic & Programme Choice</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">First Choice</p>
                                        <p className="font-bold text-gray-900">{applicant.firstChoice}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Second Choice</p>
                                        <p className="font-bold text-gray-900">{applicant.secondChoice}</p>
                                    </div>
                                </div>

                                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-700 font-medium">JAMB Registration Number</p>
                                        <p className="font-mono font-bold text-green-900 text-lg">{applicant.jambRegNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-green-700 font-medium">JAMB Score</p>
                                        <div className="inline-flex items-center justify-center bg-green-200 text-green-800 font-black text-xl w-14 h-14 rounded-full">
                                            {applicant.jambScore}
                                        </div>
                                    </div>
                                </div>

                                {/* Exam Sittings */}
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        O'Level Results - First Sitting
                                    </h4>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <div className="flex flex-wrap gap-4 mb-3 pb-3 border-b border-gray-200 text-sm">
                                            <span className="font-semibold">Type: <span className="font-normal">{applicant.firstSitting.examType}</span></span>
                                            <span className="font-semibold">Number: <span className="font-normal">{applicant.firstSitting.examNumber}</span></span>
                                            <span className="font-semibold">Year: <span className="font-normal">{applicant.firstSitting.examYear}</span></span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {applicant.firstSitting.subjects.map((sub, i) => (
                                                <div key={i} className="flex items-center justify-between bg-white p-2 rounded border border-gray-100">
                                                    <span className="text-sm text-gray-600 truncate mr-2" title={sub.subject}>{sub.subject}</span>
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${['A1', 'B2', 'B3'].includes(sub.grade) ? 'bg-green-100 text-green-700' :
                                                        ['C4', 'C5', 'C6'].includes(sub.grade) ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>{sub.grade}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {applicant.secondSitting && (
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-gray-400" />
                                            O'Level Results - Second Sitting
                                        </h4>
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <div className="flex flex-wrap gap-4 mb-3 pb-3 border-b border-gray-200 text-sm">
                                                <span className="font-semibold">Type: <span className="font-normal">{applicant.secondSitting.examType}</span></span>
                                                <span className="font-semibold">Number: <span className="font-normal">{applicant.secondSitting.examNumber}</span></span>
                                                <span className="font-semibold">Year: <span className="font-normal">{applicant.secondSitting.examYear}</span></span>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {applicant.secondSitting.subjects.map((sub, i) => (
                                                    <div key={i} className="flex items-center justify-between bg-white p-2 rounded border border-gray-100">
                                                        <span className="text-sm text-gray-600 truncate mr-2" title={sub.subject}>{sub.subject}</span>
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${['A1', 'B2', 'B3'].includes(sub.grade) ? 'bg-green-100 text-green-700' :
                                                            ['C4', 'C5', 'C6'].includes(sub.grade) ? 'bg-blue-100 text-blue-700' :
                                                                'bg-gray-100 text-gray-600'
                                                            }`}>{sub.grade}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Status & Actions */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                        >
                            <h3 className="font-bold text-gray-900 mb-4">Application Status</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                                    <span className="text-gray-600 text-sm">Review Status</span>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(applicant.status)}`}>
                                        {getStatusIcon(applicant.status)}
                                        {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                                    </span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                                    <span className="text-gray-600 text-sm">Payment Status</span>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${applicant.paymentStatus === 'paid'
                                        ? 'bg-green-100 text-green-700 border-green-200'
                                        : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                        }`}>
                                        <CreditCard className="w-3 h-3" />
                                        {applicant.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                                {applicant.applicationNumber && (
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-500 mb-1">Application Number</p>
                                        <p className="font-mono font-bold text-gray-900">{applicant.applicationNumber}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex flex-col gap-3">
                                <button
                                    onClick={handleApprove}
                                    disabled={isProcessing || applicant.status === 'approved'}
                                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:shadow-none"
                                >
                                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Approve Application'}
                                </button>
                                <button className="w-full py-3 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl font-bold transition-all disabled:opacity-50">
                                    Reject Application
                                </button>
                            </div>
                        </motion.div>

                        {/* Next of Kin */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                        >
                            <h3 className="font-bold text-gray-900 mb-4">Next of Kin</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                                    <p className="font-semibold text-gray-900">{applicant.nokFullName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Relationship</p>
                                    <p className="font-semibold text-gray-900">{applicant.nokRelationship}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        Phone Number
                                    </p>
                                    <p className="font-semibold text-gray-900">{applicant.nokPhoneNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        Address
                                    </p>
                                    <p className="font-semibold text-gray-900 text-sm">{applicant.nokAddress}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
