import React, { useState } from 'react';
import './style.css';
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
        <div className="transactions-history" style={{ height }}>
            <div className="transactions-history__table" role="table" aria-label="Transaction History">
                <div className="transactions-history__header" role="rowgroup">
                    <div className="transactions-history__row" role="row">
                        {headings.map((heading, index) => (
                            <div
                                key={`heading-${index}`}
                                className="transactions-history__cell transactions-history__cell--header"
                                role="columnheader"
                            >
                                {heading}
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className="transactions-history__body"
                    role="rowgroup"
                    style={{ maxHeight: `calc(${height} - 40px)` }}
                >
                    {transactions.length > 0 ? (
                        transactions.map((transaction, rowIndex) => (
                            <div
                                key={`transaction-${rowIndex}`}
                                className="transactions-history__row"
                                role="row"
                            >
                                <div className="transactions-history__cell" role="cell">
                                    {transaction.date}
                                </div>
                                <div
                                    className="transactions-history__cell transactions-history__cell--hash"
                                    role="cell"
                                    onClick={() => handleTransactionClick(transaction)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {transaction.txHash}
                                </div>
                                <div className="transactions-history__cell text-truncate" role="cell" title={transaction.sender}>
                                    {transaction.sender}
                                </div>
                                <div className="transactions-history__cell text-truncate" role="cell" title={transaction.receiver}>
                                    {transaction.receiver}
                                </div>
                                <div className="transactions-history__cell" role="cell">
                                    {transaction.amount}
                                </div>
                                <div className="transactions-history__cell" role="cell">
                                    {transaction.fee}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="transactions-history__empty">
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