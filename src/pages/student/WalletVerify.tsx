import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useVerifyWalletFunding } from '@/lib/api/wallet.mutations';
import { toast } from 'sonner';

export default function WalletVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verifyMutation = useVerifyWalletFunding();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    if (!reference) {
      toast.error('No payment reference found');
      navigate('/student/wallet');
      return;
    }

    (async () => {
      try {
  const res = await verifyMutation.mutateAsync({ reference });
  const msg = (res as { message?: string })?.message || 'Payment verified successfully';
        setStatus('success');
        setMessage(msg);
        toast.success(msg);
        setCountdown(5);
      } catch (err) {
        const e = err as Error;
        const msg = e.message || 'Payment verification failed';
        setStatus('failed');
        setMessage(msg);
        toast.error(msg);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // start countdown when status changes to success or failed
  useEffect(() => {
    if (status === 'verifying') return;
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(t);
          navigate('/student/wallet');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [status, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow">
        <div className="flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            {status === 'verifying' ? (
              <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : status === 'success' ? (
              <div className="text-green-600 text-4xl">✓</div>
            ) : (
              <div className="text-red-600 text-4xl">✕</div>
            )}
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {status === 'verifying' ? 'Verifying payment...' : status === 'success' ? 'Payment Verified' : 'Verification Failed'}
          </h2>

          {message && <p className="text-sm text-gray-600 text-center mb-4">{message}</p>}

          <p className="text-sm text-gray-500">You will be redirected to your wallet in {countdown} second{countdown !== 1 ? 's' : ''}.</p>

          {status === 'failed' && (
            <div className="mt-4">
              <button className="px-4 py-2 bg-gray-100 rounded" onClick={() => navigate('/student/wallet')}>Go to Wallet</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
