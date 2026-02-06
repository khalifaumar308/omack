import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Download,
    Eye,
    ChevronLeft,
    ChevronRight,
    UserCheck,
    UserX,
    Clock,
    Mail,
    Phone,
    Calendar,
    GraduationCap,
    X,
    CheckSquare,
    Square,
    Loader2,
    RefreshCw
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ApplicationSlip from '../components/admissions/ApplicationSlip';
import { useGetApplications } from '@/lib/api/queries';

export default function AdminApplicants() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [programmeFilter, setProgrammeFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const itemsPerPage = 10;

    // Fetch data using React Query
    const { data, isLoading, isError, refetch } = useGetApplications(currentPage, itemsPerPage, searchTerm);

    // Derived state from API response
    const applicants = data?.data || [];
    const pagination = data?.pagination || { total: 0, pages: 1, page: 1, limit: 10 };

    // Client-side filtering for status and programme (since API only handles search currently)
    // NOTE: Ideally these should be backend parameters if the API supports them
    const filteredApplicants = useMemo(() => {
        let result = applicants;

        if (statusFilter !== 'all') {
            result = result.filter(app => app.status === statusFilter);
        }

        if (programmeFilter !== 'all') {
            result = result.filter(app =>
                app.firstChoice === programmeFilter || app.secondChoice === programmeFilter
            );
        }

        return result;
    }, [applicants, statusFilter, programmeFilter]);

    // Stats
    const stats = useMemo(() => ({
        total: pagination.total,
        pending: applicants.filter(a => a.status === 'pending').length,
        approved: applicants.filter(a => a.status === 'approved').length,
        rejected: applicants.filter(a => a.status === 'rejected').length,
    }), [applicants, pagination.total]);

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

    // Bulk selection logic
    const isAllSelected = filteredApplicants.length > 0 && selectedIds.size === filteredApplicants.length;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds(new Set());
        } else {
            const newSelected = new Set(filteredApplicants.map(a => a._id)); // Use _id from new type
            setSelectedIds(newSelected);
        }
    };

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleBulkApprove = async () => {
        // Implement bulk approve logic here
        console.log('Approving:', Array.from(selectedIds));
    };

    const handleBulkReject = async () => {
        // Implement bulk reject logic here
        console.log('Rejecting:', Array.from(selectedIds));
    };

    const totalPages = pagination.pages;

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Applicant Management</h1>
                        <p className="text-gray-500 mt-1">Manage and review admission applications</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                            <Download className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-700 font-medium">Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid - Calculations based on loaded data for now */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Applicants', value: stats.total, icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                        { label: 'Approved', value: stats.approved, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
                        { label: 'Rejected', value: stats.rejected, icon: UserX, color: 'text-red-600', bg: 'bg-red-50' },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {isLoading ? '-' : stat.value}
                                    </p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer outline-none"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                            <GraduationCap className="w-4 h-4 text-gray-500" />
                            <select
                                value={programmeFilter}
                                onChange={(e) => setProgrammeFilter(e.target.value)}
                                className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer outline-none max-w-[200px]"
                            >
                                <option value="all">All Programmes</option>
                                <option value="Medical Laboratory Technicians">Medical Lab</option>
                                <option value="Community Health">Community Health</option>
                                <option value="Environmental Health">Environmental Health</option>
                                <option value="Health Information Management">Health Info Mgmt</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                <AnimatePresence>
                    {selectedIds.size > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-blue-600 text-white p-4 rounded-xl flex items-center justify-between shadow-lg"
                        >
                            <div className="flex items-center gap-4">
                                <span className="font-semibold">{selectedIds.size} applicants selected</span>
                                <div className="h-6 w-px bg-blue-400" />
                                <button
                                    onClick={() => setSelectedIds(new Set())}
                                    className="flex items-center gap-1 text-sm text-blue-100 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Clear selection
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleBulkApprove}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
                                >
                                    Approve Selected
                                </button>
                                <button
                                    onClick={handleBulkReject}
                                    className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Reject Selected
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Table Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden"
                >
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                            <p className="text-gray-500">Loading applicants...</p>
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20 text-red-600">
                            <UserX className="w-10 h-10 mb-4" />
                            <p className="font-semibold">Failed to load applicants</p>
                            <button onClick={() => refetch()} className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                                <RefreshCw className="w-4 h-4" />
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left">
                                            <button
                                                onClick={toggleSelectAll}
                                                className="p-1 hover:bg-blue-100 rounded transition-colors"
                                            >
                                                {isAllSelected ? (
                                                    <CheckSquare className="w-5 h-5 text-blue-600" />
                                                ) : (
                                                    <Square className="w-5 h-5 text-gray-400" />
                                                )}
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Application ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Applicant
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Programme
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            JAMB Score
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <AnimatePresence>
                                        {filteredApplicants.map((applicant, idx) => (
                                            <motion.tr
                                                key={applicant._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className={`hover:bg-blue-50/50 transition-colors ${selectedIds.has(applicant._id) ? 'bg-blue-50/80' : ''}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleSelection(applicant._id)}
                                                        className="p-1 hover:bg-blue-100 rounded transition-colors"
                                                    >
                                                        {selectedIds.has(applicant._id) ? (
                                                            <CheckSquare className="w-5 h-5 text-blue-600" />
                                                        ) : (
                                                            <Square className="w-5 h-5 text-gray-300" />
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="font-mono text-sm font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                        {applicant._id.substring(0, 8)}...
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                            {applicant.firstName[0]}{applicant.surname[0]}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{applicant.surname} {applicant.firstName}</div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                                <Mail className="w-3 h-3" />
                                                                {applicant.email}
                                                            </div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                                <Phone className="w-3 h-3" />
                                                                {applicant.phoneNumber}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{applicant.firstChoice}</div>
                                                    <div className="text-xs text-gray-500">2nd: {applicant.secondChoice}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${applicant.jambScore >= 200
                                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                        }`}>
                                                        {applicant.jambScore}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(applicant.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(applicant.status)}`}>
                                                        {getStatusIcon(applicant.status)}
                                                        {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => navigate(`/admin/applicants/${applicant._id}`)}
                                                            className="inline-flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View
                                                        </button>
                                                        <PDFDownloadLink
                                                            document={<ApplicationSlip applicant={applicant} />}
                                                            fileName={`application-slip-${applicant._id}.pdf`}
                                                        >
                                                            {({ loading }) => (
                                                                <button
                                                                    disabled={loading}
                                                                    className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium disabled:opacity-50"
                                                                >
                                                                    {loading ? (
                                                                        <span className="w-4 h-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
                                                                    ) : (
                                                                        <Download className="w-4 h-4" />
                                                                    )}
                                                                </button>
                                                            )}
                                                        </PDFDownloadLink>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* Pagination */}
                    <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, pagination.total)}</span> of <span className="font-bold">{pagination.total}</span> applicants
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1 || isLoading}
                                className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50 border border-transparent hover:border-gray-200 hover:shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === page
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'hover:bg-white text-gray-600 hover:shadow-sm'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || isLoading}
                                className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50 border border-transparent hover:border-gray-200 hover:shadow-sm"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
