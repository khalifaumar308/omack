import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useVerifyWalletFunding } from '@/lib/api/wallet.mutations';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Check, X, Clipboard, Download, ArrowRight } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ApplicationSlip from '@/components/admissions/ApplicationSlip';
import Navigation from '@/components/landing/Navigation';
import type { Applicant } from '@/lib/api/types';

export default function VerifyApplicationPayment() {
    const [searchParams] = useSearchParams();
    const verifyMutation = useVerifyWalletFunding();
    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [applicantId, setApplicantId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [applicant, setApplicant] = useState<Applicant | null>(null);

    useEffect(() => {
        const reference = searchParams.get('reference') || searchParams.get('trxref');
        if (!reference) {
            setStatus('failed');
            setError('No payment reference found');
            return;
        }

        const verify = async () => {
            try {
                await verifyMutation.mutateAsync({ reference }, {
                    onSuccess: (data) => {
                        console.log(data, "data");
                        setStatus('success');
                        if (data.applicant) {
                            setApplicantId(data.applicant.applicantId || null);
                            setApplicant(data.applicant);
                        }
                        toast.success('Payment verified successfully!');
                    },
                    onError: (err) => {
                        setStatus('failed');
                        setError(err.message || 'Payment verification failed');
                        toast.error(err.message || 'Payment verification failed');
                    },
                });

            } catch (err) {
                setStatus('failed');
                const msg = (err as Error).message || 'An error occurred during verification';
                setError(msg);
                toast.error(msg);
            }
        };

        verify();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log(applicant, "app")

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            <Navigation isScrolled={false} />

            <div className="pt-32 pb-20 px-4 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl w-full"
                >
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20 text-center relative overflow-hidden">
                        {/* Decorative background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-transparent pointer-events-none" />

                        {status === 'verifying' && (
                            <div className="relative z-10 py-10">
                                <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Verifying Payment</h2>
                                <p className="text-gray-600">Please wait while we confirm your transaction...</p>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="relative z-10 transition-all duration-500">
                                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-200">
                                    <Check className="w-14 h-14 text-white" strokeWidth={3} />
                                </div>

                                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-800 bg-clip-text text-transparent mb-4">
                                    Payment Successful!
                                </h2>

                                <p className="text-gray-700 mb-8 text-lg">
                                    Your application has been successfully processed. Please keep your application number safe.
                                </p>

                                {applicantId && (
                                    <div className="mb-10 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100 relative group">
                                        <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Your Application Number</p>
                                        <div className="flex items-center justify-center space-x-4">
                                            <span className="text-4xl font-black text-gray-900 tracking-tighter">{applicantId}</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(applicantId);
                                                    toast.success('Application ID copied!');
                                                }}
                                                className="p-3 rounded-full bg-white hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl group-hover:scale-110"
                                                title="Copy to clipboard"
                                            >
                                                <Clipboard className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {applicant ? (
                                        <PDFDownloadLink
                                            document={<ApplicationSlip applicant={applicant} />}
                                            fileName={`ACOHSAT_Application_${applicantId}.pdf`}
                                            className="inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                                        >
                                            {({ loading }) => (
                                                <>
                                                    {loading ? 'Preparing Slip...' : 'Download Application Slip'}
                                                    <Download className="ml-3 w-6 h-6" />
                                                </>
                                            )}
                                        </PDFDownloadLink>
                                    ) : (
                                        <button
                                            className="inline-flex items-center justify-center w-full px-8 py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold text-lg cursor-not-allowed border-2 border-dashed border-gray-200"
                                            disabled
                                        >
                                            {verifyMutation.isPending ? 'Loading Details...' : 'Slip not ready'}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className="inline-flex items-center justify-center w-full px-8 py-4 bg-white text-blue-700 border-2 border-blue-100 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        Return to Homepage
                                        <ArrowRight className="ml-3 w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {status === 'failed' && (
                            <div className="relative z-10 transition-all duration-500">
                                <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-200">
                                    <X className="w-14 h-14 text-white" strokeWidth={3} />
                                </div>

                                <h2 className="text-4xl font-bold bg-gradient-to-r from-red-700 via-rose-600 to-red-800 bg-clip-text text-transparent mb-4">
                                    Verification Failed
                                </h2>

                                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl mb-8 text-left">
                                    <p className="text-red-800 font-medium">Error Details:</p>
                                    <p className="text-red-700">{error || 'Unknown error occurred. Please contact support.'}</p>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg"
                                    >
                                        Retry Verification
                                    </button>

                                    <button
                                        onClick={() => window.location.href = '/apply'}
                                        className="inline-flex items-center justify-center w-full px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300"
                                    >
                                        Back to Application
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
