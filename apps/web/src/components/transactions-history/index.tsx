import React, { useState } from 'react';
import TransactionDetailsModal from '../transaction-details-modal';

interface Transaction {
    date: string;
    txHash: string;
    sender: string;
    receiver: string;
    amount: string;
    fee: string;
    block?: number;
    memo?: string;
}

interface TransactionsHistoryProps {
    transactions: Transaction[];
    height?: string | number;
}

const TransactionsHistory: React.FC<TransactionsHistoryProps> = ({ transactions, height = '100%' }) => {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const headings = ['Date', 'TX Hash', 'Sender', 'Receiver', 'Amount', 'Fee'];

    const handleTransactionClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
    };

    return (
        <div className="w-full rounded-lg bg-transparent p-2.5 overflow-hidden flex flex-col bg-[#15191C]" style={{ height }}>
            <div className="flex flex-col w-full h-full" role="table" aria-label="Transaction History">
                <div className="sticky top-0 bg-transparent z-10 pb-2" role="rowgroup">
                    <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_0.8fr_0.5fr] gap-2 w-full bg-transparent" role="row">
                        {headings.map((heading, index) => (
                            <div
                                key={`heading-${index}`}
                                className="p-2 text-text-tertiary text-xs font-medium leading-normal relative"
                                role="columnheader"
                            >
                                {heading}
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className="overflow-y-auto overflow-x-hidden flex flex-col scrollbar-thin scrollbar-track-surface-medium scrollbar-thumb-border hover:scrollbar-thumb-text-tertiary scrollbar-track-rounded-sm scrollbar-thumb-rounded-sm"
                    role="rowgroup"
                    style={{ maxHeight: `calc(${height} - 40px)` }}
                >
                    {transactions.length > 0 ? (
                        transactions.map((transaction, rowIndex) => (
                            <div
                                key={`transaction-${rowIndex}`}
                                className="grid grid-cols-[1fr_1.5fr_1fr_1fr_0.8fr_0.5fr] gap-2 w-full bg-transparent border-b border-[rgba(102,102,102,0.1)] last:border-b-0 hover:bg-[#1D2328]"
                                role="row"
                            >
                                <div className="p-2 text-text-secondary text-xs font-medium leading-normal truncate" role="cell">
                                    {transaction.date}
                                </div>
                                <div
                                    className="p-2 text-xs font-medium leading-normal truncate cursor-pointer bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent"
                                    role="cell"
                                    onClick={() => handleTransactionClick(transaction)}
                                >
                                    {transaction.txHash}
                                </div>
                                <div
                                    className="p-2 text-text-secondary text-xs font-medium leading-normal truncate"
                                    role="cell"
                                    title={transaction.sender}
                                >
                                    {transaction.sender}
                                </div>
                                <div
                                    className="p-2 text-text-secondary text-xs font-medium leading-normal truncate"
                                    role="cell"
                                    title={transaction.receiver}
                                >
                                    {transaction.receiver}
                                </div>
                                <div className="p-2 text-text-secondary text-xs font-medium leading-normal truncate" role="cell">
                                    {transaction.amount}
                                </div>
                                <div className="p-2 text-text-secondary text-xs font-medium leading-normal truncate" role="cell">
                                    {transaction.fee}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center items-center p-4 text-text-tertiary text-sm bg-transparent">
                            No transactions found
                        </div>
                    )}
                </div>
            </div>

            {selectedTransaction && (
                <TransactionDetailsModal
                    isOpen={!!selectedTransaction}
                    onClose={() => setSelectedTransaction(null)}
                    transaction={{
                        hash: selectedTransaction.txHash,
                        block: selectedTransaction.block || 0,
                        from: selectedTransaction.sender,
                        to: selectedTransaction.receiver,
                        value: selectedTransaction.amount,
                        fee: selectedTransaction.fee,
                        memo: selectedTransaction.memo
                    }}
                />
            )}
        </div>
    );
};

export default TransactionsHistory;
