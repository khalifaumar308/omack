import { useState } from 'react';
// import { useUser } from '@/contexts/useUser';
import { 
  useGetWalletBalance, 
  useGetWalletTransactions 
} from '@/lib/api/wallet.queries';
import { 
  useInitiateWalletFunding,
  useVerifyWalletFunding 
} from '@/lib/api/wallet.mutations';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, RefreshCcw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router';
import { useEffect } from 'react';

import type { WalletTransaction } from '@/lib/api/wallet.types';

// Loading skeleton component for transactions
function TransactionsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 ml-4">
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
      ))}
    </div>
  );
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);
}

function WalletManagement() {
  const [fundingAmount, setFundingAmount] = useState('');
  const [showFundDialog, setShowFundDialog] = useState(false);
//   const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);

  // Queries and Mutations
  const { 
    data: balance, 
    isLoading: isLoadingBalance,
    refetch: refetchBalance 
  } = useGetWalletBalance();

  const {
    data: transactionData,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions
  } = useGetWalletTransactions({
    limit: 10,
    page: currentPage
  });

  // Handle transaction verification from URL
  const [searchParams] = useSearchParams();
  const verifyFunding = useVerifyWalletFunding();

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (reference) {
      verifyFunding.mutate({ reference }, {
        onSuccess: (response) => {
          toast.success(response.message || 'Payment verified successfully');
          // Clear the reference from URL
          searchParams.delete('reference');
          window.history.replaceState({}, '', `${window.location.pathname}`);
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to verify payment');
        }
      });
    }
  }, [searchParams, verifyFunding]);

  const initiateFunding = useInitiateWalletFunding();

  // Handle wallet funding
  const handleFundWallet = async () => {
    try {
      const amount = parseFloat(fundingAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      const response = await initiateFunding.mutateAsync({ amount });
      if (response.authorization_url) {
        // Open Paystack payment window
        window.location.href = response.authorization_url;
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'Failed to initiate funding. Please try again.');
    }
  };

  // Transaction status badge
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`;
  };

  // Transaction type icon
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return <ArrowUpRight className="text-green-500" />;
      case 'debit':
        return <ArrowDownLeft className="text-red-500" />;
      default:
        return <Clock className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Wallet Management</h1>
        <Button variant="outline" size="sm" onClick={() => {
          refetchBalance();
          refetchTransactions();
        }}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Current Balance</h2>
            <Wallet className="text-blue-500" />
          </div>
          {isLoadingBalance ? (
            <Skeleton className="h-10 w-32" />
          ) : (
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {formatAmount(balance?.balance || 0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Available Balance</p>
            </div>
          )}
          <Button 
            className="w-full mt-4" 
            onClick={() => setShowFundDialog(true)}
          >
            Fund Wallet
          </Button>
        </Card>

        {/* Quick Stats */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-xl font-bold text-gray-900">
                {transactionData?.pagination.totalDocs || 0}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Last Transaction</p>
              <p className="text-xl font-bold text-gray-900">
                {transactionData?.transactions[0] ? 
                  formatAmount(transactionData.transactions[0].amount) : 
                  'N/A'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
          {isLoadingTransactions ? (
            <TransactionsSkeleton />
          ) : (
            <div className="space-y-4">
              {transactionData?.transactions.map((transaction: WalletTransaction) => (
                  <div 
                    key={transaction._id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-gray-50">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'} {formatAmount(transaction.amount)}
                      </p>
                      <span className={getStatusBadge(transaction.status)}>
                        {transaction.status === 'success' ? 'completed' : transaction.status}
                      </span>
                    </div>
                  </div>
                ))}

              {transactionData?.pagination.hasNextPage && (
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Load More
                </Button>
              )}

              {!transactionData?.pagination.hasNextPage && transactionData?.transactions.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No transactions found
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Fund Wallet Dialog */}
      <Dialog open={showFundDialog} onOpenChange={setShowFundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fund Your Wallet</DialogTitle>
            <DialogDescription>
              Enter the amount you want to add to your wallet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium text-gray-700">
                Amount (NGN)
              </label>
              <Input
                id="amount"
                type="number"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                placeholder="Enter amount"
                min="100"
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleFundWallet}
              disabled={initiateFunding.isPending}
            >
              {initiateFunding.isPending ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default WalletManagement;