"use client";

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction'
import { Loader2, Plus } from 'lucide-react'
import React, { useState } from 'react'
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { Skeleton } from '@/components/ui/skeleton';
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';
import { UploadButton } from './upload-button';
import { transactions as transactionsSchema } from "@/db/schema";
import { useSelectAccount } from '@/features/accounts/hooks/use-select-account';
import { toast } from 'sonner';
import { ImportCard } from './import-card';
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions';


enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {}
}

const TransactionsPage = () => {
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);
    const [AccountDialog, confirm] = useSelectAccount();
    const bulkCreateTransaction = useBulkCreateTransactions();

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        setImportResults(results);
        setVariant(VARIANTS.IMPORT)
    }

    const onCancelImport = () => {
        setVariant(VARIANTS.LIST);
        setImportResults(INITIAL_IMPORT_RESULTS);
    }

    const onSubmitImport = async (
        values: (typeof transactionsSchema.$inferInsert)[]
    ) => {
        const accountId = await confirm() as string;
        if (!accountId) toast.error("Please select an account to continue!");
        const data = values.map((transaction) => ({
            ...transaction,
            accountId,
        }));
        bulkCreateTransaction.mutate(data, {
            onSuccess: () => {
                onCancelImport();
                toast.success("Transactions imported successfully");
            },
            onError: () => toast.error("Failed to import transactions"),
        });
    };

    const newtransaction = useNewTransaction();
    const transactionsQuery = useGetTransactions();
    const deleteTransactions = useBulkDeleteTransactions();
    const transactions = transactionsQuery.data || [];

    const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending

    if (transactionsQuery.isLoading) {
        return (
            <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <Card className='border-none drop-shadow-sm'>
                    <CardHeader >
                        <Skeleton className='h-8 w-48' />
                    </CardHeader>
                    <CardContent>
                        <div className='h-[500px]  w-full flex items-center justify-center'>
                            <Loader2 className='size-6 text-slate-300 animate-spin' />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (variant === VARIANTS.IMPORT) {
        return (
            <>
                <AccountDialog />
                <ImportCard
                    data={importResults.data}
                    onCancel={onCancelImport}
                    onSubmit={onSubmitImport}
                />
            </>
        );
    }

    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 flex lg:flex-row items-center justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>
                        Transactions History
                    </CardTitle>
                    <div className="flex items-center gap-x-2">
                        <Button size={"sm"} onClick={newtransaction.onOpen}>
                            <Plus className='size-4 mr-2' />
                            Add New
                        </Button>
                        <UploadButton onUpload={onUpload} />
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={transactions} filterKey='payee' onDelete={
                        (row) => {
                            const ids = row.map((r) => r.original.id);
                            deleteTransactions.mutate({ ids })
                        }
                    } disabled={isDisabled} />
                </CardContent>
            </Card>
        </div>
    )
}

export default TransactionsPage